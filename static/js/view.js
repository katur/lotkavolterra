var $ = require("jquery");
var fabric = require("fabric");
var d3 = require("d3");
var utils = require("./utils.js");
var constants = require("./constants.js");


module.exports = {
  /**
   * Draw all seats.
   *
   * Call this to draw the initial state of the simulation.
   */
  drawSeats: function(params) {
    // Make certain canvas-wide calculations
    doCanvasWideCalculations(params.numTablesX, params.numTablesY,
                          params.seats);

    var canvas = new fabric.fabric.Canvas("simulation-canvas");

    // Add the circle elements
    addCircles(canvas, params.seats);

    // Add the text elements
    if (!params.noText) {
      addText(canvas, params.seats, params.showSpecies);
    }

    return canvas;
  },


  /**
   * Draw the stage.
   */
  drawStage: function(params) {
    var canvas = $("#simulation-canvas");
    var canvasWidth = canvas.width();
    var canvasHeight = canvas.height();

    var rect = new fabric.fabric.Rect({
      top: canvasWidth * (0.5 - params.stageWidth / 2),
      left: canvasHeight * params.stageY,
      width: canvasWidth * params.stageWidth,
      height: canvasHeight * params.stageHeight
    });

    canvas.add(rect);

    var text = new fabric.fabric.Text("STAGE", {
      top: canvasWidth * -.5,
      left: canvasHeight * (params.stageY + params.stageHeight / 2),
      originX: "center",
      originY: "center",
      fontSize: 10,
      fontFamily: "Helvetica Neue"
    });

    canvas.add(text);
  },


  /**
   * Make the "stats" visible.
   *
   * The stats are the generation/trial counters and the home nav.
   * The reason we wanted to be able to control their visibility is
   * to remove them when making screen capture videos.
   */
  displayStats: function(params) {
    $("#stats").show();

    if (params.repeat) {
      $("#trial-counter").show();
    }
  },


  /**
   * Update seat radii.
   */
  updateSeatRadii: function(params) {
    var duration, delay;

    if (params.reset) {
      duration = 0;
      delay = constants.BETWEEN_TRIAL_DELAY;
    } else {
      duration = constants.TRANSITION_DURATION;
      delay = 0;
    }

    var circle, seat, pk;
    for (var i = 0; i < params.seats.length; i++) {
      seat = params.seats[i];

      if (seat.pk != 0) {
        seat.circle.animate('radius', getRadius(seat), {
          duration: 500
        });
      } else {
        seat.circle.animate('radius', getRadius(seat), {
          duration: 500,
          // easing: fabric.fabric.util.ease.easeInCubic,
          easing: function(t, b, c, d) {return c*t/d + b;},
          onChange: params.canvas.renderAll.bind(params.canvas),
          onComplete: function() {
            if (params.showStats) {
              updateCounters(params.generation, params.reset, params.trial);
            }

            params.callback(params.callbackParams);
          }
        });
      }
    }
  },


  /**
   * Draw a large version of the logo for this project.
   */
  drawLogo: function() {
    const OFFSET = 20;
    const SCALE = 40;

    function favAdjust(coord) {
      return OFFSET + (coord * SCALE);
    }

    var svg = d3.select("#logo-svg");
    svg.selectAll("circle")
      .data([
        {group: "HERD", x: favAdjust(1/2), y: favAdjust(0)},
        {group: "PACK", x: favAdjust(0), y: favAdjust(Math.sqrt(3)/2)},
        {group: "COLONY", x: favAdjust(1), y: favAdjust(Math.sqrt(3)/2)}
      ])
      .enter()
      .append("circle")
      .each(function(d, i) {
        d3.select(this)
          .attr("cx", d.x)
          .attr("cy", d.y)
          .attr("r", 20)
          .classed(d.group, true);
      });
  }
};


/***********
 * Helpers *
 ***********/

/**
 * Process SVG-wide stuff, including setting the height, calculating
 * the size of tables, and binding all this information to all seats.
 */
function doCanvasWideCalculations(numTablesX, numTablesY, seats) {
  // Set svg height based on width
  var canvas = $("#simulation-canvas");
  var canvasWidth = canvas.width();
  var hwRatio = numTablesY / numTablesX;
  var canvasHeight = canvasWidth * hwRatio;
  canvas.height(canvasHeight);

  // Calculate the space each table can take up in both x and y dimensions
  var tableSpace = canvasWidth / numTablesX;
  var tableRadius = tableSpace * constants.TABLE_SPACE_TO_RADIUS_FACTOR;

  // Add these extra attributes to the seats for convenience later on
  for (var i = 0; i < seats.length; i++) {
    seat = seats[i];
    seat.canvasWidth = canvasWidth;
    seat.canvasHeight = canvasHeight;
    seat.tableSpace = tableSpace;
    seat.tableRadius = tableRadius;
  }
}


/**
 * Add circles representing seats to svg.
 */
function addCircles(canvas, seats) {
  var seat, coords, radius, circle;

  for (var i = 0; i < seats.length; i++) {
    seat = seats[i];
    coords = getCoordinates(seat);

    circle = new fabric.fabric.Circle({
      top: coords[1],
      left: coords[0],
      originX: "center",
      originY: "center",
      radius: getRadius(seat),
      fill: getColor(seat),
      opacity: 0.5
    });

    canvas.add(circle);
    seat.circle = circle;
  }
}


/**
 * Add text elements for seats to the svg.
 *
 * If showSpecies=true, show species name; otherwise, show first name.
 */
function addText(canvas, seats, showSpecies) {
  var seat, coords, radius, text;
  for (var i = 0; i < seats.length; i++) {
    seat = seats[i];
    coords = getCoordinates(seat);
    text = showSpecies ? seat.shortSpecies : seat.firstName;

    text = new fabric.fabric.Text(text, {
      top: coords[1],
      left: coords[0],
      originX: "center",
      originY: "center",
      fontSize: 10,
      fontFamily: "Helvetica Neue"
    });
    canvas.add(text);
  }
}


/**
 * Calculate the coordinates of a seat.
 */
function getCoordinates(seat) {
  var step = constants.CIRCLE_RADIANS / seat.table.seatCount;
  var angle = seat.index * step;

  // Skew angle slightly so that tables with an even number of seats
  // don't have horizontally-aligned seats at the top and bottom
  // of the circle (better since text runs horizontally)
  angle = (angle + (step / 2)) % constants.CIRCLE_RADIANS;

  // Table coordinates, shifted such that relative table positions
  // 0 and 1 are moved a half-table inward from the svg edges.
  var tableX = (seat.table.x * (seat.canvasWidth - seat.tableSpace)) +
               (seat.tableSpace / 2);
  var tableY = (seat.table.y * (seat.canvasHeight - seat.tableSpace)) +
               (seat.tableSpace / 2);

  // Seat coordinates now just trigonometry
  var seatX = tableX + (seat.tableRadius * Math.cos(angle));
  var seatY = tableY + (seat.tableRadius * Math.sin(angle));

  return [seatX, seatY];
}


/**
 * Calculate the radius of a seat based on its current population size.
 */
function getRadius(seat) {
  var current = utils.getRadiusFromArea(seat.populationSize);
  var max = constants.OVERPOPULATION_RADIUS;
  var relative = current / max;

  // Allow seats to get as big as the table at their largest
  return relative * seat.tableRadius;
}


/**
 * Get the color for a seat based on its group.
 */
function getColor(seat) {
  var group = seat.group;
  if (group === "HERD") {
    return "green";
  } else if (group === "PACK") {
    return "red";
  } else if (group === "COLONY") {
    return "blue";
  } else {
    return "black";
  }
}


/**
 * Update the trial and generation counters.
 */
function updateCounters(generation, reset, trial) {
  $("#generation-counter").text("Generation " + generation);

  if (reset) {
    $("#trial-counter").text("Trial " + trial);
  }
}
