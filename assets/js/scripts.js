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

			// fix: KO loop loading before the content loaded
			setTimeout(function() {
				$('body').removeClass('loading');
			}, 0);		},
		error: function() {
			alert('error!');
		}
	});

});




function randomNumber(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}
