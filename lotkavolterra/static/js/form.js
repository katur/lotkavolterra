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


function toggleSeatInput(select, seatInput) {
  var type = select.querySelector("option:checked")
      .getAttribute("data-type");

  if (type === "test-based") {
    removeClass(seatInput, "hidden");
  } else {
    addClass(seatInput, "hidden");
  }
}


function initializeForm() {
  var seatInput = document.querySelector("#seats-input-wrapper");
  var select = document.querySelector("#simulation-select");

  toggleSeatInput(select, seatInput);

  select.addEventListener("change", function() {
    toggleSeatInput(select, seatInput);
  });
}


module.exports = {
  init: initializeForm
}
