const buildLine = (dataset) => {
	console.log("Building Line Chart!");
	const lineContainer = $("#lineContainer");
	const array = [];
	console.log(dataset);

	d3.csv("./test.csv").then(data => console.log(data));
}