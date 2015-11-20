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
		var gfx;

		//game loop
		this.onUpdateTimer = this.game.time.events.loop(1000, this.onUpdate, this);
		
		//load background
		this.background = this.game.add.image(0,0, 'background');
		//setup each of our background layers to take the full screen
		/*['background']
			.forEach(function(image){
				var bg = state.game.add.tileSprite(0,0, state.game.world.width,
				state.game.world.height, image, '', state.background);
				bg.tileScale.setTo(4,4);
			});*/
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

		
		gfx = cache.getBitmapData('messageBox');
		state.messageBox = new MessageBox(
			state,state.game.width - gfx.width,state.game.height - 100, 
			gfx, 6, TextStyles.MessageBox, 7, 5);
		state.messageBox.add('Welcome Hephaestus!');

		this.playerGoldText = this.add.text(
			state.messageBox.bg.x ,state.game.height - 20,
			'Gold: '+ this.player.gold, TextStyles.simpleRight);
		this.playerGoldText.anchor.x = 1;
		
		state.tooltip = new ToolTip(state);
		state.tooltip.state = state;
		
		gfx = cache.getBitmapData('inventoryUI');
		this.inventoryUI = this.player.inventoryUI(
			gfx.width * -1 + 25, 45,  gfx);

		this.crafting = new Crafting(this, 
			cache.getBitmapData('craftingPanel').width * -1 + 25, 25);
		
		
		this.equipment = new Equipment(this, 300, 50, cache.getBitmapData('equipmentPanel'));


		state.foremostGround = state.game.add.group();
		state.foremostGround.addChild(state.tooltip.group);

		state.errorText = state.game.add.text(
			state.game.width * 0.5, state.game.height * 0.5,
			'This is an Error!!', TextStyles.bigError);
		state.errorText.anchor.set(0.5);
		state.errorText.visible = false;
		
	}, 
	showError: function(message) {
		this.errorText.text = message;
		this.errorText.visible = true;
		this.errorText.bringToTop();
		game.time.events.add(Phaser.Timer.SECOND * 2.5, this.onErrorTimeUp, this);
	},
	onErrorTimeUp:function() {
		this.errorText.visible = false;
	},
	onUpdate:function(){
		var mercs = this.myMercs;
		var merc, enemy, dungeon;
		//check each merc for a running dungeon
		for (var i = 0; i < mercs.length; i++) {
			merc = mercs[i];
			if (merc.activeDungeon) { //dungeon is running
				if (merc.rest == 1) {
					merc.health += merc.maxHealth * 0.1 + merc.regen;
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
						//if (Combat.dodgeTest(merc.dexterity, enemy.dexterity)) {
						//	this.messageBox.add(merc.name + ' damaged ' + ' ' + enemy.name);
							enemy.health -= merc.damage;
							updateStats(dungeon.enemyStats, enemy);
						//} else
						//	this.messageBox.add(enemy.name + ' dodged ' + merc.name + ' attack');
						
						if (enemy.health <= 0) {
							enemy.health = 0;
							this.award(enemy.loot, merc);
						} else { //if enemy still alive, damage the player
						//	if (Combat.dodgeTest(merc.dexterity, enemy.dexterity)) {
						//		this.messageBox.add(enemy.name + ' damaged ' + ' ' + merc.name);
								merc.health -= enemy.damage;
								if (merc.health <= 0) {
									merc.health = 0;
									merc.rest = 1;
								}
								updateStats(dungeon.playerStats, merc);
						//	} else
						//		this.messageBox.add(merc.name + ' dodged ' + enemy.name + ' attack');
						}
						
					}
				}
			}
		};
	},
	onEquipmentClick:function(button, pointer) {
		this.equipment.show(button.merc.details);
		this.hireMercList.visible = false;
		this.dungeonSelector.visible = false;
		if (this.displayedDungeon != undefined) {
			this.displayedDungeon.visible = false;
			this.displayedDungeon = undefined;
		}
	}, 
	onSendToDungeonClick:function(button) {
		var selector = this.dungeonSelector;
		var merc = button.merc.details;

		if (selector.selectedMerc == merc && selector.visible) {
			selector.visible = false;
			return;
		}
		
		this.hireMercList.visible = false;
		this.equipment.group.visible = false;

		if (merc.activeDungeon != undefined) {
			if (this.displayedDungeon != undefined) {
				if (this.displayedDungeon == merc.activeDungeon) {
					this.displayedDungeon.visible = false;
					this.displayedDungeon = undefined;
				} else {
					this.displayedDungeon.visible = false;
					merc.activeDungeon.visible = true;
					this.displayedDungeon = merc.activeDungeon;
				}
			} else {
				//display current dungeon
				merc.activeDungeon.visible = true;
				this.displayedDungeon = merc.activeDungeon;
			}
		} else {
			if (this.displayedDungeon != undefined) {
				this.displayedDungeon.visible = false;
				this.displayedDungeon = undefined;
			}
			//dungeon selection show
			selector.selectedMerc = merc;
			var btn = selector.sendToButton;
			btn.avatar = merc.avatar; //not actually changing the avatar
			//btn.text.text = 'Send ' + merc.name + '\nTo ???';
			onDungeonSelect(selector.baseDungeon);
			selector.visible = true;
		}
		
		
	},
	award:function(lootTable, merc) {
		if (lootTable != undefined && lootTable.length != 0) {
			var loot = lootTable[Math.floor(Math.random() * lootTable.length)];
			this.player.addLoot(loot);
			this.messageBox.add(merc.name + ' looted ' + loot + '.');
		} else {
			var gold = 1;
			this.player.addGold(gold);
			this.playerGoldText.text = 'Gold: ' + this.player.gold;
			this.messageBox.add(merc.name + ' found ' + gold + ' gold.');
		}

	}
});

game.state.start('play');