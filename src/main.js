require.config({
	baseUrl: 'src/'
});

(function() {
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

	var width = 1000, height = 600,
		currentLayer = 0,
		$container = $('#game-container').css({width: String(width) + 'px', height: String(height) + 'px'}),
		I = 0,
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
				top: String(height - fontSize - 5) + 'px',
				left: String(.9 * width) + 'px',
				'z-index': 99998
			}
		}),
		hackmanWidth = width / 8,
		$hackman = imageFactory('bin/Hackbuddy.png', hackmanWidth, width / 2 - hackmanWidth / 2, .5 * height, 99999)

	$container.append($hackman, $informationBar, $shopBar);
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
		}).find('a').first().click().end();

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
		var	IpS 	= 0
			,RAM 	= 0
			,CPU 	= 0
			,BW 	= 0
			,Aware 	= 0
			;

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

		var upgrades = {
			"script": 		0
			,"program": 	0
			,"software": 	0
			,"bruteforce": 	0
			,"keylog": 		0
			,"botnet": 		0
			,"neuronet": 	0
		}

		function events() {
			// verloren?
			if(Aware >= 100) lost();

			// Werte hochzählen
			calcValues();

			//GUI updaten
			updateGUI();
		}

		function updateGUI() {
			//information counter
			$informationField.text(Math.round(I));
			// level and costs of hardware
			$.each(upgrades, function(key,value) {
				$('#u_'+key).html(value+' - '+upgradeCost(key)+' I');
			});
			//enable/disable upgrades
			toggleUpgrade();
		}

		function calcValues() {
			IpS = 0;
			RAM = 1;
			CPU = 1;
			BW 	= 16;
			Aware = 0;
			$.each( upgrades, function( key, value ) {
				I += (value*costs[key].ips)/(1000/tick);
				IpS += value*costs[key].ips;
				RAM -= value*costs[key].ram;
				CPU -= value*costs[key].cpu;
				BW -= value*costs[key].bw;
				Aware += value*costs[key].aware;
			});
		}

		function toggleUpgrade() {
			Object.keys(costs).forEach(function(cost) {
				$('#'+cost).toggleClass("enabled", I >= upgradeCost(cost));
			});
		}

		function upgradeCost(obj) {
			return Math.ceil(costs[obj].base*(Math.pow(magic,upgrades[obj])));
		}

		function upgrade(obj) {
			var cost = upgradeCost(obj);
			if(I >= cost) {
				upgrades[obj]++;
				I -= cost;
				updateGUI();
			}
			else console.log('upgrade nicht möglich, zu wenig I ('+cost+' benötigt, '+I+' vorhanden)');
		}

		function lost() {
			alert("you just lost the game!");
			return true;
		}


		setInterval(function(){events()},tick);

		$shopBar.find('ul.software').append(Object.keys(upgrades).map(function(key) {
			return $('<li>', {id: key, html: key + ' auf Level <span id="u_'+key+'"></span>'}).click(function() {
				upgrade(key);
			});
		}));
	})();


	var hardwareLib = {
		rechner: ['bin/Rechner01.png'],
		display: ['bin/Display01.png','bin/Display02.png','bin/Display03.png','bin/Display04.png']
	};


	var placedHardware = [
		{ type: 'display', level: 0, pos: Array(438,250) }
	];


	for(i=0;i<placedHardware.length;i++) {
		showHardware(i);
	}


	function showHardware(i) {
		var img = new Image();
		img.src = hardwareLib[placedHardware[i]['type']][placedHardware[i]['level']];
		img.onload = function() { //falls unser Spiel mal Arsch langsam wird, hier kann man was optimieren
			var $hw = $('<img>', {
				src: img.src,
				css: {
					width: img.width*.5 + 'px',
					position: 'absolute',
					left: placedHardware[i]['pos'][0] + 'px',
					top: placedHardware[i]['pos'][1] + 'px',
					'z-index': currentLayer++
				},
				'data-id': i
			});
			$hw.click(function () {
				upgradeHardware($(this));
			});
			$container.append($hw);
		}
	}

	function upgradeHardware(hw) {
		if(placedHardware[hw.data('id')]['level']+1 < hardwareLib[placedHardware[hw.data('id')]['type']].length) {
			placedHardware[hw.data('id')]['level']++;
			hw.remove();
			showHardware(hw.data('id'));
		}
		else alert("max upgrade reached (level ");
	}

	$upgradeButton.click(function() {
		//if(Math.ceil(Math.random() * 2) == 1) type = "kitten";
		//else type = "rechner";


		//$hardware = imageFactory(getNewHardwarePosition(type)['image'], getNewHardwarePosition()['randomWidth'], getNewHardwarePosition()['randomX'], getNewHardwarePosition()['randomY'], currentLayer++);
		//$container.append($hardware);
	});






require(['typist', '../libs/jquery.transit'], function(typist) {
		typist.attach(function(keyword, value) {
			I += value;
			$informationField.text(I);
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