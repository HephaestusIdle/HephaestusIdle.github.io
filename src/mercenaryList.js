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
	var upgradePanel = state.upgradePanel = state.foreGround.addChild(state.game.add.image(
		-225, 5, cache.getBitmapData('upgradePanel')));
	
	var mercs = state.ownedMercs = upgradePanel.addChild(state.game.add.group());
	state.myMercs = [];

	/*mercsData.forEach(function(mercData, index) {
		addMercToList(state, mercs, mercData, index);
	});*/
	
	/* Hire button */
	gfx = cache.getBitmapData('hireMercButton');
	var hireMercButton = Button(state, 8, 8, gfx, 'Hire Mercenary', 
		TextStyles.simpleCenter, hireListToggle);
	upgradePanel.addChild(hireMercButton);
	upgradePanel.hireMercButton = hireMercButton;

	mercs.position.setTo(8, 12 + gfx.height);
	
	/* show me button */
	gfx = cache.getBitmapData('upgradePanelButton');
	var upgradePanelButton = upgradePanel.addChild(SlideInOutButton(
		state, upgradePanel.width - gfx.width * 0.3, 0, gfx , 'Mercenary', 
		TextStyles.simpleCenter, upgradePanel, {x: upgradePanel.position.x}, {x: -18}));
	upgradePanelButton.events.onInputDown.add(function() {
		if (this.hireMercButton.list.visible) {
			this.hireMercButton.list.visible = false;
		}
	}, {hireMercButton});

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
	var mercGroup = mercs.addChild(state.game.add.group());
	mercGroup.position.setTo(0, (bg.height + 2) * index);
	mercGroup.bg = mercGroup.addChild(state.game.add.image(0, 0, bg));
	/* DATA */
	mercGroup.avatar = mercGroup.addChild(state.game.add.image(4, 4, mercData.avatar));
	mercGroup.name = mercGroup.addChild(state.game.add.text(leftMost, 4, mercData.name, TextStyles.simple16));
	mercGroup.details = mercData;
	mercGroup.stats = mercGroup.addChild(state.game.add.text(leftMost, 22, 
		'Damage: ' + mercData.damage + '\nHealth: ' + mercData.maxHealth, TextStyles.simple12));
	//merc.events.onInputDown.add(state.onmercClick, state);

	/* SKILLS */
	/*skillUI = mercGroup.skillUI = mercGroup.addChild(state.game.add.group());
	skillUI.position.setTo(4, 38);*/

	/* Equipment */
	mercGroup.equipBTN = mercGroup.addChild(state.game.add.button(207, 38, cache.getBitmapData('mercEquipmentButton')));
	mercGroup.equipBTN.merc = mercGroup;
	mercGroup.equipBTN.events.onInputDown.add(state.onEquipmentClick, state)

	/* Send To Dungeon */
	mercGroup.sendToDungeonBTN = mercGroup.addChild(state.game.add.button(207, 18, cache.getBitmapData('mercSendToDungeonButton')));
	mercGroup.sendToDungeonBTN.merc = mercGroup;
	mercGroup.sendToDungeonBTN.events.onInputDown.add(state.onSendToDungeonClick, state);
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
			console.log('hireListToggle');
			console.log(mercDetail);
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
	
	/*if (typeof state.mercDetailPool !== 'undefined') {
		var merc;
		for (i = 0; i < state.mercDetailPool.length; i++){
			merc = state.mercDetailPool[i];
			if (!merc.visible) {
				state.mercDetailPool = state.mercDetailPool.splice(i, 1);
				return merc;
			}
		}
	}*/
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
	console.log('CLEAR');
	console.log(button.detail);
	button.details = undefined;

button.kill();
	/*var pool = button.state.mercDetailPool;
	if (typeof pool === 'undefined') {
		button.state.mercDetailPool = [detail];
	} else {
		pool.push(detail);
	}*/

	
}