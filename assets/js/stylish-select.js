// Stylish Select
// Developer: Adam Culpepper | @adamculpepper
// https://github.com/adamculpepper/stylish-select

// TODO
// make into proper jQuery plugin - DONE
// adding in options instead of data-attributes
// active states

$.fn.stylishSelect = function() {
	var select = this;
	var selectContainerWidth = 0;
	var selectOffsetWidth = 50; //arrow width or padding offset

	this.addClass('stylish-select');

	var initSelects = function() {
		$('.stylish-select').each(function(e) {
			var selectOptions = [];
			var selectHtml = '';
			var selectIndex = e;
			var selectOptionPlaceholder = $(this).attr('data-select-placeholder') || '';
			var selectOptionTheme = $(this).attr('data-select-theme') || '';
			var selectWidth = $(this).attr('data-select-width') || '';
			var selectOptionWidth = $(this).attr('data-select-dropdown-width') || '';

			$(this).find('option').each(function() {
				var option = $(this);
				var optionText = option.text();
				var optionValue = option.val();

				selectOptions.push({
					'text': optionText,
					'value': optionValue
				});
			});

			$(this).wrap('<div class="stylish-select-container" data-select-id="' + selectIndex + '" data-select-theme="' + selectOptionTheme + '" data-select-width="' + selectWidth + '" data-select-dropdown-width="' + selectOptionWidth + '" data-select-state="closed">');

			selectHtml += '<div class="stylish-select-selected">' + (selectOptionPlaceholder != '' ? selectOptionPlaceholder : selectOptions[0].text) + '</div>';
			selectHtml += '<ul class="stylish-select-list">';

			$.each(selectOptions, function(index, value) {
				selectHtml += '<li data-select-option-value="' + selectOptions[index].value + '">' + selectOptions[index].text + '</li>';
			});

			selectHtml += '</ul>';

			$(this).after(selectHtml);

			if (selectOptionWidth == 'auto') {
				var selectOptionHtml = '';

				$.each(selectOptions, function(index, value) {
					selectOptionHtml += selectOptions[index].text + '<br>';
				});

				// create dummy element for dropdown sizing
				var dummyWidthElement = $('<div class="stylish-select-dropdown-sizer">').html(selectOptionHtml).css({
					'font-size': $(this).css('font-size'),	// ensures same size text.
					'visibility': 'hidden'					// prevents FOUC
				});

				// add to parent, get width, and get out
				dummyWidthElement.appendTo($(this).parent());

				var width = dummyWidthElement.outerWidth();

				dummyWidthElement.remove();

				$(this).closest('.stylish-select-container').find('> .stylish-select-list').width(width + selectOffsetWidth);
			}

			$(this).hide();
			console.table(selectOptions);
		});
	}

	$(document).on('click', '.stylish-select-container > .stylish-select-selected', function(e) {
		var dropdownsOpen = $('.stylish-select-list:visible').length;

		if (dropdownsOpen > 0) {
			hideDropdowns();
		}

		$(this).find('+ .stylish-select-list').show();
		$(this).closest('.stylish-select-container').attr('data-select-state', 'open');
	});

	$(document).on('click', function(e) {
		if ( !$(e.target).is('.stylish-select-selected, .stylish-select-list') ) {
			hideDropdowns();
		}
	});

	$(document).on('click', '.stylish-select-list li', function(e) {
		var clicked = $(e.target);
		var selectedText = clicked.text();
		var selectedValue = clicked.attr('data-select-option-value');
		var clickedSelectIndex = clicked.closest('.stylish-select-container').attr('data-select-id');
		var selectContainer = $('.stylish-select-container[data-select-id=' + clickedSelectIndex + ']');
		selectContainer.find('.stylish-select').val(selectedValue).trigger('change');;
		selectContainer.find('.stylish-select-selected').text(selectedText);
	});

	$(document).on('change', '.stylish-select-container select', function(e) {
		var optionText = $(this).find(':selected').text();
		var optionValue = $(this).val();

		$(this).closest('.stylish-select-container').find('.stylish-select-selected').text(optionText);
	});

	var hideDropdowns = function() {
		$('.stylish-select-container > .stylish-select-list').hide();
		$('.stylish-select-container').attr('data-select-state', 'closed');
	}

	initSelects();    
};
