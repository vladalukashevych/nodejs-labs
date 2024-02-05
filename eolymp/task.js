const fs = require('fs');
const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const outputPath = path.join(__dirname, 'output.txt');

const data = fs.readFileSync(inputPath, 'utf8').trim().split('\n');
const [shops, empls] = data[0].split(' ').map(Number);
const coords = data[1].split(' ').map(Number);

let Left = 0; Right = 1000000000;
while (Left <= Right)
{
    const Middle = Math.round((Left + Right) / 2);
    if (Check(Middle)) Left = Middle + 1;
    else Right = Middle - 1;
}

let res = `${Left-1}`;
fs.writeFileSync(outputPath, res);


function Check(value) {
    let stall = 1, len = 0;
    for (let i = 1; i < shops; i++)
    {
        len += coords[i] - coords[i - 1];
        if (len >= value) len = 0, stall++;
    }
    return stall >= empls;
}
