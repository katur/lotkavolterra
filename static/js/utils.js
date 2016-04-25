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
  },

  /**
   * Add a class to an HTML element.
   */
  addClass: function(el, className) {
    if (el.classList) {
      el.classList.add(className);
    } else {
      el.className += ' ' + className;
    }
  },

  /**
   * Remove a class from an HTML element.
   */
  removeClass: function(el, className) {
    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(
          new RegExp('(^|\\b)' + className.split(' ').join('|') +
                     '(\\b|$)', 'gi'), ' ');
    }
  }

};
