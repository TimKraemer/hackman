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
			aware: {
				label: 'Awareness',
				value: 0
			}
		},
		$container = $('#game-container').css({width: window.innerWidth + 'px', height: window.innerHeight + 'px'}),
		fontSize = 20,
		$soundControl = $('<p>', {'class': 'sound'}),
		$informationField = $('<p>', {text: '0', css: {'position':'absolute', 'top':'0', 'left':'0'}}),
		$informationField2 = $('<p>', {text: '0', css: {'float': 'left', 'padding': '2px 0 0 14px'}}),
		$informationFieldIcon = $('<div>', {css: {height: '15px', width: '30px', 'background-image': 'url("bin/infocoin.png")', 'background-size': '15px', 'background-repeat': 'no-repeat', 'margin': '0 0 0 15px', 'padding': '0 0 0 3px'}}),
		$upgradeButton = $('<p>', {html: '<img src="bin/upgrade.png" width="30px">', css: {'float':'right'}}),
		$storeBar = $container.find('.store'),
		achvs = new Achievements(),
		quizzes = new Quizzes();

	$informationFieldIcon.append($informationField2);
	$soundControl.click(function() {
		if (myAudio.paused) {
			myAudio.play();
		} else {
			myAudio.pause();
		}
		$(this).toggleClass("muted");
	});

	// audio looop, background sound
	var myAudio = new Audio('bin/BasicSound.mp3');
	myAudio.addEventListener('ended', function() {
		this.currentTime = 0;
		this.play();
	}, false);
	//	myAudio.play();

	$container.append($storeBar);
	$storeBar
		.mouseenter(function() {
			$storeBar.addClass('open');
		})
		.mouseleave(function() {
			$storeBar.removeClass('open')
		})
		.on('click', 'a', function(e) {
			e.preventDefault();
			$storeBar.find('ul').hide('fast');
			$storeBar.find($(this).data('for')).show('fast');
			$storeBar.find('a').removeClass('selected');
			$(this).addClass('selected');
		})
		// preselect first tab
		.find('a').first().click();

	(function() {
		var magic = 1.15; // Faktor um den sich die Kosten bei jedem Upgrade erhöhen -> Balance this first!
		var tick = 1000; //updates every $tick milliseconds

		//Software Kosten
		var costs = {
			"script": 		{base: 15, 		ips: 0.1,	aware: 0 	}
			,"program": 	{base: 100, 	ips: 0.5,	aware: 0 	}
			,"software": 	{base: 500, 	ips: 4.0,	aware: 0 	}
			,"bruteforce": 	{base: 3000, 	ips: 10.0,	aware: 3 	}
			,"keylog": 		{base: 10000, 	ips: 40.0,	aware: 10 	}
			,"botnet": 		{base: 40000, 	ips: 100.0,	aware: 40 	}
			,"neuronet": 	{base: 200000,	ips: 400.0,	aware: 200 	},
			'display': [
							{base: 0,		ips: 0,		aware: 0	},
							{base: 500,		ips: 1,		aware: 0	},
							{base: 1000,	ips: 5,		aware: 10	},
							{base: 5000,	ips: 10,	aware: 20	}
			]
		};

		// current level of upgrades per ware
		var levels = {
			"script": 		0
			,"program": 	0
			,"software": 	0
			,"bruteforce": 	0
			,"keylog": 		0
			,"botnet": 		0
			,"neuronet": 	0
			,'display':		0
		}

		// here are hardware items we got
		var hardwareLib = {
			_auge: ['bin/auge1.png','bin/auge2.png','bin/auge3.png','bin/auge4.png','bin/auge5.png','bin/auge6.png','bin/auge7.png','bin/auge8.png'], //not placeable
			_store: ['bin/infocoin.png'], //not placeable
			_news: ['bin/idaily.png'], //not placeable
			_hackman: ['bin/Hackbuddy.png'], //not placeable
			_lamp: ['bin/lampe.png'], //not placeable
			_noise: ['bin/rauschen01.gif','bin/rauschen02.gif','bin/rauschen03.gif','bin/rauschen04.gif'], //not placeable
			_lamp_noise: ['bin/lamp-noise.gif'], //not placeable
			pc_left: ['bin/Rechner01links.png'],
			pc_right: ['bin/Rechner01rechts.png'],
			display: ['bin/Display01.png','bin/Display02.png','bin/Display03.png','bin/Display04.png'],
			router: ['bin/router1.png','bin/router2.png','bin/router3.png','bin/router4.png','bin/router5.png'],
			vpn: ['bin/vpn1.png','bin/vpn2.png','bin/vpn3.png','bin/vpn4.png','bin/vpn5.png'],
			server: ['bin/Server1.png', 'bin/Server2.png','bin/Server3.png','bin/Server4.png','bin/Server5.png','bin/Server6.png','bin/Server7.png','bin/Server8.png','bin/Server9.png']
		};

		//this is the chosen final layout, made by Joan
		var layout = [
			//{ type: '_lamp', level: 0, pos: [0,-650] },
			{ type: '_hackman', level: 0, pos: [0,100], z: 99999, id: 'hackman' },
			{ type: 'display', level: 0, pos: [0,-70], id: 'start-display' },
			{ type: 'display', level: 2, pos: [380,-70], id: 'store-display' },
			{ type: 'display', level: 2, pos: [-380,-70], },
			{ type: 'display', level: 2, pos: [-190,-270] },
			{ type: 'display', level: 2, pos: [190,-270] },
			{ type: 'display', level: 2, pos: [-570,-270] },
			{ type: 'display', level: 2, pos: [570,-270] },
			{ type: 'display', level: 2, pos: [-380,-470] },
			{ type: 'display', level: 2, pos: [570,-470] },
			{ type: 'pc_left', level: 0, pos: [-690,110], z:6 },
			{ type: 'server', level: 0, pos: [-870,-50], z:5 },
			{ type: 'server', level: 0, pos: [-1070,-50], z:4 },
			{ type: 'pc_right', level: 0, pos: [690,110], z:2 },
			{ type: 'pc_right', level: 0, pos: [850,110], z:1 },
			{ type: 'router', level: 0, pos: [-800,450] },
			{ type: 'vpn', level: 0, pos: [550,380] },
			{ type: '_auge', level: 0, pos: [570,-470] },
			{ type: '_store', level: 0, pos: [380,-70], id: 'store' },
			{ type: '_news', level: 0, pos: [-380,-470] }
			//{ type: 'vpn', level: 4, pos: [-1000,450] }
		];

		var placedHardware = [];

		placeHardware('_hackman');
		placeHardware('display');

		var infos = [
			{ item: 'hackman', content: '', mouseover: '<p>This is you &lsquo; The Hackman &rsquo;</p>'},
			{ item: 'start-display', content: '', mouseover: ''},
			{ item: 'store-display', content: '', mouseover: '<p>store</p>'},
		]

		function gameLoop() {
			// verloren?
			if(stats.aware >= 100) lost();

			for (var key in levels) {
				var value = levels[key],
					typeCost = costs[key];

				if (!$.isArray(typeCost)) typeCost = [typeCost];
				for (var i = 0; i < typeCost.length; i++) {
					var cost = typeCost[i];
					stats.info.value += (value*cost.ips)/(1000/tick);
					stats.ips.value += value*cost.ips;
					stats.aware.value += value*cost.aware;
				}
			}

			//GUI updaten
			updateGUI();
		}

		function redrawUpgrade(obj) {
			$('#u_' + obj).text(levels[obj] + ' - ' + upgradeCost(obj) + ' ' + stats.info.label);
		}

		function updateGUI() {
			//information counter
			$informationField.text(Math.round(stats.info.value));
			$informationField2.text($informationField.text());

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

					if (!gain) return;
					if (['ram', 'cpu', 'bw'].indexOf(type) == -1) stats[type].value += gain;
					else stats[type].value -= gain;
				});

				redrawUpgrade(obj);
			}
		}

		function placeHardware(type) {
			if(layout.length>0) {
				var result = layout.filter(function (layout) { return layout.type == type });
				if(result.length > 0) {
					layout.splice(layout.indexOf(result[0]),1); //removes the resulting hardware from layout array
					placedHardware.push(result[0]);
					showHardware(placedHardware.length-1);
				}
				else console.log('kein platz für '+type);
			}
			else console.log('kein platz für mehr hardware');
		}

		function lost() {
			alert("you just lost the game!");
			return true;
		}

		setInterval(gameLoop, tick);

		$storeBar.find('ul.hardware').append(Object.keys(hardwareLib).map(function(key) {
			if(key.charAt(0) != '_') //don't show the 'not placeables'
			return $('<li>', {id: key, html: key.charAt(0).toUpperCase() + key.slice(1) + ''}).click(function() {
				placeHardware(key);
			});
		}));
		$storeBar.find('ul.software').append(Object.keys(levels).map(function(key) {
			return $('<li>', {id: key, html: key.charAt(0).toUpperCase() + key.slice(1) + ' <div class="upgrade-level">Level <span id="u_'+key+'">0</span></div><br>'}).click(function() {
				upgrade(key);
			});
		}));
		Object.keys(levels).forEach(function(type) {
			redrawUpgrade(type);
		});

		function showHardware(i) {
			var scale = window.innerHeight/1550;
			var h_mid = window.innerWidth/2; 
			var v_mid = window.innerHeight/2;
			var zindex = 0;
			var img = new Image();
			img.src = hardwareLib[placedHardware[i]['type']][placedHardware[i]['level']];
			img.onload = function() { //falls unser Spiel mal Arsch langsam wird, hier kann man was optimieren
				
				if(placedHardware[i]['z'] !== 'undefined') zindex = placedHardware[i]['z'];
				//else if(['display', '_lamp-noise'].indexOf(placedHardware[i]['type']) != -1 ) zindex = currentLayer+=2;
				else zindex = currentLayer++;
				
				// if(placedHardware[i]['type'] == '_lamp' ) {
				// 	var $noise = $('<img>', {
				// 		src: hardwareLib['_lamp_noise'][0],
				// 		css: {	
				// 			width: 48*scale+ 'px',
				// 			position: 'absolute',
				// 			left: h_mid+placedHardware[i]['pos'][0]*scale-74*scale+img.width*scale/2 + 'px',
				// 			top: v_mid+placedHardware[i]['pos'][1]*scale-60*scale+img.height*scale/2 + 'px',
				// 			'z-index': zindex-1
				// 		},
				// 		'class': 'noise'
				// 	});
				// 	$container.append($noise);
				// }

				// add noise to all Displays
				if(['display'].indexOf(placedHardware[i]['type']) != -1 ) {
					var $noise = $('<img>', {
						src: hardwareLib['_noise'][rand(0,3)],
						css: {	
							width: img.width*scale+ 'px',
							position: 'absolute',
							left: h_mid+placedHardware[i]['pos'][0]*scale-img.width*scale/2 + 'px',
							top: v_mid+placedHardware[i]['pos'][1]*scale-img.height*scale/2 + 'px',
							'z-index': zindex-1
						},
						'class': 'noise',
						'data-id': 'noise-'+i
					});
					$container.append($noise);
				}



				//this are the poperties of every hardware item
				var $hw = $('<div>', {
					css: {
						'background-image': 'url('+img.src+')',
						'background-size': img.width*scale+'px ' + img.height*scale+'px',
						width: img.width*scale+ 'px',
						height: img.height*scale+ 'px',
						position: 'absolute',
						left: h_mid+placedHardware[i]['pos'][0]*scale-img.width*scale/2 + 'px',
						top: v_mid+placedHardware[i]['pos'][1]*scale-img.height*scale/2 + 'px',
						'font-size': img.width*scale/12+ 'px',
						'z-index': zindex
					},
					id: placedHardware[i]['id'],
					'class': placedHardware[i]['type']+placedHardware[i]['level'],
					'data-id': i,
					'data-type': placedHardware[i]['type']
				});
				if(['_hackman','_lamp'].indexOf(placedHardware[i]['type']) == -1 ) {
					$hw.click(function () {
						upgradeHardware($(this));
					});
				}
				//text inside displays
				$hw.html(function () {showInfos($(this)) });

				//popups
				$hw.mouseenter(function () { showInfos($(this),true); });
				
				switch (placedHardware[i]['id']) {
					case 'store-display': {
						placeHardware('_store');
						break;
					}
					default: break;
				}

				$container.append($hw);
			}
		}

		function upgradeHardware(hw) {
			var cost = costs[hw.data('type')][hw.data('id')];
			if (cost.base > stats.info.value) return;

			stats.info.value -= cost.base;
			levels[hw.data('type')]++;

			if(placedHardware[hw.data('id')]['level']+1 < hardwareLib[placedHardware[hw.data('id')]['type']].length) {
				placedHardware[hw.data('id')]['level']++;
				hw.remove();
				$container.find(".popup").remove();
				$container.find("[data-id='noise-" + hw.data('id') +"']").remove();
				showHardware(hw.data('id'));
			}
			else console.log(placedHardware[hw.data('id')]['type']+"max upgrade reached (Level "+placedHardware[hw.data('id')]['level']+")");
		}

		function showInfos(hw,popup) {
			if(typeof popup === 'undefined') { popup = false; } //js hat keine echten optionalen parameter?!
			switch(hw[0].id) {
				case 'store' : 			{var result = infos.filter(function (infos) { return infos.item == 'store-display' });break;}
				case 'start-display' : 	{var result = infos.filter(function (infos) { return infos.item == 'hackman' });break;}
				default: 				{var result = infos.filter(function (infos) { return infos.item == hw[0].id });break;}
			}
			if(result.length > 0) {
				hw.html(result[0].content);
				
				var top = 0, left = 0;
				switch(hw[0].id) {
					case 'start-display' : {
						hw.append($informationField);
						//dirty workaround to position the popup of the start-display to position of the hackman popup
						top = $('#hackman').position()['top']-$('#hackman').height()/4;
						left = $('#hackman').position()['left']+$('#hackman').width()-5;
						break;
					}
					default : {
						top = hw.position()['top']-hw.height()/4;
						left = hw.position()['left']+hw.width()-5;
						break;
					}
				}

				if(popup) {
					$popup = $('<div>', {
						'class': 'popup',
						html: result[0].mouseover,
						css: {
							top: top+'px',
							left: left+'px'
						},
						'data-id': 'popup-'+hw.data('id')
					});

					switch(hw[0].id) {
						case 'start-display' :
						case 'hackman' : {
							$popup.append($informationFieldIcon);
							$upgradeButton.click(function() { upgradeHardware($('#start-display')) }); //FIXME: references start-display, which may not have been loaded yet
							$popup.append($upgradeButton);
							$popup.append($soundControl);
							break;
						}
						default : {
							$popup.append($upgradeButton);
							break;
						}
					}

					$container.find(".popup").remove();
					$container.append($popup);
				}
			}
		}

		function rand (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}		

		$(window).resize(function() {
			console.log('resolution change');
			$container.html('');
			for(var i = 0; i < placedHardware.length; i++) {
				showHardware(i);
			}
		});		
	})();







	(function() {
		var keywords = [
				'ls', 'cp', 'mv', 'rm', 'chmod', 'function',
				'return', 'int', 'double', 'long', 'String', 'var',
				'SELECT', 'FROM', 'UPDATE', 'DELETE', 'UNION',
				'nmap', 'shutdown'
			],
			discoveredWords = [],
			maxKeywordLength = keywords.reduce(function(maxLength, keyword) {
				return Math.max(maxLength, keyword.length);
			}, 0),
			typedStack = [],
			keyAlreadyDown = true;

		document.onkeydown = function(e) {
			achvs.trigger('start');
			achvs.progress('type', 1);
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
			$informationField2.text($informationField.text());
			var offset = $('#hackman').position(),
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
