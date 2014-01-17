define(function() {
	var gameClock = 0,

		level = [],
		width, height,
		words = ['collateral', 'guantanamo', 'waterboarding', 'bush'],
		charSnakes = [],
		activeSnakes = 3,
		msPerChar = 100,

		ctx, // rendering context
		redraw = true, // whether something changed
		scale = 30;

	function randomChar() {
		return String.fromCharCode(97 + Math.random() * 26);
	}

	function addKeyController() {
		window.addEventListener('keydown', function(event) {
			window.event.preventDefault();
		});
	}

	function randomizeLevel() {
		for (var x = 0; x < width; x++) {
			level[x] = [];
			for (var y = 0; y < height; y++) {
				level[x][y] = {val: randomChar(), insertedAt: -5000};
			}
		}
	}

	function gameLoop(runningTime) {
		var delta = runningTime - gameClock;
		gameClock = runningTime;

		act(delta);
		if (redraw || true) {
			draw();
			redraw = false;
		}

		requestAnimationFrame(gameLoop);
	}

	function act(delta) {
		while (charSnakes.length < activeSnakes) {
			charSnakes.push({
				posX: Math.floor(Math.random() * width),
				posY: -1,
				chars: words[Math.floor(Math.random() * words.length)].split('').reverse(),
				delay: Math.random() * 1000
			});
		}

		charSnakes.forEach(function(snake) {
			if (snake.delay > 0) {
				snake.delay -= delta;
				return;
			}
			snake.delay = msPerChar;

			if (snake.posY - snake.chars.length > height) {
				charSnakes.splice(charSnakes.indexOf(snake), 1);
				return;
			}

			snake.posY++;

			for (var i = 0; i < snake.chars.length; i++) level[snake.posX][snake.posY - i] = {
				val: snake.chars[i],
				insertedAt: gameClock
			};

			level[snake.posX][snake.posY - i] = {
				val: randomChar(),
				insertedAt: -5000
			}
		});
	}

	function draw() {
		ctx.fillStyle = 'black';
		ctx.clearRect(0, 0, width * scale, height * scale);

		for (var x = 0; x < width; x++) for (var y = 0; y < height; y++) {
			var levelChar = level[x][y],
				char = levelChar.val;

			if (!char) continue;

			var charWidth = ctx.measureText(char).width;
			ctx.fillStyle = 'hsl(108, 100%, ' + Math.max(30, 60 - (gameClock - levelChar.insertedAt) / 150) + '%)';
			ctx.fillText(char, x * scale + (scale - charWidth) / 2, y * scale);
		}
	}

	return function(canvas) {
		ctx = canvas.getContext('2d');
		ctx.font = (scale * .9) + 'px bold Consolas';

		width = Math.floor(canvas.getAttribute('width') / scale);
		height = Math.floor(canvas.getAttribute('height') / scale);

		addKeyController();
		randomizeLevel();
		gameLoop(0);
	};

});