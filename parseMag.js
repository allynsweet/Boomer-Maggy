import usb from 'usb';
// lists all devices
// console.log(usb.getDeviceList());

// specify port with vendorid + productid
// console.log(usb.findByIds(1060,9492));

// Define constants for vendorID and productID, look up "magic numbers" for more details.
const VENDOR_ID = 1659;
const PRODUCT_ID = 8963;
const stream = usb.findByIds(VENDOR_ID, PRODUCT_ID);
const allUSBDevices = usb.getDeviceList();

// Ensure the stream is defined to prevent unwanted "not found" errors.
if (!stream) {
  const foundDevice = allUSBDevices[0] || undefined;
  // If there is an error, print that message along with the idProduct and idVendor of a found device.
  const foundDeviceMessage = !!foundDevice
    ? `Did you mean PID ${foundDevice.deviceDescriptor.idProduct} and VID ${foundDevice.deviceDescriptor.idVendor}?`
    : 'There are currently no devices plugged into this computer.';
  throw new Error(
    `USB device with vendor ID of ${VENDOR_ID} and product ID of ${PRODUCT_ID} could not be found. ${foundDeviceMessage}`
  );
}
// Now that we know stream is defined, we can use it.
stream.open();

const { endpoints } = stream.interface(0);
usb.Interface.claim();
[usb.InEndpoint, usb.OutEndpoint] = endpoints;
usb.InEndpoint.transferType = 2;
usb.InEndpoint.startPoll(1, 64);
usb.InEndpoint.transfer(64, (error, data) => {
  if (error) {
    throw error;
  }
  console.log(data);
});

usb.InEndpoint.on('data', (data) => {
  console.log(data);
});

usb.InEndpoint.on('error', (error) => {
  console.log(error);
});

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
