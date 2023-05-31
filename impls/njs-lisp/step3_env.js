const readline = require('readline');
const { pr_str } = require('./printer.js');
const { read_str } = require('./reader.js');
const replEnv = require('./step2Lib/replEnv.js');
const { Env } = require('./step3Lib/env.js');
const { MalSymbol, MalList, MalVector, MalNil } = require('./types.js');

const { partition } = require('./common.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const READ = (str) => read_str(str);

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env.get(ast);
  }

  if (ast instanceof MalVector) {
    const newAst = ast.value.map((x) => EVAL(x, env));
    return new MalVector(newAst);
  }

  if (ast instanceof MalList) {
    const newAst = ast.value.map((x) => EVAL(x, env));
    return new MalList(newAst);
  }

  return ast;
};

const EVAL = (ast, env) => {
  if (!(ast instanceof MalList)) {
    return eval_ast(ast, env);
  }

  if (ast.isEmpty()) {
    return ast;
  }

  switch (ast.first().value) {
    case 'def!':
      const [symbol, value] = ast.rest();
      env.set(symbol, EVAL(value, env));
      return env.get(symbol);
    case 'let*':
      const [bindings, body] = ast.rest();
      const newEnv = new Env(env);
      partition(bindings.value).forEach(([sym, val]) =>
        newEnv.set(sym, EVAL(val, newEnv))
      );
      return EVAL(body, newEnv);
  }

  const [fn, ...args] = eval_ast(ast, env).value;
  return fn.apply(null, args);
};

const PRINT = (str) => pr_str(str);

const rep = (str, env) => {
  return PRINT(EVAL(READ(str), env));
};

const read = (prompt) =>
  new Promise((res, _) => {
    rl.question(prompt, (line) => {
      res(line);
    });
  });

const createEnv = () => {
  const env = new Env();

  for (symbol in replEnv) {
    env.set(new MalSymbol(symbol), replEnv[symbol]);
  }

  return env;
};

const repl = async () => {
  const env = createEnv();
  while (true) {
    try {
      const line = await read('user> ');
      console.log(rep(line, env));
    } catch (err) {
      console.log(err);
    }
  }
};

repl();
