levels = {
	1: {
		nodes: [
			{x: 8, y: 7, chance: 8, time: 1000},
			{x: 16, y: 7, chance: 2, time: 1000},
			{x: 18, y: 9, chance: 1, type: 'chaser', time: 1000},
			{x: 18, y: 5, chance: 3, time: 1000},
			{x: 6, y: 9, chance: 4, time: 1000},
			{x: 20, y: 6, chance: 'D', time: 1000}
		],
		player: {x: 12, y: 7},
		paths: [
			{a: 0, b: 'p'},
			{a: 1, b: 'p'},
			{a: 1, b: 2},
			{a: 1, b: 3},
			{a: 0, b: 4},
			{a: 3, b: 5}
		]
	}
};