const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const filePath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(filePath, 'utf-8');
let data = '';
readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => stdout.write(`${data}\n`));
readableStream.on('error', (err) => console.error(err.message));
