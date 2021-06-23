import serialPort from 'serialport';
const Port = new serialPort('/dev/tty.usbserial-14340', {
  baudRate: 9600
});

Port.on("open", function () {
  console.log('open');

  Port.on('data', function(data) {
    console.log('data received: ' + data);
  });
});