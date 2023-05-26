const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const READ = (str) => {
  return str;
};

const EVAL = (str) => {
  return str;
};

const PRINT = (str) => {
  return str;
};

const rep = (str) => {
  return PRINT(EVAL(READ(str)));
};

const repl = () =>
  rl.question('user> ', (line) => {
    console.log(rep(line));
    repl();
  });

repl();
