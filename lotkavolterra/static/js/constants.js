var utils = require("./utils.js");

const INITIAL_POPULATION_SIZE = 1000;
const OVERPOPULATION_FACTOR = 10;

module.exports = {
  // Model
  GROWTH_RATE: 0.05,
  COMPETITIVE_COIN_WEIGHT: 0.667,
  INITIAL_POPULATION_SIZE: INITIAL_POPULATION_SIZE,

  // Both model and view
  OVERPOPULATION_SIZE: INITIAL_POPULATION_SIZE * OVERPOPULATION_FACTOR,

  // View
  EASING_FXN: "easeOutCubic",
  TRANSITION_DURATION: 500,
  BETWEEN_TRIAL_DELAY: 3000,
  TABLE_SPACE_TO_RADIUS_FACTOR: 1/3,
  CIRCLE_RADIANS: 2 * Math.PI,

  // Enums
  Group: {
    HERD: "HERD",
    PACK: "PACK",
    COLONY: "COLONY",

    getRandom: function() {
      return utils.getRandomChoice([this.PACK, this.HERD, this.COLONY]);
    },

    getRandomPackOrHerd: function() {
      return utils.getRandomChoice([this.PACK, this.HERD]);
    }
  },

  Species: {
    HERD: "Wild Turkey",
    PACK: "Eastern Coyote",
    COLONY: "Eurasian Boar"
  },

  Coin: {
    HEADS: "HEADS",
    TAILS: "TAILS",

    /**
    Flip a coin.

    Optionally pass in weight, where weight is the probability of flipping
    Heads. Defaults to a fair coin.
    */
    flip: function(weight) {
      if (weight === undefined) {
        weight = 0.5;
      }

      var r = Math.random();
      if (r < weight) {
        return this.HEADS;
      } else {
        return this.TAILS;
      }
    }
  },

  PERSON_NAMES: [
    'Alice', 'Bob', 'Carol', 'Django', 'Erlich', 'Freddy',
    'Georgia', 'Heidi', 'Indigo', 'Jack'
  ]
};
