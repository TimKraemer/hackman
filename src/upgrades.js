var	 I 		= 0
	,IpS 	= 0
	,RAM 	= 0
	,CPU 	= 0
	,BW 	= 0
	,Aware 	= 0
	;

var magic = 1.15;
var tick = 10 //updates every $tick milliseconds

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
	$('#I').html("Information: "+Math.floor(I));
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
	$.each( costs, function( key, value ) {
		$('#'+key).toggleClass("enabled", I >= upgradeCost(key));
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


function generateUpgradeButtons() {
	$list = $('<ul>');
	$.each( upgrades, function( key, value ) {
		$button = $('<li id="'+key+'">');
		$text = key+' auf Level <span id="u_'+key+'"></span>';
		$button.append($text);
		$button.click(function(){upgrade(key)});
		$list.append($button);
	});
	$('#game').append($list);
}

setInterval(function(){events()},tick);

$(document).ready(function() {
	generateUpgradeButtons();
});
