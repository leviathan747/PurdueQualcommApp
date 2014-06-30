;var Video;

(function() {
	'use strict';

	/*
	 * Video
	 */

	Video = function(container, videoOptions, videoDimensions) {
		this.init(container, videoOptions, videoDimensions);
	}

	Video.prototype.init = function(container, videoOptions, videoDimensions) {
		var html = [];

		videoOptions.id = container + '-video';

		html.push('<video id="' + videoOptions.id + '" class="video-js vjs-default-skin" controls preload="none" class="' + videoOptions.cls + '" data-setup="{}" width="' + videoDimensions.width + '" height="' + videoDimensions.height + '">');
		videoOptions.mp4 && html.push('	<source src="' + videoOptions.mp4 + '" type="video/mp4" />');
		videoOptions.webm && html.push('	<source src="' + videoOptions.webm + '" type="video/webm" />');
		videoOptions.ogv && html.push('	<source src="' + videoOptions.ogv + '" type="video/ogg" />');
		html.push('</video>');

		$('#' + container).html(html.join(''));

		var _this = this;

		if (!DeviceHelper.IS_IPAD) {
			videojs(videoOptions.id).ready(function() {
				_this.videojs = this;
			});
		} else {
			_this.videojs = $('#' + videoOptions.id)[0];
		}
	}

	Video.prototype.play = function() {
		this.videojs && this.videojs.play();
	}

	Video.prototype.pause = function() {
		this.videojs && this.videojs.pause();
	}
})();