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
function onSlide(state, showing) {
	if (state.upgradePanel.hireMercButton.list.visible) {
		state.upgradePanel.hireMercButton.list.visible = false;
	}
	if (showing) {
		//force hide other windows
		state.player.hide(state);
		state.crafting.hide(state);
		//display stuff
	} else {
		//hide stuff
	}
}

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
	upgradePanelButton.onSlideCallback = onSlide;
	upgradePanelButton.hireMercButton = hireMercButton;
	upgradePanelButton.panel = upgradePanel;

	/* hire merc List */
	gfx = cache.getBitmapData('hireMercListPanel');
	var hireMercList = state.hireMercList = state.game.add.image(state.game.width - gfx.width - 10, 20, gfx);
	hireMercList.visible = false;
	hireMercList.displayList = [];
	hireMercButton.list = hireMercList;
	hireMercButton.state = state;
	hireMercList.title = hireMercList.addChild(state.game.add.text(gfx.width * 0.5, 25, 'Hire Mercenary', TextStyles.title));
	hireMercList.title.anchor.set(0.5);

	hireMercList.close = new CloseMe(state, gfx.width - 8, 8, hireMercList);

	upgradePanel.hide = function() {
		upgradePanelButton.slideOut();
	}
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
		'', TextStyles.simple12));
	//merc.events.onInputDown.add(state.onmercClick, state);

	/* SKILLS */
	/*skillUI = mercGroup.skillUI = mercGroup.addChild(state.game.add.group());
	skillUI.position.setTo(4, 38);*/
	mercGroup.details.ui = mercGroup;
	/* Equipment */
	mercGroup.equipBTN = mercGroup.addChild(state.game.add.button(
		207, 38, cache.getBitmapData('mercEquipmentButton')));
	mercGroup.equipBTN.addChild(state.game.add.image(
		-1,3,'helmetIcon16')).angle = -15;
	mercGroup.equipBTN.merc = mercGroup;
	mercGroup.equipBTN.events.onInputDown.add(state.onEquipmentClick, state)

	/* Send To Dungeon */
	mercGroup.sendToDungeonBTN = mercGroup.addChild(state.game.add.button(
		207, 18, cache.getBitmapData('mercSendToDungeonButton')));
	mercGroup.sendToDungeonBTN.addChild(state.game.add.image(
		-1,3,'gunIcon16')).angle = -15;
	mercGroup.sendToDungeonBTN.merc = mercGroup;
	mercGroup.sendToDungeonBTN.events.onInputDown.add(state.onSendToDungeonClick, state);


	mercGroup.update = function() {
		this.stats.text = 'Damage: ' + mercData.damage + '\nHealth: ' + mercData.maxHealth;
	}

	mercGroup.update();
}

/* hire merc methods */
function hireListToggle(button) {
	var list = button.list;
	if (!list.visible) {
		var state = button.state;
		state.equipment.group.visible = false;
		state.dungeonSelector.visible = false;
		if (state.displayedDungeon != undefined) {
			state.displayedDungeon.visible = false;
			state.displayedDungeon = undefined;
		}
		var count = list.displayList.length;
		if (count != 6 || typeof button.lastUpdate === 'undefined' || Date.now() - button.lastUpdate > 60000) {
			button.lastUpdate = Date.now();
			for (var i = 6 - 1; i >= 0; i--) {
				var mercDetail = getMercDetailFromPool(state, list);
				
				mercDetail.position.setTo((Math.ceil((i+1)/2)-1) * (15 + mercDetail.width) + 30,
					(i % 2)?60:200);
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
				mercDetail.strength.text = merc.strength;
				mercDetail.dexterity.text = merc.dexterity;
				mercDetail.intelligence.text = merc.intelligence;

				console.warn('missing avatar swap.');

				updatePrice(mercDetail.hireBTN);
			}
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
	detail = list.addChild(state.game.add.image(0, 0, mercDetailPanel));
	detail.list = list;
	detail.avatar = detail.addChild(state.game.add.image(4, 4, cache.getBitmapData('hireMercAvatar')));

	detail.name = detail.addChild(state.game.add.text(78,18,'name', TextStyles.hireMercName));
	detail.name.anchor.set(0.5);
	detail.vitalityText = detail.addChild(state.game.add.text(4,36,'Vitality:', TextStyles.simple));
	detail.strengthText = detail.addChild(state.game.add.text(4,53,'Strength:', TextStyles.simple));
	detail.dexterityText = detail.addChild(state.game.add.text(4,70,'Dexterity:', TextStyles.simple));
	detail.intelligenceText = detail.addChild(state.game.add.text(4,87,'Intelligence:', TextStyles.simple));

	var right = mercDetailPanel.width - 2;
	detail.vitality = detail.addChild(state.game.add.text(right, 36,'xx', TextStyles.simpleRight));
	detail.strength = detail.addChild(state.game.add.text(right, 53,'xx', TextStyles.simpleRight));
	detail.dexterity = detail.addChild(state.game.add.text(right, 70,'xx', TextStyles.simpleRight));
	detail.intelligence = detail.addChild(state.game.add.text(right, 87,'xx', TextStyles.simpleRight));

	detail.vitality.anchor.x = 1;
	detail.strength.anchor.x = 1;
	detail.dexterity.anchor.x = 1;
	detail.intelligence.anchor.x = 1;

	var gfx = cache.getBitmapData('hireMercDetailButton');
	detail.hireBTN = detail.addChild(state.game.add.button(5, 104, 
		gfx, performHire));
	
	

	detail.hireBTN.text = detail.hireBTN.addChild(state.game.add.text(gfx.width * 0.5, gfx.height * 0.65,
		'', TextStyles.simpleCenter));
	detail.hireBTN.text.anchor.set(0.5);
	detail.hireBTN.detail = detail;
	detail.hireBTN.state = state;
	
	return detail;
}

function calculateHiringCost(state, merc) {
	var m = merc.baseVitality + merc.baseStrength + merc.baseDexterity + merc.baseIntelligence;
	return Math.floor(10 * Math.pow(m * 0.18, state.myMercs.length));
}

function updatePrice(button) {
	var buyCost = calculateHiringCost(button.state, button.detail.merc);
	var btn = button.detail.hireBTN;
	btn.cost = buyCost;
	btn.text.text = 'Hire me! $' + buyCost;
}

function performHire(button) {
	var state = button.state;
	if (state.player.gold < button.cost){
		state.showError('Not enough gold!');
		return;
	}
	state.player.addGold(-button.cost);
	var detail = button.detail;

	addMercToList(button.state, button.state.ownedMercs, detail.merc, button.state.ownedMercs.length);
	
	button.state.messageBox.add(detail.merc.name + ' hired!');

	detail.visible = false;
	var list = detail.list;
	list.displayList.splice(list.displayList.indexOf(detail), 1);
	button.details = undefined;

	button.kill();

	var l = button.detail.list.displayList;
	for (var i = l.length - 1; i >= 0; i--) {
		updatePrice(l[i].hireBTN);
	};



	/*var pool = button.state.mercDetailPool;
	if (typeof pool === 'undefined') {
		button.state.mercDetailPool = [detail];
	} else {
		pool.push(detail);
	}*/

	
}