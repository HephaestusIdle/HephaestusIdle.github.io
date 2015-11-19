var craftingData = [
	{	name: 'Sword',
		item: [{
				name: 'Copper Sword', gold: 5, 
				material: [['Metal', 1]], forge:[['Metal', 1]], type:'Weapon',
				stats: { damage: 1, strength: 1}
			},
			{
				name: 'Iron Sword', damage: 1, gold: 5, material: [['Metal', 2], ['Iron', 1]], type:'Weapon'
			},
			{
				name: 'Steel Sword', damage: 1, gold: 5, material: [['Metal', 1]], type:'Weapon'
			},
			{
				name: 'Mithril Sword', damage: 1, gold: 500, material: [['Metal', 1], ['Mithril', 1]], type:'Weapon'
			},
		]
	}, 
	{	name: 'Armor',
		item: [{
				name: 'Cooper Armor', damage: 1, gold: 5, material: [['Metal', 1]], type:'Armor'
			}
		]
	}, 
	{	name: 'Helmet',
		item: [{
				name: 'Cooper Helmet', damage: 1, gold: 5, material: [['Metal', 1]], type:'Helmet'
			}
		]
	}, 
	{	name: 'Gloves',
		item: [{
				name: 'Cooper Gloves', damage: 1, gold: 5, material: [['Metal', 1]], type:'Gloves'
			}
		]
	}, 
	{	name: 'Pants',
		item: [{
				name: 'Cooper Pants', damage: 1, gold: 5, material: [['Metal', 1]], type:'Pants'
			}
		]
	}, 
	{	name: 'Shoes',
		item: [{
				name: 'Cooper Shoes', damage: 1, gold: 5, material: [['Metal', 1]], type:'Shoes'
			}
		]
	}, 

]

var Crafting = function(state, x, y) {
	var state = state;
	var cache = state.game.cache;
	var buttonGFX = cache.getBitmapData('craftSkillButton');
	var itemGFX = cache.getBitmapData('craftItemButton');
	var bg = cache.getBitmapData('craftingPanel');
	var craftGFX = cache.getBitmapData('craftButton');
	var self = this;

	this.graphics = state.foreGround.addChild(state.game.add.image(x, y, bg));

	this.details = this.graphics.addChild(state.game.add.group());
	this.details.position.setTo(40 + buttonGFX.width * 2, 4);
	this.title = this.details.addChild(state.game.add.text(
		-50, 20, 'Crafting', TextStyles.titleMini));
	this.title.anchor.setTo(0.5);

	this.stats = this.details.addChild(state.game.add.text(
		0, 45, 'Stats', TextStyles.simple12));
	this.stats.lineSpacing = -8;

	this.material = []; //required materials holder

	this.craftBTN = this.graphics.addChild(Button(
		state, bg.width * 0.5 - 20, bg.height - craftGFX.height - 10,
		craftGFX, 'Craft $', TextStyles.simpleCenter, this.doCraft));

	this.onSlide = function(state, showing) {
		if (showing) {
			//force hide other windows
			state.player.hide();
			state.upgradePanel.hide();
			//display stuff
		} else {
			//hide stuff
		}
	}

	this.hide = function(state) {
		self.showButton.slideOut();
	}

	/* detailed item scrollList code */
	this.onItemSelect = function(button) {
		if (items.skillName == button.item.name) 
			return; //already selected ignore click
		var it = self.selectedItem = button.item;
		//display selected item details
		self.title.text = 'Crafting ' + it.name;
		
		var t = '';
		var s = it.stats;
		for (var key in s) {
			t += key + ': ' + s[key] + '\n';
		}

		t += '--------------\n';
		
		it.material.forEach(function(mat) {
			t += mat[0] + ': ' + mat[1] + '\n';
		});

		self.stats.text = t;

		self.craftBTN.text.text = 'Craft $' + it.gold;
	}

	var items = this.items = this.graphics.addChild(ScrollList(
		state, 12 + buttonGFX.width, 40, 0, this.onItemSelect, itemGFX));
	/* end of detailed item scrollList code */

	/* left most scrollList code*/
	this.onSkillClick = function(button) {
		if (skills.skillName == button.item.name) 
			return; //already selected ignore click

		//update detailed item scrollList with skill values
		items.clear();
		var it = button.item.item;
		for (var i = 0; i < it.length; i++) {
			items.addItem(it[i]);
		};
	}

	var skills = this.skills = this.graphics.addChild(ScrollList(
		state, 4, 40, 0, this.onSkillClick, buttonGFX));

console.warn('remove item.item.forEach');
	craftingData.forEach(function(item) {
		/*item.item.forEach(function(d) {
			d.quantity = 4;
			state.player.addCraft(Crafting.getItem(d));	
		})*/
		
		skills.addItem(item);
	});

	/*end of left most scrollList code*/

	/* show me button */
	var gfx = cache.getBitmapData('upgradePanelButton');
	this.showButton = this.graphics.addChild(SlideInOutButton(
		state, bg.width - gfx.width * 0.3, 0, gfx, 'Crafting', 
		TextStyles.simpleCenter, this.graphics, {x: x}, {x: -8}));
	this.showButton.onSlideCallback = this.onSlide;
}


Crafting.prototype.doCraft = function() {
	var it = this.state.crafting.selectedItem;
	if (it == undefined) {
		return;
	} else if (this.state.player.gold < it.gold) {
		this.state.showError('Not enough gold!');
	} else {

		var inv = this.state.player.inventory;
		var mats = it.material; //required material list
		var canCraft = true;
		
		var i = mats.length;
		var m, im; //helper var
	    while (i--) {
	    	m = mats[i];
	    	im = inv[m[0]];
	        if (im === undefined || im < m[1]) {
	            canCraft = false;
	            break;
	        }
	    }
		if (canCraft) {
			this.state.player.addGold(-it.gold);
			//removing player materials
			i = mats.length
			while (i--) {
		    	inv[m[0]] -= m[1];
		    }	
		    it.quantity = 1;
		    var gi = Crafting.getItem(it);
			this.state.player.addCraft(gi);
			console.log(this.state.messageBox);
			this.state.messageBox.add(gi.name + ' crafted!');
		} else {
			this.state.showError('Missing Materials!');
		}
	}
}

Crafting.getItem = function(item) {
	var it = {};
	for (var key in item) {
		it[key] = item[key];
	}
	it.baseName = it.name;
	console.log(it.baseName);
	if (it.forgeLevel == undefined)
		it.forgeLevel = 0;
	Crafting.setforgeCost(it);
	return it;
}


Crafting.cloneItem = function(item) {
console.log('Cloning');
	console.log(item);
	var it = {};
	for (var key in item) {
		it[key] = item[key];
	}
	return it;
}

Crafting.setforgeCost = function(item) {
	item.forgeCost = Math.floor(item.gold + (0.75 * item.gold * item.forgeLevel));
}