var Ld40 = {
	phaserConfig: {
		parent: 'game',
		renderer: Phaser.CANVAS
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
		this.load.image('table', 'img/table.png');
		this.load.image('chair', 'img/chair.png');
		this.load.image('serving', 'img/serving.png');
		this.load.image('checkout', 'img/checkout.png');
		this.load.image('receipt', 'img/receipt.png');
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