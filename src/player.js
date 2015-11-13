var Player = function() {

	this.inventory = {};
	this.gold = 25;


	this.addLoot = function(loot) {
		if (this.inventory[loot] == undefined)
			this.inventory[loot] = 1;
		else 
			++this.inventory[loot];
	}

	this.addGold = function(amount) {
		this.gold += amount;
	}

}