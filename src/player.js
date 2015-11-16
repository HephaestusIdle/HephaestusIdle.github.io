var Player = function(state) {

	var self = this;
	this.inventory = {};
	this.crafts = {};
	this.gold = 25;
	this.selectedItem = undefined;
	

	this.addCraft = function(craft) {
		if (this.crafts[craft.name] == undefined)
			this.crafts[craft.name] = craft;
		else 
			++this.crafts[craft.name].quantity;
		
		this.updateCraftList();
	}

	this.addLoot = function(loot) {
		if (this.inventory[loot] == undefined)
			this.inventory[loot] = 1;
		else 
			++this.inventory[loot];

		this.updateLootList();
	}

	this.updateCraftList = function() {
		var list = this.ui.itemList;
		var container = this.crafts;
		list.clear();
		var h;
		for (var key in container) {
			h = {name: key + ' ' + container[key].quantity, item:container[key]};
			list.addItem(h);
		}
	}

	this.updateLootList = function() {
		var list = this.ui.materialList;
		var container = this.inventory;
		list.clear();
		var h;
		for (var key in container) {
			h = {name: key + ' ' + container[key]};
			list.addItem(h);
		}
	}

	this.addGold = function(amount) {
		this.gold += amount;
		state.playerGoldText.text = 'Gold: ' + this.gold;
	}

	this.onItemSelect = function() {
		self.selectedItem = this.item.item;
		self.enchantButton.visible = true;
		self.enchantButton.y = this.y + self.ui.itemList.y;
		self.enchantButton.text.text = 'Enchant $' + self.selectedItem.enchantCost;
	}

	this.removeCraft = function(item, quantity) {
		var c;
		for (var key in self.crafts) {
			c = self.crafts[key];
			if (c.name == item.name) {
				if (c.quantity >= quantity) {
					c.quantity -= quantity;
					if (c.quantity <= 0) {
						delete self.crafts[key];
					}
					this.updateCraftList();
				}
				return c;
			}
		}
	}
	
	this.doEnchant = function() {
		console.log('attempting to enchant ' + self.selectedItem.name);
		if (self.gold < self.selectedItem.gold) {
			console.log('Not enough gold to enchant item!');
		} else if (self.selectedItem.quantity < 2) {
			console.log('Not enough items to enchant item!');
		} else {
			self.addGold(-self.selectedItem.gold);
			var c =self.removeCraft(self.selectedItem, 2);
			var e = Crafting.cloneItem(c);
			++e.enchantLevel;
			Crafting.setEnchantCost(e);
			e.name = c.baseName + ' +' + e.enchantLevel;
			e.quantity = 1;
			self.addCraft(e);
			console.log('enchant completed');
			this.visible = false;
		}
	}

	this.inventoryUI = function(x, y, bg) {
		var cache = state.game.cache;
		var ui = this.ui = state.foreGround.addChild(state.game.add.image(x, y, bg));

		var gfx = cache.getBitmapData('upgradePanelButton');
		var showButton = ui.showButton  = ui.addChild(SlideInOutButton(
			state, bg.width - gfx.width * 0.3, 0, gfx, 'Inventory', 
			TextStyles.simpleCenter, ui, {x: x}, {x: -8}));

		ui.materialLabel = ui.addChild(state.game.add.text(
			10, 20, 'Materials', TextStyles.simple16));

		ui.itemsLabel = ui.addChild(state.game.add.text(
			bg.width - 10, 20, 'Items', TextStyles.simple16));
		ui.itemsLabel.anchor.x = 1;

		var buttonGFX = cache.getBitmapData('inventoryListButton');

		ui.materialList = ui.addChild(ScrollList(state, 10, 40, 0, undefined, buttonGFX));
		ui.itemList = ui.addChild(ScrollList(state, ui.itemsLabel.position.x - buttonGFX.width, 
			40, 0, this.onItemSelect, buttonGFX));


		this.enchantButton = ui.addChild(Button(
			state, bg.width, 0, cache.getBitmapData('enchantButton'),
			'Enchant $', TextStyles.simpleCenter, this.doEnchant));
		this.enchantButton.visible = false;

		

		
		return ui;
	}
}