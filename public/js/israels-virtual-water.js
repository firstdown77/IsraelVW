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

function drawRegionsMap(drawOnly) {
	if (drawOnly !== "yes") {
		var	locationString = location.search.substring(1);
		var com;
		var year;
		if (locationString.length > 0 && locationString.length < 3) {
			com = (commodities[locationString - 1]);
			doSetCommodity(com);
			year = doGetYear();
		}
		else if (locationString.length == 4) {
			year = locationString;
			doSetYear(year);
			com = doGetCommodity();
		}
		else { //Default
			com = doGetCommodity();
			year = doGetYear();
		}
		$("#commodityCaption").text(com);
		$("#homeWithMap").html("<span class='ui-btn-inner'><span class='ui-btn-text'>" + year + "</span></span>");
		var has2012 = true;
		if (year === '2012') {
			for (var k = 0; k < no2012Values.length; k++) {
				if (com === no2012Values[k]) {
					year = '2011';
					$("#homeWithMap").html("<span class='ui-btn-inner'><span class='ui-btn-text'>" + year + "</span></span>");
				} //if
			} //for
		}
	} //if not drawOnly
	else { //else if drawOnly
		com = doGetCommodity();
		year = doGetYear();
	}
	var dataArray = $.parseJSON(doGetVirtualWater(com.trim(), year.trim()));
	var finalArray = new Array();
	finalArray[0] = ['Country', 'Virtual Water Footprint'];
	for (var j = 0; j < dataArray.length; j++) {
		var delimiter = dataArray[j].indexOf("-");
		finalArray[j+1] = [dataArray[j].substring(0, delimiter), parseInt(dataArray[j].substring(delimiter+1))];
	}
	console.log(finalArray);
	var data = google.visualization.arrayToDataTable(finalArray);
    var options = {};
    var formatter = new google.visualization.NumberFormat({pattern:'###,###'} );
    formatter.format(data, 1);
    var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
	//google.visualization.events.addListener(chart, 'ready', myReadyHandler);
    chart.draw(data, options);
};

window.onresize = function(event) {
	drawRegionsMap("yes");
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

function doGetCommodity() {
	return $.ajax({
		url: "commodityRequest",
		type: "get",
		async: false,
        data: {
	    }}).responseText;
}

function doSetCommodity(currCommodity) {
	return $.ajax({
		url: "commoditySetRequest",
		type: "post",
		async: false,
        data: {
			commodity: currCommodity
	    }}).responseText;
}

function doGetYear() {
	return $.ajax({
		url: "yearRequest",
		type: "get",
		async: false,
        data: {
	    }}).responseText;
}

function doSetYear(currYear) {
	return $.ajax({
		url: "yearSetRequest",
		type: "post",
		async: false,
        data: {
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