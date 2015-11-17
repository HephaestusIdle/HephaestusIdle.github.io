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
	
	
	var rb, data;
	var btnBG = cache.getBitmapData('equipmentButtonBG');
	var btnSelected = cache.getBitmapData('equipmentButtonSelected');

	for (var i = 0; i < equipmentPanelData.length; i++) {
		data = equipmentPanelData[i];
		rb = this[data.name] = this.panel.add(data.x, data.y, btnBG, btnSelected, data.name);
		rb.button.addChild(state.game.add.image(
			2, 2, cache.getBitmapData('equipment' + data.name)));
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
		console.log(slot.name + ' was selected');
		self.updateList(slot.name);
	}

	this.onInputOver = function() {
		var data = this.listener.item.item;
		var t = '';
console.log(data.type);
		switch (data.type) {
			//equipment
			case 'Helmet':
			case 'Armor':
			case 'Pants':
			case 'Shoes':
			case 'Gloves':
			case 'Ring':
			case 'Earing':
			case 'Weapon': 
			console.log('stats!');
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

	var buttonGFX = cache.getBitmapData('inventoryListButton');
	var itemList = this.itemList = group.addChild(new ScrollList(state, bg.width - buttonGFX.width, 
		40, 0, this.onItemSelect, buttonGFX, undefined, undefined, this.onInputOver));

	this.panel.onSelectedChangedAdd(this.onEquipmentSelected, rb);
}


