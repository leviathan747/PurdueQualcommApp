;var Loader;

(function() {
	'use strict';

	/*
	 * Loader
	 */

	Loader = {
		show: function() {
			$('#loader').show();
		},

		hide: function() {
			$('#loader').hide();
			setTimeout(function() {
				$('#loader').hide();
			}, 350);
		}
	}
})();