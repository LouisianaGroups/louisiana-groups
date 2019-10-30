// Louisiana Groups
// https://louisianagroups.com
// https://github.com/LouisianaGroups/louisiana-groups

var vm = function() {}; // data model
var groupsData = ko.observableArray();

$(function() {
	ko.applyBindings(new vm()); // This makes Knockout get to work
	var sheetGroups = 'https://docs.google.com/spreadsheets/d/12zkNdCEEyFeUlIj7Lw_v5-krx3YRws1olJ12N0e8XSU/edit#gid=1511071343';
	var sheetEvents = 'https://docs.google.com/spreadsheets/d/12zkNdCEEyFeUlIj7Lw_v5-krx3YRws1olJ12N0e8XSU/edit#gid=0';
	var arrayGroups = [];
	var arrayEvents = [];
	var arrayMerged = [];
	var dataCompleteGroups = false;
	var dataCompleteEvents = false;

	var getGroups = function() {
		$('#list-groups').sheetrock({
			url: sheetGroups,
			query: "select A,B,C,D,E,F,G,H,I,J,K",
			//fetchSize: 20,
			//rowTemplate: groupsTemplate,
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
			dataCompleteGroups = true;
		} else if (type == 'events') {
			arrayEvents.push(array);
			dataCompleteEvents = true;
		}

		console.warn(type + ' array');
		console.table(array);
	}

	var dataWatcher = setInterval(function() {
		var dataComplete = false;

		if (dataCompleteGroups == true && dataCompleteEvents == true) {
			dataComplete = true;
		}

		if (dataComplete) {
			clearInterval(dataWatcher);

			//why is the array getting wrapped, requiring this?
			arrayEvents = arrayEvents.pop();
			arrayGroups = arrayGroups.pop();

			//sort events array by next event date (for better data massaging)
			console.warn('sort - before');
			console.table(arrayEvents);
			sortArray(arrayEvents, 'NextMeetupDateTime');
			console.warn('sort - after');
			console.table(arrayEvents);

			//remove past events from events array
			arrayEvents = removePastDatesFromArrayByProperty(arrayEvents, 'NextMeetupDateTime');
			console.warn('remove past events');
			console.table(arrayEvents);
			
			//remove duplicates and only show upcoming event per group
			arrayEvents = removeDuplicates(arrayEvents, 'GroupID');
			console.warn('duplicates removed');
			console.table(arrayEvents);

			//merge the groups and events objects together (deep merge)
			$.extend(true, arrayMerged, arrayGroups, arrayEvents);

			console.warn('merged array');
			console.table(arrayMerged);

			groupsData(arrayMerged);
		}
	}, 100);

	var removeDuplicates = function(array, prop) {
		var newArray = [];
		var lookupObject = {};

		for (var i in array) {
			lookupObject[array[i][prop]] = array[i];
		}

		for (i in lookupObject) {
			newArray.push(lookupObject[i]);
		}
		return newArray;
	}

	var sortArray = function(array, prop) {
		array.sort(function(a, b){
			return new Date(b[prop]) - new Date(a[prop]);
		});
	};

	var removePastDatesFromArrayByProperty = function(array, prop) {
		return $.grep(array, function (item) {
			var today = moment();
			var value = moment(item[prop], 'mm/dd/yyyy HH:mm:ss');
			var diff = today.diff(value, 'days');

			if (diff <= 0) {
				//console.warn('OLDER | today: ' + today + ' | value: ' + value + ' | diff: ' + today.diff(item[prop], 'days', true));
				return item;
			} else {
				//console.warn('CURRENT | today: ' + today + ' | value: ' + value + ' | diff: ' + today.diff(item[prop], 'days', true));
			}
		});
	}

	getGroups();
	getEvents();

});
