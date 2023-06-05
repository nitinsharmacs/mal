const readline = require('readline');
const { pr_str } = require('./common/printer.js');
const { read_str } = require('./common/reader.js');
const core = require('./common/core.js');
const { Env } = require('./common/Env.js');
const {
  MalSymbol,
  MalList,
  MalVector,
  MalNil,
  MalFunction,
  CommentException,
} = require('./common/types.js');

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

  partition(bindings.value).forEach(([sym, val]) => {
    newEnv.set(sym, EVAL(val, newEnv));
  });

  return [body, newEnv];
};

const evalDo = (ast, env) => {
  ast.betweenExtremes().forEach((item) => EVAL(item, env));

  return ast.last();
};

const evalIf = (ast, env) => {
  const [condition, trueBlock, falseBlock] = ast.rest();

  const condEval = EVAL(condition, env);

  if (isFinite(condEval) || condEval.getBool()) {
    return trueBlock;
  }

  return falseBlock !== undefined ? falseBlock : new MalNil();
};

const bindExprs = (binds, expr, env) => {
  const fnEnv = new Env(env);

  for (let index = 0; index < binds.length; index++) {
    const param = binds[index];

    if (param.value === '&') {
      fnEnv.set(binds[index + 1], new MalList(expr.slice(index)));
      return fnEnv;
    }

    fnEnv.set(param, EVAL(expr[index], fnEnv));
  }

  return fnEnv;
};

const evalFn = (ast, env) => {
  const [{ value: binds }, fnBody] = ast.rest();
  const fn = (...expr) => {
    const [{ value: binds }, fnBody] = ast.rest();

    return EVAL(fnBody, bindExprs(binds, expr, env));
  };

  return new MalFunction(fnBody, binds, env, fn);
};

const EVAL = (ast, env) => {
  while (true) {
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
        [ast, env] = evalLet(ast, env);
        break;
      case 'do':
        ast = evalDo(ast, env);
        break;
      case 'if':
        ast = evalIf(ast, env);
        break;
      case 'fn*':
        ast = evalFn(ast, env);
        break;
      default:
        const [fn, ...args] = eval_ast(ast, env).value;
        if (fn instanceof MalFunction) {
          ast = fn.value;
          const oldEnv = fn.env;
          const binds = fn.binds;
          env = bindExprs(binds, args, oldEnv);
        } else {
          return fn.apply(null, args);
        }
    }
  }
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

  for (symbol in core) {
    env.set(new MalSymbol(symbol), core[symbol]);
  }

  env.set(new MalSymbol('eval'), (ast) => EVAL(ast, env));
  return env;
};

const repl = async () => {
  const env = createEnv();

  rep('(def! not (fn* (a) (if a false true)))', env);
  rep(
    '(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) " nil)")))))',
    env
  );

  while (true) {
    try {
      const line = await read('user> ');
      console.log(rep(line, env));
    } catch (err) {
      if (!(err instanceof CommentException)) {
        console.log(err);
      }
    }
  }
};

repl();
