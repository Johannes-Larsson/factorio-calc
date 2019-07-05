#!/usr/bin/node
const interval = require('./interval.js').intp;
const chalk = require('chalk');
const core = require('./core.js');
const humanFormat = require('./humanFormat.js');
const jsonFormat = require('./jsonFormat.js');
const graphvizFormat = require('./graphvizFormat.js');

let prods = [];
let lastWasNum = false;

let format = 'human';

let args = process.argv.slice(2).reverse();

while (args.length > 0) {
  let a = args.pop();
  if (a == '-f' || a == '--format') {
    format = args.pop();
  } else {
    let i = 1;
    if (args.length > 0) {
      i = interval(args[args.length - 1]);
      if (i == -1) {
        i = 1;
      } else {
        args.pop();
      }
    }
    prods.push({ "name": a, "amount": i });
  }
}

if (prods.length == 0) {
  console.log(chalk.red('ERROR: no recipe specified'));
  console.log('Usage: ./fcalc.js [-f format] item [amount] [item [amount] .. ]');
  process.exit(1);
}

let ingredients;

for (let rec of prods) {
  ingredients = core.processIngredient(rec, ingredients);
}

switch (format) {
  case 'human':
    humanFormat(ingredients);
    break;
  case 'json':
    jsonFormat(ingredients);
    break;
  case 'graphviz':
    graphvizFormat(ingredients);
    break;
  default:
    console.log(chalk.red(`ERROR: unrecognized format ${format}`));
    process.exit(1);
};
