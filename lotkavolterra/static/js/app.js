var form = require("./form.js");
var controller = require("./controller.js");


/**
 * Create and run input-based simulation.
 */
function launchSimulation(params) {
	// Make AJAX request for JSON input
	var request = new XMLHttpRequest();
	request.open("GET", params.jsonURL, true);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {  // Success
			jsonData = JSON.parse(request.responseText);

      var luncheon = controller.initializeLuncheon({
				data: jsonData
			});

      controller.drawLuncheon({
        luncheon: luncheon,
        showStage: jsonData.showStage,
        showSpecies: jsonData.showSpecies
      });

			controller.runGeneration({
				luncheon: luncheon,
				numGenerations: params.numGenerations,
        repeat: params.repeat
			});

		} else {
			// TODO: handle case of reached target server but returned an error
		}
	};

	request.onerror = function() {
		// TODO: handle case of connection error of some sort
	};

	request.send();
}


/**
 * Create and run test simulation.
 */
function launchTestSimulation(params) {
  var luncheon = controller.initializeTestLuncheon({
    simulation: params.simulation,
    numSeats: params.numSeats
  });

  controller.drawLuncheon({
    luncheon: luncheon,
    showStage: false,
    showSpecies: true
  });

  controller.runGeneration({
    luncheon: luncheon,
    numGenerations: params.numGenerations,
    repeat: params.repeat
  });
}


window.lotkavolterra = {
  launchSimulation: launchSimulation,
  launchTestSimulation: launchTestSimulation,
  formInit: form.init
}
