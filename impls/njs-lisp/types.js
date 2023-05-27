const TOKENS = require('./tokens');

class MalValue {
  constructor(value) {
    this.value = value;
  }

  pr_str() {
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

  pr_str() {
    return 'nil';
  }
}

class MalBoolean extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalList extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return (
      TOKENS.LEFT_PAR +
      this.value.map((value) => value.pr_str()).join(' ') +
      TOKENS.RIGHT_PAR
    );
  }

  isEmpty() {
    return this.value.length === 0;
  }
}

class MalVector extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return (
      TOKENS.LEFT_SQURE_PAR +
      this.value.map((value) => value.pr_str()).join(' ') +
      TOKENS.RIGHT_SQURE_PAR
    );
  }

  isEmpty() {
    return this.value.length === 0;
  }
}

module.exports = {
  MalSymbol,
  MalList,
  MalValue,
  MalVector,
  MalNil,
  MalBoolean,
};
