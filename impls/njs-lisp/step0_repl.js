const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const READ = (str) => str;

const EVAL = (str) => str;

const PRINT = (str) => str;

const rep = (str) => {
  return PRINT(EVAL(READ(str)));
};

const read = (prompt) =>
  new Promise((res, rej) => {
    rl.question(prompt, (line) => {
      res(line);
    });
  });

const repl = async () => {
  while (true) {
    const line = await read('user> ');
    console.log(rep(line));
  }
};

repl();
