$("#msaSelect").select2({
	closeOnSelect: false,
	maximumSelectionLength: 10
});

$("#layerSelect").select2({
	closeOnSelect: true,
});

$('.select').on('select2:select', function (e) {
    $('.select2-search__field').val('');
});

$("#compareButton").click( () => {
	selectedAreas = [];
	$(".heading").hide();
	selectedAreas = $("#msaSelect").select2('data');
	console.log(selectedAreas);

	selectedAreas.forEach((element) => {
		msas.push(element.id);
	});

	console.log(msas);

	map.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);
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

});

$("#layerSelect").change( () => {
	console.log("changing style layer");
	styleLayer = $("#layerSelect").select2('data');
	styleLayer = [ styleLayer[0].text ];
	
	if (styleLayer[0] === "Labor Force") {
		map.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","October_2020_LaborForce"],0,laborForceMin,6715275,laborForceMax]);

	} else if (styleLayer[0] === "Unemployment Rate") {
		map.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","October_2020_URate"],1.9,uRateMin,22.5,uRateMax]);

	}
});