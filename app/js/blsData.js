const makeBlsCall = (series) => {

	  	console.log(series);

	  	const settings = {
		  "async": true,
		  "crossDomain": true,
		  // "url": "https://api.bls.gov/publicAPI/v2/timeseries/data/?registrationkey=2075e7710bca44038c4abc07eecee9d5",
		  "url": "https://api.bls.gov/publicAPI/v2/timeseries/data/?registrationkey=6aff0b6bece9458d9ecfb4cd10a3a375",
		  "method": "POST",
		  "headers": {
		    "Content-Type": "application/x-www-form-urlencoded"
		  },
		  "data": {
		    "seriesid": series,
		    "startyear":"2018",
		    "endyear":"2020",
		  }
		}

		$.ajax(settings).done( (data) => {
			data = data.Results.series;
			console.log(data);
			let unemployment = [];
			let laborForce = [];
			data.forEach( (element) => {
				let series = element.seriesID;
				if (series.endsWith('03') === true) {
					unemployment.push(element);
				} else {
					laborForce.push(element);
				}
			});
			$(".heading").show();
			//build the bans for display later
			// buildBans(laborForce, unemployment);
			// break down and rebuild the datatable
			buildBlsTable(laborForce, unemployment);
			// build the line chart for the labor force data
			buildLine(unemployment);

		});

}

const buildBlsTable = (datasetOne, datasetTwo) => {
		console.log("building table now");

	// first, empty the existing table of content
	// if Datatable currently exists, then clear and kill it
	if ( $.fn.dataTable.isDataTable('#blsTable') ) {
		$('#blsTable').DataTable().destroy();
	}

	// empty html of jobsTable
	$('#blsTable thead').empty();
  	$('#blsTable tbody').empty();

	let str = '<tr>';
	let headers = ['Area',"Last Year's Labor Force",'Current Labor Force',"Last Year's Unemployment Rate",'Current Unemployment Rate' ];

	headers.forEach(function(header) {
		str += '<th>' + header + '</th>';
	});

	str += '</tr>';

	$('#blsTable thead').html(str);

	console.log(datasetOne);
	console.log(datasetTwo);

	let arrayOne = [];
	let arrayTwo = [];
	let latestTotal = 0;
	let prevTotal = 0;
	let month = [];

	datasetOne.forEach(function(element) {
		let seriesID = element.seriesID;
		let geoid = [ seriesID.substr(3,15) ];
		console.log(seriesID);
		console.log(geoid);
		let area = geoid.map(id => areas.find(({ prefix }) => prefix === id).area)[0];
		let latest = Number(element.data[0].value);
		let previous = Number(element.data[12].value);
		let m = element.data[0].periodName;
		month.push(m);

		latestTotal += latest;
		prevTotal += previous;

		let obj = {
			area:area,
			geoid:geoid[0],
			latestForce : latest,
			previousTwelveForce : previous
		};

		arrayOne.push(obj);

	});

	let latestRate = 0;
	let prevRate = 0;

	datasetTwo.forEach(function(element) {
		let seriesID = element.seriesID;
		let geoid = [ seriesID.substr(3,15) ];
		let area = geoid.map(id => areas.find(({ prefix }) => prefix === id).area)[0];;
		let latest = Number(element.data[0].value);
		let previous = Number(element.data[12].value);
		let m = element.data[0].periodName;
		month.push(m);

		latestTotal += latest;
		prevTotal += previous;

		let obj = {
			area:area,
			geoid:geoid[0],
			latestRate : latest,
			previousTwelveRate : previous
		};

		arrayTwo.push(obj);

	});

	console.log(arrayOne);
	console.log(arrayTwo);
	let array = [];
	for(let i=0; i<arrayOne.length; i++) {
		array.push({
			...arrayOne[i],
			...(arrayTwo.find((itemInner) => itemInner.geoid === arrayOne[i].geoid))
		});
	}
	console.log(array);

	let tableData = [];
	array.forEach( (element) => {
		let tempArray = [];
		tempArray.push(element.area);
		tempArray.push(commas( element.previousTwelveForce) );
		tempArray.push(commas( element.latestForce) );
		tempArray.push(element.previousTwelveRate+"%");
		tempArray.push(element.latestRate+"%");
		tableData.push(tempArray);
	});

	console.log(tableData);

	// build row and send to html table
	tableData.forEach(function(rowData) {
		var row = document.createElement('tr');
		rowData.forEach(function(cellData) {
			var cell = document.createElement('td');
			cell.appendChild(document.createTextNode(cellData));
			row.appendChild(cell);
		});			
		$("#blsTable tbody").append(row);
	});

	$('#blsTable').DataTable({
		"lengthChange" : true,
		"pageLength" : 5,
		"autoWidth" : true,
		"paging":false,
		"bInfo":false,
		"dom" : "Bfrtip",
		"pagingType" : "full",
		"buttons" : [
			{extend: 'csv', title: 'MSA Compairson', exportOptions:{columns:':visible'}},
			{extend: 'pdf', title: 'MSA Compairson', exportOptions:{columns:':visible'}}
		],
		"colReorder" : true
	});

	$(".dt-buttons.btn-group").prependTo("#blsTable_filter");

}

const prepData = (data, variable, newData) => {
	console.log(variable);
	data.forEach( (element) => {
		// create temp variables
		let geoidArray = [];
		let data = element.data;
		let index;
		let geoid = element.seriesID;		
		// strip first 5 and last 10 characters to isolate the geoid
		console.log(geoid);
		if (geoid.startsWith('LAUM') === true) {
			geoid = geoid.substr(3,15)
		} else {
			geoid = geoid.substr(3,15);
		}
		geoidArray.push(geoid);
		let area = geoidArray.map(id => areas.find(({ prefix }) => prefix === id).area)[0];

		for (index=0; index<data.length; ++index) {
			let month = data[index].periodName;
			let year = data[index].year;
			let tempObj = {
				area:area,
				month:month,
				year:year,
				[variable]:Number(data[index].value),
				id:area+"_"+month+"_"+year
				// create an id on multiple properties to make merging
				// the labor force and unemployment objects easier
			}
			newData.push( tempObj );
		}

	});
}