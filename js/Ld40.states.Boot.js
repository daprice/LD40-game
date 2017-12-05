var Ld40 = {
	phaserConfig: {
		parent: 'game',
		renderer: Phaser.CANVAS
	},
	
	states: {},
	entities: {},
	objects: {}
};

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
		this.load.image('snorg', 'img/snorg.png');
		this.load.image('borgle', 'img/borgle.png');
		this.load.image('lurt', 'img/lurt.png');
		this.load.image('lava', 'img/lava.png');
		this.load.image('pulf', 'img/pulf.png');
		this.load.image('fleeb', 'img/fleeb.png');
		this.load.image('borger', 'img/borger.png');
		this.load.image('blarg', 'img/blarg.png');
		this.load.image('bork', 'img/bork.png');
		this.load.tilemap('map', 'data/map.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.image('tilemap', 'img/tilemap.png');
		
		this.load.audio('background', 'audio/background.mp3');
	},
	
	create: function() {
		
	},
	
	update: function() {
		if(this.allSoundsDecoded()) {
			this.state.start('Ld40.states.Gameplay');
		}
	},
	
	allSoundsDecoded: function() {
		//if(this.cache.isSoundDecoded('someSound') {
		return true;
	}
};