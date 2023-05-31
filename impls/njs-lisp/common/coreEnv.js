const { MalNil, MalList, MalSequence } = require('./types');
const assert = require('assert');

const deepStrictEqual = (item1, item2) => {
  try {
    assert.deepEqual(item1, item2);
    return true;
  } catch (err) {
    return false;
  }
};

const print = (...args) =>
  args.forEach((arg) => process.stdout.write(arg.toString().concat(' ')));

const println = (...args) => {
  print(...args);
  process.stdout.write('\n');
};

const operators = {
  '+': (...args) => args.reduce((sum, arg) => sum + arg),
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  '<': (...args) => args.reduce((acc, arg) => acc < arg),
  '<=': (...args) => args.reduce((acc, arg) => acc <= arg),
  '>': (...args) => args.reduce((acc, arg) => acc > arg),
  '>=': (...args) => args.reduce((acc, arg) => acc >= arg),
  '=': (a, b) => deepStrictEqual(a, b),
  mod: (a, b) => a % b,
};

const coreFunctions = {
  list: (...args) => new MalList(args),
  'list?': (arg) => arg instanceof MalList,
  count: (seq) => {
    if (MalSequence.isSeq(seq)) {
      return seq.length;
    }

    return 0;
  },
  'empty?': (seq) => {
    return MalSequence.isSeq(seq) ? seq.isEmpty() : false;
  },
  prn: (...args) => {
    println(...args);
    return new MalNil();
  },
  println: (...args) => {
    println(...args);
    return new MalNil();
  },
};

module.exports = {
  ...operators,
  ...coreFunctions,
};
