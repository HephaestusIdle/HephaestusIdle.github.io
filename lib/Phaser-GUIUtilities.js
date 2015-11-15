var Button = function(state, x, y, gfx, text, style, onClick) {
	var b = state.game.add.button(x, y, gfx, onClick);
	b.text = b.addChild(state.game.add.text(gfx.width * 0.5, gfx.height *0.55,
		text, style));
	b.text.anchor.set(0.5);
	return b;
}

var ScrollList = function(state, x, y, scrollX, onClick, buttonGFX, scrollbarGFX, bg) {
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

		var btn = sl.addChild(Button(state, 0, c * buttonGFX.height, buttonGFX, item.name, TextStyles.simpleCenter, onClick));
		btn.item = item;
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