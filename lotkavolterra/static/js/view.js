/*************************
 * Luncheon-wide helpers *
 *************************/

/**
 * Draw all seats.
 *
 * Call this to draw the initial state.
 */
function drawSeats(seats, numTablesX, numTablesY, hasStage) {
  var svg = d3.select("svg");

  // Calculate svg height from width.
  var svgWidth = parseInt(svg.style("width"), 10);
  var hwRatio = numTablesY / numTablesX;
  var svgHeight = svgWidth * hwRatio;
  svg.style("height", svgHeight);

  // Calculate the space each table can take up in both x and y dimensions.
  var tableSpace = svgWidth / numTablesX;
  var tableRadius = tableSpace * constants.TABLE_SPACE_TO_RADIUS_FACTOR;

  // Add these extra attributes to the seat.
  // Use underscores to resemble the rest of the Python-derived attributes.
  for (var i = 0; i < seats.length; i++) {
    seat = seats[i];
    seat.svgWidth = svgWidth;
    seat.svgHeight = svgHeight;
    seat.tableSpace = tableSpace;
    seat.tableRadius = tableRadius;
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

  if (hasStage) {
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
