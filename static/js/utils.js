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
