import serialPort from 'serialport';


//Define port location. Use  " ls /dev/tty* " in Raspberry Pi terminal to identitfy serial port path. 
const portIn = new serialPort('/dev/tty.usbserial-14130', {
  baudRate: 9600
});




// Read data that is available but keep the stream in "paused mode"
portIn.on('open', function () {
    console.log('open')
  
  
  // Switches the port into "flowing mode"
  portIn.on('data', function (data) {
    console.log('Data:', data)
  })
  
});

/*Maggy Datastream /\d{5}\.\d{3}[\s,]\d{4}[\s,]\d{4}[\s,]\d{4}/;*/