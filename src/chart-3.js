import * as d3 from 'd3'

// Create your margins and height/width
var margin = { top: 30, left: 50, right: 30, bottom: 30 }

var height = 240 - margin.top - margin.bottom
var width = 180 - margin.left - margin.right

// I'll give you this part!
var container = d3.select('#chart-3')

// Create your scales

// x scale
var xPositionScale = d3
  .scaleLinear()
  .domain([1980, 2010])
  .range([0, width])

// y scale
var yPositionScale = d3
  .scaleLinear()
  .domain([0, 20000])
  .range([height, 0])

// Create your line generator
var line = d3
  .line()
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.income))

// Read in your data
Promise.all([
  d3.csv(require('./data/middle-class-income-usa.csv')),
  d3.csv(require('./data/middle-class-income.csv'))
])
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Create your ready function

function ready(datapoints) {
  // console.log('datapoints', datapoints)

  
  var datapointsUSA = datapoints[0]
  // console.log('datapoints', datapointsUSA)
  var datapointsWorld = datapoints[1]
  // console.log('datapointsOther', datapointsOther)

  var nested = d3
    .nest()
    .key(function(d) {
      return d.country
    })
    .entries(datapointsWorld)

  container
    .selectAll('.small-multiples')
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', '.small-multiples')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .each(function(d) {
      var svg = d3.select(this)

      var datapoints = d.values
      
      // Income
      svg
        .append('path')
        .datum(datapoints)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke-width', 3)
        .attr('stroke', '#95526d')


      // Labeling countries
      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('fill', '#95526d')
        .attr('font-size', 10)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .attr('dy', -10)

      // USA line
      svg
        .append('path')
        .datum(datapointsUSA)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke-width', 3)
        .attr('stroke', '#808080')

      // USA label
      svg
        .append('text')
        .text('USA')
        .attr('x', xPositionScale(1985))
        .attr('y', yPositionScale(16000))
        .attr('fill', '#808080')
        .attr('font-size', 10)
        .attr('text-anchor', 'middle')
        .attr('dy', -10)

      // x axis
      var xAxis = d3
        .axisBottom(xPositionScale)
        .ticks(4)
        .tickFormat(d3.format(''))
        .tickSize(-height)

      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)

      // y axis
      var yAxis = d3
        .axisLeft(yPositionScale)
        .ticks(4)
        .tickSize(-width)
        .tickFormat(d => {
          return '$' + d3.format(',')(d)
        })

      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)

      // x-axis text position
      svg
        .selectAll('.x-axis text')
        .attr('font-size', 8)
        .attr('dy', 10)

      // y-axis text position
      svg
        .selectAll('.y-axis text')
        .attr('font-size', 8)
        .attr('dx', 0)

      svg
        .selectAll('.axis line')
        .attr('stroke-dasharray', '1 3')
      
      svg
        .selectAll('.axis path')
        .remove()
      //svg.select('.y-axis g').remove()
    })
}
export { width, height, xPositionScale, yPositionScale, line }

