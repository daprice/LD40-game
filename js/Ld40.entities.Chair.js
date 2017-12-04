Ld40.entities.Chair = function(game, x = 0, y = 0) {
	
	//extend Phaser.Sprite
	Phaser.Sprite.call(this, game, x, y, 'chair');
	
	this.game.physics.p2.enable(this);
	
	this.body.mass = 15;
	this.body.damping = 0.95;
	this.body.angularDamping = 0.9;
	
};

Ld40.entities.Chair.prototype = Object.create(Phaser.Sprite.prototype);
Ld40.entities.Chair.prototype.constructor = Ld40.entities.Chair;