
const fs = require('fs');

const fanoFunctions = require('./shannon-fano.js');
const LZSSFunctions = require('./LZSS.js');

const arg = process.argv.slice(2);

function compressFunction(fileData) {


    const inner = fanoFunctions.compressShannonFano(fileData);
    const outer = LZSSFunctions.compressLZSS(inner.compressedData);

    return { text: outer, codes: inner.codes };
}

function decompressFunction(fileData, codes) {
    const outer = LZSSFunctions.decompressLZSS(fileData);
    const inner = fanoFunctions.decompressShannonFano(outer, codes);
    return inner;
}


if (arg == '1') {
    fs.readFile('Муму.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const cd = compressFunction(data);



        fs.writeFile('compress.txt', cd.text, 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });

        fs.writeFile('codes.json', JSON.stringify(cd.codes), 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    });
}
else {
    fs.readFile('compress.txt', 'utf8', (err, data1) => {
        if (err) {
            console.error(err);
            return;
        }

        // Read the second input file in JSON format
        fs.readFile('codes.json', 'utf8', (err, data2) => {
            if (err) {
                console.error(err);
                return;
            }

            // Parse the JSON data
            const codes = JSON.parse(data2);

            const res = decompressFunction(data1, codes);
            console.log(res);

            fs.writeFile('resultMumu.txt', res, 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        });
    });
}

