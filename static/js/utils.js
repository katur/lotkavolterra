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
  },

  /**
   * Get GET parameters as a dictionary.
   */
  getSearchParams: function() {
    var paramString = window.location.search.substr(1);
    if (paramString != null && paramString != "") {
      return transformToDictionary(paramString);
    } else {
      return {};
    }
  }
};


/***********
 * Helpers *
 ***********/

function transformToDictionary(paramString) {
  var paramArray = paramString.split("&");
  var params = {};
  for (var i = 0; i < paramArray.length; i++) {
    var tuple = paramArray[i].split("=");
    params[tuple[0]] = tuple[1];
  }
  return params;
}
