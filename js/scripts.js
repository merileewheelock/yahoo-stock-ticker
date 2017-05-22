// 1. Give the user the ability to search for multiple symbols.
// 2. Multiple will bring back an array inside of quotes. A single will bring back one object.


// 1. Make an AJAX request when the user submits the form
// 2. Get the user's input
// 3. When the AJAX has a response/JSON, check to see if there was any valid data
// 4. If there is, load up the table with the data


$(document).ready(function(){

	$('#arrow1').click(function(){
		$('#page1,#page2').css({
			'right':'100vw'
		});
	});
	$('#arrow2').click(function(){
		$('#page1,#page2').css({
			'right':'0vw'
		});
	});

	
	$('.yahoo-finance-form').submit((event)=>{
		// Prevent the browser from submitting the form. JS will handle everything.
		event.preventDefault();
		var symbol = $('#symbol').val();
		var userStockSavedIfAny = localStorage.getItem("lastSymbolSearched");
		localStorage.setItem("lastSymbolSearched", userStockSavedIfAny + "," + symbol);
	// console.log(userStockSavedIfAny);
		if (userStockSavedIfAny != undefined){
			// yahooAPI(symbol)
		}else{
			$('#stock-ticker-body').append("You have not searched for any yet");
		}
		// console.log("The form was just submitted");
		// Get whatever the user typed and stash it in a var
		 // Input tags have .val, all others have .html
		
		// Store symbol in localStorage (new version of cookies) that will last even after the browser closes or changes pages
		// Find local storage under console -> applications tab
		
		
		yahooAPI(symbol);
		$('#stock-table').DataTable();
	});

	function yahooAPI(symbol){
		// var url = "http://query.yahooapis.com/v1/public/yql?q=env%20%27store://datatables.org/alltableswithkeys%27;select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22" + symbol + "%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json";
		var url = encodeURI(`http://query.yahooapis.com/v1/public/yql?q=env 'store://datatables.org/alltableswithkeys';select * from yahoo.finance.quotes where symbol in ("${symbol}");&format=json`);
		// console.log(url);
		// Below is an AJAX request to put code returned into data
		
		$.getJSON(url,(theDataJSFound)=>{
			// console.log(theDataJSFound);

			if (theDataJSFound.query.count > 1){
				var stocksArray = theDataJSFound.query.results.quote; // quote is an array, not object
				var newRow = '';
				// we need to loop
				for (let i = 0; i < stocksArray.length; i++){
					newRow += buildStockRow(stocksArray[i]);
				}
			}else{
				// we don't need to loop
				var newRow = buildStockRow(theDataJSFound.query.results.quote);
			}
			// var newRow = buildStockRow(theDataJSFound);
			// Update th HTML inside of the table's body
			$('#stock-ticker-body').append(newRow);
			$('#stock-table').DataTable();
		});
	}

	function buildStockRow(stockInfo){
		// var stockInfo = data.query.results.quote;
		console.log(stockInfo);
		var newHTML = '';
		if (stockInfo.Ask == null){
			stockInfo.Ask = "Not available";
		}
		if (stockInfo.Bid == null){
			stockInfo.Bid = "Not available";
		}

		// This is to determine if change is + or -. Uses bootstrap green and red.
		if(stockInfo.Change !== null){
			if (stockInfo.Change.indexOf('+') > -1){
				var classChange = "success";
			}else{
				var classChange = "danger";
			}
		}

		newHTML += '<tr>';
			newHTML += '<td>'+stockInfo.Symbol+'</td>';
			newHTML += '<td>'+stockInfo.Name+'</td>';
			newHTML += '<td>'+stockInfo.Ask+'</td>';
			newHTML += '<td>'+stockInfo.Bid+'</td>';
			newHTML += '<td class="bg-'+classChange+'">'+stockInfo.Change+'</td>';
		newHTML += '</tr>';
		return newHTML
	}
});