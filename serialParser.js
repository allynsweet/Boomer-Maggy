import serialPort from 'serialport';

//Define port location. Use  " ls /dev/tty* " in Raspberry Pi terminal to identitfy serial port path.
const portIn = new serialPort('/dev/tty.usbserial-14340', {
  baudRate: 9600,
});
const portOut = new serialPort(
  '/dev/tty.usbserial-14330',
  {
    baudRate: 9600,
  },
  function (err) {
    if (err) {
      return console.log('Error: ', err.message);
    }
  }
);

const cleanReadingArray = [];

// Logic

//Set variable to empty string.
let reading = '';
//This variable should equaul the length of the string that is being parsed.
const FULL_READING_LENGTH = 17;
//Regular expression. Refer to Javascript Regular Expressions when parsing new strings with different lengths/values.
// (Hint: Eloquent JS -> Regular Expressions)
const cleanReadingsRegex = /\W\w{5}[\s,]\d{3}\.\d{1}[\s,]\w{1}\W\d{1}\w{1}/;

portIn.on('data', (data) => {
  //Just in case there's whitespace on the reading, trim it and add reading
  let character = data.toString('utf-8').trim();
  // Confirm first character in the string is equal to $
  // The first character needs to be a $ for a good reading.
  const ANCHOR = '$';
  if (reading.length === 0 && !character.includes(ANCHOR)) {
    return;
  }

  reading += character;

  //Don't do anything if reading is less than 17 characters.
  if (reading.length < FULL_READING_LENGTH) {
    return;
  }

  // Reading does not match specified regex, reset reading and don't do anything with it.
  if (!reading.match(cleanReadingsRegex)) {
    console.log(`Bad Reading: ${reading}`);
    reading = '';
    return;
  }

  console.log(`Good Reading: ${reading}`);
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
