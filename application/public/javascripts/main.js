/*
 * General Utils
 */

var bindVideos = function(id) {
	$('.video-link', id).on('click', function(ev) {
		window.location = this.href;
		ev.preventDefault();
		return false;
		
		// if (DeviceHelper.IS_MOBILE) {
			// window.location = this.href;
			// ev.preventDefault();
			// return false;
		// }

		// ev.preventDefault();

		// var modalVideo = $('#modal-video');

		// $('#modal-screenlocker').show();
		// modalVideo.show();

		// var video = new Video('video-container', {
		// 	cls: 'ph-video',
		// 	mp4: this.href,
		// 	webm: 'http://video-js.zencoder.com/oceans-clip.webm',
		// 	ogv: 'http://video-js.zencoder.com/oceans-clip.ogv'
		// }, {
		// 	width: modalVideo.width(),
		// 	height: modalVideo.height()
		// });

		// video.play();

		// return false;
	});
}

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

	// $('.btn-yes, .btn-yes-small').on('click', Yes.play);
	$('.btn-yes, .btn-yes-small').on('click', function() {
		Yes.play();
	});

	ContentManager.load();
	ContentManager.populate();
	
	Yes.load();

	var $window = $(window);
	var splashScreen = $('#splash-screen');

	var hideSplahsScreen = function() {
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
		hideSplahsScreen();

		return false;
	};

	splashScreen.removeClass('hidden');

	var splashScreenLoader = function() {
		setTimeout(function() {
			buildContentNav();

			setTimeout(function() {
				splashScreen.addClass('hide');

				setTimeout(function() {
					hideSplahsScreen();
				}, 1000);
			}, CONTAINER_RENDER_TIMER); // container render

		}, SPLASHSCREEN_TIMER - CONTAINER_RENDER_TIMER);
	}
	
	splashScreenLoader();
});


(function (e) {
	e.fn.countdown = function (t, n) {
	function i() {
		eventDate = Date.parse(r.date) / 1e3;
		currentDate = Math.floor(e.now() / 1e3);
		if (eventDate <= currentDate) {
			n.call(this);
			clearInterval(interval)
		}
		seconds = eventDate - currentDate;
		days = Math.floor(seconds / 86400);
		seconds -= days * 60 * 60 * 24;
		hours = Math.floor(seconds / 3600);
		seconds -= hours * 60 * 60;
		minutes = Math.floor(seconds / 60);
		seconds -= minutes * 60;
		days == 1 ? thisEl.find(".timeRefDays").text("day") : thisEl.find(".timeRefDays").text("days");
		hours == 1 ? thisEl.find(".timeRefHours").text("hour") : thisEl.find(".timeRefHours").text("hours");
		minutes == 1 ? thisEl.find(".timeRefMinutes").text("minute") : thisEl.find(".timeRefMinutes").text("minutes");
		seconds == 1 ? thisEl.find(".timeRefSeconds").text("second") : thisEl.find(".timeRefSeconds").text("seconds");
		if (r["format"] == "on") {
			days = String(days).length >= 2 ? days : "0" + days;
			hours = String(hours).length >= 2 ? hours : "0" + hours;
			minutes = String(minutes).length >= 2 ? minutes : "0" + minutes;
			seconds = String(seconds).length >= 2 ? seconds : "0" + seconds
		}
		if (!isNaN(eventDate)) {
			thisEl.find(".days").text(days);
			thisEl.find(".hours").text(hours);
			thisEl.find(".minutes").text(minutes);
			thisEl.find(".seconds").text(seconds)
		} else {
			alert("Invalid date. Example: 30 Tuesday 2013 15:50:00");
			clearInterval(interval)
		}
	}
	thisEl = e(this);
	var r = {
		date: null,
		format: null
	};
	t && e.extend(r, t);
	i();
	interval = setInterval(i, 1e3)
	}
	})(jQuery);
	$(document).ready(function () {
	function e() {
		var e = new Date;
		e.setDate(e.getDate() + 60);
		dd = e.getDate();
		mm = e.getMonth() + 1;
		y = e.getFullYear();
		futureFormattedDate = mm + "/" + dd + "/" + y;
		return futureFormattedDate
	}
	$("#countdown").countdown({
		date: "27 June 2014 11:00:00", // Change this to your desired date to countdown to
		format: "on"
	});
});
