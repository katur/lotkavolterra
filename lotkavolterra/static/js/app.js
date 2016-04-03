const PERSON_NAMES = [
  'Alice', 'Bob', 'Carol', 'Django', 'Erlich', 'Freddy',
  'Georgia', 'Heidi', 'Indigo', 'Jack'
]


/**
 * Run the simulation from an input file.
 */
function runSimulation(params) {
  // Create the luncheon object
  var luncheon = new Luncheon({
    name: params.data.luncheon.name,
    numTablesX: params.data.luncheon.numTablesX,
    numTablesY: params.data.luncheon.numTablesY
  });

  // Per-person primary key
  var pk = 0

  // Create the tables and add to luncheon
  var jsonTables = params.data.luncheon.tables;

  for (var i = 0; i < jsonTables.length; i++) {
    var table = new Table(jsonTables[i]);
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

  var initialState = luncheon.exportSeatStates();

  drawSeats(initialState, luncheon.numTablesX, luncheon.numTablesY,
            params.hasStage);
  var changes = [];
  for (var i = 0; i < params.numGenerations; i++) {
    luncheon.allSeatsInteract();
    changes.push(luncheon.exportSeatSizes());
  }

  for (var i = 0; i < changes.length; i++) {
    updateSeatRadii(changes[i], i);
  }
}


/**
 * Run a test simulation.
 *
 * This is very similar to run_simulation, but instead of parsing
 * a json file it creates a test table based on rules.
 */
function runTestSimulation(params) {
  var luncheon = new Luncheon({
    name: params.simulation,
    numTablesX: 2,
    numTablesY: 2
  });

  var table = new Table({
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
      name: PERSON_NAMES[i] || "Person " + i,
      group: group,
      populationSize: params.populationSize
    });
  }

  luncheon.addTable(table);

  var numTablesX = luncheon.numTablesX;
  var numTablesY = luncheon.numTablesY;
  var initialState = luncheon.exportSeatStates();
  drawSeats(initialState, numTablesX, numTablesY, true);

  var changes = []
  for (var i = 0; i < params.numGenerations; i++) {
    luncheon.allSeatsInteract();
    changes.push(luncheon.exportSeatSizes());
  }

  for (var i = 0; i < changes.length; i++) {
    updateSeatRadii(changes[i], i);
  }
}
