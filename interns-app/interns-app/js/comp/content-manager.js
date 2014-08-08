;var ContentManager;

(function() {
	'use strict';

	/*
	 * ContentManager
	 */

	ContentManager = {
		load: function() {
			this.data = internData;
			this.firstAccess = true;
		},

		populateNews: function() {
			var htmlLeft = [];
			var htmlRight = [];
			var htmlFull = [];
			var total = 0;

			for (var i = 0; i < this.data.news.length; i++) {
				if (this.data.news[i].type == 'normal')
					total++;
			}

			var current = 0;

			for (var i = 0; i < this.data.news.length; i++) {
				var html = current < total / 2 ? htmlLeft : htmlRight;
				var item = this.data.news[i];

				if (item.type == 'full') {
					html = htmlFull;
				}

				html.push('<li class="clearfix">');
				html.push('	<a href="' + item.link + '">');

				if (item.link) 	html.push('	<a class="box-item" href="' + item.link + '" onclick="' + item.tracking + '">');
				else 			html.push('	<div class="box-item">');

				if (item.type == 'full') {
					html.push('		<span class="badge-appstore"></span>');
				}

				html.push('		<div class="news-detail">');
				html.push('			<strong class="featured-title">' + item.title + '</strong>');
				html.push('			<strong class="featured-subtitle">' + item.subtitle + '</strong>');
				html.push('			<p class="featured-description">' + item.description + '</p>');

				if (item.mobileOnly) {
					html.push('			<p class="featured-mobileonly">Available for mobile devices only.</p>');
				}

				html.push('		</div>');

				if (item.link) 	html.push('	</a>');
				else 			html.push('	</div>');

				html.push('</li>');

				current++;
			}
			
			$('#page-news-col-left').html(htmlLeft.join(''));
			$('#page-news-col-right').html(htmlRight.join(''));
			$('#page-news-full').html(htmlFull.join(''));
		},


		populateprogram: function() {
			var htmlLeft = [];
			var htmlRight = [];
			var htmlFull = [];
			var total = 0;

			for (var i = 0; i < this.data.program.length; i++) {
				if (this.data.program[i].type == 'normal')
					total++;
			}

			var current = 0;

			for (var i = 0; i < this.data.program.length; i++) {
				var html = current < total / 2 ? htmlLeft : htmlRight;
				var item = this.data.program[i];

				if (item.type == 'full') {
					html = htmlFull;
				}

				html.push('<li class="clearfix">');

				if (item.type == 'full') {
					html.push('		<span class="badge-appstore"></span>');
				}

				html.push('		<img src="' + item.icon + '" class="app-ico">');
				html.push('		<div class="featured-detail">');
				html.push('			<strong class="featured-title">' + item.title + '</strong>');
				html.push('			<strong class="featured-subtitle">' + item.subtitle + '</strong>');
				html.push('			<p class="featured-description">' + item.description + '</p>');

				if (item.mobileOnly) {
					html.push('			<p class="featured-mobileonly">Available for mobile devices only.</p>');
				}

				html.push('		</div>');

				html.push('</li>');

				current++;
			}
			
			$('#page-program-col-left').html(htmlLeft.join(''));
			$('#page-program-col-right').html(htmlRight.join(''));
			$('#page-program-full').html(htmlFull.join(''));
		},

		populateSpecificHighlight: function(highlight, highlightId) {
			var htmlLeft = [];
			var htmlRight = [];
			var htmlGalery = [];
			var itemsGalery = [];
			var total = 2;

			for (var i = 0; i < highlight.items.length; i++) {
				if (highlight.items[i].galery) continue;

				total += highlight.items[i].items.length;
			}

			var current = 0;

			for (var i = 0; i < highlight.items.length; i++) {
				var html = current < total / 2 ? htmlLeft : htmlRight;

				if (highlight.items[i].galery) {
					for (var j = 0; j < highlight.items[i].items.length; j++) {
						itemsGalery.push(highlight.items[i].items[j]);
					}

					continue;
				}

				html.push('<li class="title-separator">' + highlight.items[i].type + '</li>');

				for (var j = 0; j < highlight.items[i].items.length; j++) {
					var html = current < total / 2 ? htmlLeft : htmlRight;
					var item = highlight.items[i].items[j];

					if (item) {
						if (html == htmlRight && htmlRight.length == 0) {
							html.push('<li class="title-separator title-separator-secondary">' + highlight.items[i].type + '</li>');
						}

						var typeClass = item.link && item.link.indexOf('.mp4') != -1 ? 'video-link' : '';

						html.push('<li>');

						if (item.link) 	html.push('	<a class="box-item clearfix ' + typeClass + '" href="' + item.link + '">');
						else 			html.push('	<div class="box-item clearfix">');

						html.push('		<img class="highlight-thumb" src="' + item.photo + '">');
						html.push('		<div class="highlight-ico">');
						html.push('			<span class="ico ' + item.icon + '"></span>');
						html.push('		</div>');
						html.push('		<div class="highlight-detail">');
						html.push('			<strong class="highlight-title">' + item.title + '</strong>');
						html.push('			<strong class="highlight-name">' + item.name + '</strong>');
						html.push('			<p class="highlight-description">' + item.description + '</p>');
						html.push('		</div>');

						if (item.link) 	html.push('	</a>');
						else 			html.push('	</div>');

						html.push('</li>');

						current++;
					}
				}
			}

			for (var j = 0; j < itemsGalery.length; j++) {
				var html = htmlGalery;
				var item = itemsGalery[j];

				if (item) {
					html.push('<li>');
					html.push('	<div>');
					html.push('		<a class="box-item galery-link clearfix ' + typeClass + '" href="' + item.photo + '">');
					html.push('			<img class="highlight-thumb" src="' + item.thumb + '">');
					html.push('		</a>');
					html.push('	</div>');
					html.push('</li>');
					current++;
				}
			}

			if (itemsGalery.length > 0) {
				$('#page-' + highlightId + '-galery-title').show();
			} else {
				$('#page-' + highlightId + '-galery-title').hide();
			}
			
			$('#page-' + highlightId + '-col-left').html(htmlLeft.join(''));
			$('#page-' + highlightId + '-col-right').html(htmlRight.join(''));
			$('#page-' + highlightId + '-galery').html(htmlGalery.join(''));

			bindVideos('#page-' + highlightId + '');

			$('#page-' + highlightId + '-titles .selected').removeClass('selected');
			$('#page-' + highlightId + '-titles [data-rel=' + highlight.year + ']').addClass('selected');

			$('.galery-link').magnificPopup({ 
				type: 'image',
				gallery: {
					enabled: true,
					tCounter: ''
				}
			});
		},



		populateFeatured: function() {
			var htmlLeft = [];
			var htmlRight = [];
			var htmlFull = [];
			var total = 0;

			for (var i = 0; i < this.data.featured.length; i++) {
				if (this.data.featured[i].type == 'normal')
					total++;
			}

			var current = 0;

			for (var i = 0; i < this.data.featured.length; i++) {
				var html = current < total / 2 ? htmlLeft : htmlRight;
				var item = this.data.featured[i];

				if (item.type == 'full') {
					html = htmlFull;
				}

				html.push('<li class="clearfix">');
				html.push('	<a href="' + item.link + '">');

				if (item.link) 	html.push('	<a class="box-item" href="' + item.link + '" onclick="' + item.tracking + '">');
				else 			html.push('	<div class="box-item">');

				if (item.type == 'full') {
					html.push('		<span class="badge-appstore"></span>');
				}

				html.push('		<img src="' + item.icon + '" class="app-ico">');
				html.push('		<div class="featured-detail">');
				html.push('			<strong class="featured-title">' + item.title + '</strong>');
				html.push('			<strong class="featured-subtitle">' + item.subtitle + '</strong>');
				html.push('			<p class="featured-description">' + item.description + '</p>');

				if (item.mobileOnly) {
					html.push('			<p class="featured-mobileonly">Available for mobile devices only.</p>');
				}

				html.push('		</div>');

				if (item.link) 	html.push('	</a>');
				else 			html.push('	</div>');

				html.push('</li>');

				current++;
			}
			
			$('#page-featured-col-left').html(htmlLeft.join(''));
			$('#page-featured-col-right').html(htmlRight.join(''));
			$('#page-featured-full').html(htmlFull.join(''));
		},



		populateresources: function() {
			var htmlLeft = [];
			var htmlRight = [];
			var total = 2	


			for (var i = 0; i < this.data.resources.length; i++) {
				total += this.data.resources[i].items.length;
			}

			var current = 0;

			for (var i = 0; i < this.data.resources.length; i++) {
				var html = current < total / 2 ? htmlLeft : htmlRight;

				html.push('<li class="title-separator">' + this.data.resources[i].type + '</li>');

				for (var j = 0; j < this.data.resources[i].items.length; j++) {
					var html = current < total / 2 ? htmlLeft : htmlRight;
					var item = this.data.resources[i].items[j];

					if (html == htmlRight && htmlRight.length == 0) {
						html.push('<li class="title-separator title-separator-secondary">' + this.data.resources[i].type + '</li>');
					}

					var typeClass = item.link && item.link.indexOf('.mp4') != -1 ? 'video-link' : '';

					html.push('<li>');
					
					item.tracking

					if (item.link) 	html.push('	<a class="box-item clearfix ' + typeClass + '" href="' + item.link + '" onclick="' + item.tracking + '">');
					else 			html.push('	<div class="box-item clearfix">');

					html.push('		<img class="resources-thumb" src="' + item.photo + '">');
					html.push('		<div class="resources-detail">');
					html.push('			<strong class="resources-title">' + item.title + '</strong>');
					html.push('			<p class="resources-description">' + item.description + '</p>');
					html.push('		</div>');

					if (item.link) 	html.push('	</a>');
					else 			html.push('	</div>');

					html.push('</li>');

					current++;
				}
			}
			
			$('#page-resources-col-left').html(htmlLeft.join(''));
			$('#page-resources-col-right').html(htmlRight.join(''));

			bindVideos('#page-resources');
		},


		populatecampusteam: function() {
			var htmlLeft = [];
			var htmlRight = [];
			var total = -3

			for (var i = 0; i < this.data.campusteam.length; i++) {
				total += this.data.campusteam[i].items.length;
			}

			var current = 0;

			for (var i = 0; i < this.data.campusteam.length; i++) {
				var html = current < total / 2 ? htmlLeft : htmlRight;

				html.push('<li class="title-separator">' + this.data.campusteam[i].type + '</li>');

				for (var j = 0; j < this.data.campusteam[i].items.length; j++) {
					var html = current < total / 2 ? htmlLeft : htmlRight;
					var item = this.data.campusteam[i].items[j];

					if (html == htmlRight && htmlRight.length == 0) {
						html.push('<li class="title-separator title-separator-secondary">' + this.data.campusteam[i].type + '</li>');
					}

					var typeClass = item.link && item.link.indexOf('.mp4') != -1 ? 'video-link' : '';

					html.push('<li>');
					
					if (item.link) 	html.push('	<a class="box-item clearfix ' + typeClass + '" href="' + item.link + '">');
					else 			html.push('	<div class="box-item clearfix">');

					html.push('		<img class="campusteam-thumb" src="' + item.photo + '">');
					html.push('		<div class="campusteam-detail">');
					html.push('			<strong class="campusteam-title">' + item.title + '</strong>');
					html.push('			<strong class="campusteam-subtitle">' + item.subtitle + '</strong>');
					html.push('			<p class="campusteam-description">' + item.description + '</p>');
					html.push('		</div>');

					if (item.link) 	html.push('	</a>');
					else 			html.push('	</div>');

					html.push('</li>');

					current++;
				}
			}
			
			$('#page-campusteam-col-left').html(htmlLeft.join(''));
			$('#page-campusteam-col-right').html(htmlRight.join(''));

			bindVideos('#page-campusteam');
		},


		populatespotlight: function() {
			var htmlLeft = [];
			var htmlRight = [];
			var total = 0

			for (var i = 0; i < this.data.spotlight.length; i++) {
				total += this.data.spotlight[i].items.length;
			}

			var current = 0;

			for (var i = 0; i < this.data.spotlight.length; i++) {
				var html = current < total / 2 ? htmlLeft : htmlRight;

				html.push('<li class="title-separator">' + this.data.spotlight[i].type + '</li>');

				for (var j = 0; j < this.data.spotlight[i].items.length; j++) {
					var html = current < total / 2 ? htmlLeft : htmlRight;
					var item = this.data.spotlight[i].items[j];

					if (html == htmlRight && htmlRight.length == 0) {
						html.push('<li class="title-separator title-separator-secondary">' + this.data.spotlight[i].type + '</li>');
					}

					var typeClass = item.link && item.link.indexOf('.mp4') != -1 ? 'video-link' : '';

					html.push('<li>');
					
					if (item.link) 	html.push('	<a class="box-item clearfix ' + typeClass + '" href="' + item.link + '">');
					else 			html.push('	<div class="box-item clearfix">');

					html.push('		<img class="spotlight-thumb" src="' + item.photo + '">');
					html.push('		<div class="spotlight-detail">');
					html.push('			<strong class="spotlight-title">' + item.title + '</strong>');
					html.push('			<strong class="spotlight-subtitle">' + item.subtitle + '</strong>');
					html.push('			<p class="spotlight-description">' + item.description + '</p>');
					html.push('		</div>');

					if (item.link) 	html.push('	</a>');
					else 			html.push('	</div>');

					html.push('</li>');

					current++;
				}
			}
			
			$('#page-spotlight-col-left').html(htmlLeft.join(''));
			$('#page-spotlight-col-right').html(htmlRight.join(''));

			bindVideos('#page-spotlight');
		},

		populateevents: function() {
			var htmlLeft = [];
			var htmlRight = [];
			var total = 0

			for (var i = 0; i < this.data.events.length; i++) {
				total += this.data.events[i].items.length;
			}

			var current = 0;

			for (var i = 0; i < this.data.events.length; i++) {
				var html = current < total / 2 ? htmlLeft : htmlRight;

				html.push('<li class="title-separator">' + this.data.events[i].type + '</li>');

				for (var j = 0; j < this.data.events[i].items.length; j++) {
					var html = current < total / 2 ? htmlLeft : htmlRight;
					var item = this.data.events[i].items[j];

					if (html == htmlRight && htmlRight.length == 0) {
						html.push('<li class="title-separator title-separator-secondary">' + this.data.events[i].type + '</li>');
					}

					var typeClass = item.link && item.link.indexOf('.mp4') != -1 ? 'video-link' : '';

					html.push('<li>');
					
					if (item.link) 	html.push('	<a class="box-item clearfix ' + typeClass + '" href="' + item.link + '" onclick="' + item.tracking + '">');
					else 			html.push('	<div class="box-item clearfix">');

					html.push('		<img class="events-thumb" src="' + item.photo + '">');
					html.push('		<div class="events-detail">');
					html.push('			<strong class="events-title">' + item.title + '</strong>');
					html.push('			<strong class="events-subtitle">' + item.subtitle + '</strong>');
					html.push('			<p class="events-description">' + item.description + '</p>');
					html.push('		</div>');

					if (item.link) 	html.push('	</a>');
					else 			html.push('	</div>');

					html.push('</li>');

					current++;
				}
			}
			
			$('#page-events-col-left').html(htmlLeft.join(''));
			$('#page-events-col-right').html(htmlRight.join(''));

			bindVideos('#page-events');
		},



		populatenetworks: function() {
			var htmlLeft = [];
			var htmlRight = [];
			var total = 0

			for (var i = 0; i < this.data.networks.length; i++) {
				total += this.data.networks[i].items.length;
			}

			var current = 0;

			for (var i = 0; i < this.data.networks.length; i++) {
				var html = current < total / 2 ? htmlLeft : htmlRight;

				for (var j = 0; j < this.data.networks[i].items.length; j++) {
					var html = current < total / 2 ? htmlLeft : htmlRight;
					var item = this.data.networks[i].items[j];

					if (html == htmlRight && htmlRight.length == 0) {
					}

					var typeClass = item.link && item.link.indexOf('.mp4') != -1 ? 'video-link' : '';

					html.push('<li>');
					
					if (item.link) 	html.push('	<a class="box-item clearfix ' + typeClass + '" href="' + item.link + '" onclick="' + item.tracking + '">');
					else 			html.push('	<div class="box-item clearfix">');

					html.push('		<img class="networks-thumb" src="' + item.photo + '">');
					html.push('		<div class="networks-detail">');
					html.push('			<strong class="networks-title">' + item.title + '</strong>');
					html.push('			<strong class="networks-subtitle">' + item.subtitle + '</strong>');
					html.push('			<p class="networks-description">' + item.description + '</p>');
					html.push('		</div>');

					if (item.link) 	html.push('	</a>');
					else 			html.push('	</div>');

					html.push('</li>');

					current++;
				}
			}
			
			$('#page-networks-col-left').html(htmlLeft.join(''));
			$('#page-networks-col-right').html(htmlRight.join(''));

			bindVideos('#page-networks');
		},


		populatephotos: function() {
			var htmlLeft = [];
			var htmlRight = [];
			var total = 0

			for (var i = 0; i < this.data.photos.length; i++) {
				total += this.data.photos[i].items.length;
			}

			var current = 0;

			for (var i = 0; i < this.data.photos.length; i++) {
				var html = current < total / 2 ? htmlLeft : htmlRight;

				for (var j = 0; j < this.data.photos[i].items.length; j++) {
					var html = current < total / 2 ? htmlLeft : htmlRight;
					var item = this.data.photos[i].items[j];

					if (html == htmlRight && htmlRight.length == 0) {
					}

					var typeClass = item.link && item.link.indexOf('.mp4') != -1 ? 'video-link' : '';

					html.push('<li>');
					
					if (item.link) 	html.push('	<a class="box-item clearfix ' + typeClass + '" href="' + item.link + '" onclick="' + item.tracking + '">');
					else 			html.push('	<div class="box-item clearfix">');

					html.push('		<img class="networks-thumb" src="' + item.photo + '">');
					html.push('		<div class="networks-detail">');
					html.push('			<strong class="networks-title">' + item.title + '</strong>');
					html.push('			<strong class="networks-subtitle">' + item.subtitle + '</strong>');
					html.push('			<p class="networks-description">' + item.description + '</p>');
					html.push('		</div>');

					if (item.link) 	html.push('	</a>');
					else 			html.push('	</div>');

					html.push('</li>');

					current++;
				}
			}
			
			$('#page-photos-col-left').html(htmlLeft.join(''));
			$('#page-photos-col-right').html(htmlRight.join(''));

			bindVideos('#page-photos');
		},


		populate: function() {
			this.populateNews();
			this.populateprogram();
			this.populateresources();
			this.populatecampusteam();
			this.populatespotlight();
			this.populateevents();
			this.populatenetworks();
			this.populatephotos();
			this.populateFeatured();
		},
	}
})();