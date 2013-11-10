(define(function() {
	var keywords = [
			'ls', 'cp', 'mv', 'rm', 'chmod',
			'function', 'return', 'int'
		],
		discoveredWords = [],
		maxKeywordLength = keywords.reduce(function(maxLength, keyword) {
			return Math.max(maxLength, keyword.length);
		}, 0),
		typedStack = [];

	return {
		attach: function(matchCallback) {
			document.onkeypress = function(e) {
				e = e || window.event;
				var charCode = e.which || e.keyCode, charTyped = String.fromCharCode(charCode), value = 1;

				typedStack.unshift(charTyped);
				typedStack.splice(maxKeywordLength);

				var	stackWord = typedStack.slice().reverse().join(''),
					matchedKeyword = keywords.filter(function(keyword) {
						return stackWord.indexOf(keyword) != -1;
					})[0];

				if (matchedKeyword) {
					typedStack = [];
					value = matchedKeyword.length * (discoveredWords.indexOf(matchedKeyword) == -1 ? 10 : 5);
				}

				if (matchCallback) {
					matchCallback(matchedKeyword, value);
				}

				discoveredWords.push(matchedKeyword);
			};
		}
	};
}));
