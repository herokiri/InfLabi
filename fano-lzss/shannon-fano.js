// Функция для вычисления вероятностей символов во входных данных
function calculateSymbolProbabilities(input) {
    const symbolCounts = {};
    const totalSymbols = input.length;

    for (let i = 0; i < totalSymbols; i++) {
        const symbol = input[i];
        if (symbolCounts[symbol]) {
            symbolCounts[symbol]++;
        } else {
            symbolCounts[symbol] = 1;
        }
    }

    const probabilities = {};
    for (const symbol in symbolCounts) {
        probabilities[symbol] = symbolCounts[symbol] / totalSymbols;
    }

    return probabilities;
}

// Функция для сжатия данных с использованием алгоритма Шеннон-Фано
function compressShannonFano(input) {
    const probabilities = calculateSymbolProbabilities(input);
    const sortedProbabilities = Object.entries(probabilities).sort((a, b) => b[1] - a[1]);

    // Рекурсивная функция для построения кодов Шеннон-Фано
    function buildShannonFanoCodes(subarray, prefix) {
        if (subarray.length === 1) {
            const symbol = subarray[0][0];
            return { [symbol]: prefix };
        }

        const mid = Math.ceil(subarray.length / 2);
        const left = subarray.slice(0, mid);
        const right = subarray.slice(mid);

        const leftCodes = buildShannonFanoCodes(left, prefix + '0');
        const rightCodes = buildShannonFanoCodes(right, prefix + '1');

        return { ...leftCodes, ...rightCodes };
    }

    const codes = buildShannonFanoCodes(sortedProbabilities, '');

    let compressedData = '';
    for (let i = 0; i < input.length; i++) {
        compressedData += codes[input[i]];
    }

    compressedData = bitsToString(compressedData);

    return {
        codes,
        compressedData,
    };
}

// Функция для декомпрессии данных с использованием таблицы кодов Шеннон-Фано
function decompressShannonFano(compressedData, codes) {
    compressedData = stringToBits(compressedData);
    let decodedData = '';
    let currentCode = '';

    for (let i = 0; i < compressedData.length; i++) {
        currentCode += compressedData[i];

        for (const symbol in codes) {
            if (codes[symbol] === currentCode) {
                decodedData += symbol;
                currentCode = '';
                break;
            }
        }
    }

    return decodedData;
}

function stringToBits(s) {
    let bits = '';
    for (let i = 0; i < s.length; i++) {
        const binary = s[i].charCodeAt(0).toString(2).padStart(8, '0');
        bits += binary;
    }
    return bits;
}

function bitsToString(bits) {
    let string = '';
    for (let i = 0; i < bits.length; i += 8) {
        const byte = bits.substr(i, 8);
        const charCode = parseInt(byte, 2);
        const char = String.fromCharCode(charCode);
        string += char;
    }
    return string;
}

module.exports = {
    compressShannonFano: compressShannonFano,
    decompressShannonFano: decompressShannonFano,
};