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

		//buildDungeon(state);
		buildDungeonSelector(state);

		//load enemies
		//buildMonster(state);
		//spawnRandomMonster(state);
		//buildMonsterUI(state);
		buildEquipment(state);
		
		

		//load player
		this.player = new Player();

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

		//gold coin pool
		var coins = this.coins = this.add.group();
		coins.createMultiple(50, 'gold_coin', '', false);
		coins.setAll('inputEnabled', true);
		coins.setAll('goldValue', 1);
		coins.callAll('events.onInputDown.add', 'events.onInputDown', this.onClickCoin, this);

		this.playerGoldText = this.add.text(30,30, 'Gold: '+ this.player.gold, {
			font:'24px Arial Black', fill:'#fff', strokeThickness:4
		});

		//UI
		buildMercenaryList(state);



	},
	onClickMonster:function() {
		var pos = this.input.position; // click position
		//apply click damage to monster
		this.currentMonster.damage(this.player.clickDmg);
		//update the health text
		this.monsterHealthText.text = this.currentMonster.alive ? this.currentMonster.health + ' HP':'DEAD';
		
		//floating damage text
		var dmgText = this.dmgTextPool.getFirstExists(false);
		if (dmgText) {
			dmgText.text = this.player.clickDmg;
			dmgText.reset(pos.x, pos.y);
			dmgText.alpha = 1;
			dmgText.tween.start();
		} else console.log(this.dmgTextPool.children);
	},
	onKilledMonster:function(){
		//reset the currentMonster before we move him
		this.currentMonster.position.set(1000, this.game.world.centerY);
		
		//coin spawn
		var coin = this.coins.getFirstExists(false);
		coin.reset(this.game.world.centerX + this.game.rnd.integerInRange(-100,100), this.game.world.centerY + this.game.rnd.integerInRange(-20,20));
		coin.goldValue = Math.round(this.level * 1.33);
		this.game.time.events.add(Phaser.Timer.SECOND * 3, this.onClickCoin, this, coin);

		++this.levelKills;
		if (this.levelKills >= this.levelKillsRequired) {
			++this.level;
			this.levelKills = 0;
		}

		//now pick the next in the list and bring him up
		this.currentMonster = this.monsters.getRandom();
		this.currentMonster.maxHealth = Math.ceil(this.currentMonster.details.maxHealth + (this.level - 1) * 10.6);
		this.currentMonster.revive(this.currentMonster.maxHealth);

		//update UI
		this.levelText.text = 'Level: ' + this.level;
		this.levelKillsText.text = 'Kills: ' + this.levelKills + '/' + this.levelKillsRequired;
	},
	onRevivedMonster:function(){
		this.currentMonster.position.set(this.game.world.centerX + 100, this.game.world.centerY);
		//update the text display
		this.monsterNameText.text = this.currentMonster.details.name;
		this.monsterHealthText.text = this.currentMonster.health +' HP';
		
	},
	onClickCoin:function(coin) {
		if (!coin.alive)
			return;
		//give the player gold
		this.player.gold += coin.goldValue;
		//update UI
		this.playerGoldText.text = 'Gold: '+this.player.gold;
		coin.kill();
	},
	onCharacterClick: function(button, pointer) {
		//make this a function so that it updates after we buy
		function getAdjustedCost() {
			return Math.ceil(button.details.cost + button.details.level * 1.46);
		}
		if(this.player.gold - getAdjustedCost() >= 0) {
			this.player.gold -= getAdjustedCost();
			this.playerGoldText.text = 'Gold: ' + this.player.gold;
			++button.details.level;
			button.text.text = button.details.name + ': ' + button.details.level;
			button.costText.text = 'Cost: ' + getAdjustedCost();
			button.details.purchaseHandler.call(this, button, this.player);
		}
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
			console.log(lootTable);
			var loot = lootTable[Math.floor(Math.random() * lootTable.length)];
			this.player.addLoot(loot);
		} else {
			this.player.addGold(1);
			this.playerGoldText.text = 'Gold: ' + this.player.gold;
		}

	}
});

game.state.start('play');