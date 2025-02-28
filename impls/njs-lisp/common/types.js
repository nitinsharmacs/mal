const { partition } = require('./partition');
const TOKENS = require('./tokens');

const createMalString = (str) => {
  return str.replace(/\\(.)/g, (c, captured) => {
    return captured === 'n' ? '\n' : captured;
  });
};
class MalValue {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value.toString();
  }

  getBool() {
    return true;
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalFunction extends MalValue {
  constructor(ast, binds, env, fn) {
    super(ast);
    this.binds = binds;
    this.env = env;
    this.fn = fn;
  }

  toString() {
    return '#<function>';
  }

  apply(ctx = null, args) {
    return this.fn.apply(ctx, args);
  }
}

class MalNil extends MalValue {
  constructor() {
    super(null);
  }

  toString() {
    return 'nil';
  }

  getBool() {
    return false;
  }
}

class MalBoolean extends MalValue {
  constructor(value) {
    super(value);
  }

  getBool() {
    return this.value === true;
  }
}

class MalSequence extends MalValue {
  constructor(value) {
    super(value);
  }

  static isSeq(seq) {
    return seq instanceof MalSequence;
  }

  isEmpty() {
    return this.value.length === 0;
  }

  get length() {
    return this.value.length;
  }
}

class MalString extends MalSequence {
  constructor(value) {
    super(value);
  }

  get length() {
    return this.value.length - 2;
  }

  toString(print_readably = false) {
    if (print_readably) {
      return (
        '"' +
        this.value
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n') +
        '"'
      );
    }

    return this.value.replace(/"/g, '');
  }
}
class MalList extends MalSequence {
  constructor(value) {
    super(value);
  }

  first() {
    return this.value[0];
  }

  rest() {
    return this.value.slice(1);
  }

  last() {
    return this.value.slice(-1)[0];
  }

  betweenExtremes() {
    return this.value.slice(1, -1);
  }

  toString() {
    return (
      TOKENS.LEFT_PAR +
      this.value
        .map((value) =>
          value instanceof MalValue ? value.toString() : value.toString()
        )
        .join(' ') +
      TOKENS.RIGHT_PAR
    );
  }
}

class MalVector extends MalSequence {
  constructor(value) {
    super(value);
  }

  toString() {
    return (
      TOKENS.LEFT_SQURE_PAR +
      this.value.map((value) => value.toString()).join(' ') +
      TOKENS.RIGHT_SQURE_PAR
    );
  }
}

class MalHashMap extends MalSequence {
  constructor(value) {
    super(value);
  }

  static create(items) {
    if (items.length % 2 !== 0) {
      throw new Error('Map litral must contain an even number of forms');
    }

    const keyValuePairs = partition(items);

    return new MalHashMap(
      keyValuePairs.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {})
    );
  }

  toString() {
    return (
      TOKENS.LEFT_CURLY_PAR +
      Object.entries(this.value)
        .map(([key, value]) => key.toString() + ' ' + value.toString())
        .join(' ') +
      TOKENS.RIGHT_CURLY_PAR
    );
  }
}

class MalAtom extends MalValue {
  constructor(value) {
    super(value);
  }

  toString(print_readably) {
    return '(atom ' + this.value + ')';
  }

  deref() {
    return this.value;
  }

  reset(value) {
    this.value = value;
    return value;
  }

  swap(fn, args) {
    this.value = fn.apply(null, [this.value, ...args]);
    return this.value;
  }
}

class MalComment extends MalValue {
  constructor(value) {
    super(value);
  }
}

class CommentException extends Error {
  constructor(err) {
    super(err);
  }
}
module.exports = {
  MalSymbol,
  MalSequence,
  MalList,
  MalValue,
  MalString,
  MalVector,
  MalNil,
  MalBoolean,
  MalFunction,
  MalHashMap,
  MalAtom,
  MalComment,
  CommentException,
};
