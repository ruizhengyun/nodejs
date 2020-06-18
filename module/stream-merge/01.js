const fs = require('fs');
const readStream = fs.createReadStream('./read.stream.txt');
const writeStream = fs.createWriteStream('./wirte.stream.txt');

readStream.pipe(writeStream);