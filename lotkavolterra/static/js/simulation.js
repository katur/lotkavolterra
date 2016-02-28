// Simple maths
const CIRCLE_FULL = 2 * Math.PI;
const CENTER = 0.5;

// Transition / style
const EASING_FXN = "easeOutCubic";
const TRANSITION_DURATION = 500;
const OPACITY = 0.5;
const TEXT_SIZE = 8;

// Sizing factors
const TABLE_RADIUS_TO_SPACE_RATIO = 3;


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
  var hwRatio = maxTablesY / maxTablesX;
  var svgHeight = svgWidth * hwRatio;
  svg.style("height", svgHeight);
  svgHeight = svg.style("height").replace("px", "");

  // tableSpace depends on max number of tables in both dimensions
  var tableSpace = getTableSpace(maxTablesX, maxTablesY,
                                 svgWidth, svgHeight);
  for (var i = 0; i < seats.length; i++) {
    seats[i]["tableSpace"] = tableSpace;
    seats[i]["tableRadius"] = tableSpace / TABLE_RADIUS_TO_SPACE_RATIO;
    seats[i]["svgWidth"] = svgWidth;
    seats[i]["svgHeight"] = svgHeight;
  }

  // Create and position the group elements (g tags). Each one of
  // these elements will hold both a circle and a text box.
  var elem = svg
    .selectAll("g")
    .data(seats)
    .enter()
    .append("g")
    .attr("transform", function(d) {
      coords = getCoordinates(d);
      return "translate("+coords[0]+","+coords[1]+")"
    });

  // Add the circles to the g elements
  elem.append("circle")
    .attr("r", function(d, i) {
      return getRadius(d.population_size, d.initial_population_size,
                       d.tableRadius);
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
      return getRadius(changes[d.pk], d.initial_population_size,
                       d.tableRadius);
    });
}


function getTableSpace(maxTablesX, maxTablesY, svgWidth, svgHeight) {
  var maxTableWidth = svgWidth / maxTablesX;
  var maxTableHeight = svgHeight / maxTablesY;
  return Math.min(maxTableWidth, maxTableHeight);
}


/**
 * Calculate the coordinates for a particular seat.
 *
 * This calculation depends on the relative table coordinates,
 * the table radius, the index of this seat in the table, the
 * total number of seats at this table, and the size of the SVG
 * container.
 */
function getCoordinates(d) {
  var step = CIRCLE_FULL / d.table_size;
  var angle = d.index * step;

  // Skew angle slight so that common case (even number) doesn't have two
  // horizontally-even seats at top and bottom of circle
  angle = (angle + (step / 2)) % CIRCLE_FULL;

  var cx = (d.table_x * (d.svgWidth - d.tableSpace)) +
           (d.tableSpace / 2) +
           (d.tableRadius * Math.cos(angle));

  var cy = (d.table_y * (d.svgHeight - d.tableSpace)) +
           (d.tableSpace / 2) +
           (d.tableRadius * Math.sin(angle));

  return [cx, cy];
}


/**
 * Get a circle's radius from its area.
 */
function getRadiusFromArea(area) {
  return Math.sqrt(area / Math.PI);
}


/**
 * Calculate radius of a seat based on its population size.
 *
 * The amount returned takes into account the initialPopulationSize
 * and the table size.
 */
function getRadius(populationSize, initialPopulationSize, tableRadius) {
  var current = getRadiusFromArea(populationSize);
  var full = getRadiusFromArea(initialPopulationSize * 10);
  var relative = current / full;
  return relative * tableRadius;
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
