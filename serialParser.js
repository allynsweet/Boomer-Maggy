//import serialport library. To install, use "npm install serialport" in raspberry pi terminal were source code exists.
import serialPort from 'serialport';

//Define port location. Use  " ls /dev/tty* " in Raspberry Pi terminal to identitfy serial port path.
//Fixed ports should have "portIn" as upper left, "portOut is upper right"
//Ping ports
const portIn = new serialPort('/dev/tty-portIn', {
  baudRate: 9600,
});
const portOut = new serialPort('/dev/tty-portOut', {
    baudRate: 9600,
  },
  function (err) {
    if (err) {
      return console.log('Error: ', err.message);
    }
  }
);


// Set up cleanReadingArray for sending good data, badReading counter, goodReadingCounter
const cleanReadingArray = [];
let badReadingCount = 0;
let goodReadingCount = 0;



// Logic
//--------------------------------------------------------------------------------------------------
//Set string of data to empty string.
let reading = '';

// Good data strings exist between 24-26 characters. 
const SHORT_READING_LENGTH = 24;
const LONG_READING_LENGTH = 26;


//Regular expression. Refer to Javascript Regular Expressions when parsing new strings with different lengths/values.
// (Hint: Eloquent JS -> Regular Expressions)

// Example for cleanReadingsRegex: $34687.456,8475,1284,8364
const cleanReadingsRegex = /\W\d{5}\.\d{3}[\s,]\d{4}[\s,]\d{4}[\s,]\d{4}/;
//Example for cleanReadingsRegex1: $9833.756,8374,2453,9876
const cleanReadingsRegex1 = /\W\d{4}\.\d{3}[\s,]\d{4}[\s,]\d{4}[\s,]\d{4}/;
//Example for cleanReadingsRegex2: $100645.856,8712,4327,7364
const cleanReadingsRegex2 = /\W\d{6}\.\d{3}[\s,]\d{4}[\s,]\d{4}[\s,]\d{4}/;

//-------------------------------------------------------------------


//open portIn with incoming data called "data"
portIn.on('data', (data) => {
//Convert all data incoming to a string and just in case there's whitespace on the reading, trim it. Assign the string to 
//variable "character". 
  let character = data.toString('utf-8').trim();
// Confirm first character in the string is equal to $
// The first character needs to be a $ for a good reading.
  const ANCHOR = '$';
  if (reading.length === 0 && !character.includes(ANCHOR)) {
    //badReadingCount += 1;
    return;
  }
  // build string  
  reading += character;

//Data that proceeds to logic should be between 24-26 characters.
  if (reading.length < SHORT_READING_LENGTH) {
    return;
  } 
  if (reading.length > LONG_READING_LENGTH) {
    return;
  }

// Reading does not match specified regex, reset reading and don't do anything with it
  if (reading.length === 24 && !reading.match(cleanReadingsRegex1)) {
    console.log(`Reading is greater than 10000 Gamma: ${reading}`);
    return;
  }

// Reading does not match specified regex, reset reading and don't do anything with it.
  if (reading.length === 25 && !reading.match(cleanReadingsRegex)) {
    console.log(`Reading is greater than 99999 Gamma: ${reading}`);
    return;
  }

// Reading does not match specified regex, reset reading and don't do anything with it
  if (reading.length === 26 && !reading.match(cleanReadingsRegex2)) {
    console.log(`Bad reading: ${reading}`);
    badReadingCount += 1
    reading = '';
    return;
  }

  console.log(`Good Reading: ${reading}`);
  goodReadingCount += 1;
  // TODO send data to receiver.

  //Reading matches specified regex, send out serial port.
  writeAndDrain(`${reading}\n`);

  cleanReadingArray.push(reading);
  reading = '';
  return;
});

function writeAndDrain(data) {
  portOut.write(data);
  portOut.drain(function (error) {
    if (error) {
      console.error(error);
      return;
    }
    console.log('Data successfully written.');
  });
}
reading = ' '

process.on('SIGINT', function () {
  cleanup();
});

process.on('uncaughtException', function () {
  cleanup();
});

process.on('exit', function () {
  cleanup();
});

function cleanup() {
console.log(`Number of good readings: ${goodReadingCount}. \n Bad readings thrown out: ${badReadingCount}`);
portOut.close();
portIn.close();
}