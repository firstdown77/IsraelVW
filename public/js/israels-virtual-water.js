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
var colors = ["All", "Green", "Blue", "Grey"];
var no2012Values = ["Tobacco", "Wine", "Rubber", "Eggs + (Total)", "Tea", "Beer", "Sugar Cane"];

var com;
var year;
var color;
var data;

function drawRegionsMap(drawOnly) {
	if (drawOnly !== "yes") {
		var	locationString = location.search.substring(1);
		if (locationString.length > 0 && locationString.length < 3) {
			com = (commodities[locationString - 1]);
			doSetCommodity(com);
			year = doGetYear();
			color = doGetColor();
		}
		else if (locationString.length == 3) {
			color = colors[locationString.substring(2) - 1];
			doSetColor(color);
			year = doGetYear();
			com = doGetCommodity();
		}
		else if (locationString.length == 4) {
			year = locationString;
			doSetYear(year);
			com = doGetCommodity();
			color = doGetColor();
		}
		else { //Default
			com = doGetCommodity();
			year = doGetYear();
			color = doGetColor();
		}
		$("#commodityCaption").text(com);
		$("#colorButton").html("<span class='ui-btn-inner'><span class='ui-btn-text'>" + color + "</span></span>");
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
		var dataArray = $.parseJSON(doGetVirtualWater(com.trim(), year.trim(), color.trim()));
		var finalArray = new Array();
		finalArray[0] = ['Country', 'Virtual Water Footprint (m\xB3)'];
		for (var j = 0; j < dataArray.length; j++) {
			var delimiter = dataArray[j].indexOf("-");
			finalArray[j+1] = [dataArray[j].substring(0, delimiter), parseInt(dataArray[j].substring(delimiter+1))];
		}
		console.log(finalArray);
		data = google.visualization.arrayToDataTable(finalArray);
	} //if not drawOnly
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

function doGetVirtualWater(currCommodity, currYear, currColor) {
	return $.ajax({
		url: "virtualWaterRequest",
		type: "get",
		async: false,
        data: {
            commodity: currCommodity,
			year: currYear,
			color: currColor
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

function doGetColor() {
	return $.ajax({
		url: "colorRequest",
		type: "get",
		async: false,
        data: {
	    }}).responseText;
}

function doSetColor(currColor) {
	console.log("In");
	return $.ajax({
		url: "colorSetRequest",
		type: "post",
		async: false,
        data: {
			color: currColor
	    }}).responseText;
}

function doGetXMLParsing() {
	$.ajax({
		url: "parseXMLRequest",
		type: "get",
        success: function(data) {
			$("#xmlParseButton").closest('.ui-btn').hide();
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
			$("#txtParseButton").closest('.ui-btn').hide();
		},
		error: function(jqXHR, textStatus, errorThrown) {
			alert('error ' + textStatus + " " + errorThrown);
		}
	});
	return false;	
}