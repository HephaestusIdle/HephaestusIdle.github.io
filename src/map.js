var Map = function(state, dungeon) {
	console.log('Creating map.');
	var cache = state.game.cache;
	var m = dungeon.addChild(state.game.add.group());
	m.position.setTo(80, 70);


	m.state = state;
	m.dungeon = dungeon;
	m.sizePerLevel = dungeon.data.sizePerZone;
	m.monsterList = dungeon.data.monster;
	m.currentZone = 0;

	var zbg = cache.getBitmapData('mapZone');
	var zones = m.zones = [];
	var z, i, j;
	var column = 8;//364 / (zbg.width + 4);
	var rows = m.sizePerLevel / column;

loop1:
	for (i = 0; i < rows; i++) {
		for (j = 0; j < column; j++) {
			z = m.addChild(state.game.add.image(j * (zbg.width + 3), i * (zbg.height + 4), zbg));
			
			//add special zone stuff here


			zones.push(z);
			if (zones.length == m.sizePerLevel) {
				break loop1;
			}
		};
	};


	/* methods */
	m.zoneCleared = function() {
		if (m.currentZone == 0)	{
			++m.currentZone;
			return true;
		} else if (m.currentZone == -2) {
			//flush map
			++m.dungeon.level;
			m.dungeon.levelUI.levelText.text = 'Level: ' + m.dungeon.level;
			m.currentZone = 1;
			for (var i = 0; i < m.zones.length; i++) {
				z = m.zones[i];
				z.paint.kill();
				z.paint = undefined;
			};
			return true;
		}
		//paint the zone, indicating cleared
		z = m.zones[m.currentZone - 1];
		z.paint = z.addChild(state.game.add.image(0, 0, cache.getBitmapData('mapZoneCleared')));


		//go to next zone
		if (++m.currentZone > m.sizePerLevel) {
			//exceeds zones per map, go to next map
			z = m.dungeon.data.zoneCount;
			if (z == -1 || z > m.dungeon.level) {
				//prepare for map flush
				m.currentZone = -2;
			} else {	//dungeon completed!
				//give reward
				state.award(m.dungeon.data.completeReward, m.dungeon.merc);
				//reset dungeon
				m.dungeon.level = 0;
				m.currentZone = -2;
			}
			return false;
		}
		return true;
	}

	return m;
}


dodgeTest = function(att, def) {
	var accurate = att * 0.1;
	var evasion = def * 0.035;
	var chance = ((accurate - evasion)/accurate)*100;
	if(chance < 0)
	     return miss;
	else if(random(100) > chance)
	     return miss;
	else
	     return hit;
}