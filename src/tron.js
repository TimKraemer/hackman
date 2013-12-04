(define(function() {
	//TODO require vector
	var	level = [], width = 50, height = 30,
		FieldType = {EMPTY: 0, WALL: 1},

		Direction = {LEFT: 0, RIGHT: 1, UP: 2, DOWN: 3},
		player = {pos: null, prevPos: null, direction: null, tail: [], moveDelay: 0, delayCap: 80},

		actions = {},

		gameCanvas,
		ctx, // rendering context
		redraw = true, // whether something changed
		scale = 20;

	function addKeyController() {
		window.addEventListener('keydown', function(event) {
			switch (event.keyCode) {
				case 37: //left
					actions[Direction.LEFT] = true;
					break;
				case 38: //up
					actions[Direction.UP] = true;
					break;
				case 39: //right
					actions[Direction.RIGHT] = true;
					break;
				case 40: //down
					actions[Direction.DOWN] = true;
					break;
				default:
					return;
			}
			window.event.preventDefault();
		});
	}

	function initLevel() {
		function randomWithBorder(n) {
			return Math.floor(Math.random() * (n - 1)) + 1;
		}
		player.pos = new Vector(randomWithBorder(width), randomWithBorder(height));
		player.prevPos = player.pos;
		for (var x = 0; x < width; x++) {
			level[x] = [];
			for (var y = 0; y < height; y++) {
				level[x][y] = x * y == 0 || x+1 == width || y+1 == height || Math.random() < .3 ? FieldType.WALL : FieldType.EMPTY;
			}
		}
	}

	var prevTime = 0;
	function gameLoop(runningTime) {
		var delta = runningTime - prevTime;
		prevTime = runningTime;

		act(delta);
		if (redraw) draw();

		requestAnimationFrame(gameLoop);
	}

	function act(delta) {
		for (var action in actions) {
			player.direction = action;
		}
		actions = {};

		if (player.moveDelay > 0) {
			player.moveDelay -= delta;
			return;
		}
		player.moveDelay = player.delayCap;

		var movement;
		switch (parseFloat(player.direction)) {
			case Direction.LEFT:
				movement = new Vector(-1, 0);
				break;
			case Direction.RIGHT:
				movement = new Vector(1, 0);
				break;
			case Direction.UP:
				movement = new Vector(0, -1);
				break;
			case Direction.DOWN:
				movement = new Vector(0, 1);
				break;
		}
		if (movement) {
			var newPos = player.pos.add(movement);
			player.prevPos = player.pos;
			if (level[newPos.x][newPos.y] == FieldType.EMPTY) {
				player.pos = newPos;
			}
		}
	}

	function draw() {
		for (var x = 0; x < width; x++) {
			for (var y = 0; y < height; y++) {
				ctx.fillStyle = level[x][y] == FieldType.EMPTY ? 'white' : 'black';
				ctx.lineWidth = .1;
				ctx.strokeStyle = 'black';
				ctx.fillRect(x * scale, y * scale, scale, scale);
				ctx.strokeRect(x * scale, y * scale, scale, scale);
			}
		}

		ctx.fillStyle = 'green';
		var interpolatedPos = player.prevPos.add(player.pos.subtract(player.prevPos).multiply(1 - player.moveDelay / player.delayCap));
		ctx.fillRect(interpolatedPos.x * scale, interpolatedPos.y * scale, scale, scale);
//		redraw = false;
	}

	return function(canvas) {
		gameCanvas = canvas;
		ctx = canvas.getContext('2d');

		addKeyController();
		initLevel();
		gameLoop(0);
	};
}));