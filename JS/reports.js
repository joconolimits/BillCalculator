$( function() { 
	var dateString, from, fromYear, fromMonth, to, toYear, toMonth ;
	
    $( "#from" ).datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: "yy/mm/dd",
		showAnim: "fold",
		maxDate: "0",
		onSelect: function( selectedDate ) {
		$( "#to" ).datepicker( "option", "minDate", selectedDate );
			from = $( "#from" ).datepicker( "getDate" );
			fromYear = from.getFullYear();
			fromMonth = from.getMonth()+1;
			from = fromYear * 100 + fromMonth;
	  }
	});
	$( "#to" ).datepicker({
		changeYear: true,
		changeMonth: true,
		dateFormat: "yy/mm/dd",
		showAnim: "fold",
		maxDate: "0",
		onSelect: function( selectedDate ) {
			$( "#from" ).datepicker( "option", "maxDate", selectedDate );
			to = $( this).datepicker( "getDate" );
			toYear = to.getFullYear();
			toMonth = to.getMonth()+1;
			to = toYear * 100 + toMonth;
		}
	});
	
	$('.report').on("click", function(){
		if(from == null || to == null){ // validation if the date fields are populated.
		alert("Не Внесовте датум");
		return false;
		}
		if(this.id == "waterReport"){  // Check if the button clicked is for the water report
			var table = "water";
			var measure = "m<sup>3</sup>";
		}
		if(this.id == "elReport"){  // Check if the button clicked is for the electricity report
			var table = "electricity";
			var measure = "kw/h"
		}
		
		// database  code begins here
		html5sql.openDatabase("com.calculator.appdb", "The Calculator Database",5*1024*1024);  // opening the database
		html5sql.process(  
			"SELECT * FROM " +table+ " WHERE date BETWEEN '" +from+ "' AND '" +to+ "'",   // Select the  rows of the table that are between the given date range
			function(tx,result){   // Successful callback function. Used to display the found results.
				var len = result.rows.length; 
				var currentDiv = "</br><table class='table table-bordered table-condensed table-hover'><thead><tr><th>Месец/Година</th><th>Потрошени: "+measure+" </th><th>Вкупна цена</th></tr></thead><tbody>";
			
				for(var i = 0; i< len; i++) { // iterate through all  resluts 
					var itemObj = result.rows.item(i), dateNum, year, month, date;
					// convert the  date value from the database into a string with date format.
					dateNum = itemObj.date; 
					month = String ( dateNum%100 );
					year = String ( parseInt(dateNum/100) );
					date = month+ "/" +year;  
					// add the values into a variable with format that will be displayed to the user	
					currentDiv += "<tr><td>"+ date+ "</td><td>"+itemObj.measure+ "</td><td>"+itemObj.total+ " ден.</td></tr>" ;
				}
				currentDiv += "</tbody></table>" ;
				$('#reportTable').html(currentDiv);  // Display the results
			}, 
			function(){
				alert("Нема зачувани податоци за одбраниот временски период.");
			}	
		);  // db part ends here
	});
	
	
	$('#dropElectricity').on('click', function(){ // delete  the electricity table
		var x=window.confirm("Дали сте сигурни дека сакате да ги избришете сите податоци?");  // check if the user did not press the button by mistake
		if (x){
			html5sql.openDatabase("com.calculator.appdb", "The Calculator Database",5*1024*1024);
			html5sql.process("DROP TABLE electricity ;", 
				function(){
					alert("Успешно ги избришавте сите податоци."); 
				}, 
				function(){
					alert("Нема податоци за бришење.");
				}
			);
		}	
	});
	
	$('#dropWater').on('click', function(){ // delete  the water table
		var x=window.confirm("Дали сте сигурни дека сакате да ги избришете сите податоци?");  // check if the user did not press the button by mistake
		if (x){
			html5sql.openDatabase("com.calculator.appdb", "The Calculator Database",5*1024*1024);
			html5sql.process("DROP TABLE water ;", 
				function(){
					alert("Успешно ги избришавте сите податоци."); 
				}, 
				function(){
					alert("Нема податоци за бришење.");
				}
			);
		}
	});		
});