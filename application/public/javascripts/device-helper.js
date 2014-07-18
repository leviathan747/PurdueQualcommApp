/*
 * DeviceHelper
 */

var DeviceHelper = function() {
	this.init();
}

DeviceHelper.IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BB|BlackBerry|Mobile|IEMobile|Touch/i.test(navigator.userAgent);
DeviceHelper.IS_ANDROID = DeviceHelper.IS_MOBILE && /Android/i.test(navigator.userAgent);
DeviceHelper.IS_IPAD = DeviceHelper.IS_MOBILE && /iPad/i.test(navigator.userAgent);
DeviceHelper.IS_IPHONE = /iPhone|iPod/i.test(navigator.userAgent);
DeviceHelper.IS_BB = DeviceHelper.IS_MOBILE && /BB/i.test(navigator.userAgent);
DeviceHelper.IS_OLDBB = DeviceHelper.IS_MOBILE && /BlackBerry/i.test(navigator.userAgent);
DeviceHelper.IS_WINPHONE = DeviceHelper.IS_MOBILE && /MSIE/i.test(navigator.userAgent);
DeviceHelper.IS_MSIE = /MSIE/i.test(navigator.userAgent);
DeviceHelper.IS_TABLET = DeviceHelper.IS_MOBILE && (DeviceHelper.IS_IPAD || (DeviceHelper.IS_ANDROID && navigator.userAgent.indexOf('Mobile') == -1) || (DeviceHelper.IS_WINPHONE && navigator.userAgent.indexOf('Tablet') != -1));
DeviceHelper.IS_FIREFOX = /Firefox/i.test(navigator.userAgent);

DeviceHelper.prototype.init = function() {
	this.setClasses();
	this.setOrientationClass();
	this.bindEvents();
}

DeviceHelper.prototype.getDeviceVersionByString = function(itemString) {
	var io = navigator.userAgent.indexOf(itemString) + itemString.length;
	return navigator.userAgent.substring(io, io + 3).split(' ')[0].split('.')[0].split(';')[0].split(',')[0].split('_')[0];
}

DeviceHelper.prototype.setBodyClass = function(itemString, clsString) {
	var cls = [];

	var version = parseInt(this.getDeviceVersionByString(itemString));
	cls.push('device-' + clsString);
	cls.push('device-' + clsString + '-' + version);
	cls.push('device-' + clsString + '-lt-' + (version + 1));
	cls.push('device-' + clsString + '-gt-' + (version - 1));

	return cls;
}

DeviceHelper.prototype.bindEvents = function() {
	var _this = this;
	$(window).on('resize', function() {
		_this.setOrientationClass();
	});
}

DeviceHelper.prototype.setClasses = function() {
	var body = $('body');
	var cls = [];

	if (DeviceHelper.IS_BB) cls = this.setBodyClass('BB', 'bb');
	if (DeviceHelper.IS_OLDBB) cls = this.setBodyClass('Version/', 'oldbb');
	if (DeviceHelper.IS_ANDROID) cls = this.setBodyClass('Android ', 'android');
	if (DeviceHelper.IS_IPAD) cls = this.setBodyClass('CPU OS ', 'ipad');
	if (DeviceHelper.IS_IPHONE) cls = this.setBodyClass('iPhone OS ', 'iphone');
	if (DeviceHelper.IS_WINPHONE) cls = this.setBodyClass('MSIE ', 'winphone');
	
	if (DeviceHelper.IS_MOBILE) cls.push('device-mobile');
	
	if (DeviceHelper.IS_TABLET) {
		cls.push('device-tablet');
	} else if (DeviceHelper.IS_MOBILE) {
		cls.push('device-smartphone');
	} else {
		cls.push('device-desktop');
	}

	for (var i in cls) $('html').addClass(cls[i]);
}

DeviceHelper.prototype.setOrientationClass = function() {
	var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;

	if (/MSIE 7/i.test(navigator.userAgent)) {
		width = document.documentElement.clientWidth;
		height = document.documentElement.clientHeight;
	}

	if (width > height) {
		$('html').removeClass('device-portrait').addClass('device-landscape');
	} else {
		$('html').removeClass('device-landscape').addClass('device-portrait');
	}
}

var deviceHelper = new DeviceHelper();