var utils = require("./utils.js");


module.exports = {
  // Model
  GROWTH_RATE: 0.05,
  COMPETITIVE_COIN_WEIGHT: 0.667,

  // View
  EASING_FXN: "easeOutCubic",
  TRANSITION_DURATION: 500,
  BETWEEN_TRIAL_DELAY: 2000,
  TABLE_SPACE_TO_RADIUS_FACTOR: 1/3,
  CIRCLE_RADIANS: 2 * Math.PI,

  // Both model and view
  OVERPOPULATION_FACTOR: 10,

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
