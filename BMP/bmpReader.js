var bmp = require("bmp-js");
const fs = require('fs');

var bmpBuffer = fs.readFileSync('s.bmp');
var bmpData = bmp.decode(bmpBuffer);

console.log(bmpBuffer);
console.log(bmpData);