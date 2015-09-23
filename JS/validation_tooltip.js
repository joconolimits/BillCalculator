$(function(){
	$("input").on("focus", function(){
		var placeholder = $(this).attr("placeholder");
		
		$(this).on( "keyup", function () {
			value = $(this).val();
			if (isNaN(value)|| value<0) {

				$(this).css("background-color", "rgb(255, 0, 0)");
				$(this).val("");
				$(this).attr("placeholder",  "Внесовте недозволен карактер. Ве молиме внесете само цифри...");
			}
			else { 
				$(this).css("background-color", "rgb(255, 255, 255)");
				$(this).attr("placeholder",  placeholder);
				
			}	
		});	
	});
	
	$( "input" ).tooltip({
		show: { effect: "blind", duration: 100 },
		position: {
			my: "left top",
			at: "right+4% top-1%"
		}
	});
	
});	