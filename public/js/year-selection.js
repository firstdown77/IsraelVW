/**
 * JS page for the year selection page.
 */
$(document).ready(function() {
	var	locationString = location.search.substring(1);
	if (locationString.length == 6) {
		window.onload = function() {
			var	locationString = location.search.substring(1);
			document.getElementById("yearSelect").style.display = "none"
		}
	}
	else if (locationString.length == 8) {
		window.onload = function() {
			var	locationString = location.search.substring(1);
			document.getElementById("yearSelect").nextElementSibling.nextElementSibling.nextElementSibling.style.display = "none";
			document.getElementById("yearSelect").nextElementSibling.nextElementSibling.style.display = "none";
			document.getElementById("yearSelect").nextElementSibling.style.display = "none";
		}
	}
});
