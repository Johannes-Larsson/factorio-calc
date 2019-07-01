#!/usr/bin/node
const interval = require('./interval.js').intp;
const core = require('./core.js');
const human = require('./human.js');

let prods = [];
let lastWasNum = false;

for (const arg of process.argv.slice(2)) {
  let intv = interval(arg);
  if (intv == -1) {
    prods.push({ "name": arg, "amount": 1});
    lastWasNum = false;
  } else {
    if (prods.length > 0 && !lastWasNum) {
      prods[prods.length-1].amount = intv;
      lastWasNum = true;
    } else {
      console.log(chalk.red('ERROR: specify a recipe first'));
      console.log('Usage: ./fcalc.js item [amount] [item [amount] .. ]');
      process.exit(1);
    }
  }
}

if (prods.length == 0) {
  console.log(chalk.red('ERROR: no recipe specified'));
  console.log('Usage: ./fcalc.js item [amount] [item [amount] .. ]');
  process.exit(1);
}

let ingredients;

for (let rec of prods) {
  ingredients = core.processIngredient(rec, ingredients);
}

human(ingredients);
