(define(function() {

	var hardwareLib = new Array();

	hardwareLib['rechner'][0] = 'bin/Rechner01.png';
	hardwareLib['display'][0] = 'bin/Display01.png';
	hardwareLib['display'][1] = 'bin/Display02.png';
	hardwareLib['display'][2] = 'bin/Display03.png';
	hardwareLib['display'][3] = 'bin/Display04.png';


	var placedHardware = { 
		{ type: 'display', level: 0, pos: {0,0} },
		{ type: 'rechner', level: 0, pos: {300,300} },
		{ type: 'display', level: 2, pos: {500,300} }
	};

		// function getNewHardwarePosition(Type) {
		// 	var position = new Array();

		// 	position['image'] = hardwareCollection[Type];
		// 	position['randomWidth'] = Math.ceil(Math.random() * 100) + 100;
		// 	position['randomHeight'] = Math.ceil(Math.random() * 200) + 200;
		// 	position['randomX'] = Math.ceil(Math.random() * width);
		// 	position['randomY'] = Math.ceil(Math.random() * height);

		// 	return position;
		// }

	$upgradeButton.click(function() {
		alert("hi");
		//if(Math.ceil(Math.random() * 2) == 1) type = "kitten";
		//else type = "rechner";


		//$hardware = imageFactory(getNewHardwarePosition(type)['image'], getNewHardwarePosition()['randomWidth'], getNewHardwarePosition()['randomX'], getNewHardwarePosition()['randomY'], currentLayer++);
		//$container.append($hardware);
	});

	return function(button) {
		
	};

}));