var d3 = require("d3");


function drawRandomCircles(params) {
  var svg = d3.select("svg");

  // Calculate svg height from width.
  var svgWidth = parseInt(svg.style("width"), 10);
  var hwRatio = 1/2;
  var svgHeight = svgWidth * hwRatio;
  svg.attr("height", svgHeight);

  // Calculate the space each table can take up in both x and y dimensions.
  var tableSpace = svgWidth / 8
  var tableRadius = tableSpace * 1/3;

  var seats = [];
  for (var i = 0; i < params.numCircles; i++) {
    seats.push(i);
  }

  // Add the circle elements.
  var circles = svg.selectAll("circle")
    .data(seats)
    .enter()
    .append("circle")
    .each(function(d, i) {
      d3.select(this)
        .attr("cx", Math.random() * svgWidth)
        .attr("cy", Math.random() * svgHeight)
        .attr("r", Math.random() * 30);
    });
}


function updateRandomCircles() {
  var svg = d3.select("svg");
  var circles = svg.selectAll("circle")
    .transition()
    .duration(500)
    .ease("linear")
    .attr("r", function(d) {
      return Math.random() * 30;
    })
    .each("end", function(d, i) {
      if (i === 0) {
        console.log("Starting over");
        updateRandomCircles();
      }
    });
}

module.exports = {
  drawRandomCircles: drawRandomCircles,
  updateRandomCircles: updateRandomCircles
};
