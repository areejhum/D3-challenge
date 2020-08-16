// @TODO: YOUR CODE HERE!
var svgWidth = 960; 
var svgHeight = 910; 

var margin = {
  top: 20,
  right: 40, 
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
 
// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Initial Params
var chosenXAxis = "healthcare";
var chosenYAxis = "poverty";

//Function for Updating x-scale Variable
function xScale(acsData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(acsData, d => d[chosenXAxis] * 0.8),
        d3.max(acsData, d=> d[chosenXAxis] * 1.0)
    ])
    .range([0, width]);

return xLinearScale;
}

//Function for Updating y-scale Variable
function yScale(acsData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(acsData, d => d[chosenYAxis] * 0.8),
        d3.max(acsData, d=> d[chosenYAxis] * 1.0)
    ])
    .range([width, 0]);

return yLinearScale;
}

//Function for Updating xAxis 
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis
}

//Function for Updating yAxis
function renderyAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis
}

//Function for Updating Circles on xAxis
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
    
    return circlesGroup;
}

//Function for Updating Circles on yAxis
function renderyCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));
          
    return circlesGroup;
}


// // Function for Updating Tooltip
// function updateToolTip(chosenXAxis, circlesGroup) {
//     if (chosenXAxis === "healthcare") {
//         var label = "Healthcare (%)";
//     }
//     else {
//         var label = "Obesity (%)";
//     }

//     var toolTip = d3.tip()
//     .attr("class", "d3-tip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
//     });

// circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {  
//       toolTip.hide(data);
//     });

//   return circlesGroup;
// }


// Import Data
d3.csv("assets/data/Data.csv").then(function(acsData) {

    // Step 1: Parse data
    // ==============================
    acsData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.obesity = +data.obesity;
      data.income = +data.income;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = xScale(acsData, chosenXAxis);
    var yLinearScale = yScale(acsData, chosenYAxis);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(0, 0)`) //**********Y-AXIS***********//
    .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(acsData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis])) 
    .attr("r", "12")
    .attr("fill", "blue")
    .attr("opacity", ".5")
    .attr("class", "stateInitials");

    // Circle Labels
    var circlesText = chartGroup.selectAll("stateInitials")
      .data(acsData)
      .enter()
      .append("text")
      .text(function (d) {
        return d.abbr;
      })
      .attr("x", function (d) {
        return xLinearScale(d[chosenXAxis]);
      })
      .attr("y", function (d) {
        return yLinearScale(d[chosenYAxis]);     
      })
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("fill", "white");

    // Create Group for 2 x-axis labels
    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

      var healthcareLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Healthcare (%)");

      var obesityLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obesity (%)");

    var labelsyGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)")
    .attr("y", - margin.left) 
    .attr("x", - height / 2) 
    .attr("dy", "1em")
    .classed("axis-text", true);

        var povertyLabel = labelsyGroup.append("text")
        .attr("x", -200)
        .attr("y", -70)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("Poverty (%)");

        var incomeLabel = labelsyGroup.append("text")
        .attr("x", -200)
        .attr("y", -50)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Income ($)");

// updateToolTip function above csv import
//  var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

 // x axis labels event listener
 labelsGroup.selectAll("text")
   .on("click", function() {
     // get value of selection
     var value = d3.select(this).attr("value");
     if (value !== chosenXAxis) {

       // replaces chosenXAxis with value
       chosenXAxis = value;
       // console.log(chosenXAxis)

       // functions here found above csv import
       // updates x scale for new data
       xLinearScale = xScale(acsData, chosenXAxis);

       // updates x axis with transition
       xAxis = renderAxes(xLinearScale, xAxis);

       // updates circles with new x values
       circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

       // updates circle labels
       var newCirclesText = chartGroup.selectAll("stateInitials")
       .data(acsData)
       .enter()
       .append("text")
       .text(function (d) {
         return d.abbr;
       })
       .attr("x", function (d) {
         return xLinearScale(d[chosenXAxis]);
       })
       .attr("y", function (d) {
         return yLinearScale(d[chosenYAxis]);
       })
       .attr("font-size", "10px")
       .attr("text-anchor", "middle")
       .attr("fill", "white");

       // updates tooltips with new info
      //  circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

       // changes classes to change bold text
       if (chosenXAxis === "healthcare") {
         healthcareLabel
           .classed("active", true)
           .classed("inactive", false);
         obesityLabel
           .classed("active", false)
           .classed("inactive", true);
       }
       else {
         healthcareLabel
           .classed("active", false)
           .classed("inactive", true);
         obesityLabel
           .classed("active", true)
           .classed("inactive", false);
       }
     }
   });

// y-axis labels event listener
labelsyGroup.selectAll("text")
   .on("click", function() {
     // get value of selection
     var value = d3.select(this).attr("value");
     if (value !== chosenYAxis) {

       // replaces chosenXAxis with value
       chosenYAxis = value;

       // console.log(chosenXAxis)

       // functions here found above csv import
       // updates x scale for new data
       yLinearScale = yScale(acsData, chosenYAxis);

       // updates x axis with transition
       yAxis = renderyAxes(yLinearScale, yAxis);

       // updates circles with new x values
       circlesGroup = renderyCircles(circlesGroup, yLinearScale, chosenYAxis);

       // updates circle labels
       var newCirclesText = chartGroup.selectAll("stateInitials")
       .data(acsData)
       .enter()
       .append("text")
       .text(function (d) {
         return d.abbr;
       })
       .attr("x", function (d) {
         return xLinearScale(d[chosenXAxis]);
       })
       .attr("y", function (d) {
         return yLinearScale(d[chosenYAxis]);
       })
       .attr("font-size", "10px")
       .attr("text-anchor", "middle")
       .attr("fill", "white");

       // updates tooltips with new info
      //  circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

       // changes classes to change bold text
       if (chosenYAxis === "poverty") {
         povertyLabel
           .classed("active", true)
           .classed("inactive", false);
         incomeLabel
           .classed("active", false)
           .classed("inactive", true);
       }
       else {
         povertyLabel
           .classed("active", false)
           .classed("inactive", true);
         incomeLabel
           .classed("active", true)
           .classed("inactive", false);
       }
     }
   });

  }).catch(function(error) {
    console.log(error);
  });

