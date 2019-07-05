const core = require('./core.js');
const chalk = require('chalk');
const recipes = require('./recipe.json');
const assemblers = require('./assembling-machine.json');

// round num to p places
function round(num, p) {
  let m = Math.pow(10, p);
  return Math.round(num * m) / m;
}


// returns a string like (iron-gear-wheel 1, iron-plate 1)
function makeIngredientString(ingredients) {
  let ret = '(';
  for (i in ingredients) {
    if (ret != '(') {
      ret += ', ';
    }
    ret += `${i}: ${ingredients[i]}`;
  }
  return ret + ')';
}

// this adds a name property to each object in the map which is a bit ugly
function printIngredients(ingredients) {
  let arr = [];
  for (let p in ingredients) {
    ingredients[p].name = p;
    ingredients[p].times = core.calculateTimes(ingredients[p].name, ingredients[p].amount);
    if (!ingredients[p].times) {
      ingredients[p].tier += 100;
    }
    arr.push(ingredients[p]);
  }

  arr.sort(function(a, b) {
    return a.tier - b.tier;
  });

  for (let e of arr) {
    console.log(chalk.bold.underline.inverse(e.name) + ": " + round(e.amount, 2));
    if (e.ingredients) {
      console.log(chalk.bold(makeIngredientString(e.ingredients)));
    }
    if (e.times) {
      for (let t of e.times) {
        console.log(t.name + ": " + chalk.bold(round(t.time, 3)));
      }
    }
    if (e.ingredients) console.log();
  }
}

module.exports = printIngredients;
