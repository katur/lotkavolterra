var $ = require("jquery");


module.exports = {
  /**
   * Initialize the simulation form.
   */
  init: function() {
    var select = $("#simulation-select");
    var simulationType = $("#simulation-type");
    var seatInput = $("#seats-input-wrapper");

    toggleFormType(select, simulationType, seatInput);

    select.on("change", function() {
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
  var type = select.find("option:checked").attr("data-type");

  if (type === "input") {
    seatInput.addClass("hidden");
    simulationType.attr("value", "input");
  } else {
    seatInput.removeClass("hidden");
    simulationType.attr("value", "test");
  }
}
