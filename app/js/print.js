$("#printPreview").click( () => {

	$("head link:eq(6)").after('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css">');
	$("#printPreview").hide();
	$(".no-print").hide();

	$("#printButton").show();
	$(".print-only").show();
	$(".logo-container").css("display","flex");
	$(".print-preview-buttons").css("display","flex");

	$(".data-section").css("padding-top", "0");
	$("#map").css("width","100%");

	window.setTimeout(()=>popMap.resize(), 500);
	popMap.fitBounds([[-22.368, -12.983],[20.676, 12.704]]);

	window.setTimeout( () => {
		popMap.resize();
		popMap.fitBounds([[-17.6152, -13.9477],[15.9232, 13.6698]], {padding:{left:80,right:85}})
		workMap.resize();
		workMap.fitBounds([[-17.6152, -13.9477],[15.9232, 13.6698]], {padding:{left:80,right:85}})
		map.resize();
		map.fitBounds([[-17.6152, -13.9477],[15.9232, 13.6698]], {padding:{left:80,right:85}})
		airMap.resize();
		airMap.fitBounds([[-17.6152, -13.9477],[15.9232, 13.6698]], {padding:{left:80,right:85}})
		fortuneMap.resize();
		fortuneMap.fitBounds([[-17.6152, -13.9477],[15.9232, 13.6698]], {padding:{left:80,right:85}})
		taxMap.resize();
		taxMap.fitBounds([[-17.6152, -13.9477],[15.9232, 13.6698]], {padding:{left:80,right:85}})
		costMap.resize();
		costMap.fitBounds([[-17.6152, -13.9477],[15.9232, 13.6698]], {padding:{left:80,right:85}})
		livingMap.resize();
		livingMap.fitBounds([[-17.6152, -13.9477],[15.9232, 13.6698]], {padding:{left:80,right:85}})
	}, 500);

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

	$("head link")[7].disabled=true;
	$("#printPreview").show();
	$(".no-print").show();
	$("#printButton").hide();
	$(".print-only").hide();
	$(".print-preview-buttons").css("display","none");
	popMap.fitBounds([[-22.368, -12.983],[20.676, 12.704]]);
	workMap.fitBounds([[-22.368, -12.983],[20.676, 12.704]]);
	map.fitBounds([[-22.368, -12.983],[20.676, 12.704]]);
	airMap.fitBounds([[-22.368, -12.983],[20.676, 12.704]]);
	fortuneMap.fitBounds([[-22.368, -12.983],[20.676, 12.704]]);
	taxMap.fitBounds([[-22.368, -12.983],[20.676, 12.704]]);
	costMap.fitBounds([[-22.368, -12.983],[20.676, 12.704]]);
	livingMap.fitBounds([[-22.368, -12.983],[20.676, 12.704]]);

	$("#lineContainer svg").remove();
	let width = $("#lineContainer").width();
	width = width - margin.left - margin.right;
	buildLine(unemployment, width);

});