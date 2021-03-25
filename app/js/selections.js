$("#msaSelect").select2({
	closeOnSelect: false,
	maximumSelectionLength: 10
});

$(".layerSelect").select2({
	closeOnSelect: true,
});

$('.select').on('select2:select', function (e) {
    $('.select2-search__field').val('');
});

$("#compareButton").click( () => {
	selectedAreas = [];
	msas = [];
	msaLabels = [];

	$(".heading").hide();
	selectedAreas = $("#msaSelect").select2('data');
	console.log(selectedAreas);

	selectedAreas.forEach((element) => {
		msas.push(element.id);
	});

	selectedAreas.forEach((element) => {
		msaLabels.push(element.text);
	});

	$("#msaList").text(msaLabels.join(' | '));

	map.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);
	popMap.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);
	workMap.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);
	workMap.setFilter('msaPointsLabel',["all",["match",["get","cbsa"],msas,true,false]]);
	airMap.setFilter('msaPointsAirLabel',["all",["match",["get","cbsa"],msas,true,false]]);
	airMap.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);
	fortuneMap.setFilter('msaPointsFortuneLabel', ["all",[">",["get","Fortune 500"],9],["match",["get","cbsa"],msas,true,false] ]);
	fortuneMap.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);
	taxMap.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);
	costMap.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);
	// get the prefixes and geoids of the selected geographies
  	let series = msas.map(id => areas.find(({ geoid }) => geoid === id).prefix);
  	// flatten the array in case a cd region was selected with a nested array
  	series = series.flat();
  	console.log(series);

  	let seriesOne = [];
  	let seriesTwo = [];
  	series.forEach( (element, index) => {
  		seriesOne.push( series[index] = "LAU"+element+"03" );
  		seriesTwo.push( series[index] = "LAU"+element+"06" );
  	});

  	series = seriesOne.concat( seriesTwo );

  	console.log(series);

  	//bls api only allows a max of 50 series per call, so check first
  	if (series.length > 25) {
  		showError();
  	} else {
  		// $(".data-section").show();
  		series = series.map( serie => serie ).join(',');
  		console.log(series);
  		// make request for data
		makeBlsCall(series);

  	}

  	$("#printPreview").show();
  	

});

$("#popSelect").change( () => {
	console.log("changing style layer");
	styleLayer = $("#popSelect").select2('data');
	styleLayer = [ styleLayer[0].text ];
	$("#selectedPopLayer").text( styleLayer[0] );
	
	if (styleLayer[0] === "2020 Population") {
		popMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","TOTPOP_CY"],57491,5,19560212,50]);
		popMap.setPaintProperty('msaPoints','circle-color','hsla(42, 985, 54%, 0.75)');

	} else if (styleLayer[0] === "2025 Population") {
		popMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","TOTPOP_FY"],59048,5,19803082,50]);
		popMap.setPaintProperty('msaPoints','circle-color','hsla(42, 985, 54%, 0.75)');

	} else if (styleLayer[0] === "Population Growth Rate") {
		popMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["exponential",1.81],["get","POP_ANNUAL_GROWTH"],-0.71,5,3.73,50]);
		popMap.setPaintProperty('msaPoints','circle-color',[ "case", ["<", ["get","POP_ANNUAL_GROWTH"],0],"hsla(358, 85%, 52%, 0.75)","hsla(193, 100%, 47%, 0.75)" ]);

	} else if (styleLayer[0] === "Median Age") {
		popMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["exponential",1.11],["get","MEDAGE_CY"],26,3,62,35]);
		popMap.setPaintProperty('msaPoints','circle-color','hsla(42, 985, 54%, 0.75)');

	} else if (styleLayer[0] === "Diversity Index") {
		popMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["exponential",1.11],["get","DIV_INDEX"],10.7,5,87.4,35]);
		popMap.setPaintProperty('msaPoints','circle-color','hsla(42, 985, 54%, 0.75)');

	}
});

$("#workSelect").change( () => {
	console.log("changing style layer");
	styleLayer = $("#workSelect").select2('data');
	styleLayer = [ styleLayer[0].text ];
	$("#selectedWorkLayer").text( styleLayer[0] );
	
	if (styleLayer[0] === "% Bachelor's Degree or Higher") {
		workMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","COLLEGE_DEGREE"],0.136,3,0.26,5,0.35,15,0.49,22,0.631,50]);
		workMap.setLayoutProperty( 'msaPointsLabel', 'visibility', 'visible' );
		workMap.setFilter( 'msaPointsLabel', ["all",[">",["get","COLLEGE_DEGREE"],0.35]] );
		// workMap.setLayoutProperty( 'msaPointsLabel', ['concat',['to-string',['round',['*',['get','COLLEGE_DEGREE'],100]]],"%"] );

	} else if (styleLayer[0] === "Number of Colleges") {
		workMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","NUMBER_OF_COLLEGES"],1,3,20,10,284,50]);
		workMap.setLayoutProperty( 'msaPointsLabel', 'visibility', 'visible' );
		workMap.setFilter( 'msaPointsLabel', ["all",[">",["get","NUMBER_OF_COLLEGES"],20]] );
		workMap.setLayoutProperty( 'msaPointsLabel', ['to-string',['get','NUMBER_OF_COLLEGES']] );

	} else if (styleLayer[0] === "College Enrollment") {
		workMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","ENROLLMENT"],157,5,300000,25,1393705,50]);
		workMap.setLayoutProperty( 'msaPointsLabel', 'visibility', 'none' );

	} else if (styleLayer[0] === "Degrees Conferred") {
		workMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","COMPLETIONS"],10,5,50000,25,245640,50]);
		workMap.setLayoutProperty( 'msaPointsLabel', 'visibility', 'none' );

	}
});

$("#blsSelect").change( () => {
	console.log("changing style layer");
	styleLayer = $("#blsSelect").select2('data');
	styleLayer = [ styleLayer[0].text ];
	$("#selectedBlsLayer").text( styleLayer[0] );
	
	if (styleLayer[0] === "Labor Force") {
		map.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","December_2020_LaborForce"],0,laborForceMin,6000000,laborForceMax]);

	} else if (styleLayer[0] === "Unemployment Rate") {
		map.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","December_2020_URate"],5,uRateMin,20,uRateMax]);

	}
});

$("#airSelect").change( () => {
	console.log("changing style layer");
	styleLayer = $("#airSelect").select2('data');
	styleLayer = [ styleLayer[0].text ];
	$("#selectedAirLayer").text( styleLayer[0] );
	
	if (styleLayer[0] === "Total Airports") {
		airMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","NUMBER_AIRPORTS"],0,5,4,25]);
		airMap.setLayoutProperty( 'msaPointsAirLabel', 'text-field', ["to-string",["get","NUMBER_AIRPORTS"]] );
		airMap.setFilter('msaPointsAirLabel', ["all",[">",["get","NUMBER_AIRPORTS"],0],["match",["get","cbsa"],msas,true,false] ]);

	} else if (styleLayer[0] === "Domestic Markets") {
		airMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","NS_DOMESTIC"],0,3,1,5,244,30]);
		airMap.setLayoutProperty( 'msaPointsAirLabel', 'text-field', ["to-string",["get","NS_DOMESTIC"]] );
		airMap.setFilter('msaPointsAirLabel', ["all",[">",["get","NS_DOMESTIC"],50],["match",["get","cbsa"],msas,true,false] ]);

	} else if (styleLayer[0] === "International Markets") {
		airMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","NS_INTERNATIONAL"],0,3,1,5,206,30]);
		airMap.setLayoutProperty( 'msaPointsAirLabel', 'text-field', ["to-string",["get","NS_INTERNATIONAL"]] );
		airMap.setFilter('msaPointsAirLabel', ["all",[">",["get","NS_INTERNATIONAL"],50],["match",["get","cbsa"],msas,true,false] ]);

	} else if (styleLayer[0] === "Total Markets") {
		airMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","NS_TOTAL"],0,3,1,5,428,50]);
		airMap.setLayoutProperty( 'msaPointsAirLabel', 'text-field', ["to-string",["get","NS_TOTAL"]] );
		airMap.setFilter('msaPointsAirLabel', ["all",[">",["get","NS_TOTAL"],50],["match",["get","cbsa"],msas,true,false] ]);

	}
});

$("#fortuneSelect").change( () => {
	console.log("changing style layer");
	styleLayer = $("#fortuneSelect").select2('data');
	styleLayer = [ styleLayer[0].text ];
	$("#selectedFortuneLayer").text( styleLayer[0] );

	if (styleLayer[0] === "Total Fortune 500") {
		fortuneMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","Fortune 500"],0,3,1,5,65,35]);
		fortuneMap.setLayoutProperty( 'msaPointsFortuneLabel', 'visibility', 'visible' );
		fortuneMap.setLayoutProperty( 'msaPointsFortuneLabel', 'text-field', ["to-string",["get","Fortune 500"]] );
		fortuneMap.setFilter('msaPointsFortuneLabel', ["all",[">",["get","Fortune 1000"],19],["match",["get","cbsa"],msas,true,false] ]);

	} else if (styleLayer[0] === "Total Fortune 1000") {
		fortuneMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","Fortune 1000"],0,3,1,5,100,35]);
		fortuneMap.setLayoutProperty( 'msaPointsFortuneLabel', 'visibility', 'visible' );
		fortuneMap.setLayoutProperty( 'msaPointsFortuneLabel', 'text-field', ["to-string",["get","Fortune 1000"]] );
		fortuneMap.setFilter('msaPointsFortuneLabel', ["all",[">",["get","Fortune 500"],9],["match",["get","cbsa"],msas,true,false] ]);

	}
});

$("#taxSelect").change( () => {
	console.log("changing style layer");
	styleLayer = $("#taxSelect").select2('data');
	styleLayer = [ styleLayer[0].text ];
	$("#selectedTaxLayer").text( styleLayer[0] );

	if (styleLayer[0] === "Avg. Local Sales Tax Rate") {
		taxMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["exponential",1.96],["get","Avg. Local Sales Tax"],0,3,5.22,10]);

	} else if (styleLayer[0] === "State Sales Tax Rate") {
		taxMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["exponential",1.96],["get","State Sales Tax"],0,3,7.25,15]);

	} else if (styleLayer[0] === "Total Sales Tax Rate") {
		taxMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["exponential",1.96],["get","Total Sales Tax"],0,3,9.53,15]);

	} else if (styleLayer[0] === "Property Tax Per Capita") {
		taxMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","Property Tax per Capita"],582,5,3307,30]);

	} else if (styleLayer[0] === "Property Tax Rank") {
		taxMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["exponential",0.96],["get","Property Tax Rank"],1,20,50,5]);

	} else if (styleLayer[0] === "Individual Income Tax Rate") {
		taxMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","Individual Tax Rate"],0,5,13.3,20]);

	} else if (styleLayer[0] === "Corporate Income Tax Rate") {
		taxMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["exponential",1.56],["get","Corporate Tax Rate"],0,5,12,15]);

	}
});

$("#costSelect").change( () => {
	console.log("changing style layer");
	styleLayer = $("#costSelect").select2('data');
	styleLayer = [ styleLayer[0].text ];
	$("#selectedCostLayer").text( styleLayer[0] );

	if (styleLayer[0] === "Overall Cost of Doing Business") {
		costMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["exponential",1.02],["get","MSA_CODB"],75,3,169,35]);

	} else if (styleLayer[0] === "Labor Costs") {
		costMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["exponential",1.03],["get","UNIT_LABOR_COST"],66,3,166,35]);

	}  else if (styleLayer[0] === "Energy Costs") {
		costMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["exponential",1.03],["get","ENERGY_COST"],66,3,166,35]);

	}  else if (styleLayer[0] === "State and Local Taxes") {
		costMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["exponential",1.004],["get","STATE_LOCAL_TAX"],32,1,265,25]);

	}  else if (styleLayer[0] === "New Employer's Tax") {
		costMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["exponential",1.9],["get","New Employers Rate"],0.5,3,3.69,25]);

	}  else if (styleLayer[0] === "Taxable Wage Base") {
		costMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","Taxable Wage Base"],7000,3,52700,30]);

	}  else if (styleLayer[0] === "Office Rent") {
		costMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","OFFICE_RENT"],22,3,279,35]);

	}
});