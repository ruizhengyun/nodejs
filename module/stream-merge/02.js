const fs = require('fs');

const readStream = fs.createReadStream('./read.stream.txt');
const writeStream = fs.createWriteStream('./wirte.stream.txt');

// 可写流处于打开状态，需手动关闭
readStream.pipe(writeStream, {
  end: false
});

// 监听可读流结束
readStream.on('end', () => {
  // console.log('可读流结束');
  writeStream.end('可写流结束');
});

// 监听错误
readStream.on('error', (err) => {
  console.log('error', err);
  writeStream.end('可写流结束')
});

// 打印进程 id
console.log('pid', process.pid);