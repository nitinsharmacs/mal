const TOKENS = require('./tokens');

class MalValue {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value.toString();
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalNil extends MalValue {
  constructor() {
    super(null);
  }

  toString() {
    return 'nil';
  }
}

class MalBoolean extends MalValue {
  constructor(value) {
    super(value);
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

module.exports = {
  MalSymbol,
  MalSequence,
  MalList,
  MalValue,
  MalVector,
  MalNil,
  MalBoolean,
};
