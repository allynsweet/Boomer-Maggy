import usb, { InEndpoint, OutEndpoint } from 'usb';
// lists all devices
// console.log(usb.getDeviceList());

// specify port with vendorid + productid
// console.log(usb.findByIds(1060,9492));

// Define constants for vendorID and productID, look up "magic numbers" for more details.
const VENDOR_ID = 1659;
const PRODUCT_ID = 8963;
const device = usb.findByIds(VENDOR_ID, PRODUCT_ID);
const allUSBDevices = usb.getDeviceList();

// Ensure the stream is defined to prevent unwanted "not found" errors.
if (!device) {
  const foundDevice = allUSBDevices[0] || undefined;
  // If there is an error, print that message along with the idProduct and idVendor of a found device.
  const foundDeviceMessage = !!foundDevice
    ? `Did you mean PID ${foundDevice.deviceDescriptor.idProduct} and VID ${foundDevice.deviceDescriptor.idVendor}?`
    : 'There are currently no devices plugged into this computer.';
  throw new Error(
    `USB device with vendor ID of ${VENDOR_ID} and product ID of ${PRODUCT_ID} could not be found. ${foundDeviceMessage}`
  );
}
// Now that we know device is defined, we can use it.
device.open(true);
const deviceInterface = device.interfaces[0];
if (!deviceInterface) {
  throw new Error('USB interface cannot be claimed because it is undefined.');
}
// If device interface is defined, we can claim it and start polling.
deviceInterface.claim();
const inEndpoint = deviceInterface.endpoints[1];
if (!inEndpoint) {
  throw new Error('Interface must be defined.');
}
inEndpoint.startPoll(1, 64);
// When new data comes in a data event will be fired on the receive endpoint
inEndpoint.on('data', (dataBuf) => {
  // Convert buffer to array
  let dataArr = Array.prototype.slice.call(new Uint8Array(dataBuf, 0, 8));
  console.log(`Data Received: ${JSON.stringify(dataArr)}`);
});
console.log('Listening to USB for data.');


// let string = /\d{5}\.\d{3}[\s,]\d{4}[\s,]\d{4}[\s,]\d{4}/;
// console.log(string.test("12345.123,1234,1858,1234"))

// function parseMaggy(datastream) {
//    if (!datastream) {
//        badString.push(datastream)
//    } else if (string === true) {
//        correctString.push(datastream)
// }
// }

// parseMaggy(string);
// console.log(correctString);
