(function() {
	var getPc = function(achv) {
			return achv.amount === undefined ? 0 : (achv.amount / achv.needed).toFixed(2);
		},
		createImgForId = function(id) {
			return $('<img>', {src: 'images/achievements/' + id + '.jpg'})
		};
	Achievements = function() {
	};
	Achievements.prototype = {
		count: 0,
		list: {
			'start': {title: 'Good start', text: 'Wow, very type!'},
			'type': {title: 'Typegod', needed: 1000, text: 'I have no idea what I\'m doing'}
		},
		get: function(id) {
			var achv = this.list[id];

			if (!achv) throw 'No achievement found for: ' + id;

			return achv;
		},
		trigger: function(id) {
			var achv = this.get(id);
			if (!achv.triggered) {
				achv.triggered = true;
				this.count++;
				this.show(id, achv);
			}
		},
		progress: function(id, amount) {
			var achv = this.get(id);
			if (!achv.done) {
				var prevPc = getPc(achv);

				achv.amount = achv.amount + amount || amount;
				achv.amount = Math.min(achv.amount, achv.needed);
				achv.done = achv.amount == achv.needed;

				if (achv.done || (getPc(achv).toString().substr(0, 3) - prevPc.toString().substr(0, 3)).toFixed(1) >= .1) {
					this.show(id, achv);
				}
			}
		},
		show: function(id, achv) {
			var self = this,
				$el = $('<div>', {class: 'achievement', append: [
					createImgForId(id),
					$('<h3>', {text: achv.title}),
					$('<div>', {class: 'text', text: achv.text})
				]});

			$el.click(function() {
				self.showAll();
			});

			if (achv.amount) {
				var pc = getPc(achv);
				$el.append($('<div>', {class: 'progress', append: $('<div>', {css: {width: String(pc * 100) + '%'}})}));
			}

			$(document.body).append($el);
			$el.css('top', '-' + String($el.outerHeight()) + 'px');
			$el.transit({top: 0, duration: 800}, function() {
				setTimeout(function() {
					$el.transit({top: '-' + String($el.outerHeight()) + 'px'}, function() {
						$el.remove();
					});
				}, (achv.title.length + achv.text.length) * 150);
			});
		},
		showAll: function() {
			var $el = $('<div>', {class: 'big-popup achievements'});

			for (var id in this.list) {
				$el.append(createImgForId(id));
			}

			$(document.body).append($el);
		}
	}
})();
