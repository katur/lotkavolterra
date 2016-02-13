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

function drawRandomCircles(numCircles) {
  var numCircles = numCircles || DEFAULT_NUM_RANDOM_CIRCLES;
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


function drawCircleOfCircles(outerX, outerY, outerRadius, nodes) {
  var numCircles = nodes.length || DEFAULT_SEATS_PER_TABLE;
  var circleEnd = 2 * Math.PI
  var circleStep = circleEnd / numCircles

  var innerX, innerY, node, color;
  var nodeCounter = 0;
  for (i = 0; i < circleEnd; i += circleStep) {
    innerX = outerX + outerRadius * Math.cos(i);
    innerY = outerY + outerRadius * Math.sin(i);
    node = nodes[nodeCounter];
    drawCircle(innerX, innerY, getGroupColor(node));
    nodeCounter++;
  }
}


function getGroupColor(node) {
  var color;
  if (node.group == "herd")
    color = "brown";
  else if (node.group == "pack")
    color = "gray";
  else if (node.group == "colony")
    color = "green";
  return color;
}

function drawCircle(cx, cy, color) {
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
