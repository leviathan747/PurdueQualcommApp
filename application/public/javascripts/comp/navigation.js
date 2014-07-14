;var Navigation;

(function() {
	'use strict';

	/*
	 * Navigation
	 */

	Navigation = function(application) {
		this.firstAccess = true;	
		this.hideTimer = null;
		this.app = application;

		this.init();
	};

	Navigation.prototype.init = function() {
		this.bindEvents();
	};

	Navigation.prototype.bindEvents = function() {
		var _this = this;

		$('body').on('click', '.btn-nav', function() {
			_this.showMainNav();
		});

		$('#navigation li a:not(.disabled)').on('click', function() {
			$('.page.active').trigger(DeviceHelper.IS_MOBILE ? 'touchstart' : 'click');
		});
	};

	Navigation.prototype.setContainerHeight = function() {
		// var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
		// $('.page-container').height(height - HEADER_HEIGHT);	
	};

	Navigation.prototype.showMainNav = function() {
		var _this = this;

		clearTimeout(this.hideTimer);

		$('#header .btn-nav').addClass('selected');
		$('#navigation').show();
		// $('.page-internal').addClass('nav-active');
		$('#general').addClass('side').addClass('in').removeClass('out').one('click', function(ev) {
			ev.preventDefault();
			ev.stopPropagation();
			_this.hideMainNav();
		});
	};

	Navigation.prototype.hideMainNav = function() {
		// $('.page-internal').removeClass('nav-active');
		$('#header .btn-nav').removeClass('selected');
		$('#general').addClass('out').removeClass('in');
		this.hideTimer = setTimeout(function() {
			$('#navigation').hide();
		}, 500);
	};
})();
