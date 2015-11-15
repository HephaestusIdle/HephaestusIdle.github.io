var game = new Phaser.Game(800, 600, Phaser.AUTO, '');

game.state.add('play', {
	preload: function() {
		var state = this;
		
		this.stage.disableVisibilityChange = true; //run in background
		buildImages(state);
		buildGraphics(state);
	},
	create: function() {
		
		var state = this;
		var cache = state.game.cache;

		//game loop
		this.onUpdateTimer = this.game.time.events.loop(1000, this.onUpdate, this);
		
		//load background
		this.background = this.game.add.group();
		//setup each of our background layers to take the full screen
		['forest-back', 'forest-lights', 'forest-middle', 'forest-front']
			.forEach(function(image){
				var bg = state.game.add.tileSprite(0,0, state.game.world.width,
				state.game.world.height, image, '', state.background);
				bg.tileScale.setTo(4,4);
			});
		this.dungeonGround = this.game.add.group();
		this.foreGround = this.game.add.group();

		//buildDungeon(state);
		buildDungeonSelector(state);

		//load enemies
		//buildMonster(state);
		//spawnRandomMonster(state);
		//buildMonsterUI(state);
		//buildEquipment(state);
		
		

		//load player
		this.player = new Player(state);

		//text asset pool
		this.dmgTextPool = this.add.group();
		var dmgText;
		for (var d=0; d<50; d++) {
			dmgText = this.add.text(0, 0, '1', {
				font:'64px Arial Black',
				fill:'#fff',
				strokeThickness:4
			})
		
			//start out not existing, so we don't draw it yet
			dmgText.exists = false;
			dmgText.tween = game.add.tween(dmgText).to({
				alpha:0,
				y:100,
				x: this.game.rnd.integerInRange(100, 700)
			}, 1000, Phaser.Easing.Cubic.Out);

			dmgText.tween.onComplete.add(function(text, tween) {
				text.kill();
			});
			this.dmgTextPool.add(dmgText);
		}

		//UI
		buildMercenaryList(state);

		this.playerGoldText = this.add.text(30,30, 'Gold: '+ this.player.gold, {
			font:'24px Arial Black', fill:'#fff', strokeThickness:4
		});
		
		this.crafting = new Crafting(this, 
			cache.getBitmapData('craftingPanel').width * -1 + 25, 25);
		
		var gfx = cache.getBitmapData('inventoryUI');
		this.inventoryUI = this.player.inventoryUI(
			gfx.width * -1 + 25, 45,  gfx);

	},
	onUpdate:function(){
		var mercs = this.myMercs;
		var merc, enemy, dungeon;
		//check each merc for a running dungeon
		for (var i = 0; i < mercs.length; i++) {
			merc = mercs[i];
			if (merc.activeDungeon) { //dungeon is running
				if (merc.rest == 1) {
					merc.health += merc.maxHealth * 0.1;
					updateStats(merc.activeDungeon.playerStats, merc);
					if (merc.health >= merc.maxHealth) {
						merc.health = merc.maxHealth;
						merc.rest = 0;
					}
				} else {
					dungeon = merc.activeDungeon;
					enemy = dungeon.enemy
					if (typeof enemy === 'undefined' || enemy.health <= 0) {
						//no enemies, spawn one
						dungeon.newEnemy();
					} else {
						enemy = dungeon.enemy;
						//do battle
						enemy.health -= merc.damage;
						
						if (enemy.health <= 0) {
							enemy.health = 0;
							this.award(enemy.loot);
						} else { //if enemy still alive, damage the player
							merc.health -= enemy.damage;
							if (merc.health <= 0) {
								merc.health = 0;
								merc.rest = 1;
							}
							updateStats(dungeon.playerStats, merc);	
						}
						updateStats(dungeon.enemyStats, enemy);
					}
				}
			}
		};
	},
	onEquipmentClick:function(button, pointer) {
		console.log(button.merc.details.name + ' was equipment request! Not yet implemented. ' + pointer.name);
	}, 
	onSendToDungeonClick:function(button) {
		var selector = this.dungeonSelector;
		var merc = selector.selectedMerc = button.merc.details;
		var btn = selector.sendToButton;
		btn.avatar = merc.avatar; //not actually changing the avatar
		//btn.text.text = 'Send ' + merc.name + '\nTo ???';
		onDungeonSelect(selector.baseDungeon);
		selector.visible = true;
		this.hireMercList.visible = false;
	},
	award:function(lootTable) {
		if (lootTable != undefined && lootTable.length != 0) {
			var loot = lootTable[Math.floor(Math.random() * lootTable.length)];
			this.player.addLoot(loot);
		} else {
			this.player.addGold(1);
			this.playerGoldText.text = 'Gold: ' + this.player.gold;
		}

	}
});

game.state.start('play');