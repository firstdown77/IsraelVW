google.load('visualization', '1', {'packages': ['geochart']});
google.setOnLoadCallback(drawRegionsMap);

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
}

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