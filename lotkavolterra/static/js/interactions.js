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
  x_was_colony = x.change_group_if_colony();
  y_was_colony = y.change_group_if_colony();

  if x_was_colony:
      logging.debug('\tColony {} acting as {}'.format(x, x.group.name))
  if y_was_colony:
      logging.debug('\tColony {} acting as {}'.format(y, y.group.name))

  # Now the interaction falls into 4 cases
  if x.is_herd() and y.is_herd():
      logging.debug('\t{} and {} both herds, so grow'.format(x, y))
      x.increase_population(GROWTH_RATE)
      y.increase_population(GROWTH_RATE)

  elif x.is_pack() and y.is_pack():
      logging.debug('\t{} and {} both packs, so decline'.format(x, y))
      x.decrease_population(GROWTH_RATE)
      y.decrease_population(GROWTH_RATE)

  elif x.is_pack():
      compete(pack=x, herd=y)

  else:
      compete(pack=y, herd=x)

  logging.debug('\tx size now {}, y size now {}'
                .format(x.population_size, y.population_size))

  # Set the colonies back
  if x_was_colony:
      x.set_to_colony()

  if y_was_colony:
      y.set_to_colony()
}
