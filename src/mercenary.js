function mercenaryCreate(state, name, vitality, strenght, dexterity, intelligence) {
	var merc = {};
	if (typeof name === 'undefined') {
		mercenaryFlushStats(state, merc);
	} else {
		merc.name = name;
		merc.baseVitality = merc.vitality = vitality;
		merc.baseStrength = merc.strenght = strenght;
		merc.baseDexterity = merc.dexterity = dexterity;
		merc.baseIntelligence = merc.intelligence = intelligence;

		state.player.updateStats(merc);
	}
	return merc;
}

var diceAmount = 4;
var diceSize = 6;
var diceTop = 3;

function mercenaryFlushStats(state, merc) {
	merc.name = chance.first();
	
	merc.health = merc.maxHealth = 1;
	merc.equipped = {};
	
	merc.baseVitality = merc.vitality = sumTopX(xdy(diceAmount, diceSize), diceTop);
	merc.baseStrength = merc.strenght = sumTopX(xdy(diceAmount, diceSize), diceTop);
	merc.baseDexterity = merc.dexterity = sumTopX(xdy(diceAmount, diceSize), diceTop);
	merc.baseIntelligence = merc.intelligence = sumTopX(xdy(diceAmount, diceSize), diceTop);
	merc.avatar = state.game.cache.getBitmapData('hireMercAvatar');

	state.player.updateStats(merc);
	return merc;
}

function xdy(amount, size) {
	var d = [];
	for (var i = amount - 1; i >= 0; i--) {
		d.push(Math.floor(Math.random() * size) + 1);
	}
	return d;
}

function sumTopX(dice, x){
	dice.sortNormal();
	var m = 0;
	for (var i = x - 1; i >= 0; i--) {
		m += dice[i];
	}
	return m;
}