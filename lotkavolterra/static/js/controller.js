var constants = require("./constants.js");
var model = require("./model.js");
var view = require("./view.js");


/**
 * Create luncheon from an input file.
 */
function initializeLuncheon(params) {
  // Create the luncheon object
  var luncheon = new model.Luncheon({
    name: params.data.luncheon.name,
    numTablesX: params.data.luncheon.numTablesX,
    numTablesY: params.data.luncheon.numTablesY
  });

  // Per-person primary key
  var pk = 0

  // Create the tables and add to luncheon
  var jsonTables = params.data.luncheon.tables;

  for (var i = 0; i < jsonTables.length; i++) {
    var table = new model.Table(jsonTables[i]);
    var jsonPeople = jsonTables[i].people;

    for (var j = 0; j < jsonPeople.length; j++) {
      table.insert({
        pk: pk,
        index: j,
        name: jsonPeople[j].name,
        group: jsonPeople[j].group || constants.Group.getRandom(),
        populationSize: params.populationSize
      });

      pk += 1;
    }

    luncheon.addTable(table)
  }
  return luncheon;
}


/**
 * Create single-table luncheon with seats that are assigned based on
 * rules (e.g. random, alternating, halves).
 */
function initializeTestLuncheon(params) {
  var luncheon = new model.Luncheon({
    name: params.simulation,
    numTablesX: 2,
    numTablesY: 2
  });

  var table = new model.Table({
    x: 0.5,
    y: 0.25
  });

  var group;
  for (var i = 0; i < params.numSeats; i++) {
    if (params.simulation === "alternating") {
      if (i % 2 === 0) {
        group = constants.Group.PACK;
      } else {
        group = constants.Group.HERD;
      }

    } else if (params.simulation === "halves") {
      if (i < (params.numSeats / 2)) {
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
      name: constants.PERSON_NAMES[i] || "Person" + i,
      group: group,
      populationSize: params.populationSize
    });
  }

  luncheon.addTable(table);
  return luncheon;
}


/**
 * Draw the luncheon initially
 */
function drawLuncheon(params) {
  // Draw initial state
  view.drawSeats({
    seats: params.luncheon.exportSeatStates(),
    numTablesX: params.luncheon.numTablesX,
    numTablesY: params.luncheon.numTablesY,
  });

  if (params.hasStage) {
    view.drawStage();
  }
}


/**
 * Do next generation of the simulation.
 */
function runGeneration(params) {
  if (params.luncheon.generation <= params.numGenerations) {
    params.luncheon.allSeatsInteract();
    change = params.luncheon.exportSeatSizes();
    view.updateSeatRadii(change, runGeneration, params);
  } else if (params.repeat) {
    params.luncheon.reset();
    change = params.luncheon.exportSeatSizes();
    view.updateSeatRadii(change, runGeneration, params, true);
  }
}


module.exports = {
  initializeLuncheon: initializeLuncheon,
  initializeTestLuncheon: initializeTestLuncheon,
  drawLuncheon: drawLuncheon,
  runGeneration: runGeneration
}
