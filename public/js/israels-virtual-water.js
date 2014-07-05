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
	    "Tea", "Tobacco", "Wheat", "Wine", "All"];
var colors = ["All", "Green", "Blue", "Grey"];
var no2012Values = ["Tobacco", "Wine", "Rubber", "Eggs + (Total)", "Tea", "Beer", "Sugar Cane"];

var abbreviations = [['AF', 'Afghanistan'],
['AX', 'Aland Islands'],
['AL', 'Albania'],
['DZ', 'Algeria'],
['AS', 'American Samoa'],
['AD', 'Andorra'],
['AO', 'Angola'],
['AI', 'Anguilla'],
['AQ', 'Antarctica'],
['AG', 'Antigua and Barbuda'],
['AR', 'Argentina'],
['AM', 'Armenia'],
['AW', 'Aruba'],
['AU', 'Australia'],
['AT', 'Austria'],
['AZ', 'Azerbaijan'],
['BS', 'Bahamas the'],
['BH', 'Bahrain'],
['BD', 'Bangladesh'],
['BB', 'Barbados'],
['BY', 'Belarus'],
['BE', 'Belgium'],
['BZ', 'Belize'],
['BJ', 'Benin'],
['BM', 'Bermuda'],
['BT', 'Bhutan'],
['BO', 'Bolivia'],
['BA', 'Bosnia and Herzegovina'],
['BW', 'Botswana'],
['BV', 'Bouvet Island (Bouvetoya)'],
['BR', 'Brazil'],
['IO', 'British Indian Ocean Territory (Chagos Archipelago)'],
['VG', 'British Virgin Islands'],
['BN', 'Brunei Darussalam'],
['BG', 'Bulgaria'],
['BF', 'Burkina Faso'],
['BI', 'Burundi'],
['KH', 'Cambodia'],
['CM', 'Cameroon'],
['CA', 'Canada'],
['CV', 'Cape Verde'],
['KY', 'Cayman Islands'],
['CF', 'Central African Republic'],
['TD', 'Chad'],
['CL', 'Chile'],
['CN', 'China'],
['CX', 'Christmas Island'],
['CC', 'Cocos (Keeling) Islands'],
['CO', 'Colombia'],
['KM', 'Comoros the'],
['CD', 'Congo'],
['CG', 'Congo the'],
['CK', 'Cook Islands'],
['CR', 'Costa Rica'],
['CI', 'Cote d\'Ivoire'],
['HR', 'Croatia'],
['CU', 'Cuba'],
['CY', 'Cyprus'],
['CZ', 'Czech Republic'],
['DK', 'Denmark'],
['DJ', 'Djibouti'],
['DM', 'Dominica'],
['DO', 'Dominican Republic'],
['EC', 'Ecuador'],
['EG', 'Egypt'],
['SV', 'El Salvador'],
['GQ', 'Equatorial Guinea'],
['ER', 'Eritrea'],
['EE', 'Estonia'],
['ET', 'Ethiopia'],
['FO', 'Faroe Islands'],
['FK', 'Falkland Islands (Malvinas)'],
['FJ', 'Fiji'],
['FI', 'Finland'],
['FR', 'France'],
['GF', 'French Guiana'],
['PF', 'French Polynesia'],
['TF', 'French Southern Territories'],
['GA', 'Gabon'],
['GM', 'Gambia the'],
['GE', 'Georgia'],
['DE', 'Germany'],
['GH', 'Ghana'],
['GI', 'Gibraltar'],
['GR', 'Greece'],
['GL', 'Greenland'],
['GD', 'Grenada'],
['GP', 'Guadeloupe'],
['GU', 'Guam'],
['GT', 'Guatemala'],
['GG', 'Guernsey'],
['GN', 'Guinea'],
['GW', 'Guinea-Bissau'],
['GY', 'Guyana'],
['HT', 'Haiti'],
['HM', 'Heard Island and McDonald Islands'],
['VA', 'Holy See (Vatican City State)'],
['HN', 'Honduras'],
['HK', 'Hong Kong'],
['HU', 'Hungary'],
['IS', 'Iceland'],
['IN', 'India'],
['ID', 'Indonesia'],
['IR', 'Iran'],
['IQ', 'Iraq'],
['IE', 'Ireland'],
['IM', 'Isle of Man'],
['IL', 'Israel (Export)'],
['IT', 'Italy'],
['JM', 'Jamaica'],
['JP', 'Japan'],
['JE', 'Jersey'],
['JO', 'Jordan'],
['KZ', 'Kazakhstan'],
['KE', 'Kenya'],
['KI', 'Kiribati'],
['KP', 'Korea'],
['KR', 'Korea'],
['KW', 'Kuwait'],
['KG', 'Kyrgyz Republic'],
['LA', 'Lao'],
['LV', 'Latvia'],
['LB', 'Lebanon'],
['LS', 'Lesotho'],
['LR', 'Liberia'],
['LY', 'Libyan Arab Jamahiriya'],
['LI', 'Liechtenstein'],
['LT', 'Lithuania'],
['LU', 'Luxembourg'],
['MO', 'Macao'],
['MK', 'Macedonia'],
['MG', 'Madagascar'],
['MW', 'Malawi'],
['MY', 'Malaysia'],
['MV', 'Maldives'],
['ML', 'Mali'],
['MT', 'Malta'],
['MH', 'Marshall Islands'],
['MQ', 'Martinique'],
['MR', 'Mauritania'],
['MU', 'Mauritius'],
['YT', 'Mayotte'],
['MX', 'Mexico'],
['FM', 'Micronesia'],
['MD', 'Moldova'],
['MC', 'Monaco'],
['MN', 'Mongolia'],
['ME', 'Montenegro'],
['MS', 'Montserrat'],
['MA', 'Morocco'],
['MZ', 'Mozambique'],
['MM', 'Myanmar'],
['NA', 'Namibia'],
['NR', 'Nauru'],
['NP', 'Nepal'],
['AN', 'Netherlands Antilles'],
['NL', 'Netherlands'],
['NC', 'New Caledonia'],
['NZ', 'New Zealand'],
['NI', 'Nicaragua'],
['NE', 'Niger'],
['NG', 'Nigeria'],
['NU', 'Niue'],
['NF', 'Norfolk Island'],
['MP', 'Northern Mariana Islands'],
['NO', 'Norway'],
['OM', 'Oman'],
['PK', 'Pakistan'],
['PW', 'Palau'],
['PS', 'Palestinian Territory'],
['PA', 'Panama'],
['PG', 'Papua New Guinea'],
['PY', 'Paraguay'],
['PE', 'Peru'],
['PH', 'Philippines'],
['PN', 'Pitcairn Islands'],
['PL', 'Poland'],
['PT', 'Portugal'],
['PR', 'Puerto Rico'],
['QA', 'Qatar'],
['RE', 'Reunion'],
['RO', 'Romania'],
['RU', 'Russian Federation'],
['RW', 'Rwanda'],
['BL', 'Saint Barthelemy'],
['SH', 'Saint Helena'],
['KN', 'Saint Kitts and Nevis'],
['LC', 'Saint Lucia'],
['MF', 'Saint Martin'],
['PM', 'Saint Pierre and Miquelon'],
['VC', 'Saint Vincent and the Grenadines'],
['WS', 'Samoa'],
['SM', 'San Marino'],
['ST', 'Sao Tome and Principe'],
['SA', 'Saudi Arabia'],
['SN', 'Senegal'],
['RS', 'Serbia'],
['SC', 'Seychelles'],
['SL', 'Sierra Leone'],
['SG', 'Singapore'],
['SK', 'Slovakia'],
['SI', 'Slovenia'],
['SB', 'Solomon Islands'],
['SO', 'Somalia, Somali Republic'],
['ZA', 'South Africa'],
['GS', 'South Georgia and the South Sandwich Islands'],
['ES', 'Spain'],
['LK', 'Sri Lanka'],
['SD', 'Sudan'],
['SR', 'Suriname'],
['SJ', 'Svalbard & Jan Mayen Islands'],
['SZ', 'Swaziland'],
['SE', 'Sweden'],
['CH', 'Switzerland'],
['SY', 'Syrian Arab Republic'],
['TW', 'Taiwan'],
['TJ', 'Tajikistan'],
['TZ', 'Tanzania'],
['TH', 'Thailand'],
['TL', 'Timor-Leste'],
['TG', 'Togo'],
['TK', 'Tokelau'],
['TO', 'Tonga'],
['TT', 'Trinidad and Tobago'],
['TN', 'Tunisia'],
['TR', 'Turkey'],
['TM', 'Turkmenistan'],
['TC', 'Turks and Caicos Islands'],
['TV', 'Tuvalu'],
['UG', 'Uganda'],
['UA', 'Ukraine'],
['AE', 'United Arab Emirates'],
['GB', 'United Kingdom'],
['US', 'United States'],
['UM', 'United States Minor Outlying Islands'],
['VI', 'United States Virgin Islands'],
['UY', 'Uruguay'],
['UZ', 'Uzbekistan'],
['VU', 'Vanuatu'],
['VE', 'Venezuela'],
['VN', 'Vietnam'],
['WF', 'Wallis and Futuna'],
['EH', 'Western Sahara'],
['YE', 'Yemen'],
['ZM', 'Zambia'],
['ZW', 'Zimbabwe']];


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
		drawDataTable(dataArray);
		var finalArray = new Array();
		finalArray[0] = ['Country', 'Virtual Water Footprint (m\xB3)'];
		for (var j = 0; j < dataArray.length; j++) {
			finalArray[j+1] = [dataArray[j][0], parseInt(dataArray[j][3])];
		}
//		console.log(finalArray);
		data = google.visualization.arrayToDataTable(finalArray);
	} //if not drawOnly
    var options = {
        displayMode: 'markers',
        colorAxis: {colors: ['yellow', 'red']}
    };
    var formatter = new google.visualization.NumberFormat({pattern:'###,###'} );
    formatter.format(data, 1);
    var chartDiv = document.getElementById('chart_div');
    if (chartDiv == null) {
    	return;
    }
    var chart = new google.visualization.GeoChart(chartDiv);
    chart.draw(data, options);
};

window.onresize = function(event) {
	var mq = window.matchMedia( "(min-width: 850px)" );
	var mq2 = window.matchMedia( "(min-width: 390px)" );
	replaceWithAbbreviations();
	if (!mq.matches) {
		//$("#theTable tr:eq(0) td:eq(1)").html("Tons");
		$("#theTable tr:eq(0) td:eq(2)").html("Avg. (m<sup>3</sup>/ton)");
		$("#theTable tr:eq(0) td:eq(3)").html("Total (m<sup>3</sup>)");
	}
	else {
		//$("#theTable tr:eq(0) td:eq(1)").html("Quantity (tons)");
		$("#theTable tr:eq(0) td:eq(2)").html("Average Footprint (m<sup>3</sup>/ton)");
		$("#theTable tr:eq(0) td:eq(3)").html("Israel's Total Footprint (m<sup>3</sup>)");
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
	var columnCount = table.rows[0].cells.length; //should = 4
	if (!mq.matches) {
		//$("#theTable tr:eq(0) td:eq(1)").html("Tons");
		$("#theTable tr:eq(0) td:eq(2)").html("Avg. (m<sup>3</sup>/ton)");
		$("#theTable tr:eq(0) td:eq(3)").html("Total (m<sup>3</sup>)");
	}
	for (var i = 0; i < dataArray.length; i++) {
		for (var j = 0; j < columnCount; j++) {
			if (j !== 0) {
				$('#theTable tr:eq(' + (i + 1) + ') td:eq(' + j + ')').text(addCommaSeparator(dataArray[i][j].toString()));
				
			}
			else { //This is the "country" column.
				if (dataArray[i][j] === "Israel") {
					$('#theTable tr:eq(' + (i + 1) + ') td:eq(' + j + ')').text(dataArray[i][j] + " (Export)").css('font-style', 'italic');
				}
				else { //Not Israel, so don't italicize
					$('#theTable tr:eq(' + (i + 1) + ') td:eq(' + j + ')').text(dataArray[i][j]);
				}
			}
		}
	}
	if (dataArray.length < 6) {
		$("#theTable tr:eq(6)").hide();
	}
	if (dataArray.length < 5) {
		$("#theTable tr:eq(5)").hide();
	}
	if (dataArray.length < 4) {
		$("#theTable tr:eq(4)").hide();
	}
	if (dataArray.length < 3) {
		$("#theTable tr:eq(3)").hide();
	}
	if (dataArray.length < 2) {
		$("#theTable tr:eq(2)").hide();
	}
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
			console.log(theCountry);
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
		console.log(theCountry);
		for (var j = 0; j < abbreviations.length; j++) {
			if (abbreviations[j][0] === theCountry) {
				$("#theTable tr:eq("+i+") td:eq(0)").html(abbreviations[j][1]);
			}
		}
	}
}

function addCommaSeparator(strNumber) {
	return strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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

function doGetExportsParsing() {
	$.ajax({
		url: "parseExportsRequest",
		type: "get",
        success: function(data) {
		},
		error: function(jqXHR, textStatus, errorThrown) {
			alert('error ' + textStatus + " " + errorThrown);
		}
	});
	return false;	
}