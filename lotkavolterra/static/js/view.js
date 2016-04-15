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
  addText(el, params.showSpecies);
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
 * Draw the generation counter.
 */
function drawCounters() {
  var svg = d3.select("svg");
  var svgWidth = parseInt(svg.style("width"), 10);
  var svgHeight = parseInt(svg.style("height"), 10);

  svg.append("text")
    .attr("id", "trialCounter")
    .text("Trial 0")
    .attr("x", svgWidth - 10)
    .attr("y", 20)
    .attr("text-anchor", "end")
    .attr("font-size", constants.TEXT_SIZE + 3);

  svg.append("text")
    .attr("id", "generationCounter")
    .text("Generation 0")
    .attr("x", svgWidth - 10)
    .attr("y", 40)
    .attr("text-anchor", "end")
    .attr("font-size", constants.TEXT_SIZE + 3);
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

  d3.select("svg")
    .selectAll("circle")
    .transition()
    .duration(duration)
    .delay(delay)
    .ease(constants.EASING_FXN)
    .attr("r", function(d) {
      d.populationSize = params.change[d.pk];
      return getRadius(d);
    })
    .each("end", function(d, i) {
      // The callback is only needed once over all nodes
      if (i == 0) {
        d3.select("#generationCounter")
          .text("Generation " + params.generation);

        if (params.reset) {
          d3.select("#trialCounter")
            .text("Trial " + params.trial);
        }

        params.callback(params.callbackParams);
      }
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
    .attr("class", function(d) {
      return d.group;
    })
    .attr("r", function(d) {
      return getRadius(d);
    });
}


/**
 * Add the text elements.
 */
function addText(el, showSpecies) {
  el.append("text")
    .classed("circle-text", true)
    .text(function(d){
      if (showSpecies) {
        return d.species;
      } else {
        return d.name;
      }
    });
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
 *
 * TODO: add a class and style this with css a la homepage key
 */
function getColor(seat) {
  if (seat.group === "HERD")
    return "008000";
  else if (seat.group === "PACK")
    return "FF0000";
  else if (seat.group === "COLONY")
    return "0000FF";
}


module.exports = {
  drawSeats: drawSeats,
  drawStage: drawStage,
  drawCounters: drawCounters,
  updateSeatRadii: updateSeatRadii
}
