//Taken from http://bl.ocks.org/phil-pedruco/88cb8a51cdce45f13c7e
//setting up empty data array
let data = [];
let points = [];

getData(); // popuate data

// line chart based on http://bl.ocks.org/mbostock/3883245
let margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

let x = d3.scale.linear()
    .range([0, width]);

let y = d3.scale.linear()
    .range([height, 0]);

let xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

let yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

let line = d3.svg.line()
    .x(function(d) {
        return x(d.q);
    })
    .y(function(d) {
        return y(d.p);
    });

//Custom code
let line2 = d3.svg.line()
  .x(function(d) {
    return x(d.q);
  })
  .y(function(d) {
    return y(d.o);
  })
//

//Taken from http://bl.ocks.org/jacobw56/2fd529120462c8ee044bccc3b0836547
let area = d3.svg.area()
  .x(function(d) { if(x(d.q)>445) return x(d.q); return x(0);})
  .y0(450)
  .y1(function(d) { return y(d.p); });

let area1 = d3.svg.area()
  .x(function(d) { if(x(d.q)<=445) return x(d.q); return x(0);})
  .y0(450)
  .y1(function(d) { return y(d.p); });

let svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(d3.extent(data, function(d) {
    return d.q;
}));
y.domain(d3.extent(data, function(d) {
    return d.p;
}));

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// svg.append("g")
//     .attr("class", "y axis")
//     .call(yAxis);

svg.append("path")
  .datum(data)
  .attr("class", "area")
  .attr("d", area);

svg.append("path")
  .datum(data)
  .attr("class", "area1")
  .attr("d", area1);

svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line)


//Custom code
svg.append("path")
    .datum(data)
    .attr("class", "line1")
    .attr("d", line2)
    .attr("d", area);

//Taken from https://www.dashingd3js.com/svg-paths-and-d3js
let lineFunction = d3.svg.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; })
  .interpolate("linear");



function getData() {

// loop to populate data array with
// probabily - quantile pairs
for (let i = 0; i < 100000; i++) {
  /*y*/  q = normal() // calc random draw from normal dist
  /*x*/  p = gaussian(q) // calc prob of rand draw
  /*x*/  o = gaussian(q, 1) // calc prob of rand draw with mean = 1, custom code
    el = {
        "q": q,
        "p": p,
        "o": o
    }
    //P is unshifted mean
    //O is shifted mean
    // if(p>0.5) {
    //   console.log("This happened...")
    //   let point = [{"x": p, "y": q}, {"x": p, "y": 0}];
    //   svg.append("path")
    //     .attr("d", linefunction(points))
    //     .attr("stroke", "red")
    //     .attr("stroke-width", 2)
    //     .attr("fill", none);
    // }
    data.push(el)
};

// need to sort for plotting
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
data.sort(function(x, y) {
    return x.q - y.q;
});
console.log(data)
}

// from http://bl.ocks.org/mbostock/4349187
// Sample from a normal distribution with mean 0, stddev 1.
function normal() {
    let x = 1,
        y = 0,
        rds, c;
    do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        rds = x * x + y * y;
    } while (rds == 0 || rds > 1);
    c = Math.sqrt(-2 * Math.log(rds) / rds); // Box-Muller transform
    return x * c; // throw away extra sample y * c
}

//taken from Jason Davies science library
// https://github.com/jasondavies/science.js/
function gaussian(x, m=0) {
	let gaussianConstant = 1 / Math.sqrt(2 * Math.PI),
		mean = m,
    	sigma = 1;

    x = (x - mean) / sigma;
    return gaussianConstant * Math.exp(-.5 * x * x) / sigma;
};
