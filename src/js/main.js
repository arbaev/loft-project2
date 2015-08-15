'use strict'

var shopModule = (function() {
	// инициализация функций
	var init = function () {
		_setupListeners();
	};

	// прослушка событий
	var _setupListeners = function () {
		$('.header__basket').hover(_showBasket); // показать содержимое корзины
	};

	// показать модальное окно добавления проекта
	var _showBasket = function(ev) {
		// ev.preventDefault();
		$('.basket').toggle();
	};



	return {
		init : init
	};

})();

shopModule.init();