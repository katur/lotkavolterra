var constants = require("./constants.js");
var model = require("./model.js");
var view = require("./view.js");


module.exports = {
  /**
   * Create luncheon from an input file.
   */
  initializeInputLuncheon: function(params) {
    // Create empty Luncheon object
    var luncheon = new model.Luncheon({
      name: params.data.name,
      numTablesX: params.data.numTablesX,
      numTablesY: params.data.numTablesY
    });

    populateInputLuncheon(luncheon, params.data.tables);
    return luncheon;
  },


  /**
   * Create single-table luncheon with seats that are assigned based on
   * rules (e.g. random, alternating, halves).
   */
  initializeTestLuncheon: function(params) {
    var luncheon = new model.Luncheon({
      name: params.simulation,
      numTablesX: 2.2,
      numTablesY: 1.4
    });

    var table = createTestTable(params.simulation, params.numSeats);
    luncheon.addTable(table);
    return luncheon;
  },


  /**
   * Draw the luncheon initially
   */
  drawLuncheon: function(params) {
    // Draw initial state
    var circles = view.drawSeats({
      seats: params.luncheon.getAllSeats(),
      numTablesX: params.luncheon.numTablesX,
      numTablesY: params.luncheon.numTablesY,
      showSpecies: params.showSpecies,
      noText: params.noText
    });

    if (params.showStage) {
      view.drawStage({
        stageWidth: params.stageWidth,
        stageHeight: params.stageHeight,
        stageY: params.stageY
      });
    }

    if (params.showStats) {
      view.displayStats();
    }

    return circles;
  },


  runGeneration: runGeneration
};


/***********
 * Helpers *
 ***********/

/**
 * Do a generation of the simulation.
 */
function runGeneration(params) {
  var reset;

  if (params.luncheon.generation < params.numGenerations) {
    params.luncheon.allSeatsInteract();
    reset = false;

  } else if (params.repeat) {
    params.luncheon.reset();
    reset = true;

  } else {
    return;
  }

  view.updateSeatRadii({
    showStats: params.showStats,
    trial: params.luncheon.trial,
    generation: params.luncheon.generation,
    callback: runGeneration,
    callbackParams: params,
    reset: reset,
    circles: params.circles
  });
}


/**
 * Populate luncheon from JSON-format table information.
 */
function populateInputLuncheon(luncheon, jsonTables) {
  // Per-person primary key
  var pk = 0;

  for (var i = 0; i < jsonTables.length; i++) {
    var table = new model.Table(jsonTables[i]);
    var jsonPeople = jsonTables[i].people;

    for (var j = 0; j < jsonPeople.length; j++) {
      table.insert({
        pk: pk,
        index: j,
        name: jsonPeople[j].name,
        group: jsonPeople[j].group || constants.Group.getRandom()
      });

      pk += 1;
    }

    luncheon.addTable(table);
  }
}


/**
 * Create table for test simulation.
 */
function createTestTable(simulation, numSeats) {
  var table = new model.Table({
    x: 0.5,
    y: 0.5
  });

  var group;
  for (var i = 0; i < numSeats; i++) {
    if (simulation === "alternating2") {
      group = [constants.Group.PACK, constants.Group.HERD][i % 2];

    } else if (simulation === "alternating3") {
      group = [constants.Group.PACK, constants.Group.HERD,
               constants.Group.COLONY][i % 3];

    } else if (simulation === "halves") {
      if (i < (numSeats / 2)) {
        group = constants.Group.PACK;
      } else {
        group = constants.Group.HERD;
      }

    } else {
      group = constants.Group.getRandom();
    }

    table.insert({
      pk: i,
      index: i,
      group: group,
      name: constants.TEST_PERSON_NAMES[i] || "Person" + i
    });
  }

  return table;
}
