const TRANSITION_DURATION = 1000;
const EASING_FXN = "easeOutCubic";
const MAX_NODE_RADIUS = 75;

const DEFAULT_SVG_WIDTH = 1200;
const DEFAULT_SVG_HEIGHT = 600;
const DEFAULT_NUM_RANDOM_CIRCLES = 20;
const DEFAULT_SEATS_PER_TABLE = 10;


function addSVG(width, height) {
  width = width || DEFAULT_SVG_WIDTH;
  height = height || DEFAULT_SVG_HEIGHT;
  d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
}


function createRandomCircles(numCircles) {
  numCircles = numCircles || DEFAULT_NUM_RANDOM_CIRCLES;
  svgWidth = d3.select("svg").attr("width");
  svgHeight = d3.select("svg").attr("height");

  for (i = 0; i < numCircles; i++) {
    d3.select("svg")
      .append("circle")
      .attr("cx", function() {
        return MAX_NODE_RADIUS + Math.random()*(svgWidth - 2*MAX_NODE_RADIUS);
      })
      .attr("cy", function() {
        return MAX_NODE_RADIUS + Math.random()*(svgHeight - 2*MAX_NODE_RADIUS);
      });
  }
}


function createTwoCirclesOfCircles() {
  svgWidth = d3.select("svg").attr("width");
  svgHeight = d3.select("svg").attr("height");

  var outerX1 = svgWidth / 4;
  var outerX2 = 3 * svgWidth / 4;
  var outerY = svgHeight / 2;
  var outerRadius = Math.min(svgWidth, svgHeight) / 2 - 2*MAX_NODE_RADIUS;

  createCircleOfCircles(outerX1, outerY, outerRadius);
  createCircleOfCircles(outerX2, outerY, outerRadius);
}


function createCircleOfCircles(outerX, outerY, outerRadius, numCircles) {
  var numCircles = numCircles || DEFAULT_SEATS_PER_TABLE;
  var circleEnd = 2 * Math.PI
  var circleStep = circleEnd / numCircles

  for (i = 0; i < circleEnd; i += circleStep) {
    innerX = outerX + outerRadius * Math.cos(i);
    innerY = outerY + outerRadius * Math.sin(i);

    d3.select("svg")
      .append("circle")
      .attr("cx", innerX)
      .attr("cy", innerY);
  }
}


function colorCircles(color) {
  var colors = d3.scale.category20();

  var circle = d3.selectAll("circle")
    .style("fill", function(d, i) {
      return colors(i);
    })
    .style("opacity", 0.5);

}


function changeCircleRadius() {
    d3.selectAll("circle")
      .transition()
      .duration(TRANSITION_DURATION)
      .ease(EASING_FXN)
      .attr("r", function() {
        return Math.random() * MAX_NODE_RADIUS;
      })
      .each("end", changeCircleRadius);
}
