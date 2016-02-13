const TRANSITION_DURATION = 1000;
const EASING_FXN = "easeOutCubic";
const OPACITY = 0.5;
const MAX_NODE_RADIUS = 75;

const DEFAULT_SVG_WIDTH = 1200;
const DEFAULT_SVG_HEIGHT = 600;
const DEFAULT_NUM_RANDOM_CIRCLES = 20;
const DEFAULT_SEATS_PER_TABLE = 10;

////////////////
// Test cases //
////////////////

function createRandomCircles(numCircles) {
  var numCircles = numCircles || DEFAULT_NUM_RANDOM_CIRCLES;
  var svgWidth = DEFAULT_SVG_WIDTH;
  var svgHeight = DEFAULT_SVG_HEIGHT;

  createSVG(svgWidth, svgHeight);

  for (i = 0; i < numCircles; i++) {
    var cx = Math.random() * (svgWidth - 2*MAX_NODE_RADIUS) + MAX_NODE_RADIUS;
    var cy = Math.random() * (svgHeight - 2*MAX_NODE_RADIUS) + MAX_NODE_RADIUS;
    createCircle(cx, cy);
  }

  colorAllCirclesRandomly();
  changeAllRadiiRandomly();
}


function createTwoCirclesOfCircles() {
  var svgWidth = DEFAULT_SVG_WIDTH;
  var svgHeight = DEFAULT_SVG_HEIGHT;
  createSVG(svgWidth, svgHeight);

  var outerX1 = svgWidth / 4;
  var outerX2 = 3 * svgWidth / 4;
  var outerY = svgHeight / 2;
  var outerRadius = Math.min(svgWidth, svgHeight) / 2 - 2*MAX_NODE_RADIUS;

  createCircleOfCircles(outerX1, outerY, outerRadius);
  createCircleOfCircles(outerX2, outerY, outerRadius);

  colorAllCirclesRandomly();
  changeAllRadiiRandomly();
}


function createSVG(width, height) {
  var width = width || DEFAULT_SVG_WIDTH;
  var height = height || DEFAULT_SVG_HEIGHT;
  d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
}


function createCircleOfCircles(outerX, outerY, outerRadius, numCircles) {
  var numCircles = numCircles || DEFAULT_SEATS_PER_TABLE;
  var circleEnd = 2 * Math.PI
  var circleStep = circleEnd / numCircles

  for (i = 0; i < circleEnd; i += circleStep) {
    var innerX = outerX + outerRadius * Math.cos(i);
    var innerY = outerY + outerRadius * Math.sin(i);
    createCircle(innerX, innerY);
  }
}


function createCircle(cx, cy, color) {
  d3.select("svg")
    .append("circle")
    .attr("cx", cx)
    .attr("cy", cy)
    .style("fill", color)
    .style("opacity", OPACITY);
}


function colorAllCirclesRandomly() {
  var colors = d3.scale.category20();

  d3.selectAll("circle")
    .style("fill", function(d, i) {
      return colors(i);
    });
}


function changeAllRadiiRandomly() {
    d3.selectAll("circle")
      .transition()
      .duration(TRANSITION_DURATION)
      .ease(EASING_FXN)
      .attr("r", function() {
        return Math.random() * MAX_NODE_RADIUS;
      })
      .each("end", changeAllRadiiRandomly);
}
