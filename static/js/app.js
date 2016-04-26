var utils = require("./utils.js");
var form = require("./form.js");
var controller = require("./controller.js");
var debugging = require("./debugging.js");


window.lotkavolterra = {
  /**
   * Create and run input-based simulation.
   */
  launchSimulation: function(params) {
    // Make AJAX request for JSON input
    var request = new XMLHttpRequest();
    var jsonURL = "/static/json/".concat(params.simulation);
    request.open("GET", jsonURL, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {  // Success
        jsonData = JSON.parse(request.responseText);

        var luncheon = controller.initializeLuncheon({
          data: jsonData
        });

        var circles = controller.drawLuncheon({
          luncheon: luncheon,
          showStats: params.showStats,
          noText: params.noText,
          showSpecies: jsonData.showSpecies,
          showStage: jsonData.showStage,
          stageWidth: jsonData.stageWidth,
          stageHeight: jsonData.stageHeight,
          stageY: jsonData.stageY
        });

        controller.runGeneration({
          luncheon: luncheon,
          showStats: params.showStats,
          numGenerations: params.generations,
          repeat: params.repeat,
          circles: circles
        });

      } else {
        // TODO: handle case of reached target server but returned an error
      }
    };

    request.onerror = function() {
      // TODO: handle case of connection error of some sort
    };

    request.send();
  },

  /**
   * Create and run test simulation.
   */
  launchTestSimulation: function(params) {
    var luncheon = controller.initializeTestLuncheon({
      simulation: params.simulation,
      numSeats: params.seats
    });

    var circles = controller.drawLuncheon({
      luncheon: luncheon,
      showStats: params.showStats,
      noText: params.noText,
      showSpecies: true
    });

    controller.runGeneration({
      luncheon: luncheon,
      showStats: params.showStats,
      numGenerations: params.generations,
      repeat: params.repeat,
      circles: circles
    });
  },

  /**
   * Create and run D3 animation for debugging.
   */
  launchDebuggingAnimation: function(params) {
    debugging.drawRandomCircles(params);
    debugging.updateRandomCircles();
  },

  formInit: form.init,
  getSearchParams: utils.getSearchParams
};
