
const fs = require('fs');
const fsp = require('fs').promises;

const fanoFunctions = require('./shannon-fano.js');
const LZSSFunctions = require('./LZSS.js');

const arg = process.argv.slice(2);

async function loadFiles() {
    try {
        const data1 = await fsp.readFile('codes.json', 'utf8'); // для файла JSON
        const data2 = await fsp.readFile('compress.txt', 'utf8'); // для текстового файла
        return { data1, data2 };
    } catch (err) {
        throw err;
    }
}

async function decompressFunction() {
    try {
      const { data1, data2 } = await loadFiles();
      
      let lzssDecompressData = LZSSFunctions.decompressLZSS(data2);
      let fanoDecompressData = fanoFunctions.decompressShannonFano(lzssDecompressData, data1);

    } catch (err) {
      console.error('Произошла ошибка:', err);
    }
  }
  


if (arg == '1') {
    fs.readFile('Муму.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        let fanoData = fanoFunctions.compressShannonFano(data);
        let resData = LZSSFunctions.compressLZSS(fanoData.compressedData);

        const dec =  LZSSFunctions.decompressLZSS(resData);
        console.log(fanoData.compressedData.slice(0, 150));
        console.log()
        console.log(dec.slice(0,150));

        fs.writeFile('compress.txt', resData, 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        fs.writeFile('codes.json', JSON.stringify(fanoData.codes), 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    });
}
else {

    decompressFunction();
}

