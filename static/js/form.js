var utils = require("./utils.js");


function initializeForm() {
  var seatInput = document.querySelector("#seats-input-wrapper");
  var select = document.querySelector("#simulation-select");
  var simulationType = document.querySelector("#simulation-type");

  toggleSeatInput(select, seatInput, simulationType);

  select.addEventListener("change", function() {
    toggleSeatInput(select, seatInput, simulationType);
  });
}


function transformToAssocArray(paramString) {
  var paramArray = paramString.split("&");
  var params = {};
  for (var i = 0; i < paramArray.length; i++) {
    var tuple = paramArray[i].split("=");
    params[tuple[0]] = tuple[1];
  }
  return params;
}


function getSearchParams() {
  var paramString = window.location.search.substr(1);
  if (paramString != null && paramString != "") {
    return transformToAssocArray(paramString);
  } else {
    return {};
  }
}


// Helpers

function toggleSeatInput(select, seatInput, simulationType) {
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


module.exports = {
  init: initializeForm,
  getSearchParams: getSearchParams
}
