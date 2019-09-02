const util = require('util');

/**
 * 初始化对象 Log
 * @param {*} stdout 
 * @param {*} stderr 
 */
function Log(stdout, stderr) {
    // 安全模式，检查当前对象是否是 Log 的实例
    if (!(this instanceof Log)) {
        return new Log(stdout, stderr);
    }

    // 检查是否是可写流实例
    if (!stdout || !(stdout.write instanceof Function)) {
        throw new Error('可写流实例不存在');
    }

    // stderr 未指定就指定 stdout
    if (!stderr) {
        stderr = stdout;
    }

    let props = {
        writable: true,
        enumerable: false,
        configurable: false
    }

    // 定义属性 _stdout
    Object.defineProperty(this, '_stdout', Object.assign(props, {
        value: stdout
    }));

    // 定义属性 _stderr
    Object.defineProperty(this, '_stderr', Object.assign(props, {
        value: stderr
    }));

    // 定义属性 _times
    Object.defineProperty(this, '_time', Object.assign(props, {
        value: new Map()
    }));

    // 将原型上的方法绑定到 Log 实例上
    const keys = Object.keys(Log.prototype);

    for (let key in keys) {
        const item = keys[key];
        this[item] = this[item].bind(this);
    }
}

// 定义原型上的方法
Log.prototype.info = function () {
    this._stdout.write(util.format.apply(this, arguments) + '\n');
}

Log.prototype.log = Log.prototype.info;

Log.prototype.error = function () {
    this._stderr.write(util.format.apply(this, arguments) + '\n');
}

Log.prototype.warn = Log.prototype.error;

// 堆栈信息
Log.prototype.trace = function trace(...args) {
    const err = {
        name: 'Trace',
        message: util.format.apply(null, args)
    };

    // V8 引擎的 Stack Trace API
    Error.captureStackTrace(err, trace);
    this.error(err.stack);
}

// 输出某个对象
Log.prototype.dir = function (object, options) {
    options = Object.assign({ customInspect: false }, options);
    this._stdout.write(util.inspect(object, options) + '\n');
}

// 计时器
Log.prototype.time = function(label){
    // this._time 是一个 Map
    this._time.set(label, process.hrtime());
}

Log.prototype.timeEnd = function(label){
    const timeLabel = this._time.get(label);
    if(!timeLabel) {
        process.emitWarning(`没有时间标志 ${label}`);
        return
    }
    const duration = process.hrtime(timeLabel);
    const ms = duration[0] * 1000 + duration[1] / 1e6;
    this.log('标签%s: 耗时 %sms', label, ms.toFixed(3));
    this._time.delete(label);
}

// 清除控制台信息
Log.prototype.clear = function () {
    if (this._stdout.isTTY) {
        const { cursorTo, clearScreenDown } = require('readline');
        cursorTo(this._stdout, 0, 0); // 光标移到 TTY stream 指定位置
        clearScreenDown(this._stdout); // 从光标的当前位置向下清除给定的 TTY 流
    }
}

const stdout = process.stdout;
const stderr = process.stderr;
module.exports = new Log(stdout, stderr);
module.exports.Log = Log;