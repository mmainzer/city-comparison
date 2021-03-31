
// function to build air travel table
const buildTable = ( features, table, headers, props ) => {
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

		let array = [];
		let geoid = [ feature.properties.cbsa ];
		
		let area = geoid.map(id => areas.find(({ geoid }) => geoid === id).label)[0];
		array.push( area );
		getProps(array, props, feature, tableData);

	});

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

	let title = $( "#" + table ).attr('class').split(' ')[0];
	title = title.replace(/\-/g, ' ');

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
			{extend: 'csv', title: title, exportOptions:{columns:':visible'}}
			],
		"colReorder" : true
	});

	// $(".dt-buttons.btn-group").prependTo("#" + table + "_filter");
	$(".dt-buttons.btn-group").addClass("no-print");

}

const getProps = ( array, propArray, feature, tableData ) => {

	propArray.forEach( (prop) => {
		let property = feature.properties[prop];
		array.push( property );
	});

	tableData.push( array );

}