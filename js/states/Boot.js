export class Boot {
	init(nextState) {
		this.nextState = nextState;
	}
	
	preload() {
		this.load.image('ground', 'img/ground.png');
		this.load.image('landscape', 'img/landscape.png');
		this.load.image('decoration', 'img/decoration.png');
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
		this.load.audio('carthit', 'audio/carthit.mp3');
		this.load.audio('boxhit', 'audio/boxhit.mp3');
		this.load.audio('boxdrop', 'audio/boxdrop.mp3');
	}
	
	create() {
		
	}
	
	update() {
		if(this.allSoundsDecoded()) {
			this.state.start(this.nextState);
		}
	}
	
	allSoundsDecoded() {
		//TODO: something
		//if(this.cache.isSoundDecoded('someSound') {
		return true;
	}
};