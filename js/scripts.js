// 1. Give the user the ability to search for multiple symbols.
// 2. Multiple will bring back an array inside of quotes. A single will bring back one object.


// 1. Make an AJAX request when the user submits the form
// 2. Get the user's input
// 3. When the AJAX has a response/JSON, check to see if there was any valid data
// 4. If there is, load up the table with the data


$(document).ready(function(){
	var userStockSavedIfAny = localStorage.getItem("lastSymbolSearched");
	console.log(userStockSavedIfAny);

	$('.yahoo-finance-form').submit((event)=>{
		// Prevent the browser from submitting the form. JS will handle everything.
		event.preventDefault();
		// console.log("The form was just submitted");
		// Get whatever the user typed and stash it in a var
		var symbol = $('#symbol').val(); // Input tags have .val, all others have .html
		
		// Store symbol in localStorage (new version of cookies) that will last even after the browser closes or changes pages
		// Find local storage under console -> applications tab
		localStorage.setItem("lastSymbolSearched", symbol);
		
		var url = "http://query.yahooapis.com/v1/public/yql?q=env%20%27store://datatables.org/alltableswithkeys%27;select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22" + symbol + "%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json";
		// console.log(url);
		// Below is an AJAX request to put code returned into data
		
		$.getJSON(url,(theDataJSFound)=>{
			// console.log(theDataJSFound);
			var stockInfo = theDataJSFound.query.results.quote; // these are properties in the console
			// console.log(stockInfo);

			// Build the table's new html
			var newHTML = '';
			newHTML += '<tr>';
				newHTML += '<td>'+stockInfo.Symbol+'</td>';
				newHTML += '<td>'+stockInfo.Name+'</td>';
				newHTML += '<td>'+stockInfo.Ask+'</td>';
				newHTML += '<td>'+stockInfo.Bid+'</td>';
				newHTML += '<td>'+stockInfo.Change+'</td>';
			newHTML += '</tr>';

			// Update th HTML inside of the table's body
			$('#stock-ticker-body').html(newHTML);
		});
	});
});
// console.log("I'm the last line... but I'm not last because JS is async!")