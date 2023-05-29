const readline = require('readline');
const { pr_str } = require('./printer.js');
const { read_str } = require('./reader.js');
const replEnv = require('./step2Lib/replEnv.js');
const { Env } = require('./step3Lib/env.js');
const { MalSymbol, MalList, MalVector, MalNil } = require('./types.js');

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

  switch (ast.value[0].value) {
    case 'def!':
      env.set(ast.value[1], EVAL(ast.value[2], env));
      return env.get(ast.value[1]);
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
  env.set(new MalSymbol('+'), (...args) =>
    args.reduce((sum, arg) => sum + arg)
  );
  env.set(new MalSymbol('-'), (a, b) => a - b);
  env.set(new MalSymbol('*'), (a, b) => a * b);
  env.set(new MalSymbol('/'), (a, b) => a / b);
  env.set(new MalSymbol('mod'), (a, b) => a % b);

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
