const readline = require('readline');
const { pr_str } = require('./common/printer.js');
const { read_str } = require('./common/reader.js');
const replEnv = require('./common/coreEnv.js');
const { Env } = require('./common/Env.js');
const { MalSymbol, MalList, MalVector, MalNil } = require('./common/types.js');

const { partition } = require('./common/partition.js');

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

const evalDef = (ast, env) => {
  const [symbol, value] = ast.rest();
  env.set(symbol, EVAL(value, env));
  return env.get(symbol);
};

const evalLet = (ast, env) => {
  const [bindings, body] = ast.rest();
  const newEnv = new Env(env);
  partition(bindings.value).forEach(([sym, val]) =>
    newEnv.set(sym, EVAL(val, newEnv))
  );
  return EVAL(body, newEnv);
};

const evalDo = (ast, env) => {
  ast.betweenExtremes().forEach((item) => EVAL(item, env));
  return EVAL(ast.last(), env);
};

const evalIf = (ast, env) => {
  const [condition, trueBlock, falseBlock] = ast.rest();

  if (EVAL(condition, env).value === true) {
    return EVAL(trueBlock, env);
  }

  return falseBlock ? EVAL(falseBlock, env) : new MalNil();
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
      return evalDef(ast, env);
    case 'let*':
      return evalLet(ast, env);
    case 'do':
      return evalDo(ast, env);
    case 'if':
      return evalIf(ast, env);
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
