const SVG_WIDTH = 1200;
const SVG_HEIGHT = 1200;
const MAX_RADIUS = 75;
const NUM_CIRCLES = 20;
const TRANSITION_DURATION = 500;
const EASING_FXN = "easeOutCubic";


window.onload = function() {
  var page = d3.select("body").attr("id");

  if (page == "d3_random_circles") {
    createCircles();
    changeCircleRadius();
  }
}


function createCircles() {
  d3.select("body")
    .append("svg")
    .attr("width", SVG_WIDTH)
    .attr("height", SVG_HEIGHT);

  for (i = 0; i < NUM_CIRCLES; i++) {
    d3.select("svg")
      .append("circle")
      .attr("cx", function() {
        return MAX_RADIUS + Math.random() * (SVG_WIDTH - 2*MAX_RADIUS);
      })
      .attr("cy", function() {
        return MAX_RADIUS + Math.random() * (SVG_HEIGHT - 2*MAX_RADIUS);
      });
  }

  colorCircles();
}


function colorCircles(color) {
  var colors = d3.scale.category20();

  var circle = d3.selectAll("circle")
    .style("fill", function(d, i) { return colors(i); });

}

function changeCircleRadius() {
    d3.selectAll("circle")
      .transition()
      .duration(TRANSITION_DURATION)
      .ease(EASING_FXN)
      .attr("r", function() { return Math.random() * 75; })
      .each("end", changeCircleRadius);
}
