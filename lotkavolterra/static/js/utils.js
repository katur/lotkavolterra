module.exports = {
  /**
   * Return a random element from an array of choices.
   */
  getRandomChoice: function(choices) {
    return choices[Math.floor(Math.random() * choices.length)];
  },

  /**
   * Get a circle's radius from its area.
   */
  getRadiusFromArea: function(area) {
    return Math.sqrt(area / Math.PI);
  }
};
