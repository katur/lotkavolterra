// Simple maths
const PI = Math.PI;
const CIRCLE_FULL = 2 * PI;

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

  // Calculate svgWidth and height
  var svgWidth = svg.style("width").replace("px", "");
  var hwRatio = maxTablesY / maxTablesX;
  var svgHeight = svgWidth * hwRatio;
  svg.style("height", svgHeight);
  svgHeight = svg.style("height").replace("px", "");

  // Calculate the amount of space each table can take up
  var tableSpace = getTableSpace(svgWidth, svgHeight,
                                 maxTablesX, maxTablesY);

  // Add these extra attributes to the seat.
  // Use underscores to resemble the rest of the bound attributes.
  for (var i = 0; i < seats.length; i++) {
    seats[i]["svg_width"] = svgWidth;
    seats[i]["svg_height"] = svgHeight;
    seats[i]["table_space"] = tableSpace;
    seats[i]["table_radius"] = tableSpace / TABLE_RADIUS_TO_SPACE_RATIO;
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
      return getRadius(d);
    })
    .style("fill", function(d, i) {
      // return getPattern(d.group);
      return getColor(d);
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
      d.population_size = changes[d.pk];
      return getRadius(d);
    });
}


function getTableSpace(svgWidth, svgHeight, maxTablesX, maxTablesY) {
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

  // Skew angle slightly so that tables with an even number of seats
  // don't have two horizontally-aligned seats at the top and bottom
  // of the circle. Better since text runs horizontally.
  angle = (angle + (step / 2)) % CIRCLE_FULL;

  var cx = (d.table_x * (d.svg_width - d.table_space)) +
           (d.table_space / 2) +
           (d.table_radius * Math.cos(angle));

  var cy = (d.table_y * (d.svg_height - d.table_space)) +
           (d.table_space / 2) +
           (d.table_radius * Math.sin(angle));

  return [cx, cy];
}


/**
 * Get a circle's radius from its area.
 */
function getRadiusFromArea(area) {
  return Math.sqrt(area / PI);
}


/**
 * Calculate radius of a seat based on its population size.
 *
 * The amount returned takes into account the initialPopulationSize
 * and the table size.
 */
function getRadius(d) {
  var current = getRadiusFromArea(d.population_size);
  var full = getRadiusFromArea(d.initial_population_size * 10);
  var relative = current / full;
  return relative * d.table_radius;
}


/**
 * Get the color of seat, based on its group.
 */
function getColor(d) {
  var group = d.group;
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
 * Get the pattern of a seat, based on its group.
 */
function getPattern(d) {
  var group = d.group;
  var pattern;
  if (group == "herd")
    pattern = "url(#green)";
  else if (group == "pack")
    pattern = "url(#red)";
  else if (group == "colony")
    pattern = "url(#blue)";
  return pattern;
}
