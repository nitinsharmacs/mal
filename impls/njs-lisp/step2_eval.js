const readline = require('readline');
const { pr_str } = require('./printer.js');
const { read_str } = require('./reader.js');
const replEnv = require('./step2Lib/replEnv.js');
const { MalSymbol, MalList, MalVector } = require('./types.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const READ = (str) => read_str(str);

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env[ast.value];
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

const repl = async () => {
  while (true) {
    try {
      const line = await read('user> ');
      console.log(rep(line, replEnv));
    } catch (err) {
      console.log('unbalanced');
    }
  }
};

repl();
