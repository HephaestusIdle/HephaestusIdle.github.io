var equipmentData = [
	{name: 'Helmet', image: 'helm3',  damage: 0, health: 1, level: 1}
];
var equipmentTypes = [
	'Helmet', 'Armor', 'Pants', 'Shoes', 'Gloves', 'Ring', 'Earing', 'Weapon']
function buildEquipment(state) {
	state.equipment = state.game.add.group();
	var equipment;
	equipmentData.forEach(function(data){
		equipment = state.equipment.create(1000, state.game.world.centerY, data.image);
		equipment.details = data;
		
		
	});
}

var equipmentPanelData = [
	{	name: 'null',	x: -5000,	 y: -5000	},
	{	name: 'Helmet',	x: 34,	 y: 0	},
	{	name: 'Armor',	x: 34,	 y: 34	},
	{	name: 'Pants',	x: 34,	 y: 68	},
	{	name: 'Shoes',	x: 34,	 y: 102	},
	{	name: 'Gloves',	x: 0,	 y: 34	},
	{	name: 'Ring',	x: 0,	 y: 68	},
	{	name: 'Earing',	x: 68,	 y: 0	},
	{	name: 'Weapon',	x: 68,	 y: 68	}
]

/* Equipment */
var Equipment = function(state, x, y, bg) {
	var cache = state.game.cache;
	var group = this.group = state.game.add.image(x, y, bg);
	var self = this;

	this.panel = new RadioButtonGroup(state, 8, 8);
	group.addChild(this.panel.group);

	this.equipped = {};

	var eq;
	for (var i = equipmentTypes.length - 1; i >= 0; i--) {
		eq = equipmentTypes[i];
		this.equipped[eq] = undefined;
	};
	
	
	var rb, data;
	var btnBG = cache.getBitmapData('equipmentButtonBG');
	var btnSelected = cache.getBitmapData('equipmentButtonSelected');

	for (var i = 0; i < equipmentPanelData.length; i++) {
		data = equipmentPanelData[i];
		rb = this[data.name] = this.panel.add(data.x, data.y, btnBG, btnSelected, data.name);
		rb.button.addChild(state.game.add.image(
			2, 2, cache.getBitmapData('equipment' + data.name)));
		rb.listener = rb.button;
		rb.button.state = state;
		state.tooltip.addListener(rb.button, Player.onItemInputOver);
		rb.button.name = 'rb';
	}

	this.onItemSelect = function() {
		//equip item!
		var item = this.item.item;
		var old = self.equipped[item.type];

		if (old != undefined) {
			state.player.addCraft(old, 1);
		}
		state.player.removeCraft(item, 1);
		self.equipped[item.type] = item;
		state.player.updateStats(self.activeMerc, self.equipped);
		self.panel.selected.button.item = item;
		self.updateList(item.type);
		self.updateStats();
	}


	this.updateList = function(search) {
		var container = state.player.crafts;
		itemList.clear();
		var h, data;
	main:
		for (var key in container) {
			data = container[key];
			if (search != undefined) {
				if (typeof search === 'string') {
					if (data.type != search)
						continue;
				} else {
					for (var i = search.length - 1; i >= 0; i--) {
						if (data.type != search[i])
							continue main;
					};
				}
			}
			h = {name: key + ' ' + data.quantity, item:data};
			itemList.addItem(h);
		}
	}

	this.onEquipmentSelected = function(slot) {
		self.updateList(slot.name);
	}

	this.updateStats = function() {
		if (self.activeMerc != undefined) {
			var m = self.activeMerc;
			sg.name.text = m.name;
			sg.left.text = 
				'Health: ' + m.maxHealth +
				'\nDamage: ' + m.damage +
				'\nVitality: ' + m.vitality +
				'\nStrength: ' + m.strength +
				'\nDexterity: ' + m.dexterity +
				'\nIntelligence: ' + m.intelligence;
			sg.right.text = 'Some\nStatistics\nWould\nBe\nNice';
		}
	}

	this.show = function(merc) {
		console.log('merc request ' + merc.name)
		self.activeMerc = merc;
		var e = self.equipped = merc.equipped;
		self.updateStats();
		this.group.visible = true;
		console.warn('displaying equipment but not showing equips!');

		var i, r;
		var rbl = this.panel.buttons;
		var l = rbl.length - 1;
		for (var k in e) {
			for (i = l; i >= 0; i--) {
				r = rbl[i];
				r.item = undefined;
				if (r.name == k) {
					r.item = e[k];
					break;
				}
			};
		}
	}


	var buttonGFX = cache.getBitmapData('inventoryListButton');
	var itemList = this.itemList = group.addChild(new ScrollList(state, bg.width - buttonGFX.width - 4, 
		40, 0, this.onItemSelect, buttonGFX, undefined, undefined, Player.onItemInputOver));

	this.panel.onSelectedChangedAdd(this.onEquipmentSelected, rb);


	var sg = this.statsGroup = group.addChild(state.game.add.group());
	sg.position.setTo(10, 140);

	var style = TextStyles.simple12;
	var left, right, nameText;
	sg.left = left = sg.addChild(state.game.add.text(0, 0, 'Stats: xx\nStats: xx\nStats: xx\n', style));
	sg.right = right = sg.addChild(state.game.add.text(bg.width - 120, 0, 'Stats: xx\nStats: xx\nStats: xx\n', style));
	sg.name = nameText = sg.addChild(state.game.add.text(167, -sg.position.y + 25, 'Ozymandias', TextStyles.titleMini));
	sg.name.anchor.set(0.5);

	this.group.visible = false;

}


