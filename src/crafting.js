/* crafting template
var craftingData = [
	{	name: 'Sword', //craft skill
		item: [{
				name: 'Copper Sword', gold: 5, 
				material: [['Metal', 1]], forge:[['Metal', 1]], type:'Weapon',
				stats: { damage: 1, strength: 1}
			}
		]
	}
} */

/*	An item type is limited to existing ones.
		Helmet
		Armor
		Pants
		Shoes
		Gloves
		Ring'
		Earing
		Weapon
*/
/*	Material reference (pls add new ones to list)
		Copper
		Tin
		Bronze (Copper+Tin)
		Iron
		Steel (Copper+Tin)
*/

var craftingData = [
	{	name: 'Rifle',
		item: [
			{	name: 'Copper Rifle', gold: 5,
				material: [['Copper', 1]], forge:[['Copper', 1]], type:'Weapon',
				stats: { damage: 1, strength: 1}
			},
			{	name: 'Tin Rifle', gold: 15,
				material: [['Tin', 1]], forge:[['Tin', 1]], type:'Weapon',
				stats: { damage: 3, strength: 3}
			},
			{	name: 'Bronze Rifle', gold: 200,
				material: [['Copper', 10], ['Tin', 10]], forge:[['Copper', 10], ['Tin', 10]], type:'Weapon',
				stats: { damage: 5, strength: 5}
			},
			{	name: 'Iron Rifle', gold: 900,
				material: [['Iron', 3]], forge:[['Iron', 3]], type:'Weapon',
				stats: { damage: 10, strength: 10}
			},
			{	name: 'Steel Rifle', gold: 5000,
				material: [['Iron', 10], ['Tin', 50], ['Coal']], forge:[['Iron', 10], ['Tin', 30]], type:'Weapon',
				stats: { damage: 30, strength: 30}
			}
		]
	}, 
	{	name: 'Armor',
		item: [
			{	name: 'Copper Armor', gold: 5,
				material: [['Copper', 1]], forge:[['Copper', 1]], type:'Armor',
				stats: { strength: 1, vitality: 1}
			},
			{	name: 'Tin Armor', gold: 15,
				material: [['Tin', 1]], forge:[['Tin', 1]], type:'Armor',
				stats: { strength: 3, vitality: 3.5}
			},
			{	name: 'Bronze Armor', gold: 200,
				material: [['Copper', 10], ['Tin', 10]], forge:[['Copper', 10], ['Tin', 10]], type:'Armor',
				stats: { strength: 5, vitality: 7}
			},
			{	name: 'Iron Armor', gold: 900,
				material: [['Iron', 3]], forge:[['Iron', 3]], type:'Armor',
				stats: { strength: 15, vitality: 21}
			},
			{	name: 'Steel Armor', gold: 5000,
				material: [['Iron', 10], ['Tin', 50], ['Coal']], forge:[['Iron', 10], ['Tin', 30]], type:'Armor',
				stats: { strength: 35, vitality: 41}
			}
		]
	}, 
	{	name: 'Helmet',
		item: [
			{	name: 'Copper Helmet', gold: 5,
				material: [['Copper', 1]], forge:[['Copper', 1]], type:'Helmet',
				stats: { intelligence: 1	}
			},
			{	name: 'Tin Helmet', gold: 15,
				material: [['Tin', 1]], forge:[['Tin', 1]], type:'Helmet',
				stats: { intelligence: 3}
			},
			{	name: 'Bronze Helmet', gold: 200,
				material: [['Copper', 10], ['Tin', 10]], forge:[['Copper', 10], ['Tin', 10]], type:'Helmet',
				stats: { intelligence: 5	}
			},
			{	name: 'Iron Helmet', gold: 900,
				material: [['Iron', 3]], forge:[['Iron', 3]], type:'Helmet',
				stats: { intelligence: 	13	}
			},
			{	name: 'Steel Helmet', gold: 5000,
				material: [['Iron', 10], ['Tin', 50], ['Coal']], forge:[['Iron', 10], ['Tin', 30]], type:'Helmet',
				stats: { intelligence: 	30	}
			}
		]
	}, 
	{	name: 'Gloves',
		item: [
			{	name: 'Copper Gloves', gold: 5,
				material: [['Copper', 1]], forge:[['Copper', 1]], type:'Gloves',
				stats: { damage: 0.25, dexterity: 1, vitality: 1}
			},
			{	name: 'Tin Gloves', gold: 15,
				material: [['Tin', 1]], forge:[['Tin', 1]], type:'Gloves',
				stats: { damage: 1, dexterity: 2, vitality: 2}
			},
			{	name: 'Bronze Gloves', gold: 200,
				material: [['Copper', 10], ['Tin', 10]], forge:[['Copper', 10], ['Tin', 10]], type:'Gloves',
				stats: { damage: 2.1, dexterity: 4, vitality: 4}
			},
			{	name: 'Iron Gloves', gold: 900,
				material: [['Iron', 3]], forge:[['Iron', 3]], type:'Gloves',
				stats: { damage: 4.6, strength: 7, vitality: 7}
			},
			{	name: 'Steel Gloves', gold: 5000,
				material: [['Iron', 10], ['Tin', 50], ['Coal']], forge:[['Iron', 10], ['Tin', 30]], type:'Gloves',
				stats: { damage: 7, dexterity: 16, vitality: 16}
			}
		]
	}, 
	{	name: 'Pants',
		item: [
			{	name: 'Copper Pants', gold: 5,
				material: [['Copper', 1]], forge:[['Copper', 1]], type:'Pants',
				stats: { vitality: 3}
			},
			{	name: 'Tin Pants', gold: 15,
				material: [['Tin', 1]], forge:[['Tin', 1]], type:'Pants',
				stats: { vitality: 7}
			},
			{	name: 'Bronze Pants', gold: 200,
				material: [['Copper', 10], ['Tin', 10]], forge:[['Copper', 10], ['Tin', 10]], type:'Pants',
				stats: { vitality: 15}
			},
			{	name: 'Iron Pants', gold: 900,
				material: [['Iron', 3]], forge:[['Iron', 3]], type:'Pants',
				stats: { vitality: 31}
			},
			{	name: 'Steel Pants', gold: 5000,
				material: [['Iron', 10], ['Tin', 50], ['Coal']], forge:[['Iron', 10], ['Tin', 30]], type:'Pants',
				stats: { vitality: 62}
			}
		]
	}, 
	{	name: 'Shoes',
		item: [
			{	name: 'Copper Shoes', gold: 5,
				material: [['Copper', 1]], forge:[['Copper', 1]], type:'Shoes',
				stats: { dexterity: 1}
			},
			{	name: 'Tin Shoes', gold: 15,
				material: [['Tin', 1]], forge:[['Tin', 1]], type:'Shoes',
				stats: { dexterity: 3}
			},
			{	name: 'Bronze Shoes', gold: 200,
				material: [['Copper', 10], ['Tin', 10]], forge:[['Copper', 10], ['Tin', 10]], type:'Shoes',
				stats: { dexterity: 6}
			},
			{	name: 'Iron Shoes', gold: 900,
				material: [['Iron', 3]], forge:[['Iron', 3]], type:'Shoes',
				stats: { dexterity: 12}
			},
			{	name: 'Steel Shoes', gold: 5000,
				material: [['Iron', 10], ['Tin', 50], ['Coal']], forge:[['Iron', 10], ['Tin', 30]], type:'Shoes',
				stats: { dexterity: 24}
			}
		]
	} 

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
	this.details.position.setTo(15 + buttonGFX.width + itemGFX.width, 0);
	this.title = this.details.addChild(state.game.add.text(
		-50, 20, 'Crafting', TextStyles.titleMini));
	this.title.anchor.setTo(0.5);

	this.stats = this.details.addChild(state.game.add.text(
		0, 38, 'Stats', TextStyles.cyberpunk));
	this.stats.lineSpacing = -8;

	this.material = []; //required materials holder

	this.craftBTN = this.graphics.addChild(Button(
		state, bg.width * 0.5 - 20, bg.height - craftGFX.height - 10,
		craftGFX, 'Craft $', TextStyles.cyberpunkCenterButton, this.doCraft));

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
	if (it.forgeLevel == undefined)
		it.forgeLevel = 0;
	Crafting.setforgeCost(it);
	return it;
}


Crafting.cloneItem = function(item) {
	var it = {};
	for (var key in item) {
		it[key] = item[key];
	}
	return it;
}

Crafting.setforgeCost = function(item) {
	item.forgeCost = Math.floor(item.gold + (0.75 * item.gold * item.forgeLevel));
}