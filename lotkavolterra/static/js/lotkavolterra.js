const TRANSITION_DURATION = 500;
const EASING_FXN = "easeOutCubic";
const OPACITY = 0.5;
const CIRCLE_FULL = 2 * Math.PI;


function drawTable(tableX, tableY, tableRadius, seats) {
  // The angle step between each of the seats
  var step = CIRCLE_FULL / seats.length;

  // Create and position wrapper group elements (g tags)
  var elem = d3.select("svg")
    .selectAll("g")
    .data(seats)
    .enter()
    .append("g")
    .attr("transform", function(d) {
      coords = getCoordinates({
        index: d.index,
        step: step,
        tableX: tableX,
        tableY: tableY,
        tableRadius: tableRadius,
      });
      return "translate("+coords[0]+","+coords[1]+")"
    });

  // Add the circles
  elem.append("circle")
    .attr("r", function(d, i) {
      return getRadius(d.population_size);
    })
    .style("fill", function(d, i) {
      return getColor(d.group);
    })
    .style("opacity", OPACITY)
    .text(function(d, i) {
      return d.name;
    });

  // Add the text
  elem.append("text")
    .text(function(d, i){
      return d.name;
    })
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .attr("font-size", "10");
}


function updateTable(change, iteration) {
  d3.select("svg")
    .selectAll("circle")
    .transition()
    .duration(TRANSITION_DURATION)
    .delay(function(d, i) {
      return iteration * TRANSITION_DURATION;
    })
    .ease(EASING_FXN)
    .attr("r", function(d, i) {
      return getRadius(change[d.pk]);
    });
}


function getCoordinates(params) {
  var angle = params.index * params.step;
  var cx = params.tableX + params.tableRadius * Math.cos(angle);
  var cy = params.tableY + params.tableRadius * Math.sin(angle);
  return [cx, cy];
}



function getRadius(population_size) {
  /*
   * Calculate radius such that area reflects population size.
   */
  return Math.sqrt(population_size / Math.PI) * 3;
}


function getColor(group) {
  /*
   * Get the color of a particular group.
   */
  var color;
  if (group == "herd")
    color = "green";
  else if (group == "pack")
    color = "red";
  else if (group == "colony")
    color = "blue";
  return color;
}
