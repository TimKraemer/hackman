(function() {
	Array.prototype.remove = function(from, to) {
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	};
	Quizzes = function() {
	};
	Quizzes.prototype = {
		unanswered: [
			{
				question: 'What is not a danger of Cross-site scripting (XSS)?',
				answers: ['Tampered page', 'Login theft', 'Remote code execution', 'Scary images'],
				correct: 2
			},
			{
				question: 'What is the purpose of MD5?',
				answers: ['Data integrity check', 'Password hashing', 'Message exchange' , 'Encryption'],
				correct: 0
			},
			{
				question: 'Application security wise, when is user input to be trusted?',
				answers: ['Always', 'Never', 'After authentication' , 'Plaintext input'],
				correct: 1
			}
		],
		showRandom: function() {
			var self = this,
				chosen = Math.floor(this.unanswered.length * Math.random()),
				data = this.unanswered[chosen],
				$question = $('<div>', {class: 'question', text: data.question}),
				$answers = $('<div>', {class: 'answers'}),
				$el = $('<div>', {
					class: 'big-popup question-popup',
					append: [
						$question,
						$answers
					]
				}),
				disabled = false,
				deferred = new $.Deferred();

			for (var i = 0; i < data.answers.length; i++) {
				(function() {
					var isCorrect = i == data.correct,
						$answer = $('<div>', {class: 'answer', text: data.answers[i]}).click(function() {
							if (disabled) return;
							if (false && !$answer.hasClass('selected')) {
								$answers.find('*').removeClass('selected');
								$answer.addClass('selected');
								return;
							}
							if (isCorrect) {
								$answer.removeClass('selected').addClass('correct');
								self.unanswered.remove(chosen);
							} else $answer.addClass('incorrect');
							disabled = true;

							setTimeout(function() {
								$el.transit({'opacity': 0}, function() {
									$el.remove();
									deferred.resolve(isCorrect);
								});
							}, 1000);
						});
					$answers.append($answer);
				})();
			}

			$(document.body).append($el);

			return deferred.promise();
		}
	};
})();
