const assert = require('assert');
const fs = require('fs');

const {
  MalNil,
  MalList,
  MalSequence,
  MalBoolean,
  MalString,
  MalValue,
  MalAtom,
} = require('./types');
const { read_str } = require('./reader');

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
  'read-string': (str) => {
    return read_str(new MalString(str.value).toString());
  },
  slurp: (filename) =>
    new MalString(fs.readFileSync(filename.toString(), 'utf8')),
  atom: (value) => new MalAtom(value),
  deref: (atom) => atom.deref(),
  'reset!': (atom, value) => atom.reset(value),
  'swap!': (atom, f, ...args) => atom.swap(f, args),
  'atom?': (atom) => atom instanceof MalAtom,
};

module.exports = {
  ...operators,
  ...coreFunctions,
};
