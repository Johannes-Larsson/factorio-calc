## Installation
#### Prerequisites
Nodejs and npm.

#### Data
The program reads data from two json files called assembling-machine.json and recipe.json.
To obtain these, you need to install [this mod](https://mods.factorio.com/mod/recipelister) 
for factorio, which will export these files for you.
(I won't distribute them because I'm not sure it would be legal.)
Follow the instructions on that page and copy them into this directory.

Finally, run
`npm install`
and you're good to go!


## Usage
`./fcalc.js [-f|--format format] recipe [amount] [another-recipe [amount] ..]`

Where recipe is the name of a thing you want to make, for example electronic-circuit for
regular green circuits.

The amount can be specified as a number by itself, for example 3 meaning three per second. 
It can also be a fraction with or without unit, for example `2/3` is two every three senconds or `1/h` is one per hour, and so on.
If no amount is specified, the default is one per second.

Format can be 
- `human` (default) - for human readable output, which includes info about assembling machines
- `json` - a json object containing essentially the same info as above, minus assembling machine stuff
- `graphviz`  ouputs a digraph you can pipe into graphviz, for example `./fcalc.js -f graphviz electronic-circuit | dot -T png -o tmp.png && feh tmp.png` to create and show tmp.png showing a graph representing the recipe for electronic circuit.

The program sums up every ingredient used in the recipe, down to the raw resources.
It then displays, for each one where applicable, options of assembling machines and how long they take, i.e.
how many you need to make *amount* every second.

## Demo
![Demo](https://raw.githubusercontent.com/Johannes-Larsson/factorio-calc/master/demo.gif)
