var Ld40 = {
	phaserConfig: {
		width: '100%',
		height: '100%',
		parent: 'game',
		renderer: Phaser.AUTO
	},
	
	states: {},
	entities: {},
	objects: {}
}

Ld40.states.Boot = function() {};

Ld40.states.Boot.prototype = {
	init: function() {
		
	},
	
	preload: function() {
		this.load.image('player', 'img/player.png');
		this.load.image('box', 'img/box.png');
		this.load.tilemap('map', 'data/map.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('tilemap', 'img/tilemap.png');
	},
	
	create: function() {
		
	},
	
	update: function() {
		//if(this.cache.isSoundDecoded('someSound') {
			this.state.start('Ld40.states.Gameplay');
		//}
	}
};