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
	var arrayGroups = [];
	var arrayEvents = [];
	var arrayMerged = [];
	var arrayLastGroupEvent = [];
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
			var today = moment();
			var value = moment(item[prop], 'mm/dd/yyyy HH:mm:ss');
			var diff = today.diff(item[prop], 'days');

			if (diff <= 0) {
				return item;
			}
		});
	}

	var getEventGroupIDs = function() {
		for (var i = 0; i < arrayEvents.length; i++) {
			var groupID = arrayEvents[i].GroupID;
			arrayEventGroupIDs.push({GroupID: groupID, LastEventDate: ''});
		}

		return removeDuplicates(arrayEventGroupIDs, 'GroupID');
	}

	var getLastEventDatePerGroup = function(array) {
		var output = [];

		$.grep(array, function (item) {
			var x = item;
			var y = array;


			var id = item.GroupID;
			var index = arrayEventGroupIDs.map(function(e) { return e.GroupID; }).indexOf(id);
			//debugger;
			var newDate = item.NextMeetupDateTime;
			var oldDate = arrayEventGroupIDs[index].LastEventDate || '';

			// for (var moo = 0; moo < arrayEventGroupIDs.length; moo++) {
			// 	if (arrayEventGroupIDs[moo].GroupID == id) {
			// 		oldDate = arrayEventGroupIDs[moo].NextMeetupDateTime || '';
			// 	}
			// }


			//debugger;
			//date = (moment(oldDate, 'mm/dd/yyyy HH:mm:ss').unix() > moment(newDate, 'mm/dd/yyyy HH:mm:ss').unix() ? newDate : oldDate);


			var newDateUnix = moment(newDate, 'mm/dd/yyyy HH:mm:ss').unix();
			var oldDateUnix = moment(oldDate, 'mm/dd/yyyy HH:mm:ss').unix();
			var todayUnix = moment().unix();
			var today = moment();

			var date = '';

			if (newDateUnix < todayUnix) {




				if (oldDate == '') {
					arrayEventGroupIDs[index].LastEventDate = newDate;
				} else {
					if (newDateUnix < oldDateUnix) {
						arrayEventGroupIDs[index].LastEventDate = newDate;
					}
				}




			}

			//debugger;

			var a = id;
			var b = oldDate;
			var c = newDate;
			var d = index;
			var e = date;
			var f = arrayEventGroupIDs[index].LastEventDate;
			var g = array;
			debugger;

			

			console.table(arrayEventGroupIDs);
			//debugger;


		});



		//return output;
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
		getLastEventDatePerGroup(arrayEvents);
		console.warn('getLastEventDatePerGroup 987054545');
		console.table(arrayEventGroupIDs);











	}).then(function(result) {
		arrayLastGroupEvent = removeDuplicates(arrayLastGroupEvent, 'GroupID');
		console.warn('arrayLastGroupEvent - removeDuplicates');
		console.table(arrayLastGroupEvent);










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
		console.warn('arrayLastGroupEvent - output');
		console.table(arrayLastGroupEvent);


		//var testArray = [];
		//arrayLastGroupEvent.pop();
		//testArray = $.extend(true, testArray, arrayLastGroupEvent, arrayGroups);
		var testArray = $.extend({}, arrayGroups, arrayEventGroupIDs);
		console.warn('testArray - merge in Last Group Event');
		console.table(testArray);


		console.warn('arrayEventGroupIDs 6227688');
		console.table(arrayEventGroupIDs);

		console.warn('arrayLastGroupEvent 0254025424');
		console.table(arrayLastGroupEvent);



	}).then(function(result) {
		// merge the groups and events objects together (deep merge)
		$.extend(true, arrayMerged, arrayGroups, arrayEvents);
	}).then(function(result) {
		console.warn('merged array');
		console.table(arrayMerged);
		groupsData(arrayMerged); //dump final array into observable to be used in the Knockout loop in the HTML
	}).then(function(result) {
		$('#content .card').css({'opacity': 0});
		$('body').removeClass('loading');
		displayCards();
	});

});
