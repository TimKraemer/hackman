require.config({
	baseUrl: 'src/'
});

(function() {
	function imageFactory(src, width, left, top, zIndex) {
		return $('<img>', {
			src: src,
			css: {
				width: String(width) + 'px',
				position: 'absolute',
				left: String(left) + 'px',
				top: String(top) + 'px',
				'z-index': zIndex
			}
		});
	}

	var width = 640, height = 480,
		$container = $('#game-container').css({width: String(width) + 'px', height: String(height) + 'px'}),
		informationCount = 0,
		$informationField = $('<span>', {text: String(informationCount)}),
		fontSize = 20,
		$informationBar = $('<div>', {
			append: [$informationField, $('<span>', {text: 'i'})],
			css: {
				'font-size': String(fontSize) + 'px',
				color: 'white',
				position: 'relative',
				top: String(height - fontSize - 5) + 'px',
				left: String(.9 * width) + 'px',
				'z-index': 2
			}
		}),
		hackmanWidth = width / 8,
		$hackman = imageFactory('Images/Hackbuddy.png', hackmanWidth, width / 2 - hackmanWidth / 2, .5 * height, 2),
		screenWidth = hackmanWidth / 1.2,
		$screen = imageFactory('Images/Display01.png', screenWidth, width / 2 - screenWidth / 2, .38 * height, 0);

	$container.append($hackman, $screen, $informationBar);

	require(['typist', '../libs/jquery.transit'], function(typist) {
		typist.attach(function(keyword, value) {
			informationCount += value;
			$informationField.text(informationCount);
			var offset = $hackman.position(),
				text = '+' + String(value);

			if (keyword) text += ' - ' + keyword;

			var $popup = $('<span>', {
				text: text,
				'class': 'information-up',
				css: {
					position: 'absolute',
					left: String(offset.left + 30) + 'px',
					top: String(offset.top) + 'px',
					'z-index': 1
				}
			});
			$container.append($popup);
			setTimeout(function() {
				var	n = Math.random() * Math.PI - .5 * Math.PI,
					C = -50,
					x = Math.sin(n) * C, y = Math.cos(n) * C;

				if (keyword) {
					x = 0;
					y = C;
				}

				$popup.transition({y: y, x: x}, function() {
					$(this).transition({opacity: 0}, function(){
						$(this).remove();
					});
				});
			}, 50);
		});
	});

})();