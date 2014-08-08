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
		this.setRoutes();
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

	Navigation.prototype.setRoutes = function() {
		var _this = this;

		Path.map('#!/:main(/:sub)(/:params)').to(function() {
			var that = this;
			// Loader.show();
			// setTimeout(function() {
				_this.goTo(that.params.main, null, function() {
					// Loader.hide();
				});
			// }, 0); // TODO
		});

		// Path.root('#!/agenda');
		Path.root('#!/news');
		Path.listen();
	};

	Navigation.prototype.setContainerHeight = function() {
		// var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
		// $('.page-container').height(height - HEADER_HEIGHT);	
	};

	Navigation.prototype.goTo = function(pageName, beforeShow, afterShow) {
		beforeShow && beforeShow();

		var page = $('#page-' + pageName);
		var currentPage = $('.page:visible');
		var navTimer = 0;

		if (DeviceHelper.IS_MOBILE && !DeviceHelper.IS_TABLET) {
			$('#general').trigger('click');
			navTimer = 500;
		}

		setTimeout(function() {
			currentPage.hide();
			page.show();

			$('#navigation .selected').removeClass('selected');
			$('#navigation li[data-rel=' + pageName + ']').addClass('selected');

			afterShow && afterShow();

			$('html, body').animate({
				scrollTop: 0
			}, navTimer);
		}, navTimer);

		return;

		var general = $('#general');
		var activePage = $('#general .page.active');
		var $win = $(window);

		// $('body').append(page);

		beforeShow && beforeShow();

		page.addClass('activating');
		page.css('min-height', activePage.height());
		// general.append(page);

		if (DeviceHelper.IS_ANDROID) {
			page.addClass('active').removeClass('activating').css('min-height', '100%');
			if (activePage.attr('id') == 'page-home') {
				activePage.removeClass('active').removeClass('activating');
			} else {
				activePage.remove();
			}

			afterShow && afterShow();
		} else {
			if(page.attr('id') == 'page-home')
				page.addClass('slide2').addClass('in');
			else
				page.addClass('slide').addClass('in');

			page.on('animationend webkitAnimationEnd', function() {
				page.addClass('active').removeClass('activating').css('min-height', '100%');

				if (activePage.attr('id') == 'page-home') {
					activePage.removeClass('active').removeClass('activating');
				} else {
					activePage.remove();
				}

				afterShow && afterShow();
			});
		}
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