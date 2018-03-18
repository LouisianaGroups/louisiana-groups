/*
multiline comments go here!
*/

$(function() {
	$('.toggle-menu').jPushMenu();

	function generateTempContent() {
		var maxPrototypeLoops = 20;

		for (i = 0; i < maxPrototypeLoops; i++) {
			$(template).appendTo('#output .row');
		}



		$('#output .card').each(function() {
			//$(this).css({'background-image': 'url(' + randomImage() + ')'});
			var colorNum = randomNumber(1, 6);
			$(this).find('.title').addClass('color' + colorNum);
			$(this).find('.group').addClass('color' + colorNum);
			$(this).find('.image .data').html('<img src="' + randomImage() + '">');
		});
	}
	generateTempContent();


});


function randomImage() {
	var image = 'http://lorempixel.com/400/200/business?' + Math.random();
	//var image = 'https://source.unsplash.com/random/400x200?12' + randomNumber(10, 20);
	return image;
}

function randomNumber(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}


var template = `
	<div class="col-12 col-sm-6 col-lg-4 p-0">
		<div class="card">
			<div class="image">
				<div class="blend-red-blue-light">
					<div class="data"></div>
				</div>
			</div>
			<div class="card-body position-absolute">
				<div class="clearfix">
				<div class="title pull-left">
					<h3>Event Title Here</h3>
				</div>
				<div class="date pull-right">
					<span>March 23rd, 2018</span>
				</div>
				</div>
				<div class="group pull-left">Group Name</span>
			</div>
		</div>
	</div>
`;