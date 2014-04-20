google.load('visualization', '1', {'packages': ['geochart']});
google.setOnLoadCallback(drawRegionsMap);

var commodities = ["Apples", "Barley", "Beer", "Bovine Meat", "Butter, Ghee",
 "Coconuts - Incl Copra", "Coffee", "Cream", "Eggs + (Total)", "Fats, Animals", 
 "Raw", "Grapes", "Groundnuts (Shelled Eq)", "Maize", "Millet", 
 "Mutton & Goat Meat", "Nuts", "Oats", "Offals + (Total)", "Olive Oil",
  "Olives", "Onions", "Palm Oil", "Palmkernel Oil", "Pepper", "Potatoes",
   "Rape and Mustard Oil", "Rape and Mustardseed", "Rice (Milled Equivalent)",
    "Rubber", "Rye,", "Sorghum", "Soyabean Oil", "Soyabeans", "Sugar",
	 "Sunflowerseed Oil", "Sunflowerseed", "Sweeteners, Other", "Tea", "Tobacco",
	  "Wheat", "Wine"];

var	locationString = location.search.substring(1)
if (locationString.length > 0) {
	alert(commodities[locationString - 1]);
	$(".commodityCaption").text(commodities[locationString - 1]);
}

function drawRegionsMap() {
	var com = $(".commodityCaption").text();
	var year = $("#homeWithMap").text();
	var dataArray = doGetVirtualWater(com.trim(), year.trim());
	//alert(dataArray);
    var data = google.visualization.arrayToDataTable([
        ['Country', 'Virtual Water Footprint'],
        ['Thailand', 178951728],
        ['India', 24249870],
        ['Australia', 17971520],
        ['Vietnam', 13913172],
        ['Uruguay', 9926160]
    ]);

    var options = {};

    var formatter = new google.visualization.NumberFormat({pattern:'###,###'} );
    formatter.format(data, 1);
	
    var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
    chart.draw(data, options);
};

window.onresize = function(event) {
	drawRegionsMap();
};

function doGetVirtualWater(currCommodity, currYear) {
	return $.ajax({
		url: "virtualWaterRequest",
		type: "get",
		async: false,
        data: {
            commodity: currCommodity,
			year: currYear
	    }}).responseText;
}

function doGetXMLParsing() {
	$.ajax({
		url: "parseXMLRequest",
		type: "get",
        success: function(data) {
		},
		error: function(jqXHR, textStatus, errorThrown) {
			alert('error ' + textStatus + " " + errorThrown);
		}
	});
	return false;	
}

function doGetTXTParsing() {
	$.ajax({
		url: "parseTXTRequest",
		type: "get",
        success: function(data) {
		},
		error: function(jqXHR, textStatus, errorThrown) {
			alert('error ' + textStatus + " " + errorThrown);
		}
	});
	return false;	
}