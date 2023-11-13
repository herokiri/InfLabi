const fs = require('fs');

const filepath = 'frukti.bmp';
const outputPathRed = 'results/frukti_modified_red.bmp';
const outputPathGreen = 'results/frukti_modified_green.bmp';
const outputPathBlue = 'results/frukti_modified_blue.bmp';

const data = fs.readFileSync(filepath);

// Read other fields from the BITMAPFILEHEADER
const dataOffset = readLittleEndianInt(data, 10, 4);
const width = readLittleEndianInt(data, 18, 4);
const height = readLittleEndianInt(data, 22, 4);
const bitPix = readLittleEndianInt(data, 28, 2);

// Calculate the size of the image data in bytes
const imageDataSize = readLittleEndianInt(data, 34, 4);

// Calculate the number of bytes per pixel
const bytesPerPixel = bitPix / 8;

// Create a copy of the original data to avoid modifying it directly
const modifiedDataRed = Buffer.from(data);
const modifiedDataGreen = Buffer.from(data);
const modifiedDataBlue = Buffer.from(data);

// Modify pixel values to remove red color
removeColorComponent(modifiedDataRed, dataOffset, imageDataSize, bytesPerPixel, 2); // Remove red

// Save the modified data to a new file
fs.writeFileSync(outputPathRed, modifiedDataRed);
console.log('Image with red removed saved to', outputPathRed);

// Modify pixel values to remove green color
removeColorComponent(modifiedDataGreen, dataOffset, imageDataSize, bytesPerPixel, 1); // Remove green

// Save the modified data to a new file
fs.writeFileSync(outputPathGreen, modifiedDataGreen);
console.log('Image with green removed saved to', outputPathGreen);

// Modify pixel values to remove blue color
removeColorComponent(modifiedDataBlue, dataOffset, imageDataSize, bytesPerPixel, 0); // Remove blue

// Save the modified data to a new file
fs.writeFileSync(outputPathBlue, modifiedDataBlue);
console.log('Image with blue removed saved to', outputPathBlue);

function removeColorComponent(buffer, offset, dataSize, bytesPerPixel, componentIndex) {
    for (let i = offset; i < offset + dataSize; i += bytesPerPixel) {
        buffer[i + componentIndex] = 0;
    }
}

function readLittleEndianInt(buffer, offset, length) {
    let result = 0;
    for (let i = 0; i < length; i++) {
        result += buffer[offset + i] * Math.pow(256, i);
    }
    return result;
}