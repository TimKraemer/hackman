(function() {
	var	money = 0,
		moneyPerSecond = 5,
		moneyDisplay = $('#money'),
		moneyLog = $('#money-log'),
		typedStack = [],
		keywords = [
			'ls', 'cp', 'mv', 'rm', 'chmod',
			'function', 'return', 'int'
		],
		maxKeywordLength = keywords.reduce(function(maxLength, keyword) {
			return Math.max(maxLength, keyword.length);
		}, 0);

	showMoney();

	document.onkeypress = function(e) {
		e = e || window.event;
		var charCode = e.which || e.keyCode, charTyped = String.fromCharCode(charCode),
			value = 1, label = 'stuff typed';

		typedStack.unshift(charTyped);
		typedStack.splice(maxKeywordLength);

		var	stackWord = typedStack.slice().reverse().join(''),
			matchedKeyword = keywords.filter(function(keyword) {
				return stackWord.indexOf(keyword) != -1;
			})[0];

		if (matchedKeyword) {
			typedStack = [];
			value = matchedKeyword.length * 10;
			label = 'keyword hit: ' + matchedKeyword;
		}

		money += value;
		showMoney();
		logTransaction(value, label);
	};

	setInterval(function() {
		money += moneyPerSecond;
		showMoney();
		logTransaction(moneyPerSecond, 'earnings');
	}, 1000);

	function showMoney() {
		moneyDisplay.text(money + '⚛');
	}

	function logTransaction(value, label) {
		if (value > 0) value = '+' + value;
		moneyLog.prepend($('<div>', {
			text: String(value + ' - ' + label)
		}));
	}

})();