
// function to build air travel table
const buildAirTable = ( features, table, headers ) => {
	console.log( table );
	console.log( features );
	console.log( headers );
	
	// first, empty the existing table of content
	// if Datatable currently exists, then clear and kill it
	if ( $.fn.dataTable.isDataTable( "#" + table ) ) {
		$( "#" + table ).DataTable().destroy();
	}

	// empty html of table if it already exists
	$("#" + table + ' thead').empty();
  	$("#" + table + ' tbody').empty();

  	let str = '<tr>';

  	headers.forEach(function(header) {
		str += '<th>' + header + '</th>';
	});

	str += '</tr>';

	$("#" + table + ' thead').html(str);

	let tableData = [];

	features.forEach( (feature) => {
		console.log( feature );
		let array = [];
		let geoid = [ feature.properties.cbsa ];
		console.log( geoid );
		let area = geoid.map(id => areas.find(({ geoid }) => geoid === id).area)[0];
		let airports = feature.properties.NUMBER_AIRPORTS;
		let domestic = feature.properties.NS_DOMESTIC;
		let int = feature.properties.NS_INTERNATIONAL;
		let total = feature.properties.NS_TOTAL;
		let airport = feature.properties.AIRPORT;
		array.push( area, airport, airports, domestic, int, total );
		tableData.push( array );
	});

	console.log( tableData );

	// build row and send to html table
	tableData.forEach(function(rowData) {
		var row = document.createElement('tr');
		rowData.forEach(function(cellData) {
			var cell = document.createElement('td');
			cell.appendChild(document.createTextNode(cellData));
			row.appendChild(cell);
		});			
		$("#" + table + " tbody").append(row);
	});

	console.log(table+" tbody");

	$( "#" + table ).DataTable({
		"lengthChange" : true,
		"pageLength" : 5,
		"autoWidth" : true,
		"paging":false,
		"bInfo":false,
		"searching": false,
		"dom" : "Bfrtip",
		"pagingType" : "full",
		"buttons" : [
			{extend: 'csv', title: 'MSA Compairson', exportOptions:{columns:':visible'}},
			{extend: 'pdf', title: 'MSA Compairson', exportOptions:{columns:':visible'}}
		],
		"colReorder" : true
	});

	// $(".dt-buttons.btn-group").prependTo("#" + table + "_filter");
	$(".dt-buttons.btn-group").addClass("no-print");

}