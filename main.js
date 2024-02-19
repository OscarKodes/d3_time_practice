// CONSTANTS ####################################
const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.8,
  margin = {
    top: 25,
    bottom: 75,
    left: 75,
    right: 150,
  };

// LOAD DATA ####################################
d3.csv("practice_data.csv", (d) => {
  return {
    country: d.Entity,
    year: new Date(+d.Year, 0, 1),
    population: +d.Population,
  };
}).then((data) => {
  console.log(data);

  // SCALES ====================================

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.year))
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.population))
    .range([height - margin.bottom, margin.top]);

  //   const colorArr = ["#ff6a33", "yellow", "purple"];
  //   const colorScale = d3.scaleOrdinal().range(colorArr);

  // HTML ELEMENTS #############################

  // Create SVG

  const svg = d3
    .select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "lavender");

  // Axis Ticks
  const xAxis = d3.axisBottom(xScale);

  svg
    .append("g")
    .attr("transform", `translate(${0}, ${height - margin.bottom})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("transform", `translate(${margin.left - 1}, ${0})`)
    .call(yAxis);

  //   // Axis Labels
  //   svg.append("text")
  //     .attr("text-anchor", "end")
  //     .attr("x", width / 2)
  //     .attr("y", height - margin.top)
  //     .style("font-weight", "bold")
  //     .style("font-size", "1.2rem")
  //     .text("Time (Years)");

  //   svg.append("text")
  //     .attr("text-anchor", "end")
  //     .attr("x", -height / 2 + margin.left * 2)
  //     .attr("y", 30)
  //     .style("font-weight", "bold")
  //     .style("font-size", "1.2rem")
  //     .attr("transform", "rotate(-90)")
  //     .text("Search Interest Relative to Highest Point");

  // Area Generator
  const areaGen = d3
    .area()
    .x((d) => xScale(d.year))
    .y0(height - margin.bottom)
    .y1((d) => yScale(d.population));

  // Group data by apps ----
  data = d3
    .groups(data, (d) => d.country)
    .map((d) => {
      return { country: d[0], population: d[1] };
    });

  // // Draw Graph ----------------------
  svg
    .selectAll(".area")
    .data(data)
    .join("path")
    .attr("class", "area")
    .attr("stroke", "black")
    .attr("fill", d3.scaleOrdinal(d3.schemeAccent))
    .attr("opacity", 0.5)
    .attr("d", (d) => areaGen(d.population));

  //   svg.selectAll(".area")
  //     .data(appData)
  //     .join(
  //       enter => enter
  //       .append("path")
  //         .attr("class", "area")
  //         .attr("opacity", 0)
  //         .attr("stroke", "black")
  //         .attr("fill", d => colorScale(d.app))
  //       .call(enter => enter
  //         .transition()
  //           .duration(2000)
  //           .delay((_, i) => i * 500)
  //           .attr("d", d => areaGen(d.searches))
  //           .attr("opacity", 0.85))
  //     )

  //   // Legend -------------------------

  //   // Title for search Legend
  //   svg.append("text")
  //     .text("Searched Word:")
  //     .attr("x", width - margin.right * .8)
  //     .attr("y", 210)
  //     .style("font-size", "1rem")
  //     .style("font-weight", "bold")

  //   // Color boxes for search Legend
  //   svg.selectAll(".legend-box")
  //     .data(colorArr)
  //     .join("rect")
  //     .attr("class", "legend-box")
  //     .attr("x", width - margin.right * .6 - 10)
  //     .attr("y", (_, i) => 230 + i * 20)
  //     .attr("width", 10)
  //     .attr("height", 10)
  //     .style("fill", d => d)
  //     .attr("stroke", "black")

  //   // Labels for search legend
  //   svg.selectAll(".legend-search")
  //     .data(["Tinder", "Bumble", "Okcupid"])
  //     .join("text")
  //     .attr("class", "legend-search")
  //     .attr("x", width - margin.right / 2 - 10)
  //     .attr("y", (_, i) => 235 + i * 20)
  //     .text(d => d)
  //     .style("font-size", "15px")
  //     .attr("alignment-baseline","middle")
});
