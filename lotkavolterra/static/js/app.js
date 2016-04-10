var controller = require("./controller.js");


/**
 * Create and run input-based simulation.
 */
function runSimulation(params) {
	// Make AJAX request for JSON input
	var request = new XMLHttpRequest();
	request.open("GET", params.jsonURL, true);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {  // Success
			var luncheon = controller.initializeLuncheon({
				data: JSON.parse(request.responseText),
				populationSize: params.populationSize
			});

      controller.drawLuncheon({
        luncheon: luncheon,
        hasStage: params.hasStage
      });

			controller.runGeneration({
				luncheon: luncheon,
				numGenerations: params.numGenerations
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
function runTestSimulation(params) {
  var luncheon = controller.initializeTestLuncheon({
    simulation: params.simulation,
    numSeats: params.numSeats,
    populationSize: params.populationSize
  });

  controller.drawLuncheon({
    luncheon: luncheon,
    hasStage: false
  });

  controller.runGeneration({
    luncheon: luncheon,
    numGenerations: params.numGenerations
  });
}


window.lotkavolterra = {
  runSimulation: runSimulation,
  runTestSimulation: runTestSimulation
}
