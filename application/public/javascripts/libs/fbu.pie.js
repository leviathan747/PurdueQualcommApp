if (typeof(fbu) == 'undefined') {
	var fbu = {};
}

fbu.PieChart = function(id, labelsId, data, highlightedItem) {
	this.init(id, labelsId);
	this.data = data;
	this.highlightedItem = highlightedItem;
}

fbu.PieChart.prototype = {
	init: function(id, labelsId) {
	    this.canvas = document.getElementById(id);
	
		// if (navigator.userAgent.indexOf('MSIE') != -1) {
		// 	if (navigator.userAgent.indexOf('MSIE 9') == -1) {
		// 		G_vmlCanvasManager.initElement(this.canvas);
		// 	}
		// }
	
		this.context = this.canvas.getContext('2d');
		this.canvasSize = [this.canvas.width, this.canvas.height];
		this.radius = Math.min(this.canvasSize[0], this.canvasSize[1]) / 2;
		this.center = [this.canvasSize[0]/2, this.canvasSize[1]/2];
	    this.td_index = 1; // which TD contains the data
		this.colors = [];
		this.pieColors = [
			[1, 59, 102],
			[3, 117, 149],
			[6, 172, 189],
			[4, 141, 149],
			[137, 209, 204],
			[112, 207, 238]
		];
		this.highlightColor = [245, 135, 31];
		this.total = 0;
		this.labels = $('#' + labelsId);
	},
	
	setDataFilter: function() {
		var d = [];
		
		for (var i in arguments) {
			d.push(arguments[i]);
		}
		
		this.dataFilter = d;
	},

	getData: function() {
		var value = 0;
		var color;
		var data = this.data;
		
	    for (var i in data.values) {
	        value = data.values[i];
	        this.total += value;

	        color = 'rgb(' + this.pieColors[i].join(',') + ')';
	        this.colors[i] = color;
	    }
		
		return data;
	},

	draw: function() {
		this.clearCanvas();

		var hd = 1;
		var data = this.getData();
		var sf = 0;
		var oldAngle = 1.5 * Math.PI;
		var totalItems = 0;

	    for (var i in data.values) {
	        var portion = data.values[i] / this.total;
	        var wedge = 2 * Math.PI * portion;
			var angle = oldAngle + wedge;
			var labAngle = oldAngle + wedge / 2;
	        var labX = -22 + this.radius + Math.cos(labAngle) * this.radius * 1.5;
	        var labY = -15 + this.radius + Math.sin(labAngle) * this.radius * 1.3 * hd;// - 12;
			var percent = (portion*100).toFixed(0) + '%';
			var selectedOption = data.ids[i] == this.highlightedItem;
			var color = selectedOption ? ('rgb(' + this.highlightColor.join(',') + ')') : ('rgb(' + this.pieColors[i].join(',') + ')');

			this.labels.append('<li style="color:' + color + '"><span style="background-color:' + color + '"></span>' + data.labels[i] + (selectedOption ? ' (you voted this)' : '') + '</li>');
			totalItems++;
			
			if (portion == 0) continue;

			$(this.canvas).parent().append('<div class="portion-label" style="left:' + labX + 'px; top:' + labY +'px; color:' + color + '"><span>' + percent + '</span></div>');

			this.context.save();
			this.context.beginPath();
			this.context.moveTo(this.center[0], this.center[1] / hd);
			this.context.arc(this.center[0] / hd, this.center[1] / hd, this.radius, portion != 1 ? oldAngle : 0, angle, false);
			this.context.restore();
			this.context.fillStyle = color;
			this.context.fill();

			oldAngle = angle;
	    }

	    if (totalItems <= 2) {
	    	this.labels.addClass('single-column');
	    } else {
	    	this.labels.removeClass('single-column');
	    }
	},
	
	clearCanvas: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		$(this.canvas).parent().find('.portion-label').remove();
		this.labels.html('');
	}
}