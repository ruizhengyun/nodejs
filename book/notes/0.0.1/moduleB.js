console.log('模块 moduleB');
exports.name = 'moduleB name';

const moduleA = require('./moduleA.js');
console.log('age: ', age);
console.log('moduleB require moduleA =>', moduleA.name);