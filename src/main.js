$(function() {
	function imageFactory(src, width, left, top, zIndex, attributes) {
		if (!attributes) attributes = {};
		return $('<img>', $.extend({
			src: src,
			css: {
				width: String(width) + 'px',
				position: 'absolute',
				left: String(left) + 'px',
				top: String(top) + 'px',
				'z-index': zIndex
			}
		}, attributes));
	}

	var currentLayer = 0,
		stats = {
			info: {
				label: 'i',
				value: 0
			},
			ips: {
				label: 'i/Sec',
				value: 1
			},
			cpu: {
				label: 'CPU',
				value: 1
			},
			bw: {
				label: 'Bandwidth',
				value: 16
			},
			aware: {
				label: 'Awareness',
				value: 0
			}
		},
		$container = $('#game-container').css({width: window.innerWidth + 'px', height: window.innerHeight + 'px'}),
		$informationField = $('<span>', {text: 0}),
		$upgradeButton = $('<span>', {text: ' up'}),
		$soundControl = $('<span>', {'class': 'sound'}),
		fontSize = 20,
		$shopBar = $container.find('.shop'),
		$informationBar = $('<div>', {
			append: [$informationField, $('<span>', {text: 'i'}), $soundControl, $upgradeButton],
			css: {
				'font-size': String(fontSize) + 'px',
				color: 'white',
				position: 'absolute',
				top: String(window.innerHeight - fontSize - 5) + 'px',
				left: String(.9 * window.innerWidth) + 'px',
				'z-index': 99998
			}
		})

	$container.append($informationBar, $shopBar);
	$shopBar
		.mouseenter(function() {
			$shopBar.addClass('open');
		})
		.mouseleave(function() {
			$shopBar.removeClass('open')
		})
		.on('click', 'a', function(e) {
			e.preventDefault();
			$shopBar.find('ul').hide('fast');
			$shopBar.find($(this).data('for')).show('fast');
			$shopBar.find('a').removeClass('selected');
			$(this).addClass('selected');
		})
		// preselect first tab
		.find('a').first().click();

	// audio looop, background sound
	var myAudio = new Audio('bin/BasicSound.mp3');
	myAudio.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
	}, false);
//	myAudio.play();
	$soundControl.click(function() {
		if (myAudio.paused) {
			myAudio.play();
		} else {
			myAudio.pause();
		}
		$(this).toggleClass("muted");
	});

	(function() {
		var magic = 1.15;
		var tick = 1000; //updates every $tick milliseconds

		var costs = {
			"script": 		{base: 15, 		ips: 0.1,	ram: 0.1,	cpu: 0.1,	bw: 0,		aware: 0 	}
			,"program": 	{base: 100, 	ips: 0.5,	ram: 0.2,	cpu: 0.5,	bw: 0,		aware: 0 	}
			,"software": 	{base: 500, 	ips: 4.0,	ram: 0.5,	cpu: 2.4,	bw: 1,		aware: 0 	}
			,"bruteforce": 	{base: 3000, 	ips: 10.0,	ram: 1,		cpu: 4,		bw: 6,		aware: 3 	}
			,"keylog": 		{base: 10000, 	ips: 40.0,	ram: 0,		cpu: 0.1,	bw: 1,		aware: 10 	}
			,"botnet": 		{base: 40000, 	ips: 100.0,	ram: 0.5,	cpu: 1,		bw: 16,		aware: 40 	}
			,"neuronet": 	{base: 200000,	ips: 400.0,	ram: 16,	cpu: 12,	bw: 100,	aware: 200 	}
		};

		var levels = {
			"script": 		0
			,"program": 	0
			,"software": 	0
			,"bruteforce": 	0
			,"keylog": 		0
			,"botnet": 		0
			,"neuronet": 	0
		}

		function gameLoop() {
			// verloren?
			if(stats.aware >= 100) lost();

	        $.each( levels, function( key, value ) {
	                stats.info.value += (value*costs[key].ips)/(1000/tick);
	                stats.ips.value += value*costs[key].ips;
	                stats.ram.value -= value*costs[key].ram;
	                stats.cpu.value -= value*costs[key].cpu;
	                stats.bw.value -= value*costs[key].bw;
	                stats.aware.value += value*costs[key].aware;
	        });

			//GUI updaten
			updateGUI();
		}

		function redrawUpgrade(obj) {
			$('#u_' + obj).text(levels[obj] + ' - ' + upgradeCost(obj) + ' ' + stats.info.label);
		}

		function updateGUI() {
			//information counter
			console.log(stats.info);
			$informationField.text(Math.round(stats.info.value));

			//enable/disable upgrades
			toggleUpgrade();
		}

		function toggleUpgrade() {
			Object.keys(costs).forEach(function(type) {
				var cost = upgradeCost(type),
					isBuyable = stats.info.value >= cost,
					$el = $('#'+type);

				$el.toggleClass('enabled', isBuyable);
				$el.attr('title', isBuyable ? '' : 'Es fehlen ' + Math.round(cost - stats.info.value) + ' ' + stats.info.label + '.');
			});
		}

		function upgradeCost(obj) {
			return Math.ceil(costs[obj].base*(Math.pow(magic,levels[obj])));
		}

		function upgrade(obj) {
			var cost = upgradeCost(obj);
			if (stats.info.value >= cost) {
				levels[obj]++;
				stats.info.value -= cost;

				Object.keys(stats).forEach(function(type) {
					var gain = costs[obj][type] * levels[obj];

					if (gain == undefined) return;
					if (['ram', 'cpu', 'bw'].indexOf(type) == -1) stats[type].value += gain;
					else stats[type].value -= gain;
				});

				redrawUpgrade(obj);
			}
		}

		function lost() {
			alert("you just lost the game!");
			return true;
		}

		setInterval(gameLoop, tick);

		$shopBar.find('ul.software').append(Object.keys(levels).map(function(key) {
			return $('<li>', {id: key, html: key.charAt(0).toUpperCase() + key.slice(1) + ' <div class="upgrade-level">Level <span id="u_'+key+'">0</span></div><br>'}).click(function() {
				upgrade(key);
			});
		}));
		Object.keys(levels).forEach(function(type) {
			redrawUpgrade(type);
		});

	})();


	var hardwareLib = {
		hackman: ['bin/Hackbuddy.png'],
		lamp: ['bin/lampe.png'],
		noise: ['bin/rauschen01.gif','bin/rauschen02.gif','bin/rauschen03.gif','bin/rauschen04.gif'],
		lamp_noise: ['bin/lamp-noise.gif'],
		pc: ['bin/Rechner01.png'],
		display: ['bin/Display01.png','bin/Display02.png','bin/Display03.png','bin/Display04.png'],
		display_free: ['bin/Display03-free.png','bin/Display04-free.png'],
		router: ['bin/router1.png','bin/router2.png','bin/router3.png','bin/router4.png','bin/router5.png'],
		vpn: ['bin/vpn1.png','bin/vpn2.png','bin/vpn3.png','bin/vpn4.png','bin/vpn5.png'],
		server: ['bin/Server01.png', 'bin/Server02.png']
	};


	var placedHardware = [
		{ type: 'hackman', level: 0, pos: [0,100] },
		{ type: 'lamp', level: 0, pos: [0,-650] },
		{ type: 'display', level: 0, pos: [0,-50] },
		{ type: 'display_free', level: 1, pos: [-380,-70] },
		{ type: 'display_free', level: 1, pos: [380,-70] },
		{ type: 'display_free', level: 1, pos: [-190,-270] },
		{ type: 'display_free', level: 1, pos: [190,-270] },
		{ type: 'display_free', level: 1, pos: [-570,-270] },
		{ type: 'display_free', level: 1, pos: [570,-270] },
		{ type: 'display_free', level: 1, pos: [-380,-470] },
		{ type: 'display_free', level: 1, pos: [570,-470] },
		{ type: 'server', level: 1, pos: [-870,-50] },
		{ type: 'server', level: 1, pos: [-1070,-50] },
		{ type: 'pc', level: 0, pos: [-690,155] },
		{ type: 'pc', level: 0, pos: [690,155] },
		{ type: 'pc', level: 0, pos: [850,155] },
		{ type: 'router', level: 4, pos: [-800,450] },
		{ type: 'vpn', level: 4, pos: [550,380] },
		{ type: 'vpn', level: 4, pos: [-1000,450] }

	];


	for(var i = 0; i < placedHardware.length; i++) {
		showHardware(i);
	}


	function showHardware(i) {
		var scale = window.innerHeight/1550;
		var h_mid = window.innerWidth/2; 
		var v_mid = window.innerHeight/2;
		var zindex = 0;
		var img = new Image();
		img.src = hardwareLib[placedHardware[i]['type']][placedHardware[i]['level']];
		img.onload = function() { //falls unser Spiel mal Arsch langsam wird, hier kann man was optimieren
			if(placedHardware[i]['type'] == 'hackman' ) zindex = 99999;
			else if(['display', 'display_free', 'lamp-noise'].indexOf(placedHardware[i]['type']) != -1 ) zindex = currentLayer+=2;
			else zindex = currentLayer++;
			
			if(placedHardware[i]['type'] == 'lamp' ) {
				var $noise = $('<img>', {
					src: hardwareLib['lamp_noise'][0],
					css: {	
						width: 48*scale+ 'px',
						position: 'absolute',
						left: h_mid+placedHardware[i]['pos'][0]*scale-46+img.width*scale/2 + 'px',
						top: v_mid+placedHardware[i]['pos'][1]*scale-37+img.height*scale/2 + 'px',
						'z-index': zindex-1
					},
					'class': 'noise'
				});
				$container.append($noise);
			}

			if(['display', 'display_free'].indexOf(placedHardware[i]['type']) != -1 ) {
				var $noise = $('<img>', {
					src: hardwareLib['noise'][rand(0,3)],
					css: {	
						width: img.width*scale+ 'px',
						position: 'absolute',
						left: h_mid+placedHardware[i]['pos'][0]*scale-img.width*scale/2 + 'px',
						top: v_mid+placedHardware[i]['pos'][1]*scale-img.height*scale/2 + 'px',
						'z-index': zindex-1
					},
					'class': 'noise'
				});
				$container.append($noise);
			}


			var $hw = $('<img>', {
				src: img.src,
				css: {	
					width: img.width*scale+ 'px',
					position: 'absolute',
					left: h_mid+placedHardware[i]['pos'][0]*scale-img.width*scale/2 + 'px',
					top: v_mid+placedHardware[i]['pos'][1]*scale-img.height*scale/2 + 'px',
					'z-index': zindex
				},
				'class': placedHardware[i]['type'],
				'data-id': i
			});
			if(placedHardware[i]['type'] != 'hackman' ) {
				$hw.click(function () {
					upgradeHardware($(this));
				});
			}
			$container.append($hw);
		}
	}

	function upgradeHardware(hw) {
		if(placedHardware[hw.data('id')]['level']+1 < hardwareLib[placedHardware[hw.data('id')]['type']].length) {
			placedHardware[hw.data('id')]['level']++;
			hw.remove();
			showHardware(hw.data('id'));
		}
		else alert(placedHardware[hw.data('id')]['type']+"max upgrade reached (Level "+placedHardware[hw.data('id')]['level']+")");
	}

	function rand (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	(function() {
		var keywords = [
				'ls', 'cp', 'mv', 'rm', 'chmod', 'function',
				'return', 'int', 'double', 'long', 'String', 'var',
				'SELECT', 'FROM', 'UPDATE', 'DELETE', 'UNION'
			],
			discoveredWords = [],
			maxKeywordLength = keywords.reduce(function(maxLength, keyword) {
				return Math.max(maxLength, keyword.length);
			}, 0),
			typedStack = [],
			keyAlreadyDown = true;

		document.onkeydown = function(e) {
			e = e || window.event;
			var charCode = e.which || e.keyCode,
				charTyped = String.fromCharCode(charCode),
				value = 1;

			typedStack.unshift(charTyped);
			typedStack.splice(maxKeywordLength);

			var	stackWord = typedStack.slice().reverse().join(''),
				keyword = keywords.filter(function(keyword) {
					return stackWord.toLowerCase().indexOf(keyword.toLowerCase()) != -1;
				})[0];

			if (keyword) {
				typedStack = [];
				value = keyword.length * (discoveredWords.indexOf(keyword) == -1 ? 10 : 5);
			}

			if (keyAlreadyDown && !keyword) return;
			keyAlreadyDown = true;

			stats.info.value += value;
			$informationField.text(Math.round(stats.info.value));
			var offset = $('.hackman').position(),
				text = '+' + String(value);

			if (keyword) text += ' - ' + keyword;

			var $popup = $('<span>', {
				text: text,
				'class': 'information-up',
				css: {
					position: 'absolute',
					left: String(offset.left + 50) + 'px',
					top: String(offset.top) + 'px',
					'z-index': 99997
				}
			});
			$container.append($popup);
			setTimeout(function() {
				var	n = Math.random() * Math.PI - .5 * Math.PI,
					C = -1 * (100 + Math.random() * 200),
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

			discoveredWords.push(keyword);
		};

		document.onkeyup = function() {
			keyAlreadyDown = false;
		}
	})();


});
