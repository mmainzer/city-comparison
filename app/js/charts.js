let margin = { top: 20, right: 30, bottom: 30, left: 25 };
let height = $(window).height() * .32;
let width = $("#lineContainer").width();
width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;
let svg;
let x;
let y;


// Define the line
let line = d3.line()	
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.val); })
    .curve(d3.curveMonotoneX);



const buildLine = (dataset, width) => {

	// Set the ranges
	x = d3.scaleTime().range([0, width]);  
	y = d3.scaleLinear().range([height, 0]);

	// Adds the svg canvas
	svg = d3.select("#lineContainer")
	    .append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	        .attr("transform", 
	              "translate(" + margin.left + "," + margin.top + ")");

	let lineData = [];
	dataset.forEach( (element) => {

		let seriesID = element.seriesID;
		let geoid = [ seriesID.substr(3,15) ];

		let area = geoid.map(id => areas.find(({ prefix }) => prefix === id).area)[0];
		let state = geoid.map(id => areas.find(({ prefix }) => prefix === id).state)[0];
		let data = element.data;
		
		data.forEach( (element) => {
			let dataPoint = {
				area:area,
				state:state,
				month:element.period.substr(1,2),
				year:element.year,
				date:element.year+"-"+element.period.substr(1,2)+"-1",
				val:parseFloat(element.value)
			};
			lineData.push(dataPoint);
			
		});
	});

	lineData.forEach( (d) => {
		d.date = parseDate(d.date);
		d.val = +d.val;
	});

	// Scale the range of the data
    x.domain(d3.extent(lineData, function(d) { return d.date; }));
    y.domain([0, d3.max(lineData, function(d) { return d.val; })]);

	// Nest the entries by area
	let dataNest = d3.nest()
		.key((d) => {return d.area+" "+d.state;})
		.sortKeys(d3.descending)
		.entries(lineData);

	// set the colour scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    legendSpace = width/dataNest.length; // spacing for the legend

    dataNest.forEach( (d,i) => {

    	svg.append("path")
    		// .attr("class","line")
    		.attr("class", () => {return d.key+" line unemployment";})
    		.style("fill","none")
    		.style("stroke", () => {
    			if (d.key.slice(-2)==="GA") {return d.color = "#00bcf1";} else {return d.color = "#fdb714";}
    		})
    		.attr("d", line(d.values));

    });

    // Add the X Axis
    svg.append("g")
	      .attr("class", "axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(5));


}