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

function mercenaryFlushStats(state, merc) {
	merc.name = chance.first();
	
	merc.health = merc.maxHealth = 1;
	merc.equipped = {};

	merc.baseVitality = merc.vitality = 10;
	merc.baseStrength = merc.strenght = 50;
	merc.baseDexterity = merc.dexterity = 10;
	merc.baseIntelligence = merc.intelligence = 10;
	merc.avatar = state.game.cache.getBitmapData('hireMercAvatar');

	state.player.updateStats(merc);
	return merc;
}