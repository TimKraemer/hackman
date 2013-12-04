(define(function() {

var hardwareCollection = new Array();

	hardwareCollection['rechner'][0] = 'bin/Rechner01.png';
	hardwareCollection['display'][0] = 'bin/Display01.png';
	hardwareCollection['display'][1] = 'bin/Display02.png';
	hardwareCollection['display'][2] = 'bin/Display03.png';
	hardwareCollection['display'][3] = 'bin/Display04.png';




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

	return function() {

	};

}));