const GROWTH_RATE = 0.10;
const COMPETITIVE_COIN_WEIGHT = 0.667;

/**
Have a pack and a herd compete.

A competition involves a coin flip weighted in favor of the predator,
followed by population increase for the winner and population decline
for the loser.
*/
function compete(pack, herd) {
  f = Coin.flip(COMPETITIVE_COIN_WEIGHT);

  if (f == Coin.HEADS) {
    pack.increasePopulation(GROWTH_RATE);
    herd.decreasePopulation(GROWTH_RATE);
  } else {
    pack.decreasePopulation(GROWTH_RATE);
    herd.increasePopulation(GROWTH_RATE);
  }
}


/**
Have seat x and seat y interact.

For each colony engaged in an interaction (x, y, or both), the colony
is temporarily changed to a herd or pack, based on the outcome of a fair
coin flip.

From there, the type of interaction depends on the types of x and y
(the cases include two herds, two packs, one of each).
*/

window.interact: function(x, y) {
  // If x or y is a colony, set temporarily to a pack or herd
  xWasColony = x.changeGroupIfColony();
  yWasColony = y.changeGroupIfColony();

  // Now the interaction falls into 4 cases
  if (x.isHerd() and y.isHerd()) {
    x.increasePopulation(GROWTH_RATE);
    y.increasePopulation(GROWTH_RATE);
  } else if (x.isPack() and y.isPack()) {
    x.decreasePopulation(GROWTH_RATE);
    y.decreasePopulation(GROWTH_RATE);
  } else if (x.isPack()) {
    compete(pack=x, herd=y);
  } else {
    compete(pack=y, herd=x);
  }

  // Set the colonies back
  if (xWasColony) {
    x.setToColony();
  }

  if (yWasColony) {
    y.setToColony();
  }
}
