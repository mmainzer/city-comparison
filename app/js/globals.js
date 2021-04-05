let selectedAreas;
let msas = [];
let msaLabels = [];
let styleLayer = [ "Labor Force" ];
let laborForceMin = 5;
let laborForceMax;
let uRateMin = 3;
let uRateMax;
let bounds;
let unemployment = [];

const popHeaders = [ 'Area', '2020 Population','2025 Population','Annual Growth Rate','Median Age','Diversity Index' ];
const workHeaders = [ 'Area','Total Colleges','College Enrollment', 'Degrees Conferred', "% With Bachelor's" ];
const airHeaders = [ 'Area', 'Airport(s)', 'Airports Serving MSA', 'Non-Stop Domestic Markets', 'Non-Stop International Markets', 'Total Non-Stop Markets' ];
const fortuneHeaders = [ 'Area', 'Fortune 500 Companies in the MSA', 'Fortune 1,000 Companies in the MSA' ];
const personTaxHeaders = [ 'Area', 'Avg. Local Sales Tax Rate','State Sales Tax Rate','Total Sales Tax Rate','Graduated Income Tax','Tax Brackets', 'Income Tax Rate' ];
const propertyTaxHeaders = ['Area','Property Tax Rank','Property Tax Throw Back','Property Tax per Capita']
const corporateTaxHeaders = [ 'Area', 'Franshise Tax Rate', 'Corporate Income Tax Rate','Corporate Income Tax Brackets','Apportionment' ];
const codbHeaders = [ 'Area','Overall Cost of Doing Business','Labor','Energy','State and Local Taxes','Office Rent' ];
const employerCostsHeaders = [ "Area", "Notes", "Taxable Wages Tax Rate", "New Employer's Tax Rate", "Taxable Wage Base" ];
const housingHeaders = [ "Area", "Median Home Value", "YoY Change in Single Family Housing Units Permits", "Median Apartment Rent" ];
const livingHeaders = [ "Area", "Median Household Income", "Cost of Living Composite Index", "Groceries", "Housing","Utilities","Transportation","Healtchare" ];
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