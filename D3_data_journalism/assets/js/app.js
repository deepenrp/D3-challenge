// svg container
var svgHeight = 600;
var svgWidth = 800;

// margins
var margin = {
  top: 50,
  right: 50,
  bottom: 125,
  left: 125
};

// chart area minus margins
var chartHeight = svgHeight - margin.top - margin.bottom;
var chartWidth = svgWidth - margin.left - margin.right;

// create svg container
var svg = d3.select("#scatter").append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// shift everything over by the margins
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Import Data
// Load data for D3 Journalism data
d3.csv("assets/data/data.csv").then(function(censusData) {

  // Data
  console.log(censusData);

  // Parse Data/Cast as numbers
    // ==============================
    censusData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
    });

  // Create scale functions
    // ==============================
  
    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.healthcare) -2, d3.max(censusData, d => d.healthcare) + 2])
    .range([chartHeight, 0]);
    
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d.poverty) - 1, d3.max(censusData, d => d.poverty) + 1])
      .range([0, chartWidth]);

  // Step 3: Create axis functions
    // ==============================
    var yAxis = d3.axisLeft(yLinearScale);
    var xAxis = d3.axisBottom(xLinearScale);
    
  // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

  // Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("r", "10")
      .attr("class", "stateCircle")
      .attr("stroke", "black");


  // Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([0, 0])
      .html(function(d) {
        return (`<strong>${d.state}</br></br>Lacks Healthcare (%):</br>${d.healthcare}</br></br>Poverty (%):</br> ${d.poverty}<strong>`);
      });

  // Create tooltip in the chart
  // ==============================
    svg.call(toolTip);

  // Create event listeners to display and hide the tooltip
  // ==============================
    // mouseclick event
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    });
    // onmouseover event
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    });
    // onmouseout event
    circlesGroup.on("mouseout", function(data) {
      toolTip.hide(data, this);
    });

  // Create axes labels
  // ==============================
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty (%)");

    // State Abbreviation in the Cirles
    chartGroup.append("text")
      .attr("class", "stateText")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .selectAll("tspan")
      .data(censusData)
      .enter()
      .append("tspan")
      .attr("x", function(data) {
          return xLinearScale(data.poverty);
      })
      .attr("y", function(data) {
          return yLinearScale(data.healthcare -0.2);
      })
      .text(function(data) {
          return data.abbr
      });




  // ================================================================



//   var obesity = data.map(data => data.obesity);
//   console.log("obesity", obesity);

//   var smokes = data.map(data => data.smokes);
//   console.log("smokes", smokes);

//   var healthcare = data.map(data => data.healthcare);
//   console.log("healthcare", healthcare);

//   var poverty = data.map(data => data.poverty);
//   console.log("poverty", poverty);

//   var age = data.map(data => data.age);
//   console.log("age", age);

//   var income = data.map(data => data.income);
//   console.log("income", income);

//   // Data Arrays and Categories
//   var dataArray = [obesity, smokes, healthcare, poverty, age, income];
//   console.log(dataArray)
//   var dataCategories = ["obesity", "smokes", "healthcare", "poverty", "age", "income"];
//   console.log(dataCategories)

// // ---------------------------------------------------



    
}).catch(function(error) {
  console.log(error);

});
