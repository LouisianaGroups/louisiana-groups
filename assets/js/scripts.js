// Louisiana Groups
// https://louisianagroups.com
// https://github.com/LouisianaGroups/louisiana-groups

$(function() {
	var sheetGroups = 'https://docs.google.com/spreadsheets/d/12zkNdCEEyFeUlIj7Lw_v5-krx3YRws1olJ12N0e8XSU/edit#gid=1511071343';
	var sheetEvents = 'https://docs.google.com/spreadsheets/d/12zkNdCEEyFeUlIj7Lw_v5-krx3YRws1olJ12N0e8XSU/edit#gid=1511071343';

	var getGroups = function() {
		var groupsTemplate = Handlebars.compile($('#groups-template').html());

		$('#groups-list').sheetrock({
			url: sheetGroups,
			//query: "select A,B,C,AQ,AR",
			query: "select B,C,D,E,F,G,H,I,J,K",
			fetchSize: 10,
			rowTemplate: groupsTemplate,
			callback: drawGroups
		});
	}
	getGroups();


	function drawGroups(error, options, response) {
		// if (error) {
		// 	console.log('error!');
		// } else {
		// 	console.log(response.html);
		// }
		
		// console.table(response);
		// console.table(response.rows);

		var rows = response.rows;
		var groupsArray = [];		

		for (var i = 1; i < rows.length; i++) {
			var tempArray = [];
			var label = rows[i].labels;
			var value = rows[i].cellsArray;

			for (var x = 0; x < label.length; x++) {
				tempArray[label[x]] = value[x];
			}

			groupsArray.push(tempArray);
		}

		console.warn('groupsArray');
		console.table(groupsArray);
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
