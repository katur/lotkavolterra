const NUM_CIRCLES = 3;
const TRANSITION_DURATION = 500;
const EASING_FXN = "easeOutCubic";


window.onload = function() {
  var page = d3.select("body").attr("id");

  if (page == "test_d3") {
    createCircles();
    changeCircleRadius();
  }
}


function createCircles() {
  colorCircles();
}


function colorCircles(color) {
  var colors = d3.scale.category20();
  d3.selectAll("circle")
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
