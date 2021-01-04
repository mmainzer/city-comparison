let selectedAreas;
let msas = [];
let msaLabels = [];
let styleLayer = [ "Labor Force" ];
let laborForceMin = 5;
let laborForceMax;
let uRateMin = 3;
let uRateMax;
let unemployment = [];

const round = (value, precision) => {
	const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

const commas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let windowWidth = $(window).width();

if (windowWidth <= 991) {
	laborForceMax = 25;
	uRateMax = 25;
} else {
	laborForceMax = 50;
	uRateMax = 50;
}

const parseDate = d3.timeParse("%Y-%m-%d");