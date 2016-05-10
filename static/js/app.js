var $ = require("jquery");
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
    var jsonURL = "/static/json/".concat(params.simulation);
    $.ajax(jsonURL, {
      type: "GET",
      success: function(data) {
        var luncheon = controller.initializeInputLuncheon({
          data: data
        });

        var circles = controller.drawLuncheon({
          luncheon: luncheon,
          showStats: params.showStats,
          repeat: params.repeat,
          noText: params.noText,
          showSpecies: data.showSpecies,
          showStage: data.showStage,
          stageWidth: data.stageWidth,
          stageHeight: data.stageHeight,
          stageY: data.stageY
        });

        controller.runGeneration({
          luncheon: luncheon,
          showStats: params.showStats,
          numGenerations: params.generations,
          repeat: params.repeat,
          circles: circles
        });
      }
    });
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
      repeat: params.repeat,
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


  formInit: form.init,

  getSearchParams: utils.getSearchParams,


  /**
   * Create and run D3 animation for debugging.
   */
  launchDebuggingAnimation: function(params) {
    debugging.drawRandomCircles(params);
    debugging.updateRadiiRandomly();
  },

  /**
   * Draw a large version of the favicon for this project.
   */
  drawFavicon: function(params) {
    controller.drawFavicon();
  }
};
