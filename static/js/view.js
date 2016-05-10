var $ = require("jquery");
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
    // Make certain SVG-wide calculations
    doSvgWideCalculations(params.numTablesX, params.numTablesY,
                          params.seats);

    var svg = d3.select("#simulation-svg");

    // Add the circle elements
    var circles = addCircles(svg, params.seats);

    // Add the text elements
    if (!params.noText) {
      addText(svg, params.seats, params.showSpecies);
    }

    return circles;
  },


  /**
   * Draw the stage.
   */
  drawStage: function(params) {
    var svg = d3.select("#simulation-svg");
    var svgWidth = parseInt(svg.style("width"), 10);
    var svgHeight = parseInt(svg.style("height"), 10);

    svg.append("rect")
      .classed("stage", true)
      .attr("x", svgWidth * (0.5 - params.stageWidth / 2))
      .attr("y", svgHeight * params.stageY)
      .attr("width", svgWidth * params.stageWidth)
      .attr("height", svgHeight * params.stageHeight);

    svg.append("text")
      .classed("stage-text", true)
      .text("STAGE")
      .attr("x", svgWidth * 0.5)
      .attr("y", svgHeight * (params.stageY + params.stageHeight / 2))
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle");
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

    params.circles
      .transition()
      .duration(duration)
      .delay(delay)
      .ease(constants.EASING_FXN)
      .attr("r", function(d) {
        return getRadius(d);
      })
      .each("end", function(d, i) {
        // The callback is only needed once over all circles
        if (i != 0) { return; }

        if (params.showStats) {
          updateCounters(params.generation, params.trial, params.reset);
        }
        params.callback(params.callbackParams);
      });
  },


  /**
   * Draw a large version of the favicon for this project.
   */
  drawFavicon: function() {
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
function doSvgWideCalculations(numTablesX, numTablesY, seats) {
  // Set svg height based on width
  var svg = $("#simulation-svg");
  var svgWidth = svg.width();
  var hwRatio = numTablesY / numTablesX;
  var svgHeight = svgWidth * hwRatio;
  svg.height(svgHeight);

  // Calculate the space each table can take up in both x and y dimensions
  var tableSpace = svgWidth / numTablesX;
  var tableRadius = tableSpace * constants.TABLE_SPACE_TO_RADIUS_FACTOR;

  // Add these extra attributes to the seats for convenience later on
  for (var i = 0; i < seats.length; i++) {
    seat = seats[i];
    seat.svgWidth = svgWidth;
    seat.svgHeight = svgHeight;
    seat.tableSpace = tableSpace;
    seat.tableRadius = tableRadius;
  }
}


/**
 * Add circles representing seats to svg.
 */
function addCircles(svg, seats) {
  return svg.selectAll("circle")
    .data(seats)
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
}


/**
 * Add text elements for seats to the svg.
 *
 * If showSpecies=true, show species name; otherwise, show first name.
 */
function addText(svg, seats, showSpecies) {
  return svg.selectAll("text")
    .data(seats)
    .enter()
    .append("text")
    .each(function(d, i) {
      var coords = getCoordinates(d);
      d3.select(this)
        .attr("x", coords[0])
        .attr("y", coords[1])
        .text(showSpecies ? d.shortSpecies : d.firstName)
        .classed("circle-text", true);
    });
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
 * Update the trial and generation counters.
 */
function updateCounters(generation, trial, reset) {
  $(".generation-counter").text("Generation " + generation);

  if (reset) {
    $(".trial-counter").text("Trial " + trial);
  }
}
