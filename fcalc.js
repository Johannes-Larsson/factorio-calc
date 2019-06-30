#!/usr/bin/node
const chalk = require('chalk');
const recipes = require('./recipe.json');
const assemblers = require('./assembling-machine.json');
const interval = require('./interval.js').intp;

// round num to p places
function round(num, p) {
  let m = Math.pow(10, p);
  return Math.round(num * m) / m;
}

/*
 * recursively sums up ingredients, storing them in the dictionary called acc
 * ing is an object like { name: 'thename', amount: 1 }
 * amounMultiplier is an optional additional multiplier that applies to the amount
 */
function processIngredient(ing, accumulator, amountMultiplier, tier) {
  // ing.amount * amountMultiplier is amount of this we need
  let acc;
  if (!accumulator) {
    acc = {};
  } else {
    acc = accumulator;
  }

  if (!tier) {
    tier = 0;
  }

  if (!amountMultiplier) amountMultiplier = 1;

  if (acc[ing.name]) {
    acc[ing.name].amount += ing.amount * amountMultiplier;
    if (acc[ing.name].tier < tier) acc[ing.name].tier = tier;
  } else {
    acc[ing.name] = {
      "amount": ing.amount * amountMultiplier,
      "tier": tier
    };
  }
  if (recipes[ing.name]) {

    if (recipes[ing.name].category == "smelting") return acc;

    for (let i of recipes[ing.name].ingredients) {
      // need to adjust the amountMultiplier for the amount of products produced here
      let localMult;
      let prods = recipes[ing.name].products;
      for (let j = 0; j < prods.length; j++) {
        if (prods[j].name == ing.name) {
          localMult = 1 / prods[j].amount;
        }
      }
      acc = processIngredient(i, acc, localMult * amountMultiplier * ing.amount, tier + 1)
    }
  }
  return acc;
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
    ingredients[p].times = calculateTimes(ingredients[p].name, ingredients[p].amount);
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

/*
 * calculate time taken for possible machines making this recipe
 * recipe is a string with the name of a product
 * returns an array of objects with machine name and time
 */
function calculateTimes(recipe, amount) {
  // for each assembly mahcine
  // check if can make
  // if so calculate the time
  // return array of names and times
  let ret = [];
  let rec = recipes[recipe];
  if (!rec) {
    return false;
  }
  //console.log(rec);

  for (let m in assemblers) {
    if (rec.category in assemblers[m].crafting_categories) {
      let time = 0;
      let prods = rec.products;
      for (let j = 0; j < prods.length; j++) {
        if (prods[j].name == recipe) {
          time = amount * rec.energy / (assemblers[m].crafting_speed * prods[j].amount);
        }
      }
      ret.push({
        "name": m,
        "time": time
      });
    }
  }
  if (ret.length == 0) return false;
  else return ret;
}


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
  ingredients = processIngredient(rec, ingredients);
}

printIngredients(ingredients);
