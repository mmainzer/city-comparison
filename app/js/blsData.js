const makeBlsCall = (series) => {

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
		    "startyear":"2019",
		    "endyear":"2021",
		  }
		}

		$.ajax(settings).done( (data) => {
			data = data.Results.series;

			unemployment = [];
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
			buildLine(unemployment, width);

			// now that this function has fired, the filtered mapfeatures will be visible
			// since we only want filtered features, we wait, then query the features so we only have the
			// data for the relevant MSAs
			const features = map.queryRenderedFeatures( { layers : [ 'msaPoints' ] } );

			features.forEach( (feature) => {

				feature.properties.NS_DOMESTIC = commas( feature.properties.NS_DOMESTIC );
				feature.properties.NS_INTERNATIONAL = commas( feature.properties.NS_INTERNATIONAL );
				feature.properties.NS_TOTAL = commas( feature.properties.NS_TOTAL );
				feature.properties['Avg. Local Sales Tax'] = feature.properties['Avg. Local Sales Tax'].toString() + "%";
				feature.properties['State Sales Tax'] = feature.properties['State Sales Tax'].toString() + "%";
				feature.properties['Total Sales Tax'] = feature.properties['Total Sales Tax'].toString() + "%";
				feature.properties['Individual Tax Rate'] = feature.properties['Individual Tax Rate'].toString() + "%";
				feature.properties['Corporate Tax Rate'] = feature.properties['Corporate Tax Rate'].toString() + "%";
				feature.properties['Taxable Wage Base'] = "$" + commas( feature.properties['Taxable Wage Base'] );

				if (feature.properties.TOTPOP_CY === undefined) {
					feature.properties.TOTPOP_CY = "Unknown";
				} else {
					feature.properties.TOTPOP_CY = commas( feature.properties.TOTPOP_CY );
				}

				if (feature.properties.TOTPOP_FY === undefined) {
					feature.properties.TOTPOP_FY = "Unknown";
				} else {
					feature.properties.TOTPOP_FY = commas( feature.properties.TOTPOP_FY );
				}

				if (feature.properties.POP_ANNUAL_GROWTH === undefined) {
					feature.properties.POP_ANNUAL_GROWTH = "Unknown";
				} else {
					feature.properties.POP_ANNUAL_GROWTH = feature.properties.POP_ANNUAL_GROWTH.toString() + "%";
				}

				if (feature.properties.ENROLLMENT === undefined) {
					feature.properties.ENROLLMENT = "Unknown";
				} else {
					feature.properties.ENROLLMENT = commas( feature.properties.ENROLLMENT );
				}

				if (feature.properties.COMPLETIONS === undefined) {
					feature.properties.COMPLETIONS = "Unknown";
				} else {
					feature.properties.COMPLETIONS = commas( feature.properties.COMPLETIONS );
				}

				if (feature.properties.COLLEGE_DEGREE === undefined) {
					feature.properties.COLLEGE_DEGREE = "Unknown";
				} else {
					feature.properties.COLLEGE_DEGREE = round( ( feature.properties.COLLEGE_DEGREE * 100 ), 1 ).toString() + "%";
				}

				if (feature.properties['Property Tax per Capita'] === undefined) {
					feature.properties['Property Tax per Capita'] = "Unknown";
				} else {
					feature.properties['Property Tax per Capita'] = "$" + commas( feature.properties['Property Tax per Capita'] );
				}

				if (feature.properties['Property Tax Throw Back'] === undefined) {
					feature.properties['Property Tax Throw Back'] = "Unknown";
				}
				
				if (feature.properties['New Employers Rate'] === undefined) {
					feature.properties['New Employers Rate'] = "Unknown";
				} else {
					feature.properties['New Employers Rate'] = feature.properties['New Employers Rate'].toString() + "%";
				}

				if (feature.properties.MEDHHINC_CY === undefined) {
					feature.properties.MEDHHINC_CY = "Unknown";
				} else {
					feature.properties.MEDHHINC_CY = "$" + commas( feature.properties.MEDHHINC_CY );
				}

				if (feature.properties.HOME_VALUE === undefined) {
					feature.properties.HOME_VALUE = "Unknown";
				} else {
					feature.properties.HOME_VALUE = "$" + commas( feature.properties.HOME_VALUE );
				}

				if (feature.properties.APT_RENT === undefined) {
					feature.properties.APT_RENT = "Unknown";
				} else {
					feature.properties.APT_RENT = "$" + commas( feature.properties.APT_RENT );
				}
				
				if (feature.properties.PERMIT_CHANGE === undefined) {
					feature.properties.PERMIT_CHANGE = "Unknown";
				} else {
					feature.properties.PERMIT_CHANGE = round( ( feature.properties.PERMIT_CHANGE * 100 ), 1 ).toString() + "%";
				}
				
			});


			buildTable(features, "popTable", popHeaders, ['TOTPOP_CY','TOTPOP_FY','POP_ANNUAL_GROWTH','MEDAGE_CY','DIV_INDEX' ] );
			buildTable(features, "workTable", workHeaders, ['NUMBER_OF_COLLEGES','ENROLLMENT','COMPLETIONS','COLLEGE_DEGREE' ] );
			buildTable(features, "airTable", airHeaders, ['AIRPORT','NUMBER_AIRPORTS','NS_DOMESTIC','NS_INTERNATIONAL','NS_TOTAL'] );
			buildTable(features, "fortuneTable", fortuneHeaders, ['Fortune 500','Fortune 1000'] );
			buildTable(features, "personTaxTable", personTaxHeaders, ['Avg. Local Sales Tax','State Sales Tax','Total Sales Tax','Graduated Individual Tax','Individual Tax Brackets', 'Individual Tax Rate'] );
			buildTable(features, "propertyTaxTable", propertyTaxHeaders, ['Property Tax Rank','Property Tax Throw Back','Property Tax per Capita'])
			buildTable(features, "corporateTaxTable", corporateTaxHeaders, ['Franchise Tax Rate','Corporate Tax Rate','Corporate Tax Brackets','APPORTIONMENT'] );
			buildTable(features, "codbTable", codbHeaders, ['MSA_CODB','UNIT_LABOR_COST','ENERGY_COST','STATE_LOCAL_TAX','OFFICE_RENT' ] );
			buildTable(features, "employerCostsTable", employerCostsHeaders, ['Payroll Tax Notes','Taxable Wages Rate','New Employers Rate','Taxable Wage Base' ] );
			buildTable(features, "housingTable", housingHeaders, ['HOME_VALUE','PERMIT_CHANGE','APT_RENT' ] );
			buildTable(features, "livingTable", livingHeaders, ['MEDHHINC_CY','COMP_INDEX','GROCERY','HOUSING','UTILITIES','TRANSPORTATION','HEALTH_CARE' ] );

		});

}

const buildBlsTable = (datasetOne, datasetTwo) => {
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

	let arrayOne = [];
	let arrayTwo = [];
	let latestTotal = 0;
	let prevTotal = 0;
	let month = [];

	datasetOne.forEach(function(element) {
		let seriesID = element.seriesID;
		let geoid = [ seriesID.substr(3,15) ];
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
		let area = geoid.map(id => areas.find(({ prefix }) => prefix === id).label)[0];;
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

	let array = [];
	for(let i=0; i<arrayOne.length; i++) {
		array.push({
			...arrayOne[i],
			...(arrayTwo.find((itemInner) => itemInner.geoid === arrayOne[i].geoid))
		});
	}

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
		"searching":false,
		"dom" : "Bfrtip",
		"pagingType" : "full",
		"buttons" : [
			{extend: 'csv', title: 'Labor Force & Unemployment', exportOptions:{columns:':visible'}}
		],
		"colReorder" : true
	});

	$(".dt-buttons.btn-group").prependTo("#blsTable_filter");
	$(".dt-buttons.btn-group").addClass("no-print");

}

const prepData = (data, variable, newData) => {

	data.forEach( (element) => {
		// create temp variables
		let geoidArray = [];
		let data = element.data;
		let index;
		let geoid = element.seriesID;		
		// strip first 5 and last 10 characters to isolate the geoid

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