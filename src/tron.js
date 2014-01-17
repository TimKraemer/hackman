(define(function() {
	//TODO require vector
	var	level = [], width = 50, height = 30,
		FieldType = {EMPTY: 0, WALL: 1},

		Direction = {LEFT: 0, RIGHT: 1, UP: 2, DOWN: 3},
		player = {pos: null, prevPos: null, direction: null, tail: [], moveDelay: 0, delayCap: 80},
		enemies = [],

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
			return Math.floor(Math.random() * (n - 2)) + 1;
		}
		function randomX() {
			return randomWithBorder(width);
		}
		function randomY() {
			return randomWithBorder(height);
		}
		player.pos = new Vector(Math.round((width - 1) / 2), Math.round((height - 1) / 2));
		player.prevPos = player.pos;
		for (var x = 0; x < width; x++) {
			level[x] = [];
			for (var y = 0; y < height; y++) {
				level[x][y] = x * y == 0 || x+1 == width || y+1 == height ? FieldType.WALL : FieldType.EMPTY;
			}
		}

		var dist = 10,
			positions = [new Vector(-dist, 0), new Vector(dist, 0), new Vector(0, dist), new Vector(0, -dist)];
		for (var i = 0; i < 4; i++) {
			enemies[i] = {pos: player.pos.add(positions[i]), moveDelay: 0, delayCap: player.delayCap};
			enemies[i].prevPos = enemies[i].pos;
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
		function move(entity, getMovement) {
			if (entity.moveDelay > 0) {
				entity.moveDelay -= delta;
				return;
			}

			entity.moveDelay = entity.delayCap;

			var newPos, movement = getMovement();
			if (movement) {
				newPos = entity.pos.add(movement);
				entity.prevPos = entity.pos;
				if (level[newPos.x][newPos.y] == FieldType.EMPTY && !enemies.some(function(enemy) {
					return enemy.pos.equals(newPos);
				})) {
					entity.pos = newPos;
				}
			}
		}
		var movement;
		move(player, function() {
			for (var action in actions) {
				player.direction = action;
			}
			actions = {};


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
			return movement;
		});

		enemies.forEach(function(enemy) {
			move(enemy, function() {
				if (!movement) return;
				return movement.multiply(new Vector(enemy.pos.x > player.pos.x ? 1 : -1, enemy.pos.y > player.pos.y ? 1 : -1));
				var x = 0, y = 0, n = (Math.random() > .5 ? 1 : -1);

				if (Math.random() > 0.5) x = n;
				else y = n;

				enemy.pos.subtract(player.pos).length();
				return new Vector(x, y)
			});
		});
	}

	function draw() {
		function interpolateAndScale(entity) {
			return entity.prevPos.add(entity.pos.subtract(entity.prevPos).multiply(1 - entity.moveDelay / entity.delayCap)).multiply(scale);
		}
		for (var x = 0; x < width; x++) {
			for (var y = 0; y < height; y++) {
				ctx.fillStyle = level[x][y] == FieldType.EMPTY ? 'white' : 'black';
				ctx.lineWidth = .1;
				ctx.strokeStyle = 'black';
				ctx.fillRect(x * scale, y * scale, scale, scale);
				ctx.strokeRect(x * scale, y * scale, scale, scale);
			}
		}

		var pos, sH = scale / 2;
		ctx.fillStyle = 'red';
		enemies.forEach(function(enemy) {
			pos = interpolateAndScale(enemy);
			ctx.beginPath();
			ctx.arc(pos.x + sH, pos.y + sH, sH * .9, 0, 6, false);
			ctx.fill();
//			ctx.fillRect(pos.x, pos.y, scale, scale);
		});

		ctx.fillStyle = 'green';
		pos = interpolateAndScale(player);
		ctx.fillRect(pos.x, pos.y, scale, scale);
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