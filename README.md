## Installation
The program reads data from two json-files called assembling-machine.json and recipe.json.
To obtain these, you need to install [this mod](https://mods.factorio.com/mod/recipelister) for factorio, which will export these files for you.
(I wont distribute them because I'm not sure it would be legal.)
Follow the instructions on that page and copy them into this directory.

You also need to install node.js to run this.

## Usage
    ./fcalc.js recipe [amount]

Where recipe is the name of a thing you want to make, for example electronic-circuit for 
regular green circuits.

By default it calculates the resources and time to make one. 
You can change this by specifying an amount.

The program sums up every ingredient used in the recipe, down to the raw resources.
It then displays, for each one where applicable, options of assembling machines and how long they take, i.e.
how many you need to make [amount] every second.
