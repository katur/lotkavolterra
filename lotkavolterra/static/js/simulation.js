// Simple maths
const CIRCLE_FULL = 2 * Math.PI;
const CENTER = 0.5;

// Transition / style
const EASING_FXN = "easeOutCubic";
const TRANSITION_DURATION = 500;
const OPACITY = 0.5;
const TEXT_SIZE = 8;

// Sizing factors
const TABLE_REDUCTION = 0.8;
const SVG_REDUCTION = 0.7;
const SVG_MARGIN = (1.0 - SVG_REDUCTION) / 2;


/**
 * Draw the seats initially.
 *
 * maxTablesX and maxTableY are required to determine how big the
 * tables should be.
 */
function drawSeats(seats, maxTablesX, maxTablesY) {
  var svg = d3.select("svg");
  var svgWidth = svg.style("width").replace("px", "");

  // Set height using width along with ratio of x/y tables
  var hwRatio = (maxTablesY - 1 + 0.0001) / (maxTablesX - 1 + 0.0001);
  var svgHeight = svgWidth * hwRatio;
  svg.style("height", svgHeight);
  svgHeight = svg.style("height").replace("px", "");

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
        tableSize: d.table_size
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


/**
 * Update seats according to changes.
 */
function updateSeats(changes, iteration) {
  d3.select("svg")
    .selectAll("circle")
    .transition()
    .duration(TRANSITION_DURATION)
    .delay(function(d, i) {
      return iteration * TRANSITION_DURATION;
    })
    .ease(EASING_FXN)
    .attr("r", function(d, i) {
      return getRadius(changes[d.pk], d.table_radius);
    });
}


function getTableRadius(maxTablesX, maxTablesY, svgWidth, svgHeight) {
  var maxTableWidth = svgWidth / maxTablesX * TABLE_REDUCTION * SVG_REDUCTION;
  var maxTableHeight = svgHeight / maxTablesY * TABLE_REDUCTION * SVG_REDUCTION;

  var tableDiameter = Math.min(maxTableWidth, maxTableHeight,
                               svgHeight / 3, svgWidth / 3);
  return tableDiameter / 2;
}


/**
 * Calculate the coordinates for a particular seat.
 *
 * This calculation depends on the relative table coordinates,
 * the table radius, the index of this seat in the table, the
 * total number of seats at this table, and the size of the SVG
 * container.
 */
function getCoordinates(params) {
  var step = CIRCLE_FULL / params.tableSize;
  var angle = params.index * step;

  // Skew angle slight so that common case (even number) doesn't have two
  // horizontally-even seats at top and bottom of circle
  angle = (angle + (step / 2)) % CIRCLE_FULL;

  // Move x and y coords inward to avoid edges of svg
  var tableX = params.tableX;
  var tableY = params.tableY;

  var cx = (tableX * params.svgWidth * SVG_REDUCTION) +
           (params.svgWidth * SVG_MARGIN) +
           (params.tableRadius * Math.cos(angle));
  var cy = (tableY * params.svgHeight * SVG_REDUCTION) +
           (params.svgHeight * SVG_MARGIN) +
           (params.tableRadius * Math.sin(angle));
  return [cx, cy];
}


/**
 * Calculate radius such that area reflects population size.
 */
function getRadius(populationSize, tableRadius) {
  var skew = tableRadius / 65;
  return Math.sqrt(populationSize / Math.PI) * skew;
}


/**
 * Get the color of a particular group.
 */
function getColor(group) {
  var color;
  if (group == "herd")
    color = "green";
  else if (group == "pack")
    color = "red";
  else if (group == "colony")
    color = "blue";
  return color;
}


/**
 * Get the pattern of a particular group.
 */
function getPattern(group) {
  var pattern;
  if (group == "herd")
    pattern = "url(#green)";
  else if (group == "pack")
    pattern = "url(#red)";
  else if (group == "colony")
    pattern = "url(#blue)";
  return pattern;
}
