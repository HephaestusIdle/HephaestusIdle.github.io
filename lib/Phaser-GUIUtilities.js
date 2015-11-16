var Button = function(state, x, y, gfx, text, style, onClick) {
	var b = state.game.add.button(x, y, gfx, onClick);
	b.text = b.addChild(state.game.add.text(gfx.width * 0.5, gfx.height *0.55,
		text, style));
	b.text.anchor.set(0.5);
	b.state = state;
	return b;
}

var ScrollList = function(state, x, y, scrollX, onClick, buttonGFX, scrollbarGFX, bg, inputOverCallback, alignRight) {
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
			btn = sl.addChild(Button(state, 0, c * buttonGFX.height, buttonGFX, 
			item.name, TextStyles.simpleCenter, onClick));
		}

		btn.item = item;
		if (inputOverCallback != undefined)
			state.tooltip.addListener(btn, inputOverCallback);
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

var SlideInOutButton = function(state, x, y, gfx, text, style, group, startPosition, goToPosition) {
	var showing = false;

	this.slideInOutToggle = function() {
		if (showing) {
			state.game.add.tween(group).to(startPosition, 2000, Phaser.Easing.Back.Out, true);
		} else {
			state.foreGround.bringToTop(group);
			state.game.add.tween(group).to(goToPosition, 2000, Phaser.Easing.Back.Out, true);
		}
		showing = !showing;
	}

	var b = Button(state, x, y, gfx, text, style, this.slideInOutToggle);

	return b;
}


var ToolTip = function(state) {
	var bg = state.game.cache.getBitmapData('tooltip');
	var tooltip = state.game.add.group();

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
		listener.inputEnabled = true;
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