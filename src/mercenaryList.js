/*var mercsData = [
    {icon: 'dagger', name: 'Attack', level: 1, cost: 5, 
    skill: [0, 0, 0, 0], type: 'Click', purchaseHandler: function(button, player) {
        player.clickDmg += 1;
    }},
    {icon: 'swordIcon1', name: 'Auto-Attack', level: 0, cost: 25, 
    skill: [0, 0],  type: 'DPS', purchaseHandler: function(button, player) {
        player.dps += 5;
    }}
];*/

function buildMercenaryList(state) {

	var cache = state.game.cache;
	var gfx;

	state.upgradePanel = state.game.add.image(-225, 5, cache.getBitmapData('upgradePanel'));
	
	var mercs = state.ownedMercs = state.upgradePanel.addChild(state.game.add.group());
	state.myMercs = [];

	/*mercsData.forEach(function(mercData, index) {
		addMercToList(state, mercs, mercData, index);
	});*/
	
	/* Hire button */
	gfx = cache.getBitmapData('hireMercButton');
	var hireMercButton = state.game.add.button(8, 8, gfx, hireListToggle);
	hireMercButton.text = hireMercButton.addChild(
		state.game.add.text(gfx.width * 0.5, gfx.height *0.55, 
		'Hire Mercenary', TextStyles.simpleCenter));
	hireMercButton.text.anchor.set(0.5);
	state.upgradePanel.addChild(hireMercButton);
	state.upgradePanel.hireMercButton = hireMercButton;

	mercs.position.setTo(8, 12 + gfx.height);
	
	/* show me button */
	gfx = cache.getBitmapData('upgradePanelButton');
	var upgradePanelButton = state.game.add.button(state.upgradePanel.width - gfx.width * 0.5, 
		state.upgradePanel.height * 0.5 - gfx.height * 0.5, 
		gfx, showMercenaryListMenu);
	state.upgradePanel.addChild(upgradePanelButton);
	upgradePanelButton.group = state.upgradePanel;


	/* hire merc List */
	gfx = cache.getBitmapData('hireMercListPanel');
	var hireMercList = state.hireMercList = state.game.add.image(state.game.width - gfx.width - 10, 20, gfx);
	hireMercList.visible = false;
	hireMercList.displayList = [];
	hireMercButton.list = hireMercList;
	hireMercButton.state = state;
	hireMercList.title = hireMercList.addChild(state.game.add.text(gfx.width * 0.5, 25, 'Hire Mercenary', TextStyles.title));
	hireMercList.title.anchor.set(0.5);

}

function addMercToList(state, mercs, mercData, index) {
	state.myMercs.push(mercData);

	var cache = state.game.cache;
	var bg = cache.getBitmapData('mercBackground');
	var skillBTN = cache.getBitmapData('mercSkillButton');
	var skillUI, btn;
	var leftMost = 38;
	/* BASE */
	merc = mercs.addChild(state.game.add.group());
	merc.position.setTo(0, (bg.height + 2) * index);
	merc.bg = merc.addChild(state.game.add.image(0, 0, bg));
	/* DATA */
	merc.avatar = merc.addChild(state.game.add.image(4, 4, mercData.avatar));
	merc.name = merc.addChild(state.game.add.text(leftMost, 4, mercData.name, TextStyles.simple16));
	merc.details = mercData;
	merc.stats = merc.addChild(state.game.add.text(leftMost, 22, 
		'Damage: ' + mercData.damage + '\nHealth: ' + mercData.maxHealth, TextStyles.simple12));
	//merc.events.onInputDown.add(state.onmercClick, state);

	/* SKILLS */
	skillUI = merc.skillUI = merc.addChild(state.game.add.group());
	skillUI.position.setTo(4, 38);

	/* Equipment */
	merc.equipBTN = merc.addChild(state.game.add.button(207, 38, cache.getBitmapData('mercEquipmentButton')));
	merc.equipBTN.merc = merc;
	merc.equipBTN.events.onInputDown.add(state.onEquipmentClick, state)

	/* Send To Dungeon */
	merc.sendToDungeonBTN = merc.addChild(state.game.add.button(207, 18, cache.getBitmapData('mercSendToDungeonButton')));
	merc.sendToDungeonBTN.merc = merc;
	merc.sendToDungeonBTN.events.onInputDown.add(state.onSendToDungeonClick, state)
}

function showMercenaryListMenu(button) {
	if (button.showing) {
		this.game.add.tween(button.group).to({x:-225}, 2000, Phaser.Easing.Back.Out, true);
	} else {
		this.game.add.tween(button.group).to({x:-18}, 2000, Phaser.Easing.Back.Out, true);
	}
	button.showing = !button.showing;
}


/* hire merc methods */
function hireListToggle(button) {
	var list = button.list;
	if (!list.visible) {
		var state = button.state;
		if (list.displayList.length == 0 || typeof button.lastUpdate === 'undefined' || Date.now() - button.lastUpdate > 60000) {
			button.lastUpdate = Date.now();
			var mercDetail = getMercDetailFromPool(state, list);
			var merc;
			if (typeof mercDetail.merc === 'undefined') {
				merc = mercenaryCreate(button.state);
				mercDetail.merc = merc;
			} else {
				merc = mercenaryFlushStats(button.state, mercDetail.merc);
				mercDetail.visible = true;
			}
			
			list.displayList.push(mercDetail);

			mercDetail.name.text = merc.name;
			mercDetail.vitality.text = merc.vitality;
			mercDetail.strenght.text = merc.strenght;
			mercDetail.dexterity.text = merc.dexterity;
			mercDetail.intelligence.text = merc.intelligence;

			console.warn('missing avatar swap.');
			
		}
	}
	list.visible = !list.visible;
}

function getMercDetailFromPool(state, list) {
	
	if (typeof state.mercDetailPool !== 'undefined') {
		var merc;
		for (i = 0; i < state.mercDetailPool.length; i++){
			merc = state.mercDetailPool[i];
			if (!merc.visible) {
				state.mercDetailPool = state.mercDetailPool.splice(i, 1);
				return merc;
			}
		}
	}
	// No available mercs in pool, creating new one

	var cache = state.game.cache;
	var mercDetailPanel = cache.getBitmapData('hireMercDetailPanel');
	detail = list.addChild(state.game.add.image(15, 60, mercDetailPanel));
	detail.list = list;
	detail.avatar = detail.addChild(state.game.add.image(4, 4, cache.getBitmapData('hireMercAvatar')));

	detail.name = detail.addChild(state.game.add.text(78,18,'name', TextStyles.hireMercName));
	detail.name.anchor.set(0.5);
	detail.vitalityText = detail.addChild(state.game.add.text(4,36,'Vitality:', TextStyles.simple));
	detail.strenghtText = detail.addChild(state.game.add.text(4,53,'Strenght:', TextStyles.simple));
	detail.dexterityText = detail.addChild(state.game.add.text(4,70,'Dexterity:', TextStyles.simple));
	detail.intelligenceText = detail.addChild(state.game.add.text(4,87,'Intelligence:', TextStyles.simple));

	var right = mercDetailPanel.width - 2;
	detail.vitality = detail.addChild(state.game.add.text(right, 36,'xx', TextStyles.simpleRight));
	detail.strenght = detail.addChild(state.game.add.text(right, 53,'xx', TextStyles.simpleRight));
	detail.dexterity = detail.addChild(state.game.add.text(right, 70,'xx', TextStyles.simpleRight));
	detail.intelligence = detail.addChild(state.game.add.text(right, 87,'xx', TextStyles.simpleRight));

	detail.vitality.anchor.x = 1;
	detail.strenght.anchor.x = 1;
	detail.dexterity.anchor.x = 1;
	detail.intelligence.anchor.x = 1;

	var gfx = cache.getBitmapData('hireMercDetailButton');
	detail.hireBTN = detail.addChild(state.game.add.button(5, 104, 
		gfx, performHire));
	
	detail.hireBTN.text = detail.hireBTN.addChild(state.game.add.text(gfx.width * 0.5, gfx.height * 0.65,
		'Hire Me!!!', TextStyles.simpleCenter));
	detail.hireBTN.text.anchor.set(0.5);
	detail.hireBTN.detail = detail;
	detail.hireBTN.state = state;
	
	return detail;
}

function performHire(button) {
	
	var detail = button.detail;
	
	console.log('attempting to hire ' + detail.merc.name + ' Price not yet implemented');

	addMercToList(button.state, button.state.ownedMercs, detail.merc, button.state.ownedMercs.length);
	detail.visible = false;
	var list = detail.list;
	list.displayList.splice(list.displayList.indexOf(detail), 1);
	
	var pool = button.state.mercDetailPool;
	if (typeof pool === 'undefined') {
		button.state.mercDetailPool = [detail];
	} else {
		pool.push(detail);
	}

	
}