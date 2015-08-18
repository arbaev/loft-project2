'use strict'

var shopModule = (function() {
	// инициализация функций
	var init = function () {
		_setupListeners();
		// чтобы IE8 показывал полосатую таблицу спецификации
		$("tr:even").addClass("even");
	};

	// прослушка событий
	var _setupListeners = function () {
		$('.header__basket').hover(_showBasket); // показать содержимое корзины
		$(window).scroll(_showScrollToTop); // показать кнопку скролла
		$('.scrolltotop').click(_scrollToTop); // скроллить наверх при нажатии на кнопку скролла
		$('#search').on('submit', _searchProds); // отправка запроса поиска
		$('.bxslider').bxSlider({
			pagerCustom: '#bx-pager',
			nextSelector: '#bxpager-next',
			prevSelector: '#bxpager-prev',
			nextText: '&rsaquo;',
			prevText: '&lsaquo;'
		});
	};

	// показать содержимое корзины
	var _showBasket = function(ev) {
		$('.basket').toggle();
	};

	var _showScrollToTop = function() {
		if($(this).scrollTop() != 0) {
				$('.scrolltotop').fadeIn();
			} else {
				$('.scrolltotop').fadeOut();
			}
		};

	var	_scrollToTop = function() {
			$('body,html').animate({scrollTop:0},400);
	};

	var _searchProds = function(ev) {
		var searchVal = $('#search').find('input').val();
		console.log(searchVal)
		var form = $(this),
			url = 'search.php',
			data = form.serialize();

		ev.preventDefault();

			$.ajax({
					url: url,
					type: 'post',
					dataType: 'json',
					data: data,
				})
				.done (function(answer) {
					if (answer.status === 'OK') {
						alert('Вы искали ' + answer.text);

					} else if (answer.status === 'empty') {
						alert(answer.text);
					} else {
						alert('Error: ' + answer.text);
						};
				})
				.fail (function(answer) {
					console.log('fail: ' + answer.text);
				});
		};

	return {
		init : init
	};

})();

shopModule.init();