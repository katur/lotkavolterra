const DEMO_SVG_WIDTH = 1200;
const DEMO_SVG_HEIGHT = 600;
const DEMO_MAX_NODE_RADIUS = 75;
const DEMO_TRANSITION_DURATION = 2000;
const DEMO_EASING_FXN = "easeOutCubic";
const DEMO_OPACITY = 0.5;


function createSVG() {
  d3.select("body")
    .append("svg")
    .attr("width", DEMO_SVG_WIDTH)
    .attr("height", DEMO_SVG_HEIGHT);
}


function drawRandomCircles(numCircles) {
  var r = DEMO_MAX_NODE_RADIUS;

  var cx, cy;
  for (i = 0; i < numCircles; i++) {
    cx = Math.random() * (DEMO_SVG_WIDTH - 2*r) + r;
    cy = Math.random() * (DEMO_SVG_HEIGHT - 2*r) + r;
    drawCircle(cx, cy);
  }

  colorAllCirclesRandomly();
  changeAllRadiiRandomly();
}


function drawCirclesOfCircles(circlesPerCircle) {
  var r = DEMO_MAX_NODE_RADIUS;
  var outerX1 = DEMO_SVG_WIDTH / 4;
  var outerX2 = 3 * DEMO_SVG_WIDTH / 4;
  var outerY = DEMO_SVG_HEIGHT / 2;
  var outerRadius = Math.min(DEMO_SVG_WIDTH, DEMO_SVG_HEIGHT)/2 - 2*r;

  drawCircleOfCircles(outerX1, outerY, outerRadius, circlesPerCircle);
  drawCircleOfCircles(outerX2, outerY, outerRadius, circlesPerCircle);

  colorAllCirclesRandomly();
  changeAllRadiiRandomly();
}


function drawCircleOfCircles(outerX, outerY, outerRadius, numCircles) {
  var circleEnd = 2 * Math.PI
  var circleStep = circleEnd / numCircles

  var innerX, innerY;
  for (var i = 0; i < circleEnd; i += circleStep) {
    innerX = outerX + outerRadius * Math.cos(i);
    innerY = outerY + outerRadius * Math.sin(i);
    drawCircle(innerX, innerY);
  }
}


function drawCircle(cx, cy, r, color) {
  d3.select("svg")
    .append("circle")
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("r", r)
    .style("fill", color)
    .style("opacity", DEMO_OPACITY);
}


function changeAllRadiiRandomly() {
  d3.selectAll("circle")
    .transition()
    .duration(DEMO_TRANSITION_DURATION)
    .ease(DEMO_EASING_FXN)
    .attr("r", function() {
      return Math.random() * DEMO_MAX_NODE_RADIUS;
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
