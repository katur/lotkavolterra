var utils = require("./utils.js");


module.exports = {
  /**
   * Initialize the simulation form.
   */
  init: function() {
    var select = document.querySelector("#simulation-select");
    var simulationType = document.querySelector("#simulation-type");
    var seatInput = document.querySelector("#seats-input-wrapper");

    toggleFormType(select, simulationType, seatInput);

    select.addEventListener("change", function() {
      toggleFormType(select, simulationType, seatInput);
    });
  }
};


/***********
 * Helpers *
 ***********/

/**
 * Toggle the value of simulationType and the visibility of seatInput.
 */
function toggleFormType(select, simulationType, seatInput) {
  var type = select.querySelector("option:checked")
      .getAttribute("data-type");

  if (type === "input") {
    utils.addClass(seatInput, "hidden");
    simulationType.setAttribute("value", "input");
  } else {
    utils.removeClass(seatInput, "hidden");
    simulationType.setAttribute("value", "test");
  }
}
