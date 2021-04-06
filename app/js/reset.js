$('#msaSelect').on('select2:unselect', function (e) {
  	
  	let unselected = [ e.params.data.id ];

  	selectedAreas = [];
	msas = [];

  	selectedAreas = $("#msaSelect").select2('data');

	selectedAreas.forEach((element) => {
		msas.push(element.id);
	});

	// correctly filter the maps
	map.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);
	popMap.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);
	workMap.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);
	workMap.setFilter('msaPointsLabel',["all",["match",["get","cbsa"],msas,true,false]]);
	airMap.setFilter('msaPointsAirLabel', ["all",[">",["get","NUMBER_AIRPORTS"],0],["match",["get","cbsa"],msas,true,false] ]);
	airMap.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);
	fortuneMap.setFilter('msaPointsFortuneLabel', ["all",[">",["get","Fortune 500"],9],["match",["get","cbsa"],msas,true,false] ]);
	fortuneMap.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);
	taxMap.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);
	costMap.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);
	livingMap.setFilter('msaPoints',["all",["match",["get","cbsa"],msas,true,false]]);

	// remove the deselected item from the tables
	let label = unselected.map(id => areas.find(({ geoid }) => geoid === id).label);

	$( "table" ).each( function() {
		
		$('td:first-child').each(function() {
		    if ($(this).text() === label[0]) {
		    	$(this).parent().remove();
		    }
		});

	});

	// remove selected line from chart
	$("#lineContainer path").each( function() {
		let pathLabel = $(this).attr("class").split(' ')[0];
		pathLabel = pathLabel.split('-').join(' ');
		if ( pathLabel === label[0]) {
	    	$(this).remove();
	    }
	});


});

$('#metricsSelect').on('select2:unselect', function (e) {
	let newMetric = e.params.data.id;
	$( ".section."+newMetric ).hide();

});

