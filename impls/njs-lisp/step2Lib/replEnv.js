const { MalValue } = require('../types');

module.exports = {
  '+': (...args) =>
    args.reduce((sum, arg) => new MalValue(sum.value + arg.value)),
  '-': (a, b) => new MalValue(a.value - b.value),
  '*': (a, b) => new MalValue(a.value * b.value),
  '/': (a, b) => new MalValue(a.value / b.value),
  mod: (a, b) => new MalValue(a.value % b.value),
};
