import * as d3 from 'd3'

// I'll give you margins/height/width
var margin = { top: 100, left: 10, right: 10, bottom: 30 }
var height = 500 - margin.top - margin.bottom
var width = 400 - margin.left - margin.right

// And grabbing your container
var container = d3.select('#chart-4')

// Create your scales

// x scale
var xPositionScale = d3
  .scaleLinear()
  .domain([-6, 6])
  .range([0, width])

//var MaxFrequency = d3.max(freq)
// the domain will need to wait until 
// after you've read in your data. 

// y scale
var yPositionScale = d3
  .scaleLinear()
  //.domain([0, MaxFrequency])
  // the domain will need to wait until 
  // after you've read in your data. 
  .range([height, 0])

// Create your area generator

// Read in your data, then call ready
d3.tsv(require('./data/climate-data.tsv'))
  .then(ready)
  .catch(err => {
    console.log('Failed with', err)
  })

// Write your ready function

function ready(datapoints) {
  console.log('datapoints chart 4', datapoints)

  var filtered = datapoints.filter(function(d) {
    return d.year === '1951'
  })

  // the console.log hast to be out of the function
  console.log('filtered 1951', filtered)
  // 241 datapoints, yay! 


//svg1951 

//svg1983

//svg1994

//svg2005

}

export {  }