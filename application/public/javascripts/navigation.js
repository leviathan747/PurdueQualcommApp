var Navigation;

(function() {
    'use strict';
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

    Navigation.prototype.goTo = function(pageName) {
        var navTimer = 0;

        if (DeviceHelper.IS_MOBILE && !DeviceHelper.IS_TABLET) {
            $('#general').trigger('click');
            navTimer = 500;
        }

        setTimeout(function() {
            $('#navigation .selected').removeClass('selected');
            $('#navigation li[data-rel=' + pageName + ']').addClass('selected');

	    $('html, body').animate({
                scrollTop: 0
            }, navTimer);
        }, navTimer);

    };

    Navigation.prototype.showMainNav = function() {
        var _this = this;

        clearTimeout(this.hideTimer);

        $('#header .btn-nav').addClass('selected');
        $('#navigation').show();
        $('#general').addClass('side').addClass('in').removeClass('out').one('click', function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            _this.hideMainNav();
        });
    };

    Navigation.prototype.hideMainNav = function() {
        $('#header .btn-nav').removeClass('selected');
        $('#general').addClass('out').removeClass('in');
        this.hideTimer = setTimeout(function() {
            $('#navigation').hide();
        }, 500);
    };
})();
