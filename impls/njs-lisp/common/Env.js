class Env {
  constructor(outer) {
    this.outer = outer;
    this.data = {};
  }

  set(symbol, malValue) {
    this.data[symbol.value] = malValue;
  }

  find(symbol) {
    if (this.data[symbol.value] !== undefined) {
      return this;
    }

    if (this.outer) {
      return this.outer.find(symbol);
    }
  }

  get(symbol) {
    const env = this.find(symbol);

    if (!env) {
      throw new Error(`${symbol.value} not found`);
    }

    return env.data[symbol.value];
  }
}

module.exports = { Env };
