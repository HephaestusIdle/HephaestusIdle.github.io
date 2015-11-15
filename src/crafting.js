var craftingData = [
	{	name: 'Sword',
		item: [{
				name: 'Cooper Sword', damage: 1, gold: 5, material: [['Metal', 1]]
			},
			{
				name: 'Iron Sword', damage: 1, gold: 5, material: [['Metal', 2], ['Iron', 1]]
			},
			{
				name: 'Steel Sword', damage: 1, gold: 5, material: [['Metal', 1]]
			},
			{
				name: 'Mithril Sword', damage: 1, gold: 5, material: [['Metal', 1]]
			},
		]
	}, 
	{	name: 'Armor',
		item: [{
				name: 'Cooper Armor', damage: 1, gold: 5, material: [['Metal', 1]]
			}
		]
	}, 
	{	name: 'Helmet',
		item: [{
				name: 'Cooper Helmet', damage: 1, gold: 5, material: [['Metal', 1]]
			}
		]
	}, 
	{	name: 'Gloves',
		item: [{
				name: 'Cooper Gloves', damage: 1, gold: 5, material: [['Metal', 1]]
			}
		]
	}, 
	{	name: 'Pants',
		item: [{
				name: 'Cooper Pants', damage: 1, gold: 5, material: [['Metal', 1]]
			}
		]
	}, 
	{	name: 'Shoes',
		item: [{
				name: 'Cooper Shoes', damage: 1, gold: 5, material: [['Metal', 1]]
			}
		]
	}, 

]

var Crafting = function(state, x, y) {
	var state = state;
	var cache = state.game.cache;
	var buttonGFX = cache.getBitmapData('dungeonGreenButton');
	var bg = cache.getBitmapData('craftingPanel');
	var craftGFX = cache.getBitmapData('hireMercButton');
	var self = this;

	this.graphics = state.game.add.image(x, y, bg);
	this.graphics.visible = false;

	this.details = this.graphics.addChild(state.game.add.group());
	this.details.position.setTo(40 + buttonGFX.width * 2, 4);
	this.title = this.details.addChild(state.game.add.text(160, 20, 'Crafting', TextStyles.titleSmall));
	this.title.anchor.setTo(0.5);

	this.stats = this.details.addChild(state.game.add.text(0, 45, 'Stats', TextStyles.simple12));
	this.stats.lineSpacing = -8;

	this.material = []; //required materials holder

	this.craftBTN = this.graphics.addChild(Button(
		state, bg.width * 0.5, bg.height - craftGFX.height - 10,
		craftGFX, 'Craft $', TextStyles.simpleCenter, this.doCraft));

	/* detailed item scrollList code */
	this.onItemSelect = function(button) {
		if (items.skillName == button.item.name) 
			return; //already selected ignore click
		var it = self.selectedItem = button.item;
		//display selected item details
		self.title.text = 'Crafting ' + it.name;

		// item stats
		self.stats.text = 'Damage: ' + it.damage;

		//items materials
		var m = self.material;
		for (var i = m.length - 1; i >= 0; i--) {
			//remove old materials
			m[i].kill();
		};
		m.length = 0;
		var matText;
		it.material.forEach(function(mat) {
			matText = self.details.addChild(state.game.add.text(
				bg.width - 170, 45 + 12 * m.length,
				mat[0] + ': ' + mat[1] + '\n', TextStyles.simple12));
			matText.lineSpacing = -8;
			matText.anchor.x = 1;

			m.push(matText);
		});

		self.craftBTN.text.text = 'Craft $' + it.gold;
	}

	var items = this.items = this.graphics.addChild(ScrollList(
		state, 12 + buttonGFX.width, 4, 0, this.onItemSelect, buttonGFX));
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
		state, 4, 4, 0, this.onSkillClick, buttonGFX));
	skills.position.setTo(4, 4);

	craftingData.forEach(function(item) {
		skills.addItem(item);
	})

	/*end of left most scrollList code*/

	
}


Crafting.prototype.doCraft = function() {
	var it = this.state.crafting.selectedItem;
	console.log('Doing a craft.... ');
	if (it == undefined) {
		console.log('nothing to craft!');
		return;
	} else {
		console.log('Attempting to craft ' + it.name);

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
		
		console.log(canCraft);
	}
}