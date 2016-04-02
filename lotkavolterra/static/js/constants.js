window.constants = {
  // Model
  GROWTH_RATE: 0.10,
  COMPETITIVE_COIN_WEIGHT: 0.667,

  // View
  OPACITY: 0.5,
  TEXT_SIZE: 10,
  EASING_FXN: "easeOutCubic",
  TRANSITION_DURATION: 500,
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
      return getRandomChoice([this.PACK, this.HERD, this.COLONY]);
    },

    getRandomPackOrHerd: function() {
      return getRandomChoice([this.PACK, this.HERD]);
    }
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
  }
};
