var Player = function(state) {

	var self = this;
	this.inventory = {};
	this.crafts = {};
	this.gold = 25;
	this.selectedItem = undefined;
	this.forgeAmount = 1;
	

	this.addCraft = function(craft, recalculateStats) {
		if (this.crafts[craft.name] == undefined)
			this.crafts[craft.name] = craft;
		else 
			++this.crafts[craft.name].quantity;

		if (recalculateStats === true) {
			var n = craft.baseName;
			var c, s, data;
		skillLoop:
			for (var skill in craftingData) {
				s = craftingData[skill];
				for (var d in s.item) {
					data = s.item[d];
					//console.log('Checking... ' + data.name +' '+ (data.name == n));
					if (data.name == n) {
						n = data.stats;
						c = craft.stats = {};
						if (craft.forgeLevel == 0) {
							for (var s in n) {
								c[s] = n[s];
							}
						} else {
							var l = craft.forgeLevel;
							for (var s in n) {
								c[s] = n[s] * Math.pow(1.25, l);
							}
						}
						break skillLoop;
					}
				}
			}
		}
		
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
		if (this.item.item.quantity > 1) {
			self.selectedItem = this.item.item;
			self.forgeGroup.visible = true;
			self.forgeGroup.y = this.y + self.ui.itemList.y;
			self.forgeAmount = 1;
			self.forgeButton.text.text = 'Forge 1 $' + self.selectedItem.forgeCost;
		} else {
			self.selectedItem = undefined;
			self.forgeGroup.visible = false;
		}
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
	
	this.doforge = function() {
		if (self.gold < self.selectedItem.gold * self.forgeAmount) {
			console.log('Not enough gold to forge item!');
			self.forgeGroup.visible = false;
		} else if (self.selectedItem.quantity < 2 * self.forgeAmount) {
			console.log('Not enough items to forge item!');
			self.forgeGroup.visible = false;
		} else {
			self.addGold(-self.selectedItem.gold * self.forgeAmount);
			var c =self.removeCraft(self.selectedItem, 2 * self.forgeAmount);
			var e = Crafting.cloneItem(c);
			++e.forgeLevel;
			Crafting.setforgeCost(e);
			e.name = c.baseName + ' +' + e.forgeLevel;
			e.quantity = self.forgeAmount;
			self.addCraft(e, true);

			self.forgeGroup.visible = false;
			self.forgeAmount = 1;
			self.forgeGroup.visible = false;
		}
	}

	this.addXItem = function() {
		self.forgeAmount += this.value;
		if (self.forgeAmount < 1) {
			self.forgeAmount = 1;
		}
		var a = Math.floor(self.selectedItem.quantity * 0.5);
		if (self.forgeAmount > a) {
			self.forgeAmount = a;
			if (a == 0)
				self.forgeGroup.visible = false;
		}
		self.forgeButton.text.text = 'Forge ' + self.forgeAmount + ' $' +
			(self.selectedItem.forgeCost * self.forgeAmount);
	}
	this.onInputOver = function() {
		var tt = this.tooltip;
		var btn = this.listener;
		var data = btn.item.item;
		var t = '';

		switch (data.type) {
			case 0: //equipment
				var s = data.stats;
				for(var key in s) {
					t += key + ': ' + (Math.round((s[key] + 0.00001) * 100) / 100) + '\n';
				}
				if (t != '' || t[t.length-1]=='n' && t[t.length-2] == '\\') {
					t = t.substring(0,  t.length - 1);
				}
			break;
			case 1: //material
				t = 'Type: Material'
			break;
			case 2: //item
				t = 'Type: Misc.'
			break;
		}


		state.tooltip.show(game.input.x, game.input.y, data.name, t);
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

		ui.materialList = ui.addChild(ScrollList(state, 10, 40, 0, undefined, buttonGFX, undefined, undefined, this.onInputOver));
		ui.itemList = ui.addChild(ScrollList(state, ui.itemsLabel.position.x - buttonGFX.width, 
			40, 0, this.onItemSelect, buttonGFX, undefined, undefined, this.onInputOver));

		ui.bottomText =ui.addChild(state.game.add.text(bg.width * 0.5, bg.height - 40, 
			'2 weapons or armor of the same \ntype can be forged together!', 
			TextStyles.simple12));
		ui.bottomText.anchor.x = 0.5;
		ui.bottomText.lineSpacing = -10;

		/* forging */
		this.forgeGroup = ui.addChild(state.game.add.group());
		this.forgeGroup.position.x = bg.width;

		buttonGFX = cache.getBitmapData('forgeButton');
		this.forgeButton = this.forgeGroup.addChild(Button(
			state, 0, 0, buttonGFX,
			'Forge 1 $', TextStyles.simpleCenter, this.doforge));
		this.forgeGroup.visible = false;

		var value = [+1, +5, -1, -5]
		gfx = cache.getBitmapData('forgeSmallButton');
		var v, b;

		for (var i = value.length - 1; i >= 0; i--) {
			v = value[i];
			b = this.forgeGroup.addChild(Button(
				state, gfx.width * i, buttonGFX.height, gfx,
				v, TextStyles.simpleCenter, this.addXItem));
			b.value = v;
		}


		return ui;
	}
}