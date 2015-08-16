'use strict'

var shopModule = (function() {
	// инициализация функций
	var init = function () {
		_setupListeners();
	};

	// прослушка событий
	var _setupListeners = function () {
		$('.header__basket').hover(_showBasket); // показать содержимое корзины
		$(window).scroll(_showScrollToTop); // показать кнопку скролла
		$('.scrolltotop').click(_scrollToTop); // скроллить наверх при нажатии на кнопку скролла
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


	return {
		init : init
	};

})();

shopModule.init();