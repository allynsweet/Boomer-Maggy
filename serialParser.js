import serialPort from 'serialport';

//Define port location. Use  " ls /dev/tty* " in Raspberry Pi terminal to identitfy serial port path. 
const portIn = new serialPort('/dev/tty.usbserial-14140', {
  baudRate: 9600
});
const portOut = new serialPort ('/dev/tty.usbserial-14130', {
  baudRate: 9600
});

//Open Incoming Serial Port on Raspberry Pi
portIn.on("open", function () {
  console.log('Port In is open');

// Logic

//Set variable to empty string. 
let reading = '';
//This variable should equaul the length of the string that is being parsed.
const FULL_READING_LENGTH = 17;
//Regular expression. Refer to Javascript Regular Expressions when parsing new strings with different lengths/values.
// (Hint: Eloquent JS -> Regular Expressions)
const cleanReadingsRegex = /\W\w{5}[\s,]\d{3}\.\d{1}[\s,]\w{1}\W\d{1}\w{1}/;
portIn.on('data',(data) => {
  //console.log(data);
  //Just in case there's whitespace on the reading, trim it and add reading
  let character = data.toString('utf-8').trim().split("\n");
  //console.log(character);
  
  reading += character;
  reading.match(/.{1,17}/g);
  //console.log(reading.split(","));
  console.log(reading)

 //Split string array into individual arrays before executing logic. 

//function splitString(stringToSplit, separator) {
   //const arrayOfStrings = stringToSplit.split(separator);
   //console.log(arrayOfStrings);
 //};

 //splitString(reading,17);




  //console.log(reading)
  // Confirm first character in the string is equal to $ 
  if (reading.length === 0 && !character.includes('$')) { return; }
  //Don't do anything if reading is less than 17 characters.
  if (reading.length < FULL_READING_LENGTH) { return; }
  //Reading is 17 characters, we can now decide to use or throw away.
  if (!reading.match(cleanReadingsRegex)) {
    // Reading does not match specifed regex, reset reading and don't do anything with it.
    console.log(`Bad Reading: ${reading}`)
    reading = '';
    return;
  } 

  //Completed Readings  
  //console.log(reading);
  
  
  portOut.on("open", function () {
    console.log('Port Out is open')
  //Reading matches specifed regex, send out serial port.
    portOut.write(reading, function () {
        console.log('Data successfully written.')   
    portOut.close(function (err) {
          console.log('Port Out closed', err);
      });
      }) 
    
   });
  });

  
    reading = '';
 
});

process.on('SIGINT', function () {
  portOut.close();
  portIn.close();
});

process.on('uncaughtException', function () {
  portOut.close();
  portIn.close();
});

process.on('exit', function () {
  portOut.close();
  portIn.close();
});
 
