let selectedAreas;
let msas = [];
let msaLabels = [];
let styleLayer = [ "Labor Force" ];
let laborForceMin = 5;
let laborForceMax;
let uRateMin = 3;
let uRateMax;
let unemployment = [];

const popHeaders = [ 'Area', '2020 Population','2025 Population','Annual Growth Rate','Median Age','Diversity Index' ];
const workHeaders = [ 'Area','Total Colleges','College Enrollment', 'College Completions', 'Degrees Conferred' ];
const airHeaders = [ 'Area', 'Airport(s)', 'Airports Serving MSA', 'Non-Stop Domestic Markets', 'Non-Stop International Markets', 'Total Non-Stop Markets' ];
const fortuneHeaders = [ 'Area', 'Fortune 500 Companies in the MSA', 'Fortune 1,000 Companies in the MSA' ];
const personTaxHeaders = [ 'Area', 'Avg. Local Sales Tax Rate','State Sales Tax Rate','Total Sales Tax Rate','Property Tax per Capita','Property Tax Rank','Graduated Income Tax','Income Tax Rate' ];
const corporateTaxHeaders = [ 'Area', 'Corporate Income Tax Apportionment','Franshise Tax Rate','Corporate Income Tax Rate','Corporate Income Tax Brackets' ];
const codbHeaders = [ 'Area','Overall Cost of Doing Business','Labor','Energy','State and Local Taxes','Office Rent' ];
const employerCostsHeaders = [ "Area", "Notes", "Taxable Wages Tax Rate", "New Employer's Tax Rate", "Taxable Wage Base" ];
const maps = {'1':'map', '2':'airMap', '3':'fortuneMap', '4':'taxMap', '5':'codbMap'}

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