/* monster template
	{name: '',		maxHealth: ,	dmg: , dex: },
*/

var monsterData = [
    {name: 'Sleazy Hacker',			maxHealth: 20,	dmg: 5, dex: 2},
    {name: 'Sloppy Racketeer',		maxHealth: 25,	dmg: 3, dex: 8},
    {name: 'Counterfeiter',			maxHealth: 20,	dmg: 8, dex: 5},
    {name: 'Hi-tech Robber',		maxHealth: 50,	dmg: 2, dex: 1},
    {name: 'Android Husk',			maxHealth: 600,	dmg: 100, dex: 80},
    {name: 'Mech',					maxHealth: 400,	dmg: 300, dex: 20},
    {name: 'Cyborg',				maxHealth: 1200,	dmg: 200, dex: 160},
    {name: 'Combat Engineer',		maxHealth: 6000,	dmg: 800, dex: 600},
    {name: 'Mob',					maxHealth: 6000,	dmg: 800, dex: 600},
    {name: 'Nanoborg',				maxHealth: 100000,	dmg: 9001, dex: 3000},
    {name: 'Rick Deckard',			maxHealth: 100000,	dmg: 9001, dex: 3000},
    {name: 'Al Mechapone',				maxHealth: 100000,	dmg: 9001, dex: 3000},
    {name: 'Future Cop',				maxHealth: 100000,	dmg: 9001, dex: 3000},
    {name: 'Spec Ops Soldier',				maxHealth: 100000,	dmg: 9001, dex: 3000},
    {name: 'Spec Ops Shifter',				maxHealth: 100000,	dmg: 9001, dex: 3000},
    {name: 'Tron',					maxHealth: 100000,	dmg: 9001, dex: 3000}


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