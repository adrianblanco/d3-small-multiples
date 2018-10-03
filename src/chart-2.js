import * as d3 from 'd3'

// Set up margin/height/width
var margin = { top: 30, left: 30, right: 0, bottom: 30 }

var height = 130 - margin.top - margin.bottom
var width = 70 - margin.left - margin.right

// I'll give you the container
var container = d3.select('#chart-2')

// Create your scales
var xPositionScale = d3
  .scaleLinear()
  .domain([12, 55])
  .range([0, width])

var yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.3])
  .range([height, 0])

// Create a d3.line function that uses your scales
var area = d3
  .area()
  .x(d => xPositionScale(d.Age))
  .y0(height) //y0
// the two lines share the same x-value which is the time 
// series value. However, the y-values differ by y0 and y1
// the area simultaneously draws two y coordinates, y0 and y1

// Read in your data
d3.csv(require('./data/fertility.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

// Build your ready function that draws lines, axes, etc
function ready(datapoints) {
  var nested = d3
    .nest()
    .key(function(d) {
      return d.Year
    })
    .entries(datapoints)

  container
    .selectAll('.small-multiples') // Create a class
    .data(nested)
    .enter()
    .append('svg')
    .attr('class', 'small-multiples')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .each(function(d) {
      var svg = d3.select(this)

      // USA
      // d3.area can only use ONE column name
      area.y1(d => yPositionScale(d.ASFR_us)) //y1
      svg
        .append('path')
        .datum(d.values)
        .attr('d', area)
        .attr('fill', '#0B485B')
        .attr('opacity', 0.6)
        .lower()

      // Japan
      area.y1(d => yPositionScale(d.ASFR_jp)) //y1
      svg
        .append('path')
        .datum(d.values)
        .attr('d', area)
        .attr('fill', '#EE0D3E')
        .attr('opacity', 0.6)

      // Year label
      svg
        .append('text')
        .text(d.key)
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .attr('dy', -10)

      // add total fertility rates by year
      var datapoints = d.values
      var ASFR_jpList = datapoints.map(d => +d.ASFR_jp)
      var ASFR_usList = datapoints.map(d => +d.ASFR_us)
      // console.log(d3.sum(ASFR_jpList).toFixed(2))

      // Japan Fertility rates
      svg
        .append('text')
        .datum(datapoints)
        .text(d3.sum(ASFR_jpList).toFixed(2))
        .attr('x', width)
        .attr('y', yPositionScale(0.2))
        .attr('font-size', 10)
        .attr('fill', '#EE0D3E')
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'hanging')

      // US Fertility rates
      svg
        .append('text')
        .datum(datapoints)
        .text(d3.sum(ASFR_usList).toFixed(2))
        .attr('x', width)
        .attr('y', yPositionScale(0.2))
        .attr('font-size', 10)
        .attr('fill', '#0B485B')
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'ideographic')

      // add x and y axis on each.
      var xAxis = d3.axisBottom(xPositionScale).tickValues([15, 30, 45])
      svg
        .append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)

      var yAxis = d3.axisLeft(yPositionScale).ticks(4)
      
      svg
        .append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)
    })
}
//export { xPositionScale, yPositionScale, width, height, area }
