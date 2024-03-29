// Louisiana Groups
// https://louisianagroups.com
// https://github.com/LouisianaGroups/louisiana-groups

var vm = function() {}; // data model
var groupsData = ko.observableArray();
var stateDataGroupsLoaded = ko.observable(false);
var stateDataEventsLoaded = ko.observable(false);
var stateGetEventGroupIDs = ko.observable(false);
var stateNewEventDateValid = ko.observable(false);
var stateUserLocationDetection = ko.observable(false);
var stateEventsArraySortedByNextMeetup = ko.observable(false);
var stateGetLastAndNextEventsPerGroup = ko.observable(false);
var stateRemovePastDatesFromArrayByProperty = ko.observable(false);
var stateDataLoaded = ko.computed(function() {
	if (stateDataGroupsLoaded() == true && stateDataEventsLoaded() == true) {
		console.log('5 | group + event data loaded and cleaned');
		return true;
	}
});
var stateGroupsData = ko.computed(function() {
	if (groupsData().length > 0) {
		console.log('10 | all data loaded, cleaned and merged');
		return true;
	}
});
var sheetGroups = 'https://docs.google.com/spreadsheets/d/1aE4LoWkqi8oQ_G_pXWUlV1jUxpYIHdk9HPxg5HFaJeQ/edit#gid=0';
var sheetEvents = 'https://docs.google.com/spreadsheets/d/1aE4LoWkqi8oQ_G_pXWUlV1jUxpYIHdk9HPxg5HFaJeQ/edit#gid=1815581304';
var today = moment();
var arrayGroups = [];
var arrayEvents = [];
var arrayMerged = [];
var arrayLocations = [];
var arrayEventGroupIDs = [];
var userLocationCity = ko.observable('');
var userLocationState = ko.observable('');
var userLocationMatch = ko.observable(false);

if (!window.Promise){
	alert('old browser, upgrade');
}

if (!navigator.onLine) {
	alert('offline');
}

if (!window.localStorage) {
	console.error('localStorage not supported');
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
			query: 'select C,D,E,F,G,H,I,J,K,L where M = true',
			callback: callbackGroups
		});
	}

	var getEvents = function() {
		sheetrock({
			url: sheetEvents,
			query: 'select B,C,D,E,F,G where F = true', //order by D asc
			callback: callbackEvents
		});
	}

	var callbackGroups = function(error, options, response) {
		console.log('1 | group data received');
		cleanJsonData(response, 'groups');
	}

	var callbackEvents = function(error, options, response) {
		console.log('2 | group data received');
		cleanJsonData(response, 'events');
	}

	var getUrlParam = function(param) {
		return new URLSearchParams(window.location.search).get(param);
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

	var sortArrayByGroupActivity = function() {
		function sorty (prop) {
			var tempArray = [];
			var tempArrayIndexes = [];

			arrayMerged.forEach(function(item, index) {
				if (item[prop]) {
					tempArray.push(item);
					tempArrayIndexes.push({GroupID: item.GroupID, GroupName: item.GroupName}); // remove GroupName as it's not needed
				}
			});

			tempArrayIndexes.forEach(function(item, index) {
				var id = item.GroupID;
				var index = arrayMerged.map(function(e) { return e.GroupID; }).indexOf(id);

				arrayMerged.splice(index, 1);
			});

			tempArray.sort(function (a, b) {
				if (prop == 'LastEventDate') {
					return moment(b.LastEventDate).diff(a.LastEventDate); // sort by LastEventDate
				} else if (prop == 'NextEventDate') {
					return moment(a.NextEventDate).diff(b.NextEventDate); // sort by NextEventDate
				}
			});

			//console.warn(prop + ' | tempArray 455');
			//console.table(tempArray);
			
			arrayMerged.unshift(...tempArray); // merge back into the master list
		}

		sorty('LastEventDate');
		sorty('NextEventDate');
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
			console.log('3 | group data cleaned');
		} else if (type == 'events') {
			arrayEvents.push(array);
			stateDataEventsLoaded(true);
			console.log('4 | group data cleaned');
		}

		//console.warn(type + ' array');
		//console.table(array);
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

	var removePastDatesFromArrayByProperty = function(array, prop) {
		stateRemovePastDatesFromArrayByProperty(true);
		console.log('8 | remove past dates from Events array');

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
			arrayEventGroupIDs.push({GroupID: groupID, GroupName: groupName, NextEventLink:'', LastEventDate: ''}); // remove GroupName later - not needed for the merge
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
			if (lastNewDateDaysAgo > 0) {
				if (lastOldDate == '' || lastNewDateDaysAgo < lastOldDateDaysAgo) {
					arrayEventGroupIDs[index].LastEventDate = date;
				}
			}

			// Next Event condition to add
			if (nextNewDateDaysAgo <= 0) {
				if (nextOldDate == '' || nextNewDateDaysAgo < nextOldDateDaysAgo) {
					arrayEventGroupIDs[index].NextEventDate = date;
					arrayEventGroupIDs[index].NextEventLink = item.EventLink;
				}
			}
		});

		stateGetLastAndNextEventsPerGroup(true);
		console.log('7 | get next and last events per group');
	}

	var countCards = function() {
		var cardCount = $('#content .card:visible').length;
		var sel = $('#location-selector');
		var selectedValue = sel.val();
		var selectedValueText = sel.find(':selected').text();

		if (selectedValue == '*') {
			var countTextLeft = '';
			var countTextRight = cardCount + (cardCount > 1 ? ' groups' : ' group') + ' shown';
		} else {
			var countTextLeft = cardCount + (cardCount > 1 ? ' groups' : ' group') + ' shown in ';
			var countTextRight = '';
		}

		$('#card-count-left').text(countTextLeft);
		$('#card-count-right').text(countTextRight);
	}

	var cleanEventDatetime = function() {
		var date = $('#new-event-datepicker').val() || '';
		var time = $('#new-event-timepicker').val() || '';
		var datetime = moment(date + ' ' + time, 'MM/DD/YYYY HH:mm A').format('MM/DD/YYYY HH:mm:ss');
		var dateValid = moment(date + ' ' + time, 'MM/DD/YYYY HH:mm A').isValid();

		$('#new-event-datetime').val(datetime);

		if (dateValid && date != '' & time != '') {
			stateNewEventDateValid(true);
		} else {
			stateNewEventDateValid(false);
		}
	}

	var uiCleanup = function() {
		var cards = $('#content .card');
		var totalCards = $('#content .card').length;
		var tempArray = [];

		$('#content .card').css({'opacity': 0});
		$('header #controls, header #submit-new').delay(1000).css({'opacity': 0}).removeClass('hidden-soft').animate({'opacity': 1});

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

		$('#location-selector').stylishSelect();

		cards.removeAttr('data-bind');
		cards.removeAttr('data-background');
		cards.removeAttr('data-location');

		$('body').removeClass('loading');
		$('#content').removeClass('loading-spinner');
		countCards();
	}

	var init = function() {
		$('#content').on('arrangeComplete', function() {
			countCards();
		});

		$('#location-selector').on('change', function(e) {
			var selectedValue = $(this).val();
			
			if (selectedValue.includes('*')) {
				selectedValueIsotope = '*';
				selectedPushState = 'all';
			} else {
				selectedValueIsotope = '.' + selectedValue;
				selectedPushState = selectedValue;
			}

			// if (!$('body').hasClass('loading')) {
			// 	history.pushState({location: selectedPushState}, '', '?location=' + selectedPushState);
			// }

			$('#content').isotope({ filter: selectedValueIsotope });
		});

		$('#new-event-name').select2({
			width: '100%',
			minimumResultsForSearch: 5,
			placeholder: '- SELECT -',
		});

		$('#new-event-name').on('change', function (e) {
			var groupName = $(this).find('option:selected').text();
			$('#new-event-groupname').val(groupName);
			$(this).parsley().validate();
		});

		$('.modal form').on('submit', function(e) {
			e.preventDefault();
			var moo = e.target.id;
			var form = $(this).data('type');

			$(this).find('.modal-body').addClass('loading-spinner loading-spinner-inverted');
			$(this).find('.modal-footer button[type=submit]').prop({'disabled': true});

			submitNewListing(form);
		});

		$('.modal').on('hide.bs.modal', function (e) {
			$(this).find('.modal-body .alert').hide();
		});

		$('.datepicker').datetimepicker({
			//inline: true,
			format: 'MM/DD/YYYY',
			format: 'L',
			minDate: 'now',
			useCurrent: false
		});

		$('.timepicker').datetimepicker({
			//inline: true,
			format: 'HH:mm A',
			format: 'LT'
		});

		$('.datepicker, .timepicker').on('dp.change', function () {
			cleanEventDatetime();
			$(this).parsley().validate();
		});

		$('form input[type=url]').on('change', function() {
			var value = $(this).val();
			$(this).val(value.replace(/www\./g, ''));
		});

		$('#content').one('arrangeComplete', function() {
			$(this).addClass('isotope-loaded');
		});

		//$('#modal-new-group').addClass('show').show();
		//$('#modal-new-event').addClass('show').show();
	}

	var submitNewListing = function(formSubmitting) {
		var sheetName;
		var formElement;

		if (formSubmitting == 'group') {
			sheetName = 'Groups';
			formElement = $('#form-new-group');
		} else if (formSubmitting == 'event') {
			sheetName = 'Events';
			formElement = $('#form-new-event');
		}

		var scriptURL = 'https://script.google.com/macros/s/AKfycbzFjOzKRYCiSqabWRcBFwZSj8yduV0KfbJTVZFe4IhHRWH4BdQ/exec?formUsed=' + sheetName;

		$.ajax({
			type: 'GET',
			url: scriptURL,
			success: function(resp) {
				console.log('GET success');
				var formData = formElement.serialize();

				$.ajax({
					type: 'POST',
					url: scriptURL,
					data: formData,
					success: function(resp) {
						console.log('POST success');
						formElement.find('.modal-body').removeClass('loading-spinner');
						formElement.find('.modal-body .alert').fadeIn();
						formElement.find('.modal-footer button[type=submit]').prop({'disabled': false});
						formElement.find('input').val('');
						$('#new-event-name').val('').trigger('change');
					},
					error: function() {
						console.log('POST error');
					}
				});
			},
			error: function() {
				console.log('GET error');
			}
		});
	}

	stateDataLoaded.subscribe(function() {
		// sort events array by next event date (for better data massaging)
		arrayEvents = arrayEvents.pop();
		arrayGroups = arrayGroups.pop();

		//console.warn('arrayGroups');
		//console.table(arrayGroups);

		//console.warn('arrayEvents');
		//console.table(arrayEvents);

		// get all group IDs in arrayEvents
		getEventGroupIDs();
	});

	stateGetEventGroupIDs.subscribe(function() {
		// get all group IDs in arrayEvents
		//console.warn('arrayEventGroupIDs 691');
		//console.table(arrayEventGroupIDs);

		arrayEventGroupIDs = removeDuplicates(arrayEventGroupIDs, 'GroupID');
		console.log('6 | removed duplicates from arrayEventGroupIDs array');
		//console.warn('remove duplicates from arrayEventGroupIDs');
		//console.table(arrayEventGroupIDs);

		// insert last group event and insert into arrayEventGroupIDs
		getLastAndNextEventsPerGroup(arrayEvents);
	});

	stateGetLastAndNextEventsPerGroup.subscribe(function() {
		//console.warn('getLastAndNextEventsPerGroup 914');
		//console.table(arrayEventGroupIDs);

		arrayEvents = removePastDatesFromArrayByProperty(arrayEvents, 'NextMeetupDateTime');
	});

	stateRemovePastDatesFromArrayByProperty.subscribe(function() {
		arrayMerged = mergeArrays(arrayGroups, arrayEventGroupIDs, 'GroupID');
		console.log('9 | merge Groups and Events arrays');

		groupsData(arrayMerged);
	});

	stateGroupsData.subscribe(function() {
		sortArrayByGroupActivity();

		//console.warn('merged array');
		//console.table(arrayMerged);

		var countDataGroups = 0;
		var countDomGroups = 0;

		var waitForElement = function() {
			countDataGroups = groupsData().length;
			countDomGroups = $('#content .card').length;
			//console.warn('waitForElement triggered | data:' + countDataGroups + ' | dom:' + countDomGroups);

			if (countDataGroups === countDomGroups) {
				// SPLIT THESE UP WITH WAITS
				countCards();
				getUserLocation();
				console.log('11 | group DOM elements finished loading');
			} else {
				setTimeout(waitForElement, 1000);
			}
		}
		waitForElement();
	});

	stateUserLocationDetection.subscribe(function() {
		uiCleanup();
		init();
		updateUserLocation();
	});

	var updateUserLocation = function() {
		if (userLocationState() == 'louisiana') {
			var checkCityMatch = $.grep(arrayLocations, function (e) {
				return e.value == userLocationCity();
			});

			if (checkCityMatch.length > 0) {
				userLocationMatch(true);
				console.log('user location city match');
			}
		}

		if (userLocationMatch()) {
			var startLocation = '.' + userLocationCity();
		} else {
			var startLocation = '*';
		}

		$('#content').isotope({
			itemSelector: '.card',
			filter: startLocation
		});

		$('#location-selector').val(userLocationCity()).trigger('change');
	}

	var getUserLocation = function() {
		// $.getJSON('http://ip-api.com/json', function(data) {
		// 	//console.log(JSON.stringify(data, null, 2));
		// 	//data.city = 'New Orleans';
		// 	userLocationCity(data.city.toLowerCase().replace(/ /g , '-'));
		// 	userLocationState(data.regionName.toLowerCase());
		// });

		if (userLocationCity() == '' || userLocationState() == '') {
			$.getJSON('https://extreme-ip-lookup.com/json', function(data) {
				if (data.status == 'success') {
					console.log('location detection: pulled');
					//console.log(JSON.stringify(data, null, 2));
					//data.city = 'New Orleans';
					userLocationCity(data.city.toLowerCase().replace(/ /g , '-'));
					userLocationState(data.region.toLowerCase());

					sessionStorage.setItem('userCity', userLocationCity());
					sessionStorage.setItem('userState', userLocationState());
				} else {
					console.error('location detection: failed');
				}
				stateUserLocationDetection(true);
			});
		} else {
			console.log('location detection: skipped');
			stateUserLocationDetection(true);
		}
	}

	userLocationCity(getUrlParam('location') || sessionStorage.getItem('userCity') || '');
	userLocationState(sessionStorage.getItem('userState') || '');

	loadData();
});
