import serialPort from 'serialport';

//Define port location. Use  " ls /dev/tty* " in Raspberry Pi terminal to identitfy serial port path. 
const portIn = new serialPort('/dev/tty.usbserial-14340', {
  baudRate: 9600
});
const portOut = new serialPort ('/dev/tty.usbserial-xxxxx', {
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
portIn.on('data', (character) => {
  //Just in case there's whitespace on the reading, trim it and add reading
  reading += character.trim();
  //Don't do anything if reading is less than 17 characters.
  if (reading.length < FULL_READING_LENGTH) { return; }
  //Reading is 17 characters, we can now decide to use or throw away.
  if (!reading.match(cleanReadingsRegex)) {
    // Reading does not match specifed regex, reset reading and don't do anything with it.
    reading = '';
    return;
  }  
  portOut.on("open", function () {
    console.log('Port Out is open')
// Reading matches specifed regex, send out serial port.
  portOut.on('data out', function () {
    if (reading=true) {
    portOut.write(reading, function () {
      console.log('Data is being written')
    })
  }

    //serialPort.write(reading, function () {
       // console.log('Data is being written')
     // }) 
   });
  });
  
    reading = '';
 
});


// Maggy Datastream /\d{5}\.\d{3}[\s,]\d{4}[\s,]\d{4}[\s,]\d{4}/