imageData = [
	['background', 'assets/background/cyberpunk_rain_city_lights_night_future_800x600_hd-wallpaper-363403.jpg'],
	
	['aerocephal', 'assets/allacrost_enemy_sprites/aerocephal.png'],
    ['arcana_drake', 'assets/allacrost_enemy_sprites/arcana_drake.png'],
    ['aurum-drakueli', 'assets/allacrost_enemy_sprites/aurum-drakueli.png'],
    ['bat', 'assets/allacrost_enemy_sprites/bat.png'],
    ['daemarbora', 'assets/allacrost_enemy_sprites/daemarbora.png'],
    ['deceleon', 'assets/allacrost_enemy_sprites/deceleon.png'],
    ['demonic_essence', 'assets/allacrost_enemy_sprites/demonic_essence.png'],
    ['dune_crawler', 'assets/allacrost_enemy_sprites/dune_crawler.png'],
    ['green_slime', 'assets/allacrost_enemy_sprites/green_slime.png'],
    ['nagaruda', 'assets/allacrost_enemy_sprites/nagaruda.png'],
    ['rat', 'assets/allacrost_enemy_sprites/rat.png'],
    ['scorpion', 'assets/allacrost_enemy_sprites/scorpion.png'],
    ['skeleton', 'assets/allacrost_enemy_sprites/skeleton.png'],
    ['snake', 'assets/allacrost_enemy_sprites/snake.png'],
    ['spider', 'assets/allacrost_enemy_sprites/spider.png'],
    ['stygian_lizard', 'assets/allacrost_enemy_sprites/stygian_lizard.png'],

    ['gold_coin', 'assets/496_RPG_icons/I_GoldCoin.png'],
	['dagger', 'assets/496_RPG_icons/W_Dagger002.png'],
	['swordIcon1', 'assets/496_RPG_icons/W_Sword001.png'],
	['helm3', 'assets/496_RPG_icons/C_Elm03.png'],


    ['equipmentWeapon', 'assets/icon/gun24.png'],
    ['equipmentHelmet', 'assets/icon/helmet24.png'],
    ['equipmentArmor', 'assets/icon/vest24.png'],
    ['equipmentPants', 'assets/icon/trouser24.png'],
    ['equipmentShoes', 'assets/icon/boots24.png'],
    ['equipmentGloves', 'assets/icon/glove24.png'],
    ['equipmentRing', 'assets/icon/ring24.png'],
    ['equipmentEaring', 'assets/icon/earing24.png'],

    ['equipmentOnWeapon', 'assets/icon/gunOn24.png'],
    ['equipmentOnHelmet', 'assets/icon/helmetOn24.png'],
    ['equipmentOnArmor', 'assets/icon/vestOn24.png'],
    ['equipmentOnPants', 'assets/icon/trouserOn24.png'],
    ['equipmentOnShoes', 'assets/icon/bootsOn24.png'],
    ['equipmentOnGloves', 'assets/icon/gloveOn24.png'],
    ['equipmentOnRing', 'assets/icon/ringOn24.png'],
    ['equipmentOnEaring', 'assets/icon/earingOn24.png'],

    ['gunIcon16', 'assets/icon/gun16.png'],
    ['helmetIcon16', 'assets/icon/helmet16.png']
];

function buildImages(state) {
	imageData.forEach(function(image) {
			state.game.load.image(image[0], image[1])
		})
}