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
			},
			{
				question: 'Under which nickname is John Thomas Draper known best?',
				answers: ['Phantom Phreak', 'Cereal Killer', 'Notch', 'Captain Crunch'],
				correct: 3
			},
			{
				question: 'What is Robbert Tappan Morris best known for? He ist best known for...',
				answers: [
					'...takeover of all of the telephone lines for Los Angeles radio station KIIS-FM',
					'...creating a Worm, considered the first computer worm on the Internet',
					'...beeing a video game programmer', '...beeing a founder of Sun Microsystems'
				],
				correct: 1
			},
			{
				question: 'Who hacked into the bank network SWIFT and transferred 10.7 Mio US$ to accounts set up by accomplices abroad',
				answers: ['Kevin Poulsen', 'George Francis Hotz', 'Vladimir Levin', 'L. Rafael Reif'],
				correct: 2
			},
			{
				question: 'Who was a founder of WikiLeaks?',
				answers: ['Notch', 'Fastjack', 'Mendax', 'Pyro'],
				correct: 2
			},
			{
				question: 'Who is the primary creator of a number of high-end viruses including Coconut-A, Sahay-A, and Sharp-A?',
				answers: ['Nicholas Allegra', 'Kim Vanvaeck', 'Aaron Bond', 'David Lightman'],
				correct: 1
			},
			{
				question: 'Who became known for presenting an attack against Vista kernel protection mechanism,	and also a technique called "Blue Pill"?',
				answers: ['Joanna Rutkowska', 'Dr. Jennifer Katherine Mack', 'Dr. Stephen Falken', 'Thomas A. Anderson'],
				correct: 0
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
