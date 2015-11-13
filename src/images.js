imageData = [
	['forest-back', 'assets/parallax_forest_pack/parallax-forest-back-trees.png'],
	['forest-lights', 'assets/parallax_forest_pack/parallax-forest-lights.png'],
	['forest-middle', 'assets/parallax_forest_pack/parallax-forest-middle-trees.png'],
	['forest-front', 'assets/parallax_forest_pack/parallax-forest-front-trees.png'],
	
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
	['helm3', 'assets/496_RPG_icons/C_Elm03.png']
];

function buildImages(state) {
	imageData.forEach(function(image) {
			state.game.load.image(image[0], image[1])
		})
}