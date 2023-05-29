module.exports = {
  '+': (...args) => args.reduce((sum, arg) => sum + arg),
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  mod: (a, b) => a % b,
};
