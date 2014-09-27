google.load('visualization', '1', {'packages': ['geochart', 'corechart']});
google.setOnLoadCallback(drawRegionsMap);
google.setOnLoadCallback(drawChart);

var commodities = ["Apples", "Barley", "Beer", "Bovine Meat", "Butter, Ghee",
 "Coconuts - Incl Copra", "Coffee", "Cream", "Eggs + (Total)",
  "Fats, Animals, Raw", "Groundnuts (Shelled Eq)", "Grapes", "Maize", "Millet",
   "Mutton & Goat Meat", "Nuts", "Oats", "Offals + (Total)", "Olive Oil",
    "Olives", "Onions", "Palm Oil", "Palmkernel Oil", "Pepper", "Potatoes",
     "Rape and Mustard Oil", "Rape and Mustardseed", "Rice (Milled Equivalent)",
      "Rubber", "Rye", "Sorghum", "Soyabean Oil", "Soyabeans", "Sugar Beet",
	   "Sugar Cane", "Sunflowerseed Oil", "Sunflowerseed", "Sweeteners, Other",
	    "Tea", "Tobacco", "Wheat", "Wine", "All"];
var colors = ["All", "Green", "Blue", "Grey"];
var no2012Values = ["Tobacco", "Wine", "Rubber", "Eggs + (Total)", "Tea", "Beer", "Sugar Cane"];

var abbreviations = [['AFG', 'Afghanistan'], 
['ALB', 'Albania'], 
['ALG', 'Algeria'], 
['ASA', 'American Samoa'], 
['ARG', 'Argentina'], 
['ARM', 'Armenia'], 
['AUS', 'Australia'],
['AUT', 'Austria'],
['AZE', 'Azerbaijan'],
['BAH', 'Bahamas'],
['BLR', 'Belarus'],
['BEL', 'Belgium'],
['BIH', 'Bosnia & Herzegovina'],
['BRA', 'Brazil'],
['BUL', 'Bulgaria'],
['CMR', 'Cameroon'],
['CAN', 'Canada'],
['CAF', 'Central African Republic'],
['CHA', 'Chad'],
['CHI', 'Chile'],
['CHN', 'China'],
['TPE', 'Chinese Taipei'],
['COL', 'Colombia'],
['CGO', 'Congo'],
['CRO', 'Croatia'],
['CUB', 'Cuba'],
['CYP', 'Cyprus'],
['CZE', 'Czech Republic'],
['COD', 'D.R. Congo'],
['DEN', 'Denmark'],
['DOM', 'Dominican Republic'],
['PRK', 'DPR Korea'],
['ECU', 'Ecuador'],
['EGY', 'Egypt'],
['ESA', 'El Salvador'],
['EST', 'Estonia'],
['ETH', 'Ethiopia'],
['FSM', 'Federated States of Micronesia'],
['FIN', 'Finland'],
['FRA', 'France'],
['MKD', 'FYR Macedonia'],
['GEO', 'Georgia'],
['GER', 'Germany'],
['GRE', 'Greece'],
['GUM', 'Guam'],
['GUA', 'Guatemala'],
['GBS', 'Guinea-Bissau'],
['HON', 'Honduras'],
['HUN', 'Hungary'],
['ICE', 'Iceland'],
['IND', 'India'],
['INA', 'Indonesia'],
['IRQ', 'Iraq'],
['IRL', 'Ireland'],
['IRI', 'Islamic Republic of Iran'],
['ISR', 'Israel'],
['ITA', 'Italy'],
['CIV', 'Ivory Coast'],
['JPN', 'Japan'],
['JOR', 'Jordan'],
['KAZ', 'Kazakhstan'],
['KEN', 'Kenya'],
['KOR', 'Korea'],
['KGZ', 'Kyrgyzstan'],
['LAT', 'Latvia'],
['LTU', 'Lithuania'],
['MAD', 'Madagascar'],
['MAS', 'Malaysia'],
['MLT', 'Malta'],
['MHL', 'Marshall Islands'],
['MRI', 'Mauritius'],
['MEX', 'Mexico'],
['MDA', 'Moldova'],
['MON', 'Monaco'],
['MGL', 'Mongolia'],
['MNE', 'Montenegro'],
['MAR', 'Morocco'],
['NAM', 'Namibia'],
['NEP', 'Nepal'],
['NED', 'Netherlands'],
['NZL', 'New Zealand'],
['NCA', 'Nicaragua'],
['NIG', 'Niger'],
['NGR', 'Nigeria'],
['NOR', 'Norway'],
['PAK', 'Pakistan'],
['PLW', 'Palau'],
['PAN', 'Panama'],
['PAR', 'Paraguay'],
['PER', 'Peru'],
['PHI', 'Philippines'],
['POL', 'Poland'],
['POR', 'Portugal'],
['PUR', 'Puerto Rico'],
['QAT', 'Qatar'],
['ROU', 'Romania'],
['RUS', 'Russian Federation'],
['SAM', 'Samoa'],
['SMR', 'San Marino'],
['SEN', 'Senegal'],
['SRB', 'Serbia'],
['SLE', 'Sierra Leone'],
['SIN', 'Singapore'],
['SVK', 'Slovakia'],
['SOL', 'Solomon Islands'],
['SLO', 'Slovenia'],
['SOM', 'Somalia'],
['RSA', 'South Africa'],
['ESP', 'Spain'],
['SRI', 'Sri Lanka'],
['SUD', 'Sudan'],
['SUR', 'Suriname'],
['SWE', 'Sweden'],
['SUI', 'Switzerland'],
['SYR', 'Syria'],
['TJK', 'Tajikistan'],
['THA', 'Thailand'],
['TUN', 'Tunisia'],
['TUR', 'Turkey'],
['TKM', 'Turkmenistan'],
['UKR', 'Ukraine'],
['UAE', 'United Arab Emirates'],
['GBR', 'United Kingdom'],
['USA', 'United States'],
['URU', 'Uruguay'],
['UZB', 'Uzbekistan'],
['VEN', 'Venezuela'],
['VIE', 'Viet Nam']];

var com;
var year;
var color;
var data;
var options;

function drawRegionsMap(drawOnly) {
	initCookiesIfNecessary();
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
		$("#commodityCaption a").text(com);
		$("#colorButton").html("<span class='ui-btn-inner'><span class='ui-btn-text'>" + color + "</span></span>");
		$("#yearButton").html("<span class='ui-btn-inner'><span class='ui-btn-text'>" + year + "</span></span>");
		var has2012 = true;
		for (var k = 0; k < no2012Values.length; k++) {
			if (com === no2012Values[k]) {
				$("#yearButton").attr("href", "page7.html?no2012")
				if (year === '2012') {
					$("#notYetAvailable").text("Displaying 2011 data because 2012 data for " + com.toLowerCase() + " is not yet available.").fadeIn(400).delay(2500).fadeOut(400);;
					year = '2011';
					$("#yearButton").html("<span class='ui-btn-inner'><span class='ui-btn-text'>" + year + "</span></span>");
				} //if
	
			} //if
		} //for
		if (com === "Olives") {
			if (year !== "2012") {
				$("#notYetAvailable").text("Displaying 2012 data because 2009-2011 data for " + com.toLowerCase() + " is insignificant.").fadeIn(400).delay(2500).fadeOut(400);
			}
			$("#yearButton").attr("href", "page7.html?only2012");
			year = '2012';
			$("#yearButton").html("<span class='ui-btn-inner'><span class='ui-btn-text'>" + year + "</span></span>");
		}
		var dataArray = $.parseJSON(doGetVirtualWater(com.trim(), year.trim(), color.trim()));
		drawDataTable(dataArray);
		var finalArray = new Array();
		var valueArray = new Array();
		var colorArray = new Array();
		var israelValue;
		finalArray[0] = ['Country', 'Virtual Water Export (mcm)'];
		var arrLength = dataArray.length;
		for (var j = 0; j < arrLength; j++) {
			finalArray[j+1] = [dataArray[j][0], dataArray[j][3]];
			valueArray[arrLength - 1 - j] = dataArray[j][3];
			if (dataArray[j][0] === "Israel") {
				colorArray[arrLength - 1 - j] = "#0038b8";
			}
			else {
				colorArray[arrLength - 1 - j] = "green";
			}
		}
		data = google.visualization.arrayToDataTable(finalArray);
	    options = {
	        displayMode: 'markers',
	        allowHtml: true,
	        colorAxis:  {
	        	values: valueArray,
	        	colors: colorArray
	        }
	    };
	} //if not drawOnly
    var formatter = new google.visualization.NumberFormat({pattern:' ###,###.####'} );
    formatter.format(data, 1);
    var chartDiv = document.getElementById('chart_div');
    if (chartDiv == null) {
    	return;
    }
    var chart = new google.visualization.GeoChart(chartDiv);
    chart.draw(data, options);
    
    google.visualization.events.addListener(chart, 'select', function() {
        var countries = ""
            for (var z = 0; z < dataArray.length; z ++) {
            	countries+=dataArray[z][0] + "&";
            }
        var leng = countries.length;
        countries = countries.substring(0, leng-1);
        console.log(countries);
        var selection = chart.getSelection();

        // if same city is clicked twice in a row
        // it is "unselected", and selection = []
        if (selection.length == 0) {
            $("#theTable > tbody tr").removeAttr('style');
        }
        else if(typeof selection[0] !== "undefined") {
          var value = data.getValue(selection[0].row, 0);
          $("#theTable > tbody tr").removeAttr('style');
          $("#theTable > tbody tr:eq(" + selection[0].row + ")").css("background-color","#00CCFF");
          location.href="page10.html?"+getCookie("commodity")+"&"+getCookie("color")+"&"+countries;
        }
    });

    
};

window.onresize = function(event) {
	var mq = window.matchMedia( "(min-width: 850px)" );
	var mq2 = window.matchMedia( "(min-width: 390px)" );
	replaceWithAbbreviations();
	if (!mq.matches) {
		$("#theTable tr:eq(0) th:eq(3)").html("Average (mcm/ton)");
		$("#theTable tr:eq(0) th:eq(5)").html("Total (mcm)");
	}
	else {
		$("#theTable tr:eq(0) th:eq(3)").html("Average Virtual Water Cost (mcm/ton)");
		$("#theTable tr:eq(0) th:eq(5)").html("Total Virtual Water (mcm)");
	}
	if (mq2.matches) {
		unReplaceAbbreviations();
	}
	drawRegionsMap("yes");
};


function drawDataTable(dataArray) {
	var mq = window.matchMedia( "(min-width: 850px)" );
	var mq2 = window.matchMedia( "(min-width: 390px)" );
	var table = document.getElementById("theTable");
	if (table == null) {
		return;
	}
	var rowCount = table.rows.length; //should be 7 (including thead)
	var columnCount = table.rows[0].cells.length; //should = 6
	if (!mq.matches) {
		$("#theTable tr:eq(0) th:eq(3)").html("Average (mcm/ton)");
		$("#theTable tr:eq(0) th:eq(5)").html("Total (mcm)");
	}
	else {
		$("#theTable tr:eq(0) th:eq(3)").html("Average Virtual Water Cost (mcm/ton)");
		$("#theTable tr:eq(0) th:eq(5)").html("Total Virtual Water (mcm)");
	}
	for (var i = 0; i < dataArray.length; i++) {
		for (var j = 0; j < columnCount; j++) {
			if (j != 0 && j != 2 && j != 4) {
				$('#theTable tr:eq(' + (i + 1) + ') td:eq(' + j + ')').text(addCommaSeparator(dataArray[i][Math.round(j/2)].toString()));
				
			}
			else if (j == 0) { //This is the "country" column.
				if (dataArray[i][j] === "Israel") {
					$('#theTable tr:eq(' + (i + 1) + ') td:eq(' + j + ')').text(dataArray[i][j]).css('font-style', 'italic');
				}
				else { //Not Israel, so don't italicize
					$('#theTable tr:eq(' + (i + 1) + ') td:eq(' + j + ')').text(dataArray[i][j]);
				}
			}
		}
	}
	if (dataArray.length < 6) {
		$("#theTable tr:eq(6)").remove();
	}
	if (dataArray.length < 5) {
		$("#theTable tr:eq(5)").remove();
	}
	if (dataArray.length < 4) {
		$("#theTable tr:eq(4)").remove();
	}
	if (dataArray.length < 3) {
		$("#theTable tr:eq(3)").remove();
	}
	if (dataArray.length < 2) {
		$("#theTable tr:eq(2)").remove();
	}
	$("#theTable > tbody > tr:last-child td + td + td").css("border-bottom-width", "1px");
	replaceWithAbbreviations();
}

function replaceWithAbbreviations() {
	var mq2 = window.matchMedia( "(min-width: 390px)" );
	if (!mq2.matches) {
		var table = document.getElementById("theTable");
		if (table == null) {
			return;
		}
		var rowCount = table.rows.length; //should be 7 (including thead)
		for (var i = 1; i < rowCount; i++) {
			var theCountry = $("#theTable tr:eq("+i+") td:eq(0)").text().trim();
			for (var j = 0; j < abbreviations.length; j++) {
				if (abbreviations[j][1] === theCountry) {
					$("#theTable tr:eq("+i+") td:eq(0)").html(abbreviations[j][0]);
				}
			}
		}
	}
}

function unReplaceAbbreviations() {
	var table = document.getElementById("theTable");
	if (table == null) {
		return;
	}
	var rowCount = table.rows.length; //should be 7 (including thead)
	for (var i = 1; i < rowCount; i++) {
		var theCountry = $("#theTable tr:eq("+i+") td:eq(0)").text().trim();
		for (var j = 0; j < abbreviations.length; j++) {
			if (abbreviations[j][0] === theCountry) {
				$("#theTable tr:eq("+i+") td:eq(0)").html(abbreviations[j][1]);
			}
		}
	}
}

function addCommaSeparator(strNumber) {
    var parts = strNumber.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");}

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

function doGetChartData(currCommodity, currCountry, currColor) {
	return $.ajax({
		url: "virtualWaterRequest",
		type: "get",
		async: false,
        data: {
            commodity: currCommodity,
			country: currCountry,
			color: currColor
	    }}).responseText;
}

function doGetCommodity() {
	return getCookie("commodity");
//	return $.ajax({
//		url: "commodityRequest",
//		type: "get",
//		async: false,
//        data: {
//	    }}).responseText;
}

function doSetCommodity(currCommodity) {
	document.cookie = "commodity="+currCommodity;
//	return $.ajax({
//		url: "commoditySetRequest",
//		type: "post",
//		async: false,
//        data: {
//			commodity: currCommodity
//	    }}).responseText;
}

function doGetYear() {
	return getCookie("year");
//	return $.ajax({
//		url: "yearRequest",
//		type: "get",
//		async: false,
//        data: {
//	    }}).responseText;
}

function doSetYear(currYear) {
	document.cookie = "year="+currYear;
	console.log(getCookie("year"));
//	return $.ajax({
//		url: "yearSetRequest",
//		type: "post",
//		async: false,
//        data: {
//			year: currYear
//	    }}).responseText;
}

function doGetColor() {
	return getCookie("color");
//	return $.ajax({
//		url: "colorRequest",
//		type: "get",
//		async: false,
//        data: {
//	    }}).responseText;
}

function doSetColor(currColor) {
	document.cookie="color="+currColor;

//	return $.ajax({
//		url: "colorSetRequest",
//		type: "post",
//		async: false,
//        data: {
//			color: currColor
//	    }}).responseText;
}

function doGetChartData(currCommodity, currCountries, currColor) {
	return $.ajax({
		url: "chartDataRequest",
		type: "get",
		async: false,
        data: {
            commodity: currCommodity,
			country: currCountries,
			color: currColor
	    }}).responseText;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return null;
}

function initCookiesIfNecessary() {
	if (getCookie("color") == null || getCookie("year") == null || getCookie("commodity") == null) {
		document.cookie="color=Green";
		document.cookie="year=2012";
		document.cookie="commodity=Apples";
	}
}

function drawChart() {
		$("#countryCaption").text(decodeURI(location.search.substring(1).split("&")[1]));
		var	locationString = location.search.substring(1);
		var input = locationString.split("&");
		commodity = input[0];
		color = input[1];
		var dataArr = new Array();
		var countries = new Array();
		dataArr.push("Year");
		for (var i = 2; i < input.length; i++) {
			countries.push(decodeURI(input[i]));
			dataArr.push(decodeURI(input[i]));
		}
		console.log(dataArr);
		var dataJson = JSON.parse(doGetChartData(commodity, countries, color));
//		var dataArray = []
//		var data = google.visualization.arrayToDataTable([
//		                                                  ['Year', country1, country2],
//		                                                  ['2001',  1000,      400],
//		                                                  ['2002',  1000,      400],
//		                                                  ['2003',  1000,      400],
//		                                                  ['2004',  1000,      400],
//		                                                  ['2005',  1000,      400],
//		                                                  ['2006',  1000,      400],
//		                                                  ['2007',  1000,      400],
//		                                                  ['2008',  1170,      460],
//		                                                  ['2009',  660,       1120],
//		                                                  ['2010',  1030,      540],
//		                                                  ['2011',  1000,      400],
//		                                                  ['2012',  1000,      400]
//		                                                  ]);
//
//		var options = {
//				title: 'Company Performance'
//		};
//
//		var chart = new google.visualization.LineChart(document.getElementById('chart_div2'));
//
//		chart.draw(data, options);
}
//	var chartData = {
//		    labels: ["2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012"],
//		    datasets: [
//		        {
//		            label: country,
//		            fillColor: "rgba(220,220,220,0.2)",
//		            strokeColor: "rgba(220,220,220,1)",
//		            pointColor: "rgba(220,220,220,1)",
//		            pointStrokeColor: "#fff",
//		            pointHighlightFill: "#fff",
//		            pointHighlightStroke: "rgba(220,220,220,1)",
//		            data: [dataJson.total2001.toFixed(2), dataJson.total2002.toFixed(2),
//		                   dataJson.total2003.toFixed(2), dataJson.total2004.toFixed(2),
//		                   dataJson.total2005.toFixed(2), dataJson.total2006.toFixed(2),
//		                   dataJson.total2007.toFixed(2), dataJson.total2008.toFixed(2), 
//		                   dataJson.total2009.toFixed(2), dataJson.total2010.toFixed(2),
//		                   dataJson.total2011.toFixed(2), dataJson.total2012.toFixed(2)]
//		        }
