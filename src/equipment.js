var equipmentData = [
	{name: 'Helmet', image: 'helm3',  damage: 0, health: 1, level: 1}
];

function buildEquipment(state) {
	state.equipment = state.game.add.group();
	var equipment;
	equipmentData.forEach(function(data){
		equipment = state.equipment.create(1000, state.game.world.centerY, data.image);
		equipment.details = data;
		
		
	});
}