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
    population: +d.Population / 1000000,
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

  // Axis Labels

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width / 2)
    .attr("y", height - margin.top)
    .style("font-weight", "bold")
    .style("font-size", "1.2rem")
    .text("Time (Years)");

  svg
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", -height / 2 + margin.left * 2)
    .attr("y", 30)
    .style("font-weight", "bold")
    .style("font-size", "1.2rem")
    .attr("transform", "rotate(-90)")
    .text("Population (Millions)");

  // Line Generator
  const lineGen = d3
    .line()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.population));

  // Group data by apps ----
  data = d3
    .groups(data, (d) => d.country)
    .map((d) => {
      return { country: d[0], population: d[1] };
    });

  // Filter for only top 5 countries

  const topFive = data
    .sort(
      (a, b) =>
        b.population.slice(-1)[0].population -
        a.population.slice(-1)[0].population
    )
    .slice(0, 5);

  // // Draw Graph ----------------------
  svg
    .selectAll(".line")
    .data(topFive)
    .join("path")
    .attr("class", "line")
    .attr("stroke", d3.scaleOrdinal(d3.schemeAccent))
    .attr("stroke-width", "3px")
    .attr("fill", "none")
    .attr("d", (d) => lineGen(d.population));

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
