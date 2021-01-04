$("#printPreview").click( () => {

	console.log("Ready to Print");

	$("head link:eq(6)").after('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css">');
	$("#printPreview").hide();
	$(".no-print").hide();

	$("#printButton").show();
	$(".print-only").show();
	$(".print-preview-buttons").css("display","flex");

	$(".data-section").css("padding-top", "0");
	$("#map").css("width","100%");

	map.flyTo({ center:[10.911,-2.003],zoom:3.57 });

	$("thead").css("font-size","14px");
	$("tbody").css("font-size","12px");

	$("#lineContainer svg").remove();

	width = 718.109 - 37.7953 - 37.7953;

	buildLine(unemployment, width);


});

$('#printButton').click( () => {
     window.print();
});

$("#exitPrint").click( () => {
	console.log("exiting print preview");
	$("head link")[7].disabled=true;
	$("#printPreview").show();
	$(".no-print").show();
	$("#printButton").hide();
	$(".print-only").hide();
	$(".print-preview-buttons").css("display","none");
	map.fitBounds([[-22.368, -12.983],[20.676, 12.704]]);

	$("#lineContainer svg").remove();
	let width = $("#lineContainer").width();
	width = width - margin.left - margin.right;
	buildLine(unemployment, width);

});