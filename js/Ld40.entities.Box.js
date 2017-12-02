Ld40.entities.Box = function(game, x = 0, y = 0, xSize = 20, ySize = 20, gamePackage) {
	//extend Phaser.Sprite
	Phaser.Sprite.call(this, game, x, y, 'box');
	
	this.state = this.game.state.states[this.game.state.current];
	
	//enable physics
	this.game.physics.p2.enable(this);
		
	//physics properties
	this.body.mass = 20;
	this.body.damping = 0.9;
	this.body.angularDamping = 0.9;
	
	this.gamePackage = gamePackage || new Ld40.objects.gamePackage();
};

Ld40.entities.Box.prototype = Object.create(Phaser.Sprite.prototype);
Ld40.entities.Box.prototype.constructor = Ld40.entities.Box;

Ld40.entities.Box.prototype.update = function() {
	Phaser.Sprite.prototype.update.call(this);
	
	
};