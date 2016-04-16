var testSimulations


function addClass(el, className) {
	if (el.classList) {
		el.classList.add(className);
	} else {
		el.className += ' ' + className;
	}
}


function removeClass(el, className) {
	if (el.classList) {
		el.classList.remove(className);
	} else {
		el.className = el.className.replace(
				new RegExp('(^|\\b)' + className.split(' ').join('|') +
                   '(\\b|$)', 'gi'), ' ');
	}
}


function initializeForm() {
  var numSeats = document.querySelector("#num-seats");
  var select = document.querySelector("#simulation-select");

  select.addEventListener("change", function() {
    var type = this.querySelector("option:checked")
        .getAttribute("data-type");

    if (type === "input") {
     	addClass(numSeats, "hidden");
    } else {
      removeClass(numSeats, "hidden");
    }
  });
}


module.exports = {
  init: initializeForm,
}
