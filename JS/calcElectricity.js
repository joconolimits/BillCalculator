$(function(){

	//Displaying the one tarif calculator input form
	$("#oneTarif").on("click", function(){
		$("#oneTarifCalc").css("display", "block");
		$("#twoTarifCalc").css("display", "none");
		$("#result").css("display", "none");
	});
	//Displaying the two tarif calculator input form
	$("#twoTarif").on("click", function(){
		$("#twoTarifCalc").css("display", "block");
		$("#oneTarifCalc").css("display", "none");
		$("#result").css("display", "none");
	});
	//  Beagining of one tarif calculation 
	$("#calcOneTarif").on("click", function() {	
		var first = parseFloat( $("#first").val() ); // the beginning of the month
		var last = parseFloat( $("#last").val() ); // the end of the month
		var price = parseFloat( $("#price").val() ); // the unit price of the kwh of electricity
		var users = parseFloat( $("#users").val()); // number of control counters
		
		if( last < first  ) {	// validation whether the  new state is biiger or equal to the old state
			alert("Крајната состојба треба да е поголема или еднаква со почетната");
		}
		else if( isNaN(first) || isNaN(last) || isNaN(users)) { // validation whether all fields have value.
			alert("Сите полиња мора да бидат пополнети...");
		}
		else{  // Doing the calculations
			var energy = calculation(first, last);
			var active = (((energy* price)*33.33)/100); // price for the active used power
			var subTotal = energy* price + active;
			var tax = lightDdv(users, subTotal);
			var total = parseInt( subTotal + tax );	
			result (energy, total);
		}
	});
	//  End of one tarif calculation.
	
	//  Beagining of Two tarif calculation
	$("#calcTwoTarif").on("click", function(){
		var firstVt = parseFloat( $("#firstVt").val() );
		var lastVt = parseFloat( $("#lastVt").val() );
		var priceVt = parseFloat( $("#priceVt").val() );
		var firstNt = parseFloat( $("#firstNt").val() );
		var lastNt = parseFloat( $("#lastNt").val() );
		var priceNt = parseFloat( $("#priceNt").val() );
		var usersTwoTarif = parseFloat( $("#usersTwoTarif").val() ); // number of control counters
		
		if( lastVt < firstVt || lastNt < firstNt  ) {	// validation whether the  new state is biiger or equal to the old state
			alert("Крајната состојба треба да е поголема или еднаква со почетната");
		}
		else if( isNaN(firstVt) || isNaN(lastVt) || isNaN(firstNt) || isNaN(lastNt) || isNaN(usersTwoTarif)) {  // validation whether all fields have value.
			alert("Сите полиња мора да бидат пополнети...");
		}
		else {  // Doing the calculations
			var energyVt = calculation(firstVt, lastVt);
			var energyNt = calculation(firstNt, lastNt);
			var subtotal = energyVt  * priceVt + energyNt * priceNt;
			var tax = lightDdv(usersTwoTarif, subtotal);
			var total = parseInt( subtotal + tax );
			result ((energyVt+energyNt), total);
		}
	});
	//  End of two tarif calculation
	
	// Function to calculate the used energy
	function calculation(first, last){
		var kwh = last-first;  // used electricity in kwh 
		return kwh;
	}	
	//Function to calculate the street lighting price and tax.
	function lightDdv(users, energy) {
		var defaultLight = 140.25; // The Original price of the street light tax.
		var light = defaultLight/(users + 1); // the price for street lighting
		var ddv = (energy*18)/100; // calculation for the tax
		return light+ddv;
	}
	// dysplay the result.
	function result (kwh, total) {
		$("#oneTarifCalc").css("display", "none"); // set the input block for one tarif as none visible
		$("#twoTarifCalc").css("display", "none"); // set the input block for one two tarif as none visible
		$("#result").css("display", "block"); // set the result block as visible
		
		// add values in the result block
		$("#usedKwh").val(kwh.toFixed(2));
		$("#toPay").val(total.toFixed(2));
	}
	
	
	// Function for saving the data from the calculation.
	var date, year, month;
	$( "#date" ).datepicker({  //  datepicker for  saving into the database
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
	$("#save").on("click", function(){
		if(date == null) alert("Не внесовте датум");
		// We get the values from the input fields again because we want the user to be able to edit the  calculation results.
		var kwh = parseFloat($("#usedKwh").val()); 
		var total = parseFloat($("#toPay").val());

		html5sql.openDatabase("com.calculator.appdb", "The Calculator Database",5*1024*1024);  // opening the database
		html5sql.process("CREATE TABLE electricity (date INTEGER PRIMARY KEY, measure FLOAT, total FLOAT);",   // creating table in case it does not exists
			function(){
				console.log("table successfully created");
			 
			}, 
			function(){
				console.log("table not created");
			}
		);

		html5sql.process(  // adding the values from the calculation into the database
			[{
				"sql": "INSERT INTO electricity (date, measure, total) VALUES (?, ?, ?)",
				"data": [date, kwh, total],
				"success": function(){}	
			}],
			function(){
			 alert("Вашите податоци се успешно зачувани!!!");  // notify the user for successful saving 
			 
			}, 
			function(){
			 alert("се појави грешка! Вашите податоци не се зачувани пробајте повторно!!! ");  //  notify the user that his data is not saved
			}	
		);  
					
	});		
	
	
});

