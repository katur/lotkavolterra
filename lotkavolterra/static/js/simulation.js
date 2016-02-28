// Simple maths
const CIRCLE_FULL = 2 * Math.PI;
const CENTER = 0.5

// Transition / style
const EASING_FXN = "easeOutCubic";
const TRANSITION_DURATION = 500;
const OPACITY = 0.5;
const TEXT_SIZE = 8;

// Sizing factors
const TABLE_REDUCTION_FACTOR = 0.6;
const EDGE_SKEW_FACTOR = 0.25;



function drawSeats(seats, maxTablesX, maxTablesY) {
  var svg = d3.select("svg");
  var svgWidth = svg.attr("width");
  var svgHeight = svg.attr("height");

  // tableRadius depends on max number of tables in both dimensions
  var tableRadius = getTableRadius(maxTablesX, maxTablesY,
                                   svgWidth, svgHeight);
  for (var i = 0; i < seats.length; i++) {
    seats[i]["table_radius"] = tableRadius;
  }

  // Create and position the group elements (g tags). Each one of
  // these elements will hold both a circle and a text box.
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
        tableRadius: d.table_radius,
        index: d.index,
        step: CIRCLE_FULL / d.table_size,
      });
      return "translate("+coords[0]+","+coords[1]+")"
    });

  // Add the circles to the g elements
  elem.append("circle")
    .attr("r", function(d, i) {
      return getRadius(d.population_size, d.table_radius);
    })
    .style("fill", function(d, i) {
      // return getPattern(d.group);
      return getColor(d.group);
    })
    .style("opacity", OPACITY)
    .text(function(d, i) {
      return d.name;
    });

  // Add the text to the g elements
  elem.append("text")
    .text(function(d, i){
      return d.name;
    })
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", TEXT_SIZE);
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
      return getRadius(change[d.pk], d.table_radius);
    });
}


function getTableRadius(maxTablesX, maxTablesY, svgWidth, svgHeight) {
  var maxTableWidth = svgWidth / maxTablesX * TABLE_REDUCTION_FACTOR;
  var maxTableHeight = svgHeight / maxTablesY * TABLE_REDUCTION_FACTOR;
  var tableDiameter = Math.min(maxTableWidth, maxTableHeight,
                               svgHeight / 2, svgWidth / 2);
  return tableDiameter / 2;
}


function getCoordinates(params) {
  var angle = params.index * params.step;

  // Move x and y coords inward to avoid edges of svg
  var tableX = bringInFromEdge(params.tableX);
  var tableY = bringInFromEdge(params.tableY);

  var cx = (tableX * params.svgWidth) +
           (params.tableRadius * Math.cos(angle));
  var cy = (tableY * params.svgHeight) +
           (params.tableRadius * Math.sin(angle));
  return [cx, cy];
}


function bringInFromEdge(coord) {
  var distanceFromCenter = Math.abs(CENTER - coord);
  var skew = distanceFromCenter * EDGE_SKEW_FACTOR;

  if (coord < CENTER) {
    coord += skew;
  } else if (coord > CENTER) {
    coord -= skew;
  }
  return coord;
}


function getRadius(populationSize, tableRadius) {
  /*
   * Calculate radius such that area reflects population size.
   */
  var skew = tableRadius / 65;
  return Math.sqrt(populationSize / Math.PI) * skew;
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
