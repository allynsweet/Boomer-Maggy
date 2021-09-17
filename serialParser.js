import serialPort from 'serialport';

//Define port location. Use  " ls /dev/tty* " in Raspberry Pi terminal to identitfy serial port path.
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

const cleanReadingArray = [];
let badReadingCount = 0;
let goodReadingCount = 0;

// Logic

//Set variable to empty string.
let reading = '';
//This variable should equaul the length of the string that is being parsed.
const FULL_READING_LENGTH_LESSTHAN = 24
const FULL_READING_LENGTH = 25
const FULL_READING_LENGTH_GREATERTHAN = 26
//Regular expression. Refer to Javascript Regular Expressions when parsing new strings with different lengths/values.
// (Hint: Eloquent JS -> Regular Expressions)
const cleanReadingsRegex = /\W\d{5}\.\d{3}[\s,]\d{4}[\s,]\d{4}[\s,]\d{4}/;
const lessThan10000 = /\W\d{4}\.\d{3}[\s,]\d{4}[\s,]\d{4}[\s,]\d{4}/;
const greaterThan100000 = /\W\d{6}\.\d{3}[\s,]\d{4}[\s,]\d{4}[\s,]\d{4}/;

portIn.on('data', (data) => {
  //Just in case there's whitespace on the reading, trim it and add reading
  let character = data.toString('utf-8').trim();
  // Confirm first character in the string is equal to $
  // The first character needs to be a $ for a good reading. This can be changed for different strings.
  const ANCHOR = '$';
  if (reading.length === 0 && !character.includes(ANCHOR)) {
    //badReadingCount += 1;
    return;
  }

  reading += character;

  //Don't do anything if reading is less than 17 characters.
  if (reading.length < FULL_READING_LENGTH_LESSTHAN) {
    return;
  }


  // Reading does not match specified regex, reset reading and don't do anything with it.
  if (!reading.match(cleanReadingsRegex) || !reading.match(lessThan10000) || !reading.match(greaterThan100000)) {
    console.log(`Bad Reading: ${reading}`);
    badReadingCount += 1;
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