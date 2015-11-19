function buildDungeonSelector(state) {
	var cache = state.game.cache;
	var gfx;
	var panel = cache.getBitmapData('dungeonSelectorPanel');

	var selector = state.dungeonSelector = state.game.add.image(state.game.width - panel.width,
		5, panel);
	state.game.world.bringToTop(selector);
	selector.visible = false;

	selector.close = new CloseMe(state, panel.width - 8, 8, selector);

	selector.title = selector.addChild(state.game.add.text(
		panel.width * 0.5, 25, 'Select Dungeon', TextStyles.title));
	selector.title.anchor.set(0.5);

	var list = selector.list = selector.addChild(state.game.add.group());
	list.entries = []; //save reference for easy access
	list.position.setTo(10, 50);

	buildDungeonSelectorList(state);

	/* selected dungeon details */
	var detail = selector.detail = selector.addChild(state.game.add.group());
	detail.position.setTo(cache.getBitmapData('dungeonGreenButton').width + 20, 45);

	detail.name = detail.addChild(state.game.add.text(
		0,0,' ', TextStyles.simple));
	detail.enemyCount = detail.addChild(state.game.add.text(
		0,13,' ', TextStyles.simple));
	detail.sizePerZone = detail.addChild(state.game.add.text(
		0,26,'', TextStyles.simple));
	detail.zoneCount = detail.addChild(state.game.add.text(
		0,39,'', TextStyles.simple));

	var sendToGFX = cache.getBitmapData('sendToDungeon');
	var btn = selector.sendToButton = selector.addChild(state.game.add.button(
		panel.width - sendToGFX.width - 10, panel.height - sendToGFX.height - 10,
		sendToGFX,  onSendToDungeon));
	btn.state = state;
	btn.avatar = btn.addChild(state.game.add.image(
		2,2, cache.getBitmapData('hireMercAvatar')));
	btn.text = btn.addChild(state.game.add.text(38,sendToGFX.height*0.05,
			'Send Merc\nTo ???', TextStyles.simple));
	btn.text.lineSpacing = -10;
}


function buildDungeonSelectorList(state) {
	var cache = state.game.cache;
	var gfx = cache.getBitmapData('dungeonGreenButton');
	var selector = state.dungeonSelector;
	var list = selector.list;
	var entries = list.entries;
	var btn, text;
	selector.baseDungeon = {};
	selector.baseDungeon.data = dungeonList[0];
	selector.baseDungeon.state = state;

	dungeonList.forEach(function(data, index) {
		btn = list.addChild(state.game.add.button(0, index * (gfx.height + 2),
			gfx, onDungeonSelect))

		text = btn.addChild(state.game.add.text(gfx.width*0.5,gfx.height*0.55,
			data.name, TextStyles.simpleCenter));
		text.anchor.set(0.5);
		btn.name = text;

		btn.data = data;

		btn.state = state;
		entries.push(btn);
	});

	hdn = btn;
}
var hdn;

function onDungeonSelect(button) {
	var selector = button.state.dungeonSelector;
	var detail = selector.detail;

	var data = selector.selectedDungeon = button.data;
	detail.name.text = data.name;
	detail.enemyCount.text = 'Enemy Type: ' + data.monster.length;
	detail.sizePerZone.text = 'Size: ' + data.sizePerZone;
	detail.zoneCount.text = 'Zones: ' + data.zoneCount;

	selector.sendToButton.text.text = 'Send ' + selector.selectedMerc.name + '\nTo ' + data.name;
}

function onSendToDungeon(button) {
	var d = button.state.dungeonSelector;
	d.visible = false;
	newDungeon(button.state);

	button.state.messageBox.add(d.selectedMerc.name + ' sent to ' + d.selectedDungeon.name + '.');
}