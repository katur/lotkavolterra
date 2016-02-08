const SVG_WIDTH = 1200;
const SVG_HEIGHT = 600;
const MAX_RADIUS = 75;
const NUM_RANDOM_CIRCLES = 20;
const TRANSITION_DURATION = 500;
const EASING_FXN = "easeOutCubic";


window.onload = function() {
  var page = d3.select("body").attr("id");

  if (page == "d3-random-circles") {
    addSVG();
    createRandomCircles();
    colorCircles();
    changeCircleRadius();
  }

  if (page == "d3-circles-of-circles") {
    addSVG();
    createCirclesOfCircles();
    colorCircles();
    changeCircleRadius();
  }
}


function addSVG() {
  d3.select("body")
    .append("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT);
}


function createCirclesOfCircles() {
  var tableX1 = SVG_WIDTH / 4;
  var tableX2 = 3 * SVG_WIDTH / 4;
  var tableY = SVG_HEIGHT / 2;
  var tableRadius = Math.min(SVG_WIDTH, SVG_HEIGHT) / 2 - 2*MAX_RADIUS

  createCircleOfCircles(tableX1, tableY, tableRadius);
  createCircleOfCircles(tableX2, tableY, tableRadius);
}


function createCircleOfCircles(tableX, tableY, tableRadius) {
  var circleEnd = 2 * Math.PI
  var circleStep = 0.2 * Math.PI

  for (i = 0; i < circleEnd; i += circleStep) {
    x = tableX + tableRadius * Math.cos(i);
    y = tableY + tableRadius * Math.sin(i);

    d3.select("svg")
      .append("circle")
      .attr("cx", x)
      .attr("cy", y);
  }
}


function createRandomCircles() {
  for (i = 0; i < NUM_RANDOM_CIRCLES; i++) {
    d3.select("svg")
      .append("circle")
      .attr("cx", function() {
        return MAX_RADIUS + Math.random() * (SVG_WIDTH - 2*MAX_RADIUS);
      })
      .attr("cy", function() {
        return MAX_RADIUS + Math.random() * (SVG_HEIGHT - 2*MAX_RADIUS);
      });
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
        return Math.random() * 75;
      })
      .each("end", changeCircleRadius);
}
