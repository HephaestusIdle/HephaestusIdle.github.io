/* Button */
function Button(state, x, y, gfx, text, style, onClick) {
	var b = state.game.add.button(x, y, gfx, onClick);
	b.text = b.addChild(state.game.add.text(gfx.width * 0.5, gfx.height *0.55,
		text, style));
	b.text.anchor.set(0.5);
	b.state = state;
	return b;
}

/* ScrollList*/
function ScrollList(state, x, y, scrollX, onClick, buttonGFX, scrollbarGFX, bg, inputOverCallback, alignRight) {
	var sl;
	var click = onClick;
	if (bg != undefined) {
		sl = state.game.add.image(x,y,bg);
	} else {
		sl = state.game.add.group();
		sl.position.setTo(x,y);
	}

	//scrollbar???
	//sl.bar = sl.addChild(state.game.add.image(scrollX, 0, scrollbarGFX));

	var list = sl.list = [];

	sl.addItem = function(item) {
		var c = list.length;
		var btn;
		
		if (alignRight) {
			console.warn('ScrollList align right not implemented.');
			/*btn = sl.addChild(Button(state, 0, c * buttonGFX.height, 
				buttonGFX, item.name, TextStyles.simpleRight, onClick));
			btn.text.anchor.x = 0;
			//btn.text.x += buttonGFX.width;
			console.log(item.name);
			console.log(btn);*/
		} else {
			btn = sl.addChild(Button(state, 0, c * buttonGFX.height, 
				buttonGFX, item.name, TextStyles.simpleCenter, onClick));
		}

		btn.item = item;
		if (inputOverCallback != undefined) {
			state.tooltip.addListener(btn, inputOverCallback);
		}
		list.push(btn);
	}

	sl.clear = function() {
		for (var i = 0; i < list.length; i++) {
			list[i].kill();
		};
		list.length = 0;
	}

	return sl;	
}

/* SlideInOutButton */
function SlideInOutButton(state, x, y, gfx, text, style, group, startPosition, goToPosition) {
	var showing = false;

	this.slideInOutToggle = function() {
		if (showing) {
			this.slideOut();
		} else {
			this.slideIn();
		}
	}

	this.slideIn = function() {
		state.foreGround.bringToTop(group);
		state.game.add.tween(group).to(goToPosition, 2000, Phaser.Easing.Back.Out, true);
		showing = true;
		if (b.onSlideCallback != undefined)
			b.onSlideCallback(state, true);
	}

	this.slideOut = function() {
		state.game.add.tween(group).to(startPosition, 2000, Phaser.Easing.Back.Out, true);
		showing = false;
		if (b.onSlideCallback != undefined)
			b.onSlideCallback(state, false);
	}

	var b = Button(state, x, y, gfx, text, style, this.slideInOutToggle);
	b.slideOut = this.slideOut;
	b.slideIn = this.slideIn;
	return b;
}

function SlideInOutManager(state) {
	var group = state.game.add.group();

}

/* ToolTip */
function ToolTip(state) {
	var bg = state.game.cache.getBitmapData('tooltip');
	var tooltip = this.group = state.game.add.group();

	tooltip.bg = tooltip.addChild(state.game.add.image(
		0,0, bg));
	tooltip.inputEnabled = false;
	tooltip.name = tooltip.addChild(state.game.add.text(
		0,0, '', TextStyles.ToolTipName));
	tooltip.filler = tooltip.addChild(state.game.add.text(
		0,20, '', TextStyles.ToolTipFiller));

	this.onOut = function() {
		tooltip.visible = false;
	}

	this.addListener = function(listener, callback) {
		listener.events.onInputOver.add(callback, {tooltip, listener});
		listener.events.onInputOut.add(this.onOut, tooltip);
	}

	this.show = function(x,y,name,filler){
		tooltip.visible = true;
		tooltip.name.text = name;
		tooltip.filler.text = filler
		tooltip.x = x;
		
		if (tooltip.name.width > tooltip.filler.width)
			tooltip.bg.scale.x = tooltip.name.width;
		else
			tooltip.bg.scale.x = tooltip.filler.width;
		tooltip.bg.scale.y = tooltip.name.height + tooltip.filler.height +
			tooltip.filler.x;
		tooltip.y = y - tooltip.bg.scale.y;

	}
}


/*	RadioButton
	On/off button
*/
function RadioButton(state, x, y, bg, selectedBG, name) {
	this.button = state.game.add.button(x, y, bg, this.select, this);
	this.selected = this.button.addChild(state.game.add.image(
		0, 0, selectedBG));
	this.name = name;

	RadioButton.prototype.select = function() {
		if (this.selected.visible == false) {
			this.selected.visible = true;
			if (this.parent != undefined)
				this.parent.select(this);
		}
	}

}



/*	RadioButtonGroup
	Holds a group of RadioButtons so that only one
	may be selected at any time
*/
function RadioButtonGroup(state, x, y, bg) {
	//constructor
	if (bg == undefined) {
		this.group = state.game.add.group();
		if (x != undefined) {
			this.group.position.x = x;
		}
		if (y != undefined) {
			this.group.position.y = y;
		}
	} else {
		this.group = state.game.add.image(x, y, bg);
	}

	this.buttons = [];
	this.listeners = [];

	//methods
	RadioButtonGroup.prototype.add = function(x, y, bg, selectedBG, name) {
		var rb = new RadioButton(state, x, y, bg, selectedBG, name);
		rb.parent = this;
		this.group.addChild(rb.button);
		if (this.buttons.length != 0) {
			rb.selected.visible = false;
		} else
			this.selected = rb;
		this.buttons.push(rb);
		return rb;
	}

	RadioButtonGroup.prototype.onSelectedChangedAdd = function(callback) {
		this.listeners.push(callback);
	}

	RadioButtonGroup.prototype.select = function(rb) {
		this.selected = rb;
		for (var i = this.listeners.length - 1; i >= 0; i--) {
			this.listeners[i](rb);
		}
		var b;
		for (var i = this.buttons.length - 1; i >= 0; i--) {
			b = this.buttons[i];
			if (b !== rb)
				b.selected.visible = false;
		};
	}
}

function MessageBox(state, x, y, bg, messageLimit, textStyle, offsetX, offsetY) {
	this.bg = state.game.add.image(x, y, bg);
	this.messageLimit = messageLimit;
	this.list = [];
	this.textStyle = textStyle;

	MessageBox.prototype.add = function(message) {
		var l = this.list;
		if (l.length >= messageLimit)
			l.shift().kill();
		l.push(this.bg.addChild(state.game.add.text(
			0, 0, message, textStyle)));
		for (var i = l.length - 1; i >= 0; i--) {
			l[i].position.setTo(offsetX, i * 16 + offsetY);
		};
	}

}

function CloseMe(state, x, y, window, callback) {
	
	this.onClick = function() {
		this.owner.window.visible = false;
		if (this.owner.callback != undefined)
			this.owner.callback();
	}

	this.state = state;
	this.window = window;
	this.callback = callback;
	var gfx = state.game.cache.getBitmapData('closeMe');
	this.button = state.game.add.button(x - gfx.width, y, 
		gfx, this.onClick);
	this.button.owner = this;
	this.window.addChild(this.button);
}

