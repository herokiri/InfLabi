// Функция для кодирования строки с использованием алгоритма LZSS
function compressLZSS(input) {
    let output = '';
    let buffer = '';
    let index = 0;

    while (index < input.length) {
        let match = '';
        let matchLength = 0;

        for (let i = 1; i <= 12; i++) {
            const substring = input.substr(index, i);
            const searchIndex = buffer.lastIndexOf(substring);

            if (searchIndex !== -1 && searchIndex < buffer.length - 1) {
                match = substring;
                matchLength = i;
            }
        }

        if (match) {
            output += `1${matchLength.toString(2).padStart(4, '0')}${match}`;
            index += matchLength;
            buffer += match;
        } else {
            output += `0${input[index]}`;
            buffer += input[index];
            index++;
        }

        if (buffer.length > 4096) {
            buffer = buffer.slice(-4096);
        }
    }

    return output;
}

// Функция для декодирования строки, закодированной с использованием алгоритма LZSS
function decompressLZSS(input) {
    let output = '';
    let index = 0;
    let buffer = '';

    while (index < input.length) {
        if (input[index] === '0') {
            output += input[index + 1];
            buffer += input[index + 1];
            index += 2;
        } else {
            const matchLength = parseInt(input.substr(index + 1, 4), 2);
            const matchOffset = buffer.lastIndexOf(input.substr(index + 5, matchLength));
            const match = buffer.slice(matchOffset, matchOffset + matchLength);
            output += match;
            buffer += match;
            index += 5 + matchLength;
        }

        if (buffer.length > 4096) {
            buffer = buffer.slice(-4096);
        }
    }

    return output;
}

module.exports = {
    compressLZSS: compressLZSS,
    decompressLZSS: decompressLZSS,
};
