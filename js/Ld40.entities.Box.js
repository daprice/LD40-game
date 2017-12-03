Ld40.entities.Box = function(game, x = 0, y = 0, gamePackage, loose = true) {
	this.gamePackage = gamePackage || new Ld40.objects.GamePackage();
	
	//extend Phaser.Sprite
	Phaser.Sprite.call(this, game, x, y, this.gamePackage.image);
	
	this.state = this.game.state.states[this.game.state.current];
	
	//enable physics if necessary
	if(loose) {
		this.setupPhysics();
	}
	
};

Ld40.entities.Box.prototype = Object.create(Phaser.Sprite.prototype);
Ld40.entities.Box.prototype.constructor = Ld40.entities.Box;

Ld40.entities.Box.prototype.setupPhysics = function() {
	this.game.physics.p2.enable(this);
	
	this.body.mass = this.gamePackage.mass;
	this.body.damping = 0.9;
	this.body.angularDamping = 0.9;
};

Ld40.entities.Box.prototype.update = function() {
	Phaser.Sprite.prototype.update.call(this);
	
	
};