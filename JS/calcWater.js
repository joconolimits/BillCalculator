$( function(){

	$("#calcWater").on("click", function() {
		var old = parseFloat( $("#old").val() ); // the beginning of the month
		var New = parseFloat( $("#new").val() ); // the end of the month
		var priceWater = parseFloat( $("#waterPrice").val() ); // the unit price of the m3 water
		var area = parseFloat( $("#area").val() ); // the area of the apartment
		var priceArea = parseFloat( $("#areaPrice").val() ); // the unit price for the garbage.
		var waterFund = 3.45;
		
		if( New < old  ) {	// validation whether the  new state is bigger or equal to the old state
			alert("Крајната состојба треба да е поголема или еднаква со почетната");
		}
		else if( isNaN(New) || isNaN(old) || isNaN(area)) {  // validation whether all fields have value.
			alert("Сите полиња мора да бидат пополнети...");
		}
		
		else {   // Doing the calculations
			var m3 = New - old;
			var spent = m3 * priceWater;
			var ddvWater = (spent * 5)/100;
			var totalWater = spent + ddvWater + waterFund;
			var garbage = area * priceArea; 
			var ddvGarbage = (garbage * 5)/100;
			var totalGarbage = garbage + ddvGarbage;
			var total = totalWater + totalGarbage;
			
			result (m3, total);	
		}
	});
	function result (m3, total) {
		$("#inputWater").css("display", "none");
		$("#resultWater").css("display", "block")
		
		$("#m3").val(m3);
		$("#totalWater").val(total.toFixed(2));
	}
	// Function for saving the data from the calculation.
	var date, year, month;	
	$( "#dateWater" ).datepicker({  //  datepicker for  saving into the database
		changeYear: true,
		changeMonth: true,
		dateFormat: "yy/mm/dd",
		showAnim: "fold",
		maxDate: "0",
		onSelect: function( selectedDate ) {	
			date = $(this).datepicker( "getDate" );
			year = date.getFullYear();
			month = date.getMonth()+1;
			date = year * 100 + month;  // preparing the date in a format suitable for the db table	
		}
	});
	
	$("#saveWater").on("click", function(){
		if(date == null) alert("Не Внесовте датум");  
		var m3 = parseFloat($("#m3").val());
		var total = parseInt($("#totalWater").val());
		
		
		html5sql.openDatabase("com.calculator.appdb", "The Calculator Database",5*1024*1024); // opening the database
		html5sql.process("CREATE TABLE water (date INTEGER PRIMARY KEY, measure FLOAT, total FLOAT);",   // creating table in case it does not exists
			function(){ 
				console.log("table successfully created");
			}, 
			function(){
				console.log("table not created");
			}
		);  
		html5sql.process(   // adding the values from the calculation into the database
			[{
				"sql": "INSERT INTO water (date, measure, total) VALUES (?, ?, ?)",
				"data": [date, m3, total],
				"success": function(){}	
			}],
			function(){
				alert("Вашите податоци се успешно зачувани!!!");   // notify the user for successful saving 
			}, 
			function(){
				alert("се појави грешка! Вашите податоци не се зачувани пробајте повторно!!!");  //  notify the user that his data is not saved
			}	
		);  
		$("#inputWater").css("display", "block");
		$("#resultWater").css("display", "none");
	});
	
	$('#backWater').on("click", function (){  // Show the  calculation fields again so the user can correct the input values
		$("#inputWater").css("display", "block");
		$("#resultWater").css("display", "none");
	});
	

});