const recipes = require('./recipe.json');
const assemblers = require('./assembling-machine.json');

/* calculate time taken for possible machines making this recipe
 * recipe is a string with the name of a product
 * returns an array of objects with machine name and time */
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

/* Get ingredients with proper amounts for the recipe */
function getIngredients(recipe, amount) {
  if (!(recipe in recipes)) return false;

  let ret = {};
  let rec = recipes[recipe];
  let amountPer = 1;
  let prods = rec.products;
  for (let j = 0; j < prods.length; j++) {
    if (prods[j].name == recipe) {
      amountPer = prods[j].amount;
    }
  }
  for (let ing of rec.ingredients) {
    ret[ing.name] = ing.amount * amount / amountPer;
  }
  return ret;
}

/* recursively sums up ingredients, storing them in the dictionary called acc
 * ing is an object like { name: 'thename', amount: 1 }
 * amounMultiplier is an optional additional multiplier that applies to the amount */
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
  for (k in acc) {
    if (acc[k].ingredients) continue;
    const i = getIngredients(k, acc[k].amount);
    if (i) {
      acc[k].ingredients = i;
    }
  }
  return acc;
}

module.exports = {
  processIngredient,
  calculateTimes,
  getIngredients
};
