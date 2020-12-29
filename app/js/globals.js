let selectedAreas;
let msas = [];
let styleLayer;
let laborForceMin = 5;
let laborForceMax;
let uRateMin = 3;
let uRateMax;

const round = (value, precision) => {
	const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

const commas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let width = $(window).width();

if (width <= 991) {
	laborForceMax = 25;
	uRateMax = 25;
} else {
	laborForceMax = 50;
	uRateMax = 50;
}