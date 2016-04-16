var utils = require("./utils.js");
var constants = require("./constants.js");
var d3 = require("d3");


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
  svg.attr("height", svgHeight);

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

  // Add the circle elements.
  var circles = svg.selectAll("circle")
    .data(params.seats)
    .enter()
    .append("circle")
    .each(function(d, i) {
      var coords = getCoordinates(d);
      d3.select(this)
        .attr("cx", coords[0])
        .attr("cy", coords[1])
        .attr("r", getRadius(d))
        .classed(d.group, true);
    });


  // Add the text elements.
  svg.selectAll("text")
    .data(params.seats)
    .enter()
    .append("text")
    .each(function(d, i) {
      var coords = getCoordinates(d);
      d3.select(this)
        .attr("x", coords[0])
        .attr("y", coords[1])
        .text(params.showSpecies ? d.shortSpecies : d.firstName)
        .classed("circle-text", true);
    });

  return circles;
}


/**
 * Draw the stage.
 */
function drawStage() {
  var svg = d3.select("svg");
  var svgWidth = parseInt(svg.style("width"), 10);
  var svgHeight = parseInt(svg.style("height"), 10);
  var stageSize = 0.2;

  svg.append("rect")
    .classed("stage", true)
    .attr("x", svgWidth * (0.5 - stageSize / 2))
    .attr("y", 0)
    .attr("width", svgWidth * stageSize)
    .attr("height", svgHeight * stageSize);

  svg.append("text")
    .classed("stage-text", true)
    .text("STAGE")
    .attr("x", svgWidth * 0.5)
    .attr("y", svgHeight * (stageSize / 2))
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
}


/**
 * Update seat radii.
 */
function updateSeatRadii(params) {
  var duration, delay;

  if (params.reset) {
    duration = 0;
    delay = constants.BETWEEN_TRIAL_DELAY;
  } else {
    duration = constants.TRANSITION_DURATION;
    delay = 0;
  }

  params.circles
    .transition()
    .duration(duration)
    .delay(delay)
    .ease(constants.EASING_FXN)
    .attr("r", function(d) {
      return getRadius(d);
    })
    .each("end", function(d, i) {
      // The callback is only needed once over all nodes
      if (i == 0) {
        // TODO: cache the selection of the counters
        d3.select(".generation-counter")
          .text("Generation " + params.generation);

        if (params.reset) {
          d3.select(".trial-counter")
            .text("Trial " + params.trial);
        }

        params.callback(params.callbackParams);
      }
    });
}


/*******************
 * Drawing helpers *
 *******************/

/********************
 * Per-seat helpers *
 ********************/

/**
 * Get the coordinates of a seat.
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
  var tableX = (seat.table.x * (seat.svgWidth - seat.tableSpace)) +
               (seat.tableSpace / 2);
  var tableY = (seat.table.y * (seat.svgHeight - seat.tableSpace)) +
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
  var max = utils.getRadiusFromArea(constants.OVERPOPULATION_SIZE);
  var relative = current / max;

  // Allow seats to get as big as the table at their largest
  return relative * seat.tableRadius;
}


module.exports = {
  drawSeats: drawSeats,
  drawStage: drawStage,
  updateSeatRadii: updateSeatRadii
}
