var $ = require("jquery");
var fabric = require("fabric");
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

        var canvas = controller.drawLuncheon({
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
          canvas: canvas,
          showStats: params.showStats,
          numGenerations: params.generations,
          repeat: params.repeat
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

    var canvas = controller.drawLuncheon({
      luncheon: luncheon,
      showStats: params.showStats,
      repeat: params.repeat,
      noText: params.noText,
      showSpecies: true
    });

    controller.runGeneration({
      luncheon: luncheon,
      canvas: canvas,
      showStats: params.showStats,
      numGenerations: params.generations,
      repeat: params.repeat
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

  launchCanvasTest: function() {
    $(document).ready(function() {
      var canvas = new fabric.fabric.Canvas('canvas');
      var rect = new fabric.fabric.Rect({
        top: 100,
        left: 100,
        width: 100,
        height: 100,
        fill: 'green'
      });
      canvas.add(rect);
    });
  },

  /**
   * Draw a large version of the logo for this project.
   */
  drawLogo: function(params) {
    controller.drawLogo();
  }
};
