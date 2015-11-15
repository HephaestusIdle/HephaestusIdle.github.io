var Player = function(state) {

	this.inventory = {};
	this.crafts = {};
	this.gold = 25;

	this.addCraft = function(craft) {
		if (this.crafts[craft.name] == undefined)
			this.crafts[craft.name] = craft;
		else 
			++this.crafts[craft.name].quantity;
	}

	this.addLoot = function(loot) {
		if (this.inventory[loot] == undefined)
			this.inventory[loot] = 1;
		else 
			++this.inventory[loot];
	}

	this.addGold = function(amount) {
		this.gold += amount;
	}
	

	this.inventoryUI = function(x, y, bg) {
		var cache = state.game.cache;
		var ui = state.foreGround.addChild(state.game.add.image(x, y, bg));

		var gfx = cache.getBitmapData('upgradePanelButton');
		var showButton = ui.showButton  = ui.addChild(SlideInOutButton(
			state, bg.width - gfx.width * 0.3, 0, gfx, 'Inventory', 
			TextStyles.simpleCenter, ui, {x: x}, {x: -8}));

		ui.materialLabel = ui.addChild(state.game.add.text(
			10, 20, 'Materials', TextStyles.simple16));

		ui.itemsLabel = ui.addChild(state.game.add.text(
			bg.width - 10, 20, 'Items', TextStyles.simple16));
		ui.itemsLabel.anchor.x = 1;
		return ui;
	}
}