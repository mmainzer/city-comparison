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

	console.log(msas);
	console.log(msaLabels);
	console.log(msaLabels.join(' | '));
	$("#msaList").text(msaLabels.join(' | '));

	map.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);
	airMap.setFilter('msaPointsAirLabel',["all",["match",["get","cbsa"],msas,true,false]]);
	airMap.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);
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
		airMap.setFilter('msaPointsAirLabel', ["all",[">",["get","NUMBER_AIRPORTS"],0]]);

	} else if (styleLayer[0] === "Domestic Markets") {
		airMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","NS_DOMESTIC"],0,3,1,5,244,30]);
		airMap.setLayoutProperty( 'msaPointsAirLabel', 'text-field', ["to-string",["get","NS_DOMESTIC"]] );
		airMap.setFilter('msaPointsAirLabel', ["all",[">",["get","NS_DOMESTIC"],50]]);

	} else if (styleLayer[0] === "International Markets") {
		airMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","NS_INTERNATIONAL"],0,3,1,5,206,30]);
		airMap.setLayoutProperty( 'msaPointsAirLabel', 'text-field', ["to-string",["get","NS_INTERNATIONAL"]] );
		airMap.setFilter('msaPointsAirLabel', ["all",[">",["get","NS_INTERNATIONAL"],50]]);

	} else if (styleLayer[0] === "Total Markets") {
		airMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","NS_TOTAL"],0,3,1,5,428,50]);
		airMap.setLayoutProperty( 'msaPointsAirLabel', 'text-field', ["to-string",["get","NS_TOTAL"]] );
		airMap.setFilter('msaPointsAirLabel', ["all",[">",["get","NS_TOTAL"],50]]);

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
		fortuneMap.setFilter('msaPointsFortuneLabel', ["all",[">",["get","Fortune 1000"],19]]);

	} else if (styleLayer[0] === "Total Fortune 1000") {
		fortuneMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","Fortune 1000"],0,3,1,5,100,35]);
		fortuneMap.setLayoutProperty( 'msaPointsFortuneLabel', 'visibility', 'visible' );
		fortuneMap.setLayoutProperty( 'msaPointsFortuneLabel', 'text-field', ["to-string",["get","Fortune 1000"]] );
		fortuneMap.setFilter('msaPointsFortuneLabel', ["all",[">",["get","Fortune 500"],9]]);

	} else if (styleLayer[0] === "Fortune 500 Companies") {
		fortuneMap.setLayoutProperty( 'msaPointsFortuneLabel', 'visibility', 'none' );
		fortuneMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","NS_INTERNATIONAL"],0,3,1,5,206,30]);

	} else if (styleLayer[0] === "Fortune 1000 Companies") {
		fortuneMap.setLayoutProperty( 'msaPointsFortuneLabel', 'visibility', 'none' );
		fortuneMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","NS_TOTAL"],0,3,1,5,428,30]);

	}
});