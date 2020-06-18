const fs = require('fs');
const path = require('path');

const resolve = dir => {
  return path.resolve(__dirname, dir);
}

/**
 * streamMerge 入口文件
 * @param { String } sourceFiles 源文件目录名
 * @param { String } targetFile 目标文件
 */
function streamMerge (sourceFiles, targetFile) {
  const fileReadStreams = fs.readdirSync(resolve(sourceFiles)); // 获取源文件目录下的所有文件
  const fileWriteStream = fs.createWriteStream(resolve(targetFile)); // 创建一个可写流

  streamMergeRecursive(fileReadStreams, fileWriteStream);
}

/**
 * streamMergeRecursive  函数递归处理多文件合并
 * @param { Array } fileReadStreams 
 * @param { Stream } fileWriteStream
 */
function streamMergeRecursive (fileReadStreams = [], fileWriteStream) {
  // 递归到尾部情况判断
  if (!fileReadStreams.length) {
    return fileWriteStream.end("console.log('Stream 合并完成')"); // 关闭可写流，防止内存泄漏
  }

  const currentFile = resolve(`fileReadStreams/${fileReadStreams.shift()}`);
  const currentReadStream = fs.createReadStream(currentFile); // 获取当前的可读流
  currentReadStream.pipe(fileWriteStream, { end: false });
  currentReadStream.on('end', () => {
    streamMergeRecursive(fileReadStreams, fileWriteStream);
  });

  currentReadStream.on('error', (error) => {
    // 监听错误事件，关闭可写流，防止内存泄漏
    console.error(error);
    fileWriteStream.close();
  });
}

streamMerge('./fileReadStreams', './fileWriteStream.txt');
