window.Coin = {
  HEADS: 0,
  TAILS: 1,

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
