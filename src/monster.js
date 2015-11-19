var monsterData = [
    {name: 'Aerocephal',        image: 'aerocephal',        maxHealth: 100,	dmg: 2, dex: 5},
    {name: 'Arcana Drake',      image: 'arcana_drake',      maxHealth: 200,	dmg: 2, dex: 5},
    {name: 'Aurum Drakueli',    image: 'aurum-drakueli',    maxHealth: 300,	dmg: 2, dex: 5},
    {name: 'Bat',               image: 'bat',               maxHealth: 50,	dmg: 2, dex: 5},
    {name: 'Daemarbora',        image: 'daemarbora',        maxHealth: 100,	dmg: 2, dex: 5},
    {name: 'Deceleon',          image: 'deceleon',          maxHealth: 100,	dmg: 2, dex: 5},
    {name: 'Demonic Essence',   image: 'demonic_essence',   maxHealth: 150,	dmg: 2, dex: 5},
    {name: 'Dune Crawler',      image: 'dune_crawler',      maxHealth: 80,	dmg: 2, dex: 5},
    {name: 'Green Slime',       image: 'green_slime',       maxHealth: 30,	dmg: 2, dex: 5},
    {name: 'Nagaruda',          image: 'nagaruda',          maxHealth: 130,	dmg: 2, dex: 5},
    {name: 'Rat',               image: 'rat',               maxHealth: 20,	dmg: 2, dex: 5},
    {name: 'Scorpion',          image: 'scorpion',          maxHealth: 20,	dmg: 2, dex: 5},
    {name: 'Skeleton',          image: 'skeleton',          maxHealth: 60,	dmg: 2, dex: 5},
    {name: 'Snake',             image: 'snake',             maxHealth: 40,	dmg: 2, dex: 5},
    {name: 'Spider',            image: 'spider',            maxHealth: 40,	dmg: 2, dex: 5},
    {name: 'Stygian Lizard',    image: 'stygian_lizard',    maxHealth: 200,	dmg: 2, dex: 5}
];


/* BUILDERS */
function buildMonster(state){
	state.monsters = state.game.add.group();
	var monster;
	monsterData.forEach(function(data) {
	    // create a sprite for them off screen
	    monster = state.monsters.create(1000, state.game.world.centerY, data.image);
	    // center anchor
	    monster.anchor.setTo(0.5);
	    // reference to the database
	    monster.details = data;

	    monster.health = monster.maxHealth = data.maxHealth;

		monster.inputEnabled = true; //enable input so we can click it!
	    monster.events.onInputDown.add(state.onClickMonster, state);
	    monster.events.onKilled.add(state.onKilledMonster, state);
	    monster.events.onRevived.add(state.onRevivedMonster, state);
	});
		
}

function buildMonsterUI(state) {
	state.monsterInfoUI = state.game.add.group();
	state.monsterInfoUI.position.setTo(state.currentMonster.x - 220, state.currentMonster.y + 120);
	state.monsterNameText = state.monsterInfoUI.addChild(state.game.add.text(0,0, state.currentMonster.details.name, {
		font:'48px Arial Black',
		fill:'#fff',
		strokeThickness:4
	}));

	state.monsterHealthText = state.monsterInfoUI.addChild(state.game.add.text(0, 80, state.currentMonster.health + ' HP', {
		font: '32px Arial Black',
		fill: '#ff0000',
		strokeThickness: 4
	}));
}

/* methods */

function spawnRandomMonster(state) {
	state.currentMonster = state.monsters.getRandom();
	state.currentMonster.position.set(state.game.world.centerX + 100, state.game.world.centerY);
}