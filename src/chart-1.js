import * as d3 from 'd3'

// Set up margin/height/width
const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 300 - margin.top - margin.bottom
const width = 700 - margin.left - margin.right

// Add your svg
const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create a time parser (see hints)
// The time parser read the data from data src
// http://strftime.org/ 
var parseTime = d3.timeParse("%B-%y")

// // Create your scales
const xPositionScale = d3
  .scaleLinear()
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([1, 400])
  .range([height, 0])

// // Create a d3.line function that uses your scales

const line = d3
  .line()
  .x(d => {
    return xPositionScale(d.datetime)
  })
  .y(d => {
    return yPositionScale(d.price)
  })

// // Read in your housing price data
d3.csv(require('./data/housing-prices.csv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// // Write your ready function

function ready(datapoints) {
  // Convert your months to dates
  // Creates a new column called datetime
  	datapoints.forEach(d => {
		d.datetime = parseTime(d.month)
	})

	console.log(datapoints)

  // Get a list of dates and a list of prices
	let dates = datapoints.map(d => d.datetime)
	let prices = datapoints.map(d => +d.price)

	const dateMax = d3.max(dates)
  	const dateMin = d3.min(dates)

  	xPositionScale.domain([dateMin, dateMax])
  
  // Group your data together

  	const nested = d3.nest()
   		.key(d => {
     		return d.region
    	})
    	.entries(datapoints)

    console.log('nested data looks like', nested)


  // Draw your lines

	svg.selectAll('path')
    	.data(nested)
    	.enter()
    	.append('path')
    	.attr('stroke', 'blue')
    	.attr('stroke-width', 2)
    	.attr('fill', 'none')  //  d => return colorScale, etc
  		.attr('d', d => {
      		console.log("d", d)
      		return line(d.values) // in this case is values instead of line
    	})

  // Add your text on the right-hand side

  // Add your title 

  // Add the shaded rectangle

  // Add your axes
  const xAxis = d3.axisBottom(xPositionScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
