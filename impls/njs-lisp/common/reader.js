const TOKENS = require('./tokens.js');
const {
  MalList,
  MalValue,
  MalSymbol,
  MalVector,
  MalNil,
  MalString,
  MalBoolean,
} = require('./types.js');

const tokenize = (str) => {
  const re =
    /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;

  return [...str.matchAll(re)].map((matchItem) => matchItem[1]).slice(0, -1);
};

class Reader {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  peek() {
    return this.tokens[this.position];
  }

  next() {
    const token = this.peek();
    this.position++;
    return token;
  }
}

const read_seq = (reader, seqEndSymbol) => {
  const ast = [];

  reader.next();

  while (reader.peek() !== seqEndSymbol) {
    if (reader.peek() === undefined) {
      throw new Error('unbalanced');
    }
    ast.push(read_form(reader));
  }

  reader.next();

  return ast;
};

const read_list = (reader) => {
  return new MalList(read_seq(reader, TOKENS.RIGHT_PAR));
};

const read_vector = (reader) => {
  return new MalVector(read_seq(reader, TOKENS.RIGHT_SQURE_PAR));
};

const isNumber = (token) => /^-?[0-9]+$/.test(token);
const isString = (token) => /^"(.*)"$/.test(token);

const read_atom = (reader) => {
  const token = reader.next();

  if (isString(token)) {
    return new MalString(token);
  }

  if (isNumber(token)) {
    return parseInt(token);
  }

  if (token === 'true') {
    return new MalBoolean(true);
  }

  if (token === 'false') {
    return new MalBoolean(false);
  }

  if (token === 'nil') {
    return new MalNil();
  }
  return new MalSymbol(token);
};

const read_form = (reader) => {
  const token = reader.peek();

  switch (token) {
    case TOKENS.LEFT_PAR: {
      return read_list(reader);
    }

    case TOKENS.LEFT_SQURE_PAR: {
      return read_vector(reader);
    }
    default:
      return read_atom(reader);
  }
};

const read_str = (str) => read_form(new Reader(tokenize(str)));

exports.read_str = read_str;
