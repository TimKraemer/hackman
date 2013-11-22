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

	// audio looop, background sound
	myAudio = new Audio('bin/BasicSound.mp3'); 
	myAudio.addEventListener('ended', function() {
	    this.currentTime = 0;
	    this.play();
	}, false);
	myAudio.play();

	var width = 640, height = 480,
		$container = $('#game-container').css({width: String(width) + 'px', height: String(height) + 'px'}),
		informationCount = 0,
		$informationField = $('<span>', {text: String(informationCount)}),
		$soundControl = $('<span>', {append: ''}),
		fontSize = 20,
		$informationBar = $('<div>', {
			append: [$informationField, $('<span>', {text: 'i'}), $soundControl],
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
		$hackman = imageFactory('bin/Hackbuddy.png', hackmanWidth, width / 2 - hackmanWidth / 2, .5 * height, 2),
		screenWidth = hackmanWidth / 1.2,
		$screen = imageFactory('bin/Display01.png', screenWidth, width / 2 - screenWidth / 2, .38 * height, 0);

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
				$popup.transition({y: -40}, function() {
					$(this).transition({opacity: 0}, function(){
						$(this).remove();
					});
				});
			}, 50);
		});
	});

})();