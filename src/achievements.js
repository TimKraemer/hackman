(function() {
	var getPc = function(achv) {
			return achv.amount === undefined ? 0 : (achv.amount / achv.needed).toFixed(2);
		},
		slideUpAndRemove = function($el) {
			var self = this;
			$el.transit({top: '-' + String($el.outerHeight()) + 'px'}, function() {
				self.$activeAchv = undefined;
				$el.remove();
			});
		};
	Achievements = function() {
	};
	Achievements.prototype = {
		count: 0,
		list: {
			'start': {title: 'Good start', text: 'Wow, very type!'},
			'type': {title: 'Typegod', needed: 1000, text: 'I have no idea what I\'m doing'},
			'store': {title: 'Maxed out', text: 'Great Job, you maxed out your display upgrades! <br/> Let\'s buy some new stuff...', image: 'store.png'},
			'e': {secret: true},
			'f': {secret: true},
			'g': {secret: true},
			'h': {secret: true},
			'i': {secret: true},
			'e1': {secret: true},
			'e2': {secret: true},
			'e3': {secret: true},
			'e4': {secret: true},
			'e5': {secret: true},
			'e6': {secret: true},
			'e7': {secret: true},
			'e8': {secret: true},
			'e9': {secret: true},
			'1e7': {secret: true},
			'23e7': {secret: true},
			'44e7': {secret: true},
			'5e7': {secret: true},
			'4e7': {secret: true},
			'77e7': {secret: true},
			'e17': {secret: true},
			'57e7': {secret: true},
			'21e7': {secret: true},
			'544e7': {secret: true},
			'e327': {secret: true},
			'e27': {secret: true},
			'11e7': {secret: true}
		},
		createImgForId: function(id) {
			var $img, achv = this.list[id];
			if (achv.secret) id = 'unknown.png'
			else id += '.jpg';
			$img = $('<img>', {src: 'bin/achievements/' + id});

			if (achv.triggered) $img.addClass('triggered');

			return $img;
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
					this.createImgForId(id),
					$('<h3>', {text: achv.title}),
					$('<div>', {class: 'text', html: achv.text})
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
			if (this.$activeAchv) slideUpAndRemove(this.$activeAchv);
			$el.transit({top: 0, duration: 800}, function() {
				setTimeout(function() {
					if (!$el) return;
					slideUpAndRemove($el);
				}, (achv.title.length + achv.text.length) * 150);
			});
			this.$activeAchv = $el;
		},
		showAll: function() {
			var self = this,
				$el = $('<div>', {class: 'big-popup achievements'}),
				$container = $('<div>', {class: 'container'}).appendTo($el),
				$hoverInfo = $('<div>', {class: 'info'}).append([$('<h4>'), $('<div>')]).hide(),
				hide = function() {
					$el.transit({opacity: 0}, function() {
						$el.remove();
					});
				};

			var i = 0;
			for (var id in this.list) {
				$container.append(this.createImgForId(id).addClass(i < 6 ? 'first' : '').data('id', id));
				i++;
			}

			$container.on('mouseenter', 'img', function(e) {
				var $img = $(e.target),
					achv = self.list[$img.data('id')];
				if (achv.secret) return;
				$hoverInfo
					.show()
					.css({
						position: 'absolute',
						left: e.pageX,
						top: e.pageY,
						zIndex: 9999999999
					})
					.find('h4').text(achv.title).end()
					.find('div').html(achv.text).end();
			});
			$container.on('mouseleave', 'img', function() {
				$hoverInfo.hide();
			});

			$el.append($hoverInfo);

			$(document).keyup(function(e) {
				if (e.keyCode == 27) hide();
			});

			$('#game-container').click(function(e) {
				if(e.target == $('#game-container')[0]) hide();
			});


			$(document.body).append($el);
		}
	}
})();
