var dungeonList = [
	{	name:'World', sizePerZone: 5, zoneCount: -1,
		monster: [
			['Bat', []],
			['Rat', ['Metal']]
		]
	},
	{	name:'Noob Area', sizePerZone: 1, zoneCount: 1,
		monster: [
			['Bat', []],
			['Rat', ['Metal']]
		],
		completeReward: [
			'Oriharukon'
		]
	}
]

function buildDungeon(state) {
	var cache = state.game.cache;
	var bmd = cache.getBitmapData('dungeonPanel');
	var greenBTN = cache.getBitmapData('dungeonGreenButton');
	var dungeon = /*state.dungeon =*/ state.game.add.image(
		state.game.width - bmd.width - 5, 5, bmd);
	
	dungeon.close = new CloseMe(state, bmd.width - 8, 8, dungeon);

	//load player health bar
	var playerStats = dungeon.playerStats = dungeon.addChild(state.game.add.group());
	playerStats.position.setTo(10,5);
	buildDisplayStats(state, playerStats);

	//load enemy health bar
	var enemyStats = dungeon.enemyStats = dungeon.addChild(state.game.add.group());
	enemyStats.position.setTo(bmd.width - 150, 5);
	buildDisplayStats(state, enemyStats);



	//world progression UI
	dungeon.level = 1;
	var levelUI = dungeon.levelUI = dungeon.addChild(state.game.add.group());
	levelUI.position.setTo(10, 60);
	levelUI.levelText = levelUI.addChild(this.game.add.text(0,0,'Level: ' + dungeon.level, TextStyles.simple));

	dungeon.levelUI.escape = levelUI.addChild(state.game.add.button(0, 20, greenBTN, onDungeonEscape));
	var btnText = dungeon.levelUI.escape.addChild(state.game.add.text(greenBTN.width * 0.5,greenBTN.height * 0.5 + 2, 'Escape!', TextStyles.simpleCenter));
	btnText.anchor.set(0.5);

	/* methods */
	dungeon.newEnemy = function() {

		if (dungeon.map.zoneCleared()) {
			var monsters = dungeon.data.monster;
			var m = monsters[state.game.rnd.integerInRange(0, monsters.length - 1)];
			var md;
			monsterData.forEach(function(data) {
				if (data.name == m[0]) {
					md = data;
					return false;
				} else return true;
			});
			m = dungeon.enemy = { 
				name: m[0], 
				loot: m[1],
				maxHealth: md.maxHealth, //should probably have formula for
				health: md.maxHealth,	//higher level zones
				damage: md.dmg,
				dexterity: md.dex
			};

			var stats = dungeon.enemyStats;
			stats.name.text = m.name;
			stats.damage.text = m.damage;
			updateStats(stats, m);
		}
		
	}

	return dungeon;
}

function buildDisplayStats(state, group) {
	var cache = state.game.cache;
	
	group.name = group.addChild(state.game.add.text(2,0, 'Name', TextStyles.simple));
	group.damage = group.addChild(state.game.add.text(90,0, 'Name', TextStyles.simple));

	group.healthBG = group.addChild(state.game.add.image(0, 20, cache.getBitmapData('bigHPBarBG')));
	var fg = cache.getBitmapData('bigHPBarFG');
	group.healthFG = group.addChild(state.game.add.image(2, 22, fg));

	group.health = group.addChild(state.game.add.text(5,21, 'Health / max Health', TextStyles.simple));
}

function newDungeon(state) {
	var merc = state.dungeonSelector.selectedMerc;
	
	var dungeon = merc.activeDungeon = buildDungeon(state);
	dungeon.data = state.dungeonSelector.selectedDungeon;
	dungeon.merc = dungeon.levelUI.escape.merc = merc;
	dungeon.levelUI.escape.dungeon = dungeon;

	var stats = dungeon.playerStats;
	stats.name.text = merc.name;
	stats.damage.text = merc.damage;
	updateStats(stats, merc);

	dungeon.map = new Map(state, dungeon);
	state.displayedDungeon = dungeon;
}

function onDungeonEscape(button) {
	var dungeon = button.dungeon;
	button.merc.activeDungeon = undefined;

	dungeon.levelUI.escape.merc = undefined;
	dungeon.levelUI.escape.dungeon = undefined;

	dungeon.kill();
}


function updateStats(stats, unit) {
	stats.health.text = unit.health  + ' / ' + unit.maxHealth;
	var fg = stats.healthFG;

	fg.scale.x = unit.health / unit.maxHealth;
}