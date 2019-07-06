// remove replace dashes with underscore
function formatString(str) {
  return str.split('-').join('_');
}
function printGraphviz(data) {
  console.log('digraph {');
  for (let p in data) {
    for (let i in data[p].ingredients) {
      let w = data[p].ingredients[i];
      // doing weights like this doesnt seem to work for ingredients that go to many places
      console.log(`${formatString(i)} -> ${formatString(p)}[label="${w}",weight="${w}"];`);

      //console.log(`  ${formatString(i)} -> ${formatString(p)};`);
    }
  }
  console.log('}');
}

module.exports = printGraphviz;
