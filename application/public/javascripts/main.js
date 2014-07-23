function bindClickEnhancement() {
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

function checkCompatibility() {
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
}


/* App start */
var SPLASHSCREEN_TIMER = 2000;
var CONTAINER_RENDER_TIMER = 1000;

var navigation;

$(function() {
  if (DeviceHelper.IS_MOBILE && !DeviceHelper.IS_TABLET) {
    $('body').prepend($('#navigation'));
  }


  bindClickEnhancement();
  checkCompatibility();

  if (location.hash.length > 0) {
      hideNav();
  }
  else {


          buildContentNav();

  }
});

function hideNav() {
    console.log('here');
    buildContentNav();
    hideSplashScreen();
}

function hideSplashScreen() {
};

function buildContentNav() {
    $('#general').show();
    navigation = new Navigation();
}
