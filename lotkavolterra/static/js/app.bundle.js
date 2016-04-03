/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var controller = __webpack_require__(1);


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

				controller.runGenerations({
					luncheon: luncheon,
					numGenerations: params.numGenerations,
	        hasStage: params.hasStage
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

	  controller.runGenerations({
	    luncheon: luncheon,
	    numGenerations: params.numGenerations,
	    hasStage: false
	  });
	}


	window.lotkavolterra = {
	  runSimulation: runSimulation,
	  runTestSimulation: runTestSimulation
	}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var constants = __webpack_require__(2);
	var model = __webpack_require__(4);
	var view = __webpack_require__(6);


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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(3);


	module.exports = {
	  // Model
	  GROWTH_RATE: 0.10,
	  COMPETITIVE_COIN_WEIGHT: 0.667,

	  // View
	  OPACITY: 0.5,
	  TEXT_SIZE: 10,
	  EASING_FXN: "easeOutCubic",
	  TRANSITION_DURATION: 500,
	  TABLE_SPACE_TO_RADIUS_FACTOR: 1/3,
	  CIRCLE_RADIANS: 2 * Math.PI,

	  // Both model and view
	  OVERPOPULATION_FACTOR: 10,

	  // Enums
	  Group: {
	    HERD: "HERD",
	    PACK: "PACK",
	    COLONY: "COLONY",

	    getRandom: function() {
	      return utils.getRandomChoice([this.PACK, this.HERD, this.COLONY]);
	    },

	    getRandomPackOrHerd: function() {
	      return utils.getRandomChoice([this.PACK, this.HERD]);
	    }
	  },

	  Coin: {
	    HEADS: "HEADS",
	    TAILS: "TAILS",

	    /**
	    Flip a coin.

	    Optionally pass in weight, where weight is the probability of flipping
	    Heads. Defaults to a fair coin.
	    */
	    flip: function(weight) {
	      if (weight === undefined) {
	        weight = 0.5;
	      }

	      var r = Math.random();
	      if (r < weight) {
	        return this.HEADS;
	      } else {
	        return this.TAILS;
	      }
	    }
	  },

	  PERSON_NAMES: [
	    'Alice', 'Bob', 'Carol', 'Django', 'Erlich', 'Freddy',
	    'Georgia', 'Heidi', 'Indigo', 'Jack'
	  ]
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = {
	  /**
	   * Return a random element from an array of choices.
	   */
	  getRandomChoice: function(choices) {
	    return choices[Math.floor(Math.random() * choices.length)];
	  },

	  /**
	   * Get a circle's radius from its area.
	   */
	  getRadiusFromArea: function(area) {
	    return Math.sqrt(area / Math.PI);
	  }
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(3);
	var constants = __webpack_require__(2);
	var interactions = __webpack_require__(5);


	/**
	 * A luncheon, made up of Tables, to take part in the simulation.
	 */
	function Luncheon(params) {
	  this.name = params.name;
	  this.numTablesX = params.numTablesX;
	  this.numTablesY = params.numTablesY;
	  this.tables = [];

	  this.toString = function() {
	    return "Luncheon " + this.name;
	  };

	  /**
	   * Add a table to this luncheon.
	   */
	  this.addTable = function(table) {
	    this.tables.push(table);
	  };

	  /**
	   * Run a generation of the simulation.
	   *
	   * Optionally pass in the number of generations that it should run;
	   * defaults to 1.
	   */
	  this.allSeatsInteract = function(numGenerations) {
	    if (numGenerations === undefined) {
	      numGenerations = 1;
	    }

	    var i, j;
	    for (i = 0; i < numGenerations; i++) {
	      for (j = 0; j < this.tables.length; j++) {
	        this.tables[j].allSeatsInteract();
	      }
	    }
	  };

	  /**
	   * Export the current state of all seats at the luncheon.
	   */
	  this.exportSeatStates = function() {
	    var seatStates = [];

	    var i, table;
	    for (i = 0; i < this.tables.length; i++) {
	      table = this.tables[i];
	      seatStates = seatStates.concat(table.exportSeatStates());
	    }

	    return seatStates;
	  };

	  /**
	   * Export a mapping from pk to size for all seats at the luncheon.
	   */
	  this.exportSeatSizes = function() {
	    // Create a true prototype-less dictionary
	    seatSizes = Object.create(null);

	    var i, tableSeatSizes;
	    for (i = 0; i < this.tables.length; i++) {
	      tableSeatSizes = this.tables[i].exportSeatSizes();

	      for (var key in tableSeatSizes) {
	        seatSizes[key] = tableSeatSizes[key];
	      }
	    }

	    return seatSizes;
	  };
	}


	/**
	 * A table to take part in the simulation.
	 *
	 * A table is a circlular doubly linked list of Seats.
	 */
	function Table(params) {
	  this.number = params.number || 0;
	  this.name = params.name || "Test";

	  // Relative position in space
	  this.x = params.x;
	  this.y = params.y;

	  if (this.x === undefined) {
	    this.x = 0.5;
	  }

	  if (this.y === undefined) {
	    this.y = 0.5;
	  }

	  // Table is initially empty
	  this.head = null;
	  this.seatCount = 0;

	  this.toString = function() {
	    return "Table " + this.number + ": " + this.name;
	  };

	  /**
	   * Insert a new seat at the head of this table.
	   */
	  this.insert = function(params) {
	    params.table = this;
	    newSeat = new Seat(params);

	    if (!this.head) {
	      newSeat.setNext(newSeat);
	      newSeat.setPrevious(newSeat);
	    } else {
	      // Create new pointers
	      newSeat.setPrevious(this.head);
	      newSeat.setNext(this.head.getNext());

	      // Update old pointers
	      newSeat.getNext().setPrevious(newSeat);
	      newSeat.getPrevious().setNext(newSeat);
	    }

	    this.head = newSeat;
	    this.seatCount += 1;
	  };

	  /**
	   * Get all seats at this table.
	   */
	  this.getAllSeats = function() {
	    var seats = [];

	    if (!this.head) {
	      return seats;
	    }

	    seats.push(this.head);

	    var current = this.head.getNext()
	    while (current != this.head) {
	      seats.push(current);
	      current = current.getNext();
	    }

	    return seats;
	  };

	  // TODO: consider having the three functions below not call getAllSeats()

	  /**
	   * Have all seats at this table interact for numGenerations.
	   */
	  this.allSeatsInteract = function(numGenerations) {
	    if (numGenerations === undefined) {
	      numGenerations = 1;
	    }

	    var seats = this.getAllSeats();

	    var i, j;
	    for (i = 0; i < numGenerations; i++) {
	      for (j = 0; j < seats.length; j++) {
	        seats[j].interactWithNextInteractor();
	      }
	    }
	  };

	  /**
	   * Export the current state of all seats at this table.
	   */
	  this.exportSeatStates = function() {
	    var seats = this.getAllSeats();
	    var states = [];

	    for (var i = 0; i < seats.length; i++) {
	      states.push(seats[i].exportState());
	    }

	    return states;
	  };

	  /**
	   * Export a mapping from seat.pk to seat.populationSize for all seats
	   * at this table.
	   */
	  this.exportSeatSizes = function() {
	    var seats = this.getAllSeats();
	    var sizes = {};

	    var i, seat;
	    for (i = 0; i < seats.length; i++) {
	      seat = seats[i];
	      sizes[seat.pk] = seat.populationSize;
	    }

	    return sizes;
	  };
	}


	/**
	 * A Seat at a Table.
	 *
	 * Each seat can be assigned a group (Pack, Herd, Colony) and a
	 * population size.
	 *
	 * A seat is connected to both adjacent seats, in circular doubly-linked
	 * list fashion.
	 */
	function Seat(params) {
	  this.pk = params.pk;  // Unique identifier across tables
	  this.index = params.index;  // Position within the table
	  this.name = params.name;
	  this.group = params.group;
	  this.populationSize = params.populationSize;
	  this.initialPopulationSize = params.populationSize;
	  this.table = params.table;
	  this.nextSeat = params.nextSeat;
	  this.previousSeat = params.previousSeat;

	  this.toString = function() {
	    return this.group + " " + this.name;
	  };

	  this.formatName = function() {
	    return this.getFirstName();
	  };

	  this.getFirstName = function() {
	    return this.name.split(/\s+/)[0];
	  };

	  /**
	   * Export the current state this seat.
	   *
	   * Includes all information necessary to pass the seat to the front
	   * end, such that the frontn end can render it, including its position.
	   */
	  this.exportState = function() {
	    // Create a true prototype-less dictionary
	    state = Object.create(null);
	    state.pk = this.pk;
	    state.index = this.index;
	    state.name = this.formatName();
	    state.group = this.group;
	    state.populationSize = this.populationSize;
	    state.initialPopulationSize = this.initialPopulationSize;
	    state.tableX = this.table.x;
	    state.tableY = this.table.y;
	    state.tableSeatCount = this.table.seatCount;
	    return state;
	  };

	  /** Get the next adjacent seat. */
	  this.getNext = function() {
	    return this.nextSeat;
	  };

	  /** Get the previous adjacent seat. */
	  this.getPrevious = function() {
	    return this.previousSeat;
	  };

	  /** Set the next adjacent seat. */
	  this.setNext = function(other) {
	    this.nextSeat = other;
	  };

	  /** Set the previous adjacent seat. */
	  this.setPrevious = function(other) {
	    this.previousSeat = other;
	  };

	  /** Determine if this seat is a herd. */
	  this.isHerd = function() {
	    return this.group === constants.Group.HERD;
	  };

	  /** Determine if this seat is a pack. */
	  this.isPack = function() {
	    return this.group === constants.Group.PACK;
	  };

	  /** Determine if this seat is a colony. */
	  this.isColony = function() {
	    return this.group === constants.Group.COLONY;
	  };

	  /**
	   * If this seat is a colony, change it randomly to a pack or herd.
	   *
	   * Returns true if this seat was initially a colony (now changed to
	   * pack or herd).
	   *
	   * Returns false if this seat was not initally a colony (unchanged).
	   */
	  this.changeGroupIfColony = function() {
	    if (!this.isColony()) {
	      return false;
	    }

	    this.group = utils.getRandomChoice([
	      constants.Group.PACK,
	      constants.Group.HERD
	    ]);

	    return true;
	  };

	  /**
	   * Set this seat's group to colony.
	   *
	   * Use this to restore a seat after calling changeGroupIfColony().
	   */
	  this.setToColony = function() {
	    this.group = constants.Group.COLONY;
	  };

	  /** Increase this seat's population size by growthRate. */
	  this.increasePopulation = function(growthRate) {
	    change = Math.round(this.populationSize * growthRate);
	    this.populationSize += change;

	    // Extinction from overpopulation
	    if (this.populationSize >=
	        (constants.OVERPOPULATION_FACTOR * this.initialPopulationSize)) {
	      this.populationSize = 0;
	    }
	  };

	  /** Decrease this seat's population size by growthRate. */
	  this.decreasePopulation = function(growthRate) {
	    change = Math.round(this.populationSize * growthRate);
	    this.populationSize -= change;

	    // Extinction if no further decline is not possible
	    if (Math.round(this.populationSize * growthRate) === 0) {
	      this.populationSize = 0;
	    }
	  };

	  /** Determine if this seat has become extinct. */
	  this.isExtinct = function() {
	    return this.populationSize === 0;
	  };

	  /**
	   * Get the next interactor for this seat.
	   *
	   * Returns null if this seat is extinct, or if this seat is the only
	   * node left.
	   */
	  this.getNextInteractor = function() {
	    if (this.isExtinct()) {
	      return null;
	    }

	    interactor = this.getNext();
	    while (interactor.isExtinct()) {
	      interactor = interactor.getNext();
	    }

	    /*
	    // Enable this to freeze "last man standing"
	    if (this === interactor) {
	      return null;
	    }
	    */

	    return interactor;
	  };

	  /** Interact with the next defined interactor. */
	  this.interactWithNextInteractor = function() {
	    interactor = this.getNextInteractor();
	    if (interactor) {
	      interactions.interact(this, interactor);
	    }
	  };
	}


	module.exports = {
	  Luncheon: Luncheon,
	  Table: Table
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var constants = __webpack_require__(2);


	/**
	Have a pack and a herd compete.

	A competition involves a coin flip weighted in favor of the predator,
	followed by population increase for the winner and population decline
	for the loser.
	*/
	function compete(pack, herd) {
	  f = constants.Coin.flip(constants.COMPETITIVE_COIN_WEIGHT);

	  if (f == constants.Coin.HEADS) {
	    pack.increasePopulation(constants.GROWTH_RATE);
	    herd.decreasePopulation(constants.GROWTH_RATE);
	  } else {
	    pack.decreasePopulation(constants.GROWTH_RATE);
	    herd.increasePopulation(constants.GROWTH_RATE);
	  }
	}


	/**
	Have seat x and seat y interact.

	For each colony engaged in an interaction (x, y, or both), the colony
	is temporarily changed to a herd or pack, based on the outcome of a fair
	coin flip.

	From there, the type of interaction depends on the types of x and y
	(the cases include two herds, two packs, one of each).
	*/

	function interact(x, y) {
	  // If x or y is a colony, set temporarily to a pack or herd
	  xWasColony = x.changeGroupIfColony();
	  yWasColony = y.changeGroupIfColony();

	  // Now the interaction falls into 4 cases
	  if (x.isHerd() && y.isHerd()) {
	    x.increasePopulation(constants.GROWTH_RATE);
	    y.increasePopulation(constants.GROWTH_RATE);
	  } else if (x.isPack() && y.isPack()) {
	    x.decreasePopulation(constants.GROWTH_RATE);
	    y.decreasePopulation(constants.GROWTH_RATE);
	  } else if (x.isPack()) {
	    compete(pack=x, herd=y);
	  } else {
	    compete(pack=y, herd=x);
	  }

	  // Set the colonies back
	  if (xWasColony) {
	    x.setToColony();
	  }

	  if (yWasColony) {
	    y.setToColony();
	  }
	}

	module.exports = {
	  interact: interact
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(3);
	var constants = __webpack_require__(2);


	/**
	 * Draw all seats.
	 *
	 * Call this to draw the initial state.
	 */
	function drawSeats(params) {
	  var svg = d3.select("svg");

	  // Calculate svg height from width.
	  var svgWidth = parseInt(svg.style("width"), 10);
	  var hwRatio = params.numTablesY / params.numTablesX;
	  var svgHeight = svgWidth * hwRatio;
	  svg.style("height", svgHeight);

	  // Calculate the space each table can take up in both x and y dimensions.
	  var tableSpace = svgWidth / params.numTablesX;
	  var tableRadius = tableSpace * constants.TABLE_SPACE_TO_RADIUS_FACTOR;

	  // Add these extra attributes to the seat.
	  // Use underscores to resemble the rest of the Python-derived attributes.
	  for (var i = 0; i < params.seats.length; i++) {
	    seat = params.seats[i];
	    seat.svgWidth = svgWidth;
	    seat.svgHeight = svgHeight;
	    seat.tableSpace = tableSpace;
	    seat.tableRadius = tableRadius;
	  }

	  // Create and position the group elents (g tags). Each one of
	  // these elents will hold both a circle and a text box.
	  var el = svg
	    .selectAll("g")
	    .data(params.seats)
	    .enter()
	    .append("g")
	    .attr("transform", function(d) {
	      coords = getCoordinates(d);
	      return "translate("+coords[0]+","+coords[1]+")"
	    });

	  addCircles(el);
	  addText(el);

	  if (params.hasStage) {
	    svg.append("rect")
	      .attr("x", svgWidth * .38)
	      .attr("width", svgWidth * .24)
	      .attr("height", svgHeight * .24)
	      .style("fill", "#B7A897")
	      .style("stroke-width", "2")
	      .style("opacity", constants.OPACITY)
	      .style("stroke", "#735535");

	    svg.append("text")
	      .text("STAGE")
	      .attr("x", svgWidth * .5)
	      .attr("y", svgHeight * .12)
	      .attr("text-anchor", "middle")
	      .attr("alignment-baseline", "middle")
	      .attr("font-size", constants.TEXT_SIZE + 5);
	  }
	}


	/**
	 * Update seat radii according to changes.
	 */
	function updateSeatRadii(changes, iteration) {
	  d3.select("svg")
	    .selectAll("circle")
	    .transition()
	    .duration(constants.TRANSITION_DURATION)
	    .delay(function(d) {
	      return iteration * constants.TRANSITION_DURATION;
	    })
	    .ease(constants.EASING_FXN)
	    .attr("r", function(d) {
	      d.populationSize = changes[d.pk];
	      return getRadius(d);
	    });
	}


	/*******************
	 * Drawing helpers *
	 *******************/

	/**
	 * Add the circle elements.
	 */
	function addCircles(el) {
	  el.append("circle")
	    .attr("r", function(d) {
	      return getRadius(d);
	    })
	    .style("fill", function(d) {
	      return getColor(d);
	    })
	    .style("opacity", constants.OPACITY);
	}


	/**
	 * Add the text elements.
	 */
	function addText(el) {
	  el.append("text")
	    .text(function(d){
	      return d.name;
	    })
	    .attr("text-anchor", "middle")
	    .attr("alignment-baseline", "middle")
	    .attr("font-size", constants.TEXT_SIZE);
	}


	/********************
	 * Per-seat helpers *
	 ********************/

	/**
	 * Get the coordinates of a seat.
	 */
	function getCoordinates(seat) {
	  var step = constants.CIRCLE_RADIANS / seat.tableSeatCount;
	  var angle = seat.index * step;

	  // Skew angle slightly so that tables with an even number of seats
	  // don't have horizontally-aligned seats at the top and bottom
	  // of the circle (better since text runs horizontally)
	  angle = (angle + (step / 2)) % constants.CIRCLE_RADIANS;

	  // Table coordinates, shifted such that relative table positions
	  // 0 and 1 are moved a half-table inward from the svg edges.
	  var tableX = (seat.tableX * (seat.svgWidth - seat.tableSpace)) +
	               (seat.tableSpace / 2);
	  var tableY = (seat.tableY * (seat.svgHeight - seat.tableSpace)) +
	               (seat.tableSpace / 2);

	  // Seat coordinates now just trigonometry
	  var seatX = tableX + (seat.tableRadius * Math.cos(angle));
	  var seatY = tableY + (seat.tableRadius * Math.sin(angle));

	  return [seatX, seatY];
	}


	/**
	 * Get the radius of a seat based on its current population size.
	 */
	function getRadius(seat) {
	  var current = utils.getRadiusFromArea(seat.populationSize);
	  var max = utils.getRadiusFromArea(
	    seat.initialPopulationSize * constants.OVERPOPULATION_FACTOR);
	  var relative = current / max;

	  // Allow seats to get as big as the table at their largest
	  return relative * seat.tableRadius;
	}


	/**
	 * Get the fill color of seat based on its group.
	 */
	function getColor(seat) {
	  if (seat.group === "HERD")
	    return "green";
	  else if (seat.group === "PACK")
	    return "red";
	  else if (seat.group === "COLONY")
	    return "blue";
	}


	/**
	 * Get the fill pattern of a seat based on its group.
	 */
	function getPattern(seat) {
	  if (seat.group == "herd")
	    return "url(#green)";
	  else if (seat.group == "pack")
	    return "url(#red)";
	  else if (seat.group == "colony")
	    return "url(#blue)";
	}


	module.exports = {
	  drawSeats: drawSeats,
	  updateSeatRadii: updateSeatRadii
	}


/***/ }
/******/ ]);