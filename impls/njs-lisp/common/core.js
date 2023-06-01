const {
  MalNil,
  MalList,
  MalSequence,
  MalBoolean,
  MalString,
} = require('./types');
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
  '<': (...args) =>
    new MalBoolean(args.slice(0, -1).every((item, i) => item < args[i + 1])),
  '<=': (...args) =>
    new MalBoolean(args.slice(0, -1).every((item, i) => item <= args[i + 1])),
  '>': (...args) =>
    new MalBoolean(args.slice(0, -1).every((item, i) => item > args[i + 1])),
  '>=': (...args) =>
    new MalBoolean(args.slice(0, -1).every((item, i) => item >= args[i + 1])),
  '=': (a, b) => new MalBoolean(deepStrictEqual(a, b)),
  mod: (a, b) => a % b,
};

const coreFunctions = {
  list: (...args) => new MalList(args),
  count: (seq) => {
    if (MalSequence.isSeq(seq)) {
      return seq.length;
    }

    return 0;
  },
  str: (...args) => {
    return new MalString(
      '"' +
        args.reduce((acc, arg) => acc + arg.toString(), '').replace(/"/g, '') +
        '"'
    );
  },
  prn: (...args) => {
    println(...args);
    return new MalNil();
  },
  println: (...args) => {
    println(...args);
    return new MalNil();
  },
  'list?': (arg) => arg instanceof MalList,
  'empty?': (seq) => {
    return MalSequence.isSeq(seq) ? seq.isEmpty() : false;
  },
};

module.exports = {
  ...operators,
  ...coreFunctions,
};
