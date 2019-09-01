// Louisiana Groups
// www.louisianagroups.com
// github link

$(function() {


	var sheetGroups = 'https://docs.google.com/spreadsheets/d/12zkNdCEEyFeUlIj7Lw_v5-krx3YRws1olJ12N0e8XSU/edit#gid=1511071343';

	// Load an entire worksheet.
	var getGroups = function() {



		var groupsTemplate = Handlebars.compile($('#groups-template').html());

		$('#groups-list').sheetrock({
			url: sheetGroups,
			//query: "select A,B,C,AQ,AR",
			query: "select B,C,D,E,F,G,H,I,J,K",
			fetchSize: 50,
			rowTemplate: groupsTemplate,
			//callback: drawGroups
		});

	}

	getGroups();



function drawGroups(error, options, response) {
  if (error) {
    console.log('fail');
  } else{
    console.log(response.html);
  }
  var a = response;
  console.table(response.rows[0].cellsArray);
  //debugger;
}


	// Compile the Handlebars template for HR leaders.
	// var HRTemplate = Handlebars.compile($('#hr-template').html());

	// $('#list').sheetrock({
	// 	url: mySpreadsheet,
	// 	//query: "select A,C,D,I order by I desc",
	// 	query: "select A,B,C,AQ,AR",
	// 	fetchSize: 50,
	// 	rowTemplate: HRTemplate
	// });

});




function randomNumber(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}
