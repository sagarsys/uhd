$('.dropdown').click(function () {
	$('.select-overlay').removeClass('hide');
});

$('.select-overlay').click(function () {
	$('.select-overlay').addClass('hide');
});

$('.select-overlay h3').click(function () {
	$('.select-overlay').addClass('hide');
	$('.dropdown input').val($(this).text());
});

$('.answers h2').click(function () {
	$('.answers h2').removeClass('active');
	$(this).addClass('active');
});

$('.checkbox-button #declare').click(function () {
	var value = $(this).val();
	if (value === 'true') {
		$(this).val('false');
	} else {
		$(this).val('true');
	}
});

// VEILLE
var timer = 30000;
var tm;

$('body, div, h1, h2, h3, h4, h5, h6, p, small, span, button, label, img, input').click(function () {
	if (tm) clearTimeout(tm);
	retourVeille(timer);
});

retourVeille(timer);

function retourVeille(timer) {
	if (location.pathname !== '/') {
		tm = setTimeout(function () {
			location.pathname = '/';
		}, timer);
	}
}

/*--------------------------------------------------
 CLAVIER
 --------------------------------------------------*/
$('.form-control').click(function () {
	select(this);
});

var selectedElement = null;

function select(element) {
	if ( selectedElement ) {
		selectedElement.removeClass('active');
	}

	selectedElement = $(element);
	selectedElement.addClass('active');
}

function touche(element) {
	var key = $(element).text();

	if ( key === '@' || key === '.' || key === '-' || key === '_' ) {
		$(element).toggleClass('touch-option');
	}

	else if ( $(element).hasClass('space') || $(element).hasClass('suppr') ) {
		$(element).toggleClass('touch-option');
	}

	else {
		$(element).toggleClass('touch');
	}

	setTimeout(function () {
		if ( key === '@' || key === '.' || key === '-' || key === '_' ) {
			$(element).toggleClass('touch-option');
		}

		else if ( $(element).hasClass('space') || $(element).hasClass('suppr') ) {
			$(element).toggleClass('touch-option');
		}

		else {
			$(element).toggleClass('touch');
		}

	}, 150);

	var currentText = selectedElement.val();

	if ( $(element).hasClass('space') ) {
		key = ' ';
	}

	if ( $(element).hasClass('suppr') ) {
		selectedElement.val(currentText.substring(0, currentText.length - 1));
		return;
	}

	selectedElement.val(currentText + key);
}

// Attach click event listener to keyboard
$('.clavier span').click(function (e) {
	touche(e.target);
});

// Annuler click
$('.back').click(function () {
	location.pathname = '/';
});
