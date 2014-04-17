var currentCountry;
var currentVirtualWaterData;

google.load('visualization', '1', {'packages': ['geochart']});
google.setOnLoadCallback(drawRegionsMap);

function drawRegionsMap() {
	//doGetVirtualWater();
	//onFinish:
	var data = currentVirtualWaterData;
    var data = google.visualization.arrayToDataTable([
        ['Country', 'Virtual Water Footprint'],
        ['Thailand', 178951728],
        ['India', 24249870],
        ['Australia', 17971520],
        ['Vietnam', 13913172],
        ['Uruguay', 9926160],
        ['United States', 1847223],
        ['Italy', 1477812],
        ['Spain', 546132],
        ['United Kingdom', 336237],
        ['Egypt', 25668]
    ]);

    var options = 
    {
        magnifyingGlass: {enable: true, zoomFactor: 5.0},
    };

    var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
    chart.draw(data, options);
};

window.onresize = function(event) {
	drawRegionsMap();
}

function doGetVirtualWater() {
	$.ajax({
		url: "virtualWaterRequest",
		type: "get",
        data: {
            country: currentCountry
	    },
        success: function(data) {
		    currentVirtualWaterData = data;
		}
	});
	return false;	
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