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
function makeIngredientString(recipe, amount) {
  if (!(recipe in recipes)) return false;
  let rec = recipes[recipe];
  let ret = '(';
  for (let ing of rec.ingredients) {
    if (ret != '(') ret += ', ';
    let amountPer = 1;
    let prods = rec.products;
    for (let j = 0; j < prods.length; j++) {
      if (prods[j].name == recipe) {
        amountPer = prods[j].amount;
      }
    }
    ret += ing.name + ' ' + round(ing.amount * amount / amountPer, 2);
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
    let ingStr = makeIngredientString(e.name, e.amount);
    if (ingStr) console.log(chalk.bold(ingStr));
    if (e.times) {
      for (let t of e.times) {
        console.log(t.name + ": " + chalk.bold(round(t.time, 3)));
      }
    }
    if (ingStr) console.log();
  }
}

module.exports = printIngredients;
