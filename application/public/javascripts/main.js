var bindClickEnhancement = function() {
  if (DeviceHelper.IS_MOBILE) {
    FastClick.attach(document.body);

    $('body').on({
      touchstart: function(ev) {
        $(this).addClass('active').addClass('active-fastclick');
        $(this).parent().addClass('active').addClass('active-fastclick');
      }
    }, 'a, .link, label');

    $('body').on({
      touchend: function(ev) {
        $('.active-fastclick').removeClass('active').removeClass('active-fastclick');
      },

      touchmove: function(ev) {
        $('.active-fastclick').removeClass('active').removeClass('active-fastclick');
      }
    });
  } else {
    $('body').on({
      mousedown: function(ev) {
        $(this).addClass('active');
        $(this).parent().addClass('active');
      },

      mouseup: function(ev) {
        $(this).removeClass('active');
        $(this).parent().removeClass('active');
      }
    }, 'a, .link, label');		
  }
};


/* App start */
var SPLASHSCREEN_TIMER = 2000;
var CONTAINER_RENDER_TIMER = 1000;

$(function() {
  if (DeviceHelper.IS_MOBILE && !DeviceHelper.IS_TABLET) {
    $('body').prepend($('#navigation'));
  }

  var $window = $(window);
  var splashScreen = $('#splash-screen');

  var hideSplashScreen = function() {
    splashScreen.hide();
    splashScreen.removeClass('hide');
  };

  var buildContentNav = function() {
    $('#general').show();
    var navigation = new Navigation();
  }

  bindClickEnhancement();

  if (typeof(document.documentMode) != 'undefined') {
    if (document.documentMode == 7) {
      $('html').addClass('ie7');
    } else if (document.documentMode == 8) {
      $('html').addClass('ie8');
    } else if (document.documentMode == 9) {
      $('html').addClass('ie9');
    } else if (document.documentMode == 10) {
      $('html').addClass('ie10');
    }
  } else {
    if (/MSIE 7/i.test(navigator.userAgent)) {
      $('html').addClass('ie7');
    } else if (/MSIE 8/i.test(navigator.userAgent)) {
      $('html').addClass('ie8');
    } else if (/MSIE 9/i.test(navigator.userAgent)) {
      $('html').addClass('ie9');
    } else if (/MSIE 10/i.test(navigator.userAgent)) {
      $('html').addClass('ie10');
    }
  }

  if (location.hash.length > 0) {
    buildContentNav();
    hideSplashScreen();

    return false;
  };

  splashScreen.removeClass('hidden');

  var splashScreenLoader = function() {
    setTimeout(function() {
      buildContentNav();

      setTimeout(function() {
        splashScreen.addClass('hide');

        setTimeout(function() {
          hideSplashScreen();
        }, 1000);
      }, CONTAINER_RENDER_TIMER); // container render

    }, SPLASHSCREEN_TIMER - CONTAINER_RENDER_TIMER);
  }

  splashScreenLoader();
});
