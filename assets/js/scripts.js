// Louisiana Groups
// https://louisianagroups.com
// https://github.com/LouisianaGroups/louisiana-groups

var vm = function() {}; // data model
var groupsData = ko.observableArray();

if (!window.Promise){
    alert('old browser, upgrade');
}

$(function() {
	ko.applyBindings(new vm()); // init knockout
	var sheetGroups = 'https://docs.google.com/spreadsheets/d/12zkNdCEEyFeUlIj7Lw_v5-krx3YRws1olJ12N0e8XSU/edit#gid=1511071343';
	var sheetEvents = 'https://docs.google.com/spreadsheets/d/12zkNdCEEyFeUlIj7Lw_v5-krx3YRws1olJ12N0e8XSU/edit#gid=0';
	var today = moment();
	var arrayGroups = [];
	var arrayEvents = [];
	var arrayMerged = [];
	var arrayEventGroupIDs = [];

	var getGroups = function() {
		sheetrock({
			url: sheetGroups,
			query: "select A,B,C,D,E,F,G,H,I,J where K = true",
			callback: callbackGroups
		});
	}

	var getEvents = function() {
		sheetrock({
			url: sheetEvents,
			query: "select B,C,D,E",
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
		} else if (type == 'events') {
			arrayEvents.push(array);
		}

		console.warn(type + ' array');
		console.table(array);
	}

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
			var value = moment(item[prop], 'MM/DD/YYYY HH:mm:ss');
			var diff = today.diff(item[prop], 'days');

			if (diff <= 0) {
				return item;
			}
		});
	}

	var getEventGroupIDs = function() {
		for (var i = 0; i < arrayEvents.length; i++) {
			var groupID = arrayEvents[i].GroupID;
			var groupName = arrayEvents[i].GroupName;
			arrayEventGroupIDs.push({GroupID: groupID, GroupName: groupName, LastEventDate: ''});
		}

		return removeDuplicates(arrayEventGroupIDs, 'GroupID');
	}

	var getLastEventDatePerGroup = function(array) {
		$.grep(array, function (item) {
			var id = item.GroupID;
			var index = arrayEventGroupIDs.map(function(e) { return e.GroupID; }).indexOf(id);
			var newDate = item.NextMeetupDateTime;
			var oldDate = arrayEventGroupIDs[index].LastEventDate || '';
			var newDateMoment = moment(newDate, 'MM/DD/YYYY HH:mm:ss');
			var oldDateMoment = moment(oldDate, 'MM/DD/YYYY HH:mm:ss');
			var newDateDaysAgo = today.diff(newDateMoment, 'days');
			var oldDateDaysAgo = today.diff(oldDateMoment, 'days');

			if (newDateDaysAgo >= 0) {
				if (oldDate == '' || newDateDaysAgo < oldDateDaysAgo) {
					arrayEventGroupIDs[index].LastEventDate = newDate;
				}
			}
		});
	}

	var displayCards = function() {
		var totalCards = $('#content .card').length;

		for (var i = 0; i < totalCards; i++) {
			$('#content .card').delay(50).eq(i).animate({'opacity': 1});
		}
	}

	new Promise(function(resolve, reject) {
		setTimeout(() => resolve(1), 1000);
		getGroups();
		getEvents();		
	}).then(function(result) {
		// why is the array getting wrapped, requiring this?
		arrayEvents = arrayEvents.pop();
		arrayGroups = arrayGroups.pop();
	}).then(function(result) {
		// sort events array by next event date (for better data massaging)
		console.warn('sort - before');
		console.table(arrayEvents);
		sortArray(arrayEvents, 'NextMeetupDateTime');
		console.warn('sort - after');
		console.table(arrayEvents);
	}).then(function(result) {
		// get all group IDs in arrayEvents
		arrayEventGroupIDs = getEventGroupIDs();
		console.warn('arrayEventGroupIDs 45435454');
		console.table(arrayEventGroupIDs);
	}).then(function(result) {
		// insert last group event and insert into arrayEventGroupIDs
		getLastEventDatePerGroup(arrayEvents);
		console.warn('getLastEventDatePerGroup 987054545');
		console.table(arrayEventGroupIDs);
	}).then(function(result) {
		// remove past events from events array
		arrayEvents = removePastDatesFromArrayByProperty(arrayEvents, 'NextMeetupDateTime');
		console.warn('remove past events');
		console.table(arrayEvents);
	}).then(function(result) {
		// remove duplicates and only show upcoming event per group
		arrayEvents = removeDuplicates(arrayEvents, 'GroupID');
		console.warn('duplicates removed');
		console.table(arrayEvents);





	}).then(function(result) {
		// var testArray = Object.assign({}, arrayEventGroupIDs, arrayGroups);
		var testArray = $.extend(true, {}, arrayGroups, arrayEventGroupIDs);
		console.warn('testArray - merge in Last Group Event');
		console.table(testArray);





	}).then(function(result) {
		// merge the groups and events objects together (deep merge)
		$.extend(true, arrayMerged, arrayGroups, arrayEvents);
	}).then(function(result) {
		//dump final array into observable to be used in the Knockout loop in the HTML
		groupsData(arrayMerged);
		console.warn('merged array');
		console.table(arrayMerged);
	}).then(function(result) {
		$('#content .card').css({'opacity': 0});
		$('body').removeClass('loading');
		displayCards();
	});

});
