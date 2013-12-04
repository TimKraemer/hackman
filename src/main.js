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

	var width = 1000, height = 600,
		currentLayer = 0,
		$container = $('#game-container').css({width: String(width) + 'px', height: String(height) + 'px'}),
		$canvas = $container.find('canvas').attr({'width': width, 'height': height}).css({zIndex: 10, position: 'relative'}),
		informationCount = 0,
		$informationField = $('<span>', {text: String(informationCount)}),
		$upgradeButton = $('<span>', {text: ' up'}),
		$soundControl = $('<span>', {'class': 'sound'}),
		fontSize = 20,
		$informationBar = $('<div>', {
			append: [$informationField, $('<span>', {text: 'i'}), $soundControl, $upgradeButton],
			css: {
				'font-size': String(fontSize) + 'px',
				color: 'white',
				position: 'absolute',
				top: String(height - fontSize - 5) + 'px',
				left: String(.9 * width) + 'px',
				'z-index': 99998
			}
		}),
		hackmanWidth = width / 8,
		$hackman = imageFactory('bin/Hackbuddy.png', hackmanWidth, width / 2 - hackmanWidth / 2, .5 * height, 99999),
		screenWidth = hackmanWidth / 1.2,
		$screen = imageFactory('bin/Display01.png', screenWidth, width / 2 - screenWidth / 2, .38 * height, 0);

	$container.append($hackman, $screen, $informationBar);

	// audio looop, background sound
	var myAudio = new Audio('bin/BasicSound.mp3');
	myAudio.addEventListener('ended', function() {
	    this.currentTime = 0;
	    this.play();
	}, false);
	myAudio.play();
	$soundControl.click(function() {
	if (myAudio.paused) {
			myAudio.play();
		} else {
			myAudio.pause();
		}
		$(this).toggleClass("muted");
	});

	require(['hardware'], function(Hardware) {
//		new Tron($canvas[0]);
	});

	require(['tron'], function(Tron) {
//		new Tron($canvas[0]);
	});

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
					'z-index': 99997
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