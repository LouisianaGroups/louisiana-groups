/*
multiline comments go here!
*/



var eventData = ko.observableArray();

// data model
var vm = function() {
	this.data = $.getJSON();
};

$(function() {
	ko.applyBindings(new vm()); // This makes Knockout get to work

	$.ajax({
		type: 'GET',
		url: 'http://louisianagroups.com/groups.json',
		success: function(data) {
			eventData(data);
			console.table(eventData);
		},
		error: function() {
			alert('error!');
		}
	});

	// fix for the Knockout loop from loading before the content is loaded in
	setTimeout(function() {
		$('body').removeClass('loading');
	}, 0);

});




function randomNumber(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}
