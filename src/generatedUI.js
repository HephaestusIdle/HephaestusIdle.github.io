rectUIData = [
	/* mercenaryList.js */
	{	name: 'upgradePanel', width: 250, height:500,
		fillStyle: '#9a783d', strokeStyle: '#35371c', lineWidth: 12,
		fillRect: [0, 0, 250, 500], strokeRect: [0, 0, 250, 500]
	},
	{	name: 'upgradePanelButton', width: 20, height:64,
		fillStyle: '#CC00CC', strokeStyle: '#666699', lineWidth: 10,
		fillRect: [0, 0, 20, 64], strokeRect: [0, 0, 20, 64]
	},
	{	name: 'mercBackground', width: 230, height:60,
		fillStyle: '#e6dec7', strokeStyle: '#35371c', lineWidth: 4,
		fillRect: [0, 0, 230, 60], strokeRect: [0, 0, 230, 60]
	},
	{	name: 'mercSkillButton', width: 16, height:16,
		fillStyle: '#58C8ED', strokeStyle: '#416470', lineWidth: 2,
		fillRect: [0, 0, 16, 16], strokeRect: [0, 0, 16, 16]
	},
	{	name: 'mercSkillBackground', width: 200, height:18,
		fillStyle: '#D0A9DB', strokeStyle: '#413245', lineWidth: 2,
		fillRect: [0, 0, 200, 18], strokeRect: [0, 0, 200, 18]
	},
	{	name: 'mercEquipmentButton', width: 18, height:18,
		fillStyle: '#D0A9DB', strokeStyle: '#413245', lineWidth: 2,
		fillRect: [0, 0, 18, 18], strokeRect: [0, 0, 18, 18]
	},
	{	name: 'mercSendToDungeonButton', width: 18, height:18,
		fillStyle: '#D0A9DB', strokeStyle: '#413245', lineWidth: 2,
		fillRect: [0, 0, 18, 18], strokeRect: [0, 0, 18, 18]
	},
	{	name: 'hireMercButton', width: 230, height:30,
		fillStyle: '#8b7d7b', strokeStyle: '#2d2d2d', lineWidth: 8,
		fillRect: [0, 0, 230, 30], strokeRect: [-1, -1, 230, 30]
	},
	{	name: 'hireMercListPanel', width: 450, height:450,
		fillStyle: '#9a783d', strokeStyle: '#35371c', lineWidth: 12,
		fillRect: [0, 0, 450, 450], strokeRect: [0, 0, 450, 450]
	},
	/* hire merc detailed*/
	{	name: 'hireMercDetailPanel', width: 120, height:132,
		fillStyle: '#8b7d7b', strokeStyle: '#383a3f', lineWidth: 8,
		fillRect: [0, 0, 120, 132], strokeRect: [0, 0, 120, 132]
	},
	{	name: 'hireMercAvatar', width: 32, height:32,
		fillStyle: '#7704f3', strokeStyle: '#00688b', lineWidth: 8,
		fillRect: [0, 0, 32, 32], strokeRect: [0, 0, 32, 32]
	},
	{	name: 'hireMercDetailButton', width: 110, height:22,
		fillStyle: '#D0A9DB', strokeStyle: '#413245', lineWidth: 2,
		fillRect: [0, 0, 110, 22], strokeRect: [0, 0, 110, 22]
	},
	/* dungeon.js */
	{	name: 'dungeonPanel', width: 500, height:500,
		fillStyle: '#9a783d', strokeStyle: '#35371c', lineWidth: 12,
		fillRect: [0, 0, 500, 500], strokeRect: [0, 0, 500, 500]
	}, 
	{	name: 'bigHPBarBG', width: 140, height:20,
		fillStyle: '#fff', strokeStyle: '#000', lineWidth: 4,
		fillRect: [0, 0, 140, 20], strokeRect: [0, 0, 140, 20]
	}, 
	{	name: 'bigHPBarFG', width: 136, height:16,
		fillStyle: '#00f', strokeStyle: '#00f', lineWidth: 0,
		fillRect: [0, 0, 136, 16], strokeRect: [0, 0, 136, 16]
	},
	{	name: 'dungeonGreenButton', width: 60, height:20,
		fillStyle: '#458b00', strokeStyle: '#000', lineWidth: 2,
		fillRect: [0, 0, 60, 20], strokeRect: [0, 0, 60, 20]
	},
	/* dungeonSelector.js */
	{	name: 'dungeonSelectorPanel', width: 300, height:400,
		fillStyle: '#9a783d', strokeStyle: '#35371c', lineWidth: 12,
		fillRect: [0, 0, 300, 400], strokeRect: [0, 0, 300, 400]
	},
	{	name: 'sendToDungeon', width: 220, height:38,
		fillStyle: '#8b7d7b', strokeStyle: '#383a3f', lineWidth: 8,
		fillRect: [0, 0, 220, 38], strokeRect: [0, 0, 220, 38]
	},
	/* map.js */
	{	name: 'mapZone', width: 48, height:32,
		fillStyle: '#8b7d7b', strokeStyle: '#0d253d', lineWidth: 4,
		fillRect: [0, 0, 48, 32], strokeRect: [0, 0, 48, 32]
	},
	{	name: 'mapZoneCleared', width: 48, height:32,
		fillStyle: '#4c704c', strokeStyle: '#fff', lineWidth: 4,
		fillRect: [2, 2, 44, 28], strokeRect: [0, 0, 0, 0]
	}
];

function buildGraphics(state) {
	var ui;
	rectUIData.forEach(function(rect) {
		ui = state.game.add.bitmapData(rect.width, rect.height);
		ui.ctx.fillStyle = rect.fillStyle;
	    ui.ctx.strokeStyle = rect.strokeStyle;
	    ui.ctx.lineWidth = rect.lineWidth;
		ui.ctx.fillRect(rect.fillRect[0],rect.fillRect[1],rect.fillRect[2],rect.fillRect[3]);
		ui.ctx.strokeRect(rect.strokeRect[0],rect.strokeRect[1],rect.strokeRect[2],rect.strokeRect[3]);
		
		state.game.cache.addBitmapData(rect.name, ui);
	});
}