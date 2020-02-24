const log = require('./log.js');
const fs = require('fs');
const { Log } = require('./log.js');

const stdout = fs.createWriteStream('./stdout.txt');
const stderr = fs.createWriteStream('./stderr.txt');

const obj = {
    name: 'pr',
    age: 30,
    favorite: {
        'ball': ['篮球', '足球']
    }
}
// 日志输出至终端
log.log('打印日志');

log.info('打印基础日志');

log.error('打印错误日志');

log.warn('打印警告日志');

log.trace('打印错误堆栈');

// 打印对象
log.log(obj);
log.dir(obj, { depth: 0 });

// 程序执行消耗时间
log.time('定时器 pr');
for (let i = 0; i < 1000000000; i++) { }
log.timeEnd('定时器 pr');

log.log(log._time.get('time'));
// log.clear();

// 日志输出至文件
const logger = Log(stdout, stderr);
logger.log('可写流，日志模块 Console 方法 log');
logger.error('可写流，日志模块 Console 方法 error');
