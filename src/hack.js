(function() {
	Hack = function(container) {
		var player,
			paths = [],

			totalWidth = 1000, totalHeight = 600,
			scale = 40,
			width = totalWidth / scale,
			height = totalHeight / scale,

			bgCanvas,

			bgStage,

			nodes = [],

			isPathable = function(path) {
				return path.nodeA == player || path.nodeB == player ||
					path.nodeA.hacked || path.nodeB.hacked;
			},
			isPathed = function(path) {
				return (path.nodeA == player || path.nodeA.hacked) &&
					(path.nodeB == player || path.nodeB.hacked);
			},

			initLevel = function() {
				var isHackable = function(node) {
					return !node.hacked && !node.hacking && paths.some(function(path) {
						return path.nodeA == node && (path.nodeB == player || path.nodeB.hacked) ||
							path.nodeB == node && (path.nodeA == player || path.nodeA.hacked);
					});
				};

				bgCanvas = document.createElement('canvas');
				bgCanvas.setAttribute('width', totalWidth);
				bgCanvas.setAttribute('height', totalHeight);
				bgCanvas.setAttribute('style', 'position: absolute; left: 0; top: 0; z-index: 10;');

				container.appendChild(bgCanvas);

				bgStage = new createjs.Stage(bgCanvas);
				bgStage.enableMouseOver();

				levels[1].nodes.forEach(function(nodeObj) {
					var node = new createjs.Shape();
					node.drawThyself = function() {
						node.graphics.beginFill(node.model.type ? 'darkgrey' : 'white').drawCircle(0, 0, scale / 2);
					};
					node.model = nodeObj;
					node.drawThyself();
					node.x = nodeObj.x * scale;
					node.y = nodeObj.y * scale;

					var text = new createjs.Text(nodeObj.chance, '20px Arial', 'red');
					text.x = node.x - 6;
					text.y = node.y - 11;
					node.text = text;

					node.on('mouseover', function() {
						node.graphics.clear().setStrokeStyle(3).beginStroke('red').drawCircle(0, 0, scale / 2);
						node.drawThyself();
						bgStage.update();
					});
					node.on('mouseout', function() {
						node.graphics.clear();
						node.drawThyself();
						bgStage.update();
					});
					node.on('click', function() {
						if (!isHackable(node)) return;
						node.hacking = true;
						node.hackingTime = 0;

						redrawPaths();
					});
					node.on('tick', function() {
						if (node.hacking) {
							if (!node.hackOverlay) {
								node.hackOverlay = new createjs.Shape();
								node.hackOverlay.x = node.x;
								node.hackOverlay.y = node.y;
								bgStage.addChild(node.hackOverlay);
							}
							var watue = node.hackingTime / node.model.time;
							node.hackOverlay.graphics.clear()
								.beginFill('#2B547E').beginStroke('darkgrey').arc(0, 0, watue * (scale / 2), 0, 6);
						}
					});

					nodes.push(node);
				});

				player = new createjs.Shape();
				player.graphics.beginFill('blue').drawCircle(0, 0, scale / 2);
				player.x = levels[1].player.x * scale;
				player.y = levels[1].player.y * scale;

				levels[1].paths.forEach(function(pathObj) {
					var getNode = function(id) {
							return id == 'p' ? player : nodes[id];
						},
						nodeA = getNode(pathObj.a),
						nodeB = getNode(pathObj.b);

					var path = new createjs.Shape();
					path.nodeA = nodeA;
					path.nodeB = nodeB;

					path.graphics.beginStroke(isPathable(path) ? 'lightgreen' : 'darkgrey').setStrokeStyle(3).moveTo(nodeA.x, nodeA.y).lineTo(nodeB.x, nodeB.y);
					bgStage.addChild(path);

					paths.push(path);
				});

				bgStage.addChild(player);
				nodes.forEach(function(node) {
					bgStage.addChild(node);
					bgStage.addChild(node.text);
				});

				createjs.Ticker.addEventListener('tick', bgStage);
				bgStage.update();
			},
			redrawPaths = function() {
				paths.forEach(function(path) {
					path.graphics.clear().setStrokeStyle(3);
					if (isPathed(path) || (isPathable(path) && (path.nodeA.hacking || path.nodeB.hacking))) {
						path.graphics.beginStroke('blue');
					} else if (isPathable(path)) {
						path.graphics.beginStroke('lightgreen');
					} else {
						path.graphics.beginStroke('grey');
					}
					path.graphics.moveTo(path.nodeA.x, path.nodeA.y).lineTo(path.nodeB.x, path.nodeB.y);
				});
				bgStage.update();
			},
			act = function(delta) {
				nodes.forEach(function(node) {
					if (node.hacking) {
						node.hackingTime += delta;
						node.hackingTime = Math.min(node.hackingTime, node.model.time);
						if (node.hackingTime == node.model.time) {
							node.hacking = false;
							node.hacked = true;
							redrawPaths();
						}
					}
				});
			};

		initLevel();

		createjs.Ticker.addEventListener('tick', function(event) {
			act(event.delta);
		});
	};
})();
