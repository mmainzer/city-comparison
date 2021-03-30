map.on('mousemove', 'msaPoints', function(e) {
	// Change the cursor style as a UI indicator.
	map.getCanvas().style.cursor = 'pointer';

	let lngLat = e.lngLat;
	let msa = e.features[0].properties.msa;

	msa = '<h1 class="popup-header">'+msa+'</h1>';
	let popupVal;
	if (styleLayer[0] === "Labor Force") {
		popupVal = e.features[0].properties.January_2021_LaborForce;
		popupVal = '<p class="popup-description">Labor force of'+'<strong> '+commas(e.features[0].properties.January_2021_LaborForce)+' </strong>'+'in January 2021.</p>';
	} else {
		popupVal = '<p class="popup-description">'+'<strong> '+round(e.features[0].properties.January_2021_URate,1)+'% </strong>'+'unemployment rate in January 2021.</p>';
	}
	popupVal = '<strong> '+popupVal+' </strong>';
	let html = msa+popupVal;
	popup
		.setLngLat(lngLat)
		.setHTML(html)
		.addTo(map);

});

// When the mouse leaves the state-fill layer, update the feature state of the
// previously hovered feature. Also, remove popup and change cursor style

map.on('mouseleave', 'msaPoints', function() {
	// Change the cursor style as a UI indicator.
	map.getCanvas().style.cursor = 'grab';
	popup.remove();

});