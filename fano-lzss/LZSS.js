
function compressLZSS(input) {
    const encoder = new TextEncoder('utf-8');
    input = encoder.encode(input);

    let output = [];
    let buffer = 0;
    let bufferLength = 0;
    let consecutiveZeros = 0;

    const writeBit = (bit) => {
        buffer = (buffer << 1) | bit;
        bufferLength++;

        if (bufferLength === 8) {
            output.push(buffer);
            buffer = 0;
            bufferLength = 0;
        }
    };

    const writeLiteral = (value) => {
        if (consecutiveZeros > 0) {
            while (consecutiveZeros > 0) {
                writeBit(0); // Маркер для нулей
                consecutiveZeros--;
            }
        }
        writeBit(1);
        for (let i = 7; i >= 0; i--) {
            writeBit((value >> i) & 1);
        }
    };

    for (let i = 0; i < input.length; i++) {
        if (input[i] === 0) {
            consecutiveZeros++;
        } else {
            writeLiteral(input[i]);
        }
    }

    if (consecutiveZeros > 0) {
        while (consecutiveZeros > 0) {
            writeBit(0); // Маркер для нулей
            consecutiveZeros--;
        }
    }

    if (bufferLength > 0) {
        output.push(buffer << (8 - bufferLength));
    }

    return new Uint8Array(output);
}

// Функция для распаковки данных с использованием алгоритма LZSS
function decompressLZSS(input) {
    let output = [];
    let buffer = 0;
    let bufferLength = 0;
    let inputIndex = 0;
    let consecutiveZeros = 0;

    const readBit = () => {
        if (bufferLength === 0) {
            buffer = input[inputIndex++];
            bufferLength = 8;
        }
        bufferLength--;
        return (buffer >> bufferLength) & 1;
    };

    while (inputIndex < input.length) {
        if (consecutiveZeros > 0) {
            while (consecutiveZeros > 0) {
                output.push(0);
                consecutiveZeros--;
            }
        }

        if (readBit() === 1) {
            let value = 0;
            for (let i = 0; i < 8; i++) {
                value = (value << 1) | readBit();
            }
            output.push(value);
        } else {
            consecutiveZeros = 1;
            while (consecutiveZeros > 0) {
                if (readBit() === 0) {
                    consecutiveZeros++;
                } else {
                    break;
                }
            }
        }
    }

    output = new Uint8Array(output)
    const decoder = new TextDecoder('utf-8');
    output = decoder.decode(output);
    return output;
}

let k = "r@☻1B♥Á♦☻X·¢ÅE  ¶X²p◄a% É▬♦0 eÀ♣♠♠x☺♦♦$D91 ☺À☻▬☻$►H ÄÄ◄☺☻►►♦H1 B☻☻☺@h↑À◄◄aÁ0♠$$p►Â !F§♠@!►◄âÀ►►&►8hq`!À☺◄►¶";
let c = compressLZSS(k);
console.log(c);
let dec = decompressLZSS(c);
console.log(dec === k);

if(dec == c) {

}
module.exports = {
    compressLZSS: compressLZSS,
    decompressLZSS: decompressLZSS,
};