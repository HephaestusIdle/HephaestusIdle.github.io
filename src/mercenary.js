function mercenaryCreate(state, name, vitality, strenght, dexterity, intelligence) {
	var merc = {};
	if (typeof name === 'undefined') {
		mercenaryFlushStats(state, merc);
	} else {
		merc.name = name;
		merc.vitality = vitality;
		merc.strenght = strenght;
		merc.dexterity = dexterity;
		merc.intelligence = intelligence;

		mercenaryCalculate(merc);
	}
	return merc;
}

function mercenaryFlushStats(state, merc) {
	merc.name = chance.first();

	merc.vitality = 10;
	merc.strenght = 50;
	merc.dexterity = 10;
	merc.intelligence = 10;
	merc.avatar = state.game.cache.getBitmapData('hireMercAvatar');

	mercenaryCalculate(merc);
	return merc;
}

function mercenaryCalculate(merc) {
	merc.health = merc.maxHealth = merc.vitality;

	merc.damage = merc.strenght;
	console.warn('not yet implemented.' + merc.health + '_' + merc.vitality);

}