google.load('visualization', '1', {'packages': ['geochart']});
google.setOnLoadCallback(drawRegionsMap);

var commodities = ["Apples", "Barley", "Beer", "Bovine Meat", "Butter, Ghee",
 "Coconuts - Incl Copra", "Coffee", "Cream", "Eggs + (Total)",
  "Fats, Animals, Raw", "Groundnuts (Shelled Eq)", "Grapes", "Maize", "Millet",
   "Mutton & Goat Meat", "Nuts", "Oats", "Offals + (Total)", "Olive Oil",
    "Olives", "Onions", "Palm Oil", "Palmkernel Oil", "Pepper", "Potatoes",
     "Rape and Mustard Oil", "Rape and Mustardseed", "Rice (Milled Equivalent)",
      "Rubber", "Rye", "Sorghum", "Soyabean Oil", "Soyabeans", "Sugar Beet",
	   "Sugar Cane", "Sunflowerseed Oil", "Sunflowerseed", "Sweeteners, Other",
	    "Tea", "Tobacco", "Wheat", "Wine"];

var no2012Values = ["Tobacco", "Wine", "Rubber", "Eggs + (Total)", "Tea", "Beer", "Sugar Cane"];

function drawRegionsMap() {
	var	locationString = location.search.substring(1);
	var com;
	if (locationString.length > 0) {
		com = (commodities[locationString - 1]);
		$("#commodityCaption").text(commodities[locationString - 1]);
	}
	else {
		com = "Rice (Milled Equivalent)";
	}
	var has2012 = true;
	var year = $("#homeWithMap").text().trim();
	if (year === '2012') {
		for (var k = 0; k < no2012Values.length; k++) {
			if (com === no2012Values[k]) {
				year = '2011';
				$("#homeWithMap").html("<span class='ui-btn-inner'><span class='ui-btn-text'>" + year + "</span></span>");
			} //if
		} //for
	}
	//year = '2009';
	var dataArray = doGetVirtualWater(com.trim(), year.trim());
	console.log("Results - " + com.trim() + " in " + year.trim() + ":");
	console.log(dataArray);
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