const readline = require('readline');
const { pr_str } = require('./printer.js');
const { read_str } = require('./reader.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const READ = (str) => read_str(str);

const EVAL = (str) => str;

const PRINT = (str) => pr_str(str);

const rep = (str) => {
  return PRINT(EVAL(READ(str)));
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
      console.log(rep(line));
    } catch (err) {
      console.log(err);
      console.log('unbalanced');
    }
  }
};

repl();
