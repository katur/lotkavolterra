const TRANSITION_DURATION = 500;
const EASING_FXN = "easeOutCubic";
const OPACITY = 0.5;
const MAX_NODE_RADIUS = 75;

const DEFAULT_SVG_WIDTH = 1200;
const DEFAULT_SVG_HEIGHT = 600;
const DEFAULT_SEATS_PER_TABLE = 10;


////////////////
// Test cases //
////////////////

function drawRandomCircles(numCircles) {
  var svgWidth = DEFAULT_SVG_WIDTH;
  var svgHeight = DEFAULT_SVG_HEIGHT;

  createSVG(svgWidth, svgHeight);

  for (i = 0; i < numCircles; i++) {
    var cx = Math.random() * (svgWidth - 2*MAX_NODE_RADIUS) + MAX_NODE_RADIUS;
    var cy = Math.random() * (svgHeight - 2*MAX_NODE_RADIUS) + MAX_NODE_RADIUS;
    drawCircle(cx, cy);
  }

  colorAllCirclesRandomly();
  changeAllRadiiRandomly();
}


function drawTwoCirclesOfCircles() {
  var svgWidth = DEFAULT_SVG_WIDTH;
  var svgHeight = DEFAULT_SVG_HEIGHT;
  createSVG(svgWidth, svgHeight);

  var outerX1 = svgWidth / 4;
  var outerX2 = 3 * svgWidth / 4;
  var outerY = svgHeight / 2;
  var outerRadius = Math.min(svgWidth, svgHeight) / 2 - 2*MAX_NODE_RADIUS;

  drawCircleOfCircles(outerX1, outerY, outerRadius);
  drawCircleOfCircles(outerX2, outerY, outerRadius);

  colorAllCirclesRandomly();
  changeAllRadiiRandomly();
}


/////////////
// Helpers //
/////////////

function createSVG(width, height) {
  var width = width || DEFAULT_SVG_WIDTH;
  var height = height || DEFAULT_SVG_HEIGHT;
  d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
}


function drawCircleOfCircles(outerX, outerY, outerRadius, numCircles) {
  var numCircles = numCircles || DEFAULT_SEATS_PER_TABLE;
  var circleEnd = 2 * Math.PI
  var circleStep = circleEnd / numCircles

  var innerX, innerY;
  for (var i = 0; i < circleEnd; i += circleStep) {
    innerX = outerX + outerRadius * Math.cos(i);
    innerY = outerY + outerRadius * Math.sin(i);
    drawCircle(innerX, innerY);
  }
}


function drawTable(tableX, tableY, tableRadius, seats) {
  var numSeats = seats.length;

  var circleFull = 2 * Math.PI;
  var circleStep = circleFull / numSeats;

  function getPosition(seat) {
    var angle = circleStep * seat.index;
    var cx = tableX + tableRadius * Math.cos(angle);
    var cy = tableY + tableRadius * Math.sin(angle);
    return [cx, cy];
  }

  d3.select("svg")
    .selectAll("circle")
    .data(seats)
    .enter()
    .append("circle")
    .attr("cx", function(d, i) {
      return getPosition(d)[0];
    })
    .attr("cy", function(d, i) {
      return getPosition(d)[1];
    })
    .attr("r", function(d, i) {
      return getRadius(d.population_size);
    })
    .style("fill", function(d, i) {
      return getColor(d);
    })
    .style("opacity", OPACITY);
}


function getRadius(population_size) {
  /*
   * Choose radius such that area equals population size.
   */
  return Math.sqrt(population_size / Math.PI);
}

function getColor(seat) {
  var color;
  if (seat.group == "herd")
    color = "blue"; // "#68513b";
  else if (seat.group == "pack")
    color = "red";
  else if (seat.group == "colony")
    color = "green";
  return color;
}


function updateTable(change, iteration) {
  d3.select("svg")
    .selectAll("circle")
    .transition()
    .duration(TRANSITION_DURATION)
    .delay(function(d, i) {
      var delay = iteration * TRANSITION_DURATION;
      return delay;
    })
    .ease(EASING_FXN)
    .attr("r", function(d, i) {
      return getRadius(change[d.id]);
    });
}


function drawCircle(cx, cy, r, color) {
  d3.select("svg")
    .append("circle")
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("r", r)
    .style("fill", color)
    .style("opacity", OPACITY);
}


function changeAllRadiiRandomly() {
    d3.selectAll("circle")
      .transition()
      .duration(1000)
      .ease(EASING_FXN)
      .attr("r", function() {
        return Math.random() * MAX_NODE_RADIUS;
      })
      .each("end", changeAllRadiiRandomly);
}


function colorAllCirclesRandomly() {
  var colors = d3.scale.category20();

  d3.selectAll("circle")
    .style("fill", function(d, i) {
      return colors(i);
    });
}
