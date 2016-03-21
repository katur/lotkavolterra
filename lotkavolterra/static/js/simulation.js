// Simple maths
const PI = Math.PI;
const CIRCLE_RADIANS = 2 * PI;

// Transition / style
const OPACITY = 0.5;
const TEXT_SIZE = 10;
const EASING_FXN = "easeOutCubic";
const TRANSITION_DURATION = 500;

// Sizing factors
const TABLE_SPACE_TO_RADIUS_FACTOR = 1/3;


/*************************
 * Luncheon-wide helpers *
 *************************/

/**
 * Draw all seats.
 *
 * Call this to draw the initial state.
 */
function drawSeats(seats, numTablesX, numTablesY, showStage) {
  var svg = d3.select("svg");

  // Calculate svg height from width.
  var svgWidth = parseInt(svg.style("width"), 10);
  var hwRatio = numTablesY / numTablesX;
  var svgHeight = svgWidth * hwRatio;
  svg.style("height", svgHeight);

  // Calculate the space each table can take up in both x and y dimensions.
  var tableSpace = svgWidth / numTablesX;
  var tableRadius = tableSpace * TABLE_SPACE_TO_RADIUS_FACTOR;

  // Add these extra attributes to the seat.
  // Use underscores to resemble the rest of the Python-derived attributes.
  for (var i = 0; i < seats.length; i++) {
    seat = seats[i];
    seat["svg_width"] = svgWidth;
    seat["svg_height"] = svgHeight;
    seat["table_space"] = tableSpace;
    seat["table_radius"] = tableRadius;
  }

  // Create and position the group elents (g tags). Each one of
  // these elents will hold both a circle and a text box.
  var el = svg
    .selectAll("g")
    .data(seats)
    .enter()
    .append("g")
    .attr("transform", function(d) {
      coords = getCoordinates(d);
      return "translate("+coords[0]+","+coords[1]+")"
    });

  addCircles(el);
  addText(el);

  var stageSize = 0.2;

  if (showStage) {
    svg.append("rect")
      .attr("x", svgWidth * (0.5 - stageSize / 2))
      .attr("width", svgWidth * stageSize)
      .attr("height", svgHeight * stageSize)
      .style("fill", "#bbb")
      .style("opacity", OPACITY);

    svg.append("text")
      .text("STAGE")
      .attr("x", svgWidth * 0.5)
      .attr("y", svgHeight * (stageSize / 2))
      .attr("text-anchor", "middle")
      .attr("fill", "#999")
      .attr("alignment-baseline", "middle")
      .attr("font-size", TEXT_SIZE + 5);
  }
}

/**
 * Update seat radii according to changes.
 */
function updateSeatRadii(changes, iteration) {
  d3.select("svg")
    .selectAll("circle")
    .transition()
    .duration(TRANSITION_DURATION)
    .delay(function(d) {
      return iteration * TRANSITION_DURATION;
    })
    .ease(EASING_FXN)
    .attr("r", function(d) {
      d.population_size = changes[d.pk];
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
    .style("opacity", OPACITY);
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
    .attr("font-size", TEXT_SIZE);
}


/********************
 * Per-seat helpers *
 ********************/

/**
 * Get the coordinates of a seat.
 */
function getCoordinates(seat) {
  var step = CIRCLE_RADIANS / seat.table_seat_count;
  var angle = seat.index * step;

  // Skew angle slightly so that tables with an even number of seats
  // don't have horizontally-aligned seats at the top and bottom
  // of the circle (better since text runs horizontally)
  angle = (angle + (step / 2)) % CIRCLE_RADIANS;

  // Table coordinates, shifted such that relative table positions
  // 0 and 1 are moved a half-table inward from the svg edges.
  var tableX = (seat.table_x * (seat.svg_width - seat.table_space)) +
               (seat.table_space / 2);
  var tableY = (seat.table_y * (seat.svg_height - seat.table_space)) +
               (seat.table_space / 2);

  // Seat coordinates now just trigonometry
  var seatX = tableX + (seat.table_radius * Math.cos(angle));
  var seatY = tableY + (seat.table_radius * Math.sin(angle));

  return [seatX, seatY];
}

/**
 * Get the radius of a seat based on its current population size.
 */
function getRadius(seat) {
  var current = getRadiusFromArea(seat.population_size);
  var max = getRadiusFromArea(seat.initial_population_size *
                              OVERPOPULATION_FACTOR);
  var relative = current / max;

  // Allow seats to get as big as the table at their largest
  return relative * seat.table_radius;
}

/**
 * Get the fill color of seat based on its group.
 */
function getColor(seat) {
  if (seat.group == "herd")
    return "green";
  else if (seat.group == "pack")
    return "red";
  else if (seat.group == "colony")
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


/*******************
 * General helpers *
 *******************/

/**
 * Get a circle's radius from its area.
 */
function getRadiusFromArea(area) {
  return Math.sqrt(area / PI);
}
