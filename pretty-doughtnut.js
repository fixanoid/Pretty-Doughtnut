var doughnutWidget = {
	charts: {},

	prettyNumber: function(n) {
		// pretty count
		return (n + '').replace(/./g, function(c, i, a) {
			return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
		});
	},

	positionLabel: function(value) {
		var container = {
			top: $('#' + value).offset().top,
			left: $('#' + value).offset().left,
			height: $('#' + value).height(),
			width: $('#' + value).width()
		}

		var label = {
			height: $('#' + value + 'Label').height(),
			width: $('#' + value + 'Label').width()
		}

		// find position
		var position = {
			top: container.top + container.height / 2 - (label.height / 2),
			left: container.left + container.width / 2 - (label.width / 2)
		}

		$('#' + value + 'Label').offset(position);
	},

	createCanvas: function(value, o) {
		var canvas;
		if (doughnutWidget.options) {
			canvas = $('<canvas>', { id: value, width: doughnutWidget.options.width, height: doughnutWidget.options.height, class: doughnutWidget.options.class});
		} else {
			canvas = $('<canvas>', { id: value, width: o.width, height: o.height});

			if (o.class) {
				canvas.addClass(o.class);
			}
		}

		if (doughnutWidget.options && doughnutWidget.options.container) {
			doughnutWidget.options.container.append(canvas);
		} else {
			o.container.append(canvas);
		}
	},

	render: function(o) {
		for (var value in o) {
			if (!doughnutWidget.charts[value + 'Chart']) {
				// create canvas
				doughnutWidget.createCanvas(value, o[value]);

				// create chart
				doughnutWidget.charts[value + 'Chart'] = new Chart($('#' + value).get(0).getContext('2d')).Doughnut(
					[{
						value: o[value].val,
						label: '1',
						color: o[value].color
					}, {
						value: 100 - o[value].val,
						color: '#F0F0F0'
					}],
					{
						percentageInnerCutout: (doughnutWidget.options && doughnutWidget.options.cutout) ? doughnutWidget.options.cutout : 75,
						animationEasing: 'easeOut',
						showTooltips: false
					});

				// create the labels
				var perc = $('<div class="labelPercentage"><a href="' + (o[value].link ? o[value].link : '#') + '" class="labelLink">' + o[value].val + '%</a></div>');

				var label = $('<span id="' + value + 'Label" class="labelContainer"></span>');
				label.append(perc);
				label.append('<div class="labelText">' + value + '</div>');

				$( (doughnutWidget.options && doughnutWidget.options.container ? doughnutWidget.options.container : o[value].container) ).append(label);

				// click handler
				if (o[value].click) {
					$('#' + value + 'Label .labelLink').click(o[value].click);
				}
			} else {
				// update the charts
				doughnutWidget.charts[value + 'Chart'].segments[0].value = o[value].val;
				doughnutWidget.charts[value + 'Chart'].update();

				var perc = $('#' + value + 'Label .labelLink');
				perc.html(o[value].val + '%');
			}

			doughnutWidget.positionLabel(value);
		}
	}
}