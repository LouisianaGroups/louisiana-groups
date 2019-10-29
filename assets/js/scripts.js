// Louisiana Groups
// https://louisianagroups.com
// https://github.com/LouisianaGroups/louisiana-groups

$(function() {
	var sheetGroups = 'https://docs.google.com/spreadsheets/d/12zkNdCEEyFeUlIj7Lw_v5-krx3YRws1olJ12N0e8XSU/edit#gid=1511071343';
	var sheetEvents = 'https://docs.google.com/spreadsheets/d/12zkNdCEEyFeUlIj7Lw_v5-krx3YRws1olJ12N0e8XSU/edit#gid=0';
	var arrayGroups = [];
	var arrayEvents = [];
	var arrayMerged = [];
	var completeGroups = false;
	var completeEvents = false;

	var getGroups = function() {
		var groupsTemplate = Handlebars.compile($('#groups-template').html());

		$('#list-groups').sheetrock({
			url: sheetGroups,
			query: "select A,B,C,D,E,F,G,H,I,J,K",
			fetchSize: 20,
			rowTemplate: groupsTemplate,
			callback: callbackGroups
		});
	}

	var getEvents = function() {
		$('#list-events').sheetrock({
			url: sheetEvents,
			query: "select B,C,D,E",
			//fetchSize: 10,
			callback: callbackEvents
		});
	}

	var callbackGroups = function(error, options, response) {
		cleanJsonData(response, 'groups');
	}

	var callbackEvents = function(error, options, response) {
		cleanJsonData(response, 'events');
	}

	var cleanJsonData = function(data, type) {
		var rows = data.rows;
		var array = [];

		for (var i = 1; i < rows.length; i++) {
			var tempArray = [];
			var label = rows[i].labels;
			var value = rows[i].cellsArray;

			for (var x = 0; x < label.length; x++) {
				tempArray[label[x]] = value[x];
			}

			array.push(tempArray);
		}

		if (type == 'groups') {
			arrayGroups.push(array);
			completeGroups = true;
		} else if (type == 'events') {
			arrayEvents.push(array);
			completeEvents = true;
		}

		console.warn('array');
		console.table(array);
	}

	getGroups();
	getEvents();

	var dataWatcher = setInterval(function() {
		var dataComplete = false;

		if (completeGroups == true && completeEvents == true) {
			dataComplete = true;
		}

		if (dataComplete) {
			clearInterval(dataWatcher);

			$.extend(true, arrayMerged, arrayGroups, arrayEvents);

			console.table(arrayMerged);
		}
	}, 100);

});
