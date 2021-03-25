mapboxgl.accessToken = 'pk.eyJ1IjoiZ3BjZWNvbmRldiIsImEiOiJja2o4ejIwa2wyOTlpMnBwZG5zMnNhbXJkIn0.WA3_-W166gTRzu3_iNZ-kA';

const popMap = new mapboxgl.Map({
	container: 'popMap',
	style: 'mapbox://styles/gpcecondev/ckj8yx8b755qw19pk7ay9aa0a?fresh=true',
	bounds: [[-22.368, -12.983],[20.676, 12.704]],
	scrollZoom: false,
	doubleClickZoom: false,
	renderWorldCopies: false,
	dragPan: false,
	preserveDrawingBuffer: true
});

const workMap = new mapboxgl.Map({
	container: 'workMap',
	style: 'mapbox://styles/gpcecondev/ckj8yx8b755qw19pk7ay9aa0a?fresh=true',
	bounds: [[-22.368, -12.983],[20.676, 12.704]],
	scrollZoom: false,
	doubleClickZoom: false,
	renderWorldCopies: false,
	dragPan: false,
	preserveDrawingBuffer: true
});

const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/gpcecondev/ckj8yx8b755qw19pk7ay9aa0a?fresh=true',
	bounds: [[-22.368, -12.983],[20.676, 12.704]],
	// fitBoundsOptions: {padding: 25},
	// center: [-0.825,1.436],
	// zoom: 4.29,
	scrollZoom: false,
	doubleClickZoom: false,
	renderWorldCopies: false,
	dragPan: false,
	preserveDrawingBuffer: true
});

const airMap = new mapboxgl.Map({
	container: 'airMap',
	style: 'mapbox://styles/gpcecondev/ckj8yx8b755qw19pk7ay9aa0a?fresh=true',
	bounds: [[-22.368, -12.983],[20.676, 12.704]],
	// fitBoundsOptions: {padding: 25},
	// center: [-0.825,1.436],
	// zoom: 4.29,
	scrollZoom: false,
	doubleClickZoom: false,
	renderWorldCopies: false,
	dragPan: false,
	preserveDrawingBuffer: true
});

const fortuneMap = new mapboxgl.Map({
	container: 'fortuneMap',
	style: 'mapbox://styles/gpcecondev/ckj8yx8b755qw19pk7ay9aa0a?fresh=true',
	bounds: [[-22.368, -12.983],[20.676, 12.704]],
	// fitBoundsOptions: {padding: 25},
	// center: [-0.825,1.436],
	// zoom: 4.29,
	scrollZoom: false,
	doubleClickZoom: false,
	renderWorldCopies: false,
	dragPan: false,
	preserveDrawingBuffer: true
});

const taxMap = new mapboxgl.Map({
	container: 'taxMap',
	style: 'mapbox://styles/gpcecondev/ckj8yx8b755qw19pk7ay9aa0a?fresh=true',
	bounds: [[-22.368, -12.983],[20.676, 12.704]],
	scrollZoom: false,
	doubleClickZoom: false,
	renderWorldCopies: false,
	dragPan: false,
	preserveDrawingBuffer: true
});

const costMap = new mapboxgl.Map({
	container: 'costMap',
	style: 'mapbox://styles/gpcecondev/ckj8yx8b755qw19pk7ay9aa0a?fresh=true',
	bounds: [[-22.368, -12.983],[20.676, 12.704]],
	scrollZoom: false,
	doubleClickZoom: false,
	renderWorldCopies: false,
	dragPan: false,
	preserveDrawingBuffer: true
});

const popup = new mapboxgl.Popup({
	closeButton: false,
	closeOnClick: false
});

// add a dropdown to the mapbox ctrl group on the top right to change the layer filter
// $(".mapboxgl-ctrl-top-right").append( "<select id='layerSelect' class='select'><option>Population</option><option>Labor Force</option></select>" );

popMap.on('load', function() {
	console.log("population map is loaded");
	popMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","TOTPOP_CY"],57491,5,19560212,50]);
});

workMap.on('load', function() {
	console.log("future workforce map is loaded");
	workMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","NUMBER_OF_COLLEGES"],1,3,20,10,284,50]);
	workMap.setLayoutProperty( 'msaPointsLabel', 'visibility', 'visible' );
});

map.on('load', function() {
	console.log("bls map is loaded");
	map.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","December_2020_LaborForce"],0,laborForceMin,6000000,laborForceMax]);
});

airMap.on('load', function() {
	console.log("air map is loaded");
	airMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","NUMBER_AIRPORTS"],0,5,4,25]);
	airMap.setLayoutProperty( 'msaPointsAirLabel', 'visibility', 'visible' );
});

fortuneMap.on('load', function() {
	console.log("fortune map is loaded");
	fortuneMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["linear"],["get","Fortune 1000"],0,3,1,5,100,35]);
	fortuneMap.setLayoutProperty( 'msaPointsFortuneLabel', 'visibility', 'visible' );
	fortuneMap.setFilter('msaPointsFortuneLabel', ["all",[">",["get","Fortune 1000"],19]]);
});

taxMap.on('load', function() {
	console.log("tax map is loaded");
	taxMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["exponential",1.96],["get","Avg. Local Sales Tax"],0,3,5.22,10]);
});

costMap.on('load', function() {
	console.log("cost map is loaded");
	costMap.setPaintProperty('msaPoints','circle-radius',["interpolate",["exponential",1.02],["get","MSA_CODB"],75,3,169,35]);
});
