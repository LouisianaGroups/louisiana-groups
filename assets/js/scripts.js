// Louisiana Groups
// https://louisianagroups.com
// https://github.com/LouisianaGroups/louisiana-groups

var vm = function() {}; // data model
var groupsData = ko.observableArray();
var stateDataGroupsLoaded = ko.observable(false);
var stateDataEventsLoaded = ko.observable(false);
var stateGetEventGroupIDs = ko.observable(false);
var stateEventsArraySortedByNextMeetup = ko.observable(false);
var stateGetLastAndNextEventsPerGroup = ko.observable(false);
var stateRemovePastDatesFromArrayByProperty = ko.observable(false);
var stateDataLoaded = ko.computed(function() {
	if (stateDataGroupsLoaded() == true && stateDataEventsLoaded() == true) {
		return true;
	}
});
var stateGroupsData = ko.computed(function() {
	if (groupsData().length > 0) {
		return true;
	}
});
var sheetGroups = 'https://docs.google.com/spreadsheets/d/12zkNdCEEyFeUlIj7Lw_v5-krx3YRws1olJ12N0e8XSU/edit#gid=1511071343';
var sheetEvents = 'https://docs.google.com/spreadsheets/d/12zkNdCEEyFeUlIj7Lw_v5-krx3YRws1olJ12N0e8XSU/edit#gid=0';
var today = moment();
var arrayGroups = [];
var arrayEvents = [];
var arrayMerged = [];
var arrayLocations = [];
var arrayEventGroupIDs = [];

if (!window.Promise){
    alert('old browser, upgrade');
}

if (!navigator.onLine) {
	alert('offline');
}

$(function() {
	ko.applyBindings(new vm()); // init knockout

	var loadData = function() {
		getGroups();
		getEvents();
	}

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
			query: "select B,C,D,E order by D asc",
			callback: callbackEvents
		});
	}

	var callbackGroups = function(error, options, response) {
		cleanJsonData(response, 'groups');
	}

	var callbackEvents = function(error, options, response) {
		cleanJsonData(response, 'events');
	}

	var mergeArrays = function(array1, array2, prop) {
		return array1.map(x => ({...x, ...array2.find(y => x[prop] === y[prop])}) );
	}

	var sortArray = function(array, prop) {
		array.sort(function (a, b) {
			return a[prop] > b[prop] ? 1 : -1 // asc
		});
	};

	var sortArrayByDate = function(array, prop, direction = 'desc') {
		array.sort(function (a, b) {
			if (direction == 'desc') {
				return moment(b[prop]).diff(a[prop]);
			} else {
				return moment(a[prop]).diff(b[prop]);
			}
		});
	};

	var sortArrayByLastEventDate = function() {
		var groupsWithPastEvents = [];
		var groupsWithPastEventsIndexes = []

		arrayMerged.forEach(function(item, index) {
			if (item.LastEventDate) {
				groupsWithPastEvents.push(item);
				groupsWithPastEventsIndexes.push({GroupID: item.GroupID, GroupName: item.GroupName}); // remove GroupName as it's not needed
			}
		});

		groupsWithPastEventsIndexes.forEach(function(item, index) {
			var id = item.GroupID;
			var index = arrayMerged.map(function(e) { return e.GroupID; }).indexOf(id);

			arrayMerged.splice(index, 1);
		});

		sortArrayByDate(groupsWithPastEvents, 'LastEventDate');
		
		arrayMerged.unshift(...groupsWithPastEvents); // merge in the now sorted groups that have a LastEventDate back into the master list
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
			stateDataGroupsLoaded(true);
		} else if (type == 'events') {
			arrayEvents.push(array);
			stateDataEventsLoaded(true);
		}

		//console.warn(type + ' array');
		//console.table(array);
	}

	// var getUrlParam = function(name) {
	// 	var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
	// 	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	// }

	// var checkUrlParams = function() {
	// 	var location = getUrlParam('location');
		
	// 	if (location) {
	// 		$('#location-selector').val(location).trigger('change');
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }

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

	var removePastDatesFromArrayByProperty = function(array, prop) {
		stateRemovePastDatesFromArrayByProperty(true);

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
			arrayEventGroupIDs.push({GroupID: groupID, GroupName: groupName, LastEventDate: ''}); // remove GroupName later - not needed for the merge
		}

		stateGetEventGroupIDs(true);
	}

	var getLastAndNextEventsPerGroup = function(array) {
		$.grep(array, function (item) {
			var id = item.GroupID;
			var index = arrayEventGroupIDs.map(function(e) { return e.GroupID; }).indexOf(id);
			var date = item.NextMeetupDateTime;

			// REFACTOR THE CODE BELOW INTO A FUNCTION

			// Last Event vars
			var lastOldDate = arrayEventGroupIDs[index].LastEventDate || '';
			var lastNewDateMoment = moment(date, 'MM/DD/YYYY HH:mm:ss');
			var lastOldDateMoment = moment(lastOldDate, 'MM/DD/YYYY HH:mm:ss');
			var lastNewDateDaysAgo = today.diff(lastNewDateMoment, 'days');
			var lastOldDateDaysAgo = today.diff(lastOldDateMoment, 'days');

			// Next Event vars
			var nextOldDate = arrayEventGroupIDs[index].NextEventDate || '';
			var nextNewDateMoment = moment(date, 'MM/DD/YYYY HH:mm:ss');
			var nextOldDateMoment = moment(nextOldDate, 'MM/DD/YYYY HH:mm:ss');
			var nextNewDateDaysAgo = today.diff(nextNewDateMoment, 'days');
			var nextOldDateDaysAgo = today.diff(nextOldDateMoment, 'days');

			// Last Event condition to add
			if (lastNewDateDaysAgo >= 0) {
				if (lastOldDate == '' || lastNewDateDaysAgo < lastOldDateDaysAgo) {
					arrayEventGroupIDs[index].LastEventDate = date;
				}
			}

			// Last Event condition to add
			if (nextNewDateDaysAgo <= 0) {
				if (nextOldDate == '' || nextNewDateDaysAgo < nextOldDateDaysAgo) {
					arrayEventGroupIDs[index].NextEventDate = date;
				}
			}
		});

		stateGetLastAndNextEventsPerGroup(true);
	}

	var countCards = function() {
		var cardCount = $('#content .card:visible').length;
		$('#card-count').text(cardCount + ' groups shown');
	}

	var uiCleanup = function() {
		var cards = $('#content .card');
		var totalCards = $('#content .card').length;
		var tempArray = [];

		$('#content .card').css({'opacity': 0});
		$('header #controls').delay(1000).animate({'opacity': 1});

		for (var i = 0; i < totalCards; i++) {
			$('#content .card').delay(50).eq(i).animate({'opacity': 1});

			var sel = $('#content .card').eq(i);
			var background = sel.data('background');
			var locationDirty = sel.data('location');
			var locationClean = locationDirty.toLowerCase().replace(/, /g, '|').replace(/ /g , '-').replace(/\|/g, ' ');

			sel.addClass(locationClean);
			sel.css({'background-color': background, 'color': background});
			sel.find('a').css({'color': background});

			tempArray.push({name: locationDirty, value: locationClean});
		}
		
		arrayLocations = removeDuplicates(tempArray, 'value');

		arrayLocations.forEach(function(item) {
			var optionHTML = '<option value="' + item.value + '">' + item.name + '</option>';
			$('#location-selector').append(optionHTML);
		});

		cards.removeAttr('data-bind');
		cards.removeAttr('data-background');
		cards.removeAttr('data-location');

		$('body').removeClass('loading');
		countCards();
	}

	var init = function() {
		$('#content').isotope({
			itemSelector: '.card',
		});

		$('#content').on('arrangeComplete', function() {
			countCards();
		});

		$('#location-selector').on('change', function(e) {
			var selected = $(this).val();

			if (selected.includes('*')) {
				selected = '*';
				//history.pushState({location: 'all'}, "title 1", '?location=all');
			} else {
				selected = '.' + selected
				//history.pushState({location: selected}, "title 1", '?location=' + selected.replace('.', ''));
			}

			$('#content').isotope({ filter: selected });
		});

		$('#location-selector').select2({
			width: 120,
			minimumResultsForSearch: 10
		});
	}

	stateDataLoaded.subscribe(function(v) {
		// sort events array by next event date (for better data massaging)
		arrayEvents = arrayEvents.pop();
		arrayGroups = arrayGroups.pop();

		console.warn('arrayEvents');
		console.table(arrayEvents);

		// get all group IDs in arrayEvents
		getEventGroupIDs();
	});

	stateGetEventGroupIDs.subscribe(function(v) {
		// get all group IDs in arrayEvents
		console.warn('arrayEventGroupIDs 691');
		console.table(arrayEventGroupIDs);

		arrayEventGroupIDs = removeDuplicates(arrayEventGroupIDs, 'GroupID');
		console.warn('remove duplicates from arrayEventGroupIDs');
		console.table(arrayEventGroupIDs);

		// insert last group event and insert into arrayEventGroupIDs
		getLastAndNextEventsPerGroup(arrayEvents);
	});

	stateGetLastAndNextEventsPerGroup.subscribe(function(v) {
		console.warn('getLastAndNextEventsPerGroup 914');
		console.table(arrayEventGroupIDs);

		arrayEvents = removePastDatesFromArrayByProperty(arrayEvents, 'NextMeetupDateTime');
	});

	stateRemovePastDatesFromArrayByProperty.subscribe(function(v) {
		arrayMerged = mergeArrays(arrayGroups, arrayEventGroupIDs, 'GroupID');

		groupsData(arrayMerged);
	});

	stateGroupsData.subscribe(function(v) {
		sortArrayByLastEventDate();

		console.warn('merged array');
		console.table(arrayMerged);

		var countDataGroups = 0;
		var countDomGroups = 0;

		var waitForElement = function() {
			countDataGroups = groupsData().length;
			countDomGroups = $('#content .card').length;
			console.warn('waitForElement triggered | data:' + countDataGroups + ' | dom:' + countDomGroups);

			if (countDataGroups === countDomGroups) {
				// SPLIT THESE UP WITH WAITS
				countCards();
				uiCleanup();
				init();
			} else {
				setTimeout(waitForElement, 1000);
			}
		}
		waitForElement();
	});

	loadData();
});
