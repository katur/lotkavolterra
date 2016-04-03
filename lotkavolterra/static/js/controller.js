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
 * Run generations of the simulation.
 */
function runGenerations(params) {
  // Draw initial state
  view.drawSeats({
    seats: params.luncheon.exportSeatStates(),
    numTablesX: params.luncheon.numTablesX,
    numTablesY: params.luncheon.numTablesY,
    hasStage: params.hasStage
  });

  // Draw generations of the simulation
  var changes = [];
  for (var i = 0; i < params.numGenerations; i++) {
    params.luncheon.allSeatsInteract();
    changes.push(params.luncheon.exportSeatSizes());
  }

  for (var i = 0; i < changes.length; i++) {
    view.updateSeatRadii(changes[i], i);
  }
}


module.exports = {
  initializeLuncheon: initializeLuncheon,
  initializeTestLuncheon: initializeTestLuncheon,
  runGenerations: runGenerations
}
