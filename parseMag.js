import usb from 'usb';
//lists all devices
//console.log(usb.getDeviceList());

//specify port with vendorid + productid
//console.log(usb.findByIds(1060,9492));

let stream = usb.findByIds(1659, 8963);
stream.open(); 

let endpoints = stream.interface(0).endpoints
console.log(endpoints)
usb.Interface.claim()
    usb.InEndpoint = endpoints[0],
    usb.OutEndpoint = endpoints[1];
usb.InEndpoint.trasferType = 2
usb.InEndpoint.startPoll(1, 64)
usb.InEndpoint.transfer(64, function (error, data) {
    if (!error) {
        console.log(data);
    } else {
        console.log(error);
    }
});

usb.InEndpoint.on('data', function (data) {
    console.log(data);
});

usb.InEndpoint.on('error', function (error) {
    console.log(error);
});



//let string = /\d{5}\.\d{3}[\s,]\d{4}[\s,]\d{4}[\s,]\d{4}/;
//console.log(string.test("12345.123,1234,1858,1234"))



//function parseMaggy(datastream) {
//    if (!datastream) {
//        badString.push(datastream)
//    } else if (string === true) {
//        correctString.push(datastream)
   // }     
//}

//parseMaggy(string);
//console.log(correctString);