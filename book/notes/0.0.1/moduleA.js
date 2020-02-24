console.log('模块 moduleA');
exports.name = 'moduleA name';

age = 27;

const moduleB = require('./moduleB.js');
console.log('moduleA require moduleB =>', moduleB.name);