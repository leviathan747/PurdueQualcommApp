;var Yes;

(function() {
	'use strict';

	/*
	 * Yes
	 */

	Yes = {
		play: function() {
			if (typeof(Audio) == 'undefined') {
				var r = Math.floor(Math.random() * Yes.items.length);
				$('.yes-audio').remove();
				$('body').append('<embed height="0" width="0" class="yes-audio visuallyhidden" src="' + Yes.items[r] + '">');

				return false;
			};

			var r = Math.floor(Math.random() * Yes.audios.length);
			Yes.audios[r].play();
		},

		load: function() {
			var extension = DeviceHelper.IS_BB || DeviceHelper.IS_ANDROID || DeviceHelper.IS_FIREFOX ? '.ogg' : '.mp3';

			Yes.items = [
				'media/accept' + extension,
				'media/address' + extension,
				'media/edh' + extension,
				'media/hawaii' + extension,
				'media/hydrate' + extension,
				'media/mysource' + extension,
				'media/sunscreen' + extension,
				'media/tacos' + extension																																																	
			];

			if (typeof(Audio) == 'undefined') return false;

			Yes.audios = [];

			for (var i = 0; i < Yes.items.length; i++) {
				Yes.audios.push(new Audio(Yes.items[i]));
			}
		}
	}
})();