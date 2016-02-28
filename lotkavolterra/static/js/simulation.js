const CIRCLE_FULL = 2 * Math.PI;
const OPACITY = 0.5;
const TRANSITION_DURATION = 500;
const EASING_FXN = "easeOutCubic";


function drawSeats(seats, maxTablesX, maxTablesY) {
  var svg = d3.select("svg")
  var svgWidth = svg.attr("width");
  var svgHeight = svg.attr("height");

  var maxTableWidth = svgWidth / maxTablesX * 0.6;
  var maxTableHeight = svgHeight / maxTablesY * 0.6;
  var tableRadius = Math.min(maxTableWidth, maxTableHeight,
                             svgHeight / 2, svgWidth / 2) / 2;

  // Create and position wrapper group elements (g tags)
  var elem = svg
    .selectAll("g")
    .data(seats)
    .enter()
    .append("g")
    .attr("transform", function(d) {
      coords = getCoordinates({
        svgWidth: svgWidth,
        svgHeight: svgHeight,
        tableX: d.table_x,
        tableY: d.table_y,
        tableRadius: tableRadius,
        index: d.index,
        step: CIRCLE_FULL / d.table_size,
      });
      return "translate("+coords[0]+","+coords[1]+")"
    });

  // Add the circles
  elem.append("circle")
    .attr("r", function(d, i) {
      return getRadius(d.population_size);
    })
    .style("fill", function(d, i) {
      // return getPattern(d.group);
      return getColor(d.group);
    })
    .style("opacity", OPACITY)
    .text(function(d, i) {
      return d.name;
    });

  // Add the text
  elem.append("text")
    .text(function(d, i){
      return d.name;
    })
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", "10");
}


function updateSeats(change, iteration) {
  d3.select("svg")
    .selectAll("circle")
    .transition()
    .duration(TRANSITION_DURATION)
    .delay(function(d, i) {
      return iteration * TRANSITION_DURATION;
    })
    .ease(EASING_FXN)
    .attr("r", function(d, i) {
      return getRadius(change[d.pk]);
    });
}


function getCoordinates(params) {
  var angle = params.index * params.step;

  // Move x and y coords inward to avoid edges of svg
  var tableX = moveFromEdge(params.tableX);
  var tableY = moveFromEdge(params.tableY);

  var cx = (tableX * params.svgWidth) +
           (params.tableRadius * Math.cos(angle));
  var cy = (tableY * params.svgHeight) +
           (params.tableRadius * Math.sin(angle));
  return [cx, cy];
}


function moveFromEdge(coord) {
  var distanceFromCenter = Math.abs(0.5 - coord);
  var skew = distanceFromCenter * 0.25;

  if (coord < 0.5) {
    coord += skew;
  } else if (coord > 0.5) {
    coord -= skew;
  }
  return coord;
}


function getRadius(population_size) {
  /*
   * Calculate radius such that area reflects population size.
   */
  return Math.sqrt(population_size / Math.PI);
}


function getColor(group) {
  /*
   * Get the color of a particular group.
   */
  var color;
  if (group == "herd")
    color = "green";
  else if (group == "pack")
    color = "red";
  else if (group == "colony")
    color = "blue";
  return color;
}


function getPattern(group) {
  /*
   * Get the pattern of a particular group.
   */
  var pattern;
  if (group == "herd")
    pattern = "url(#green)";
  else if (group == "pack")
    pattern = "url(#red)";
  else if (group == "colony")
    pattern = "url(#blue)";
  return pattern;
}
