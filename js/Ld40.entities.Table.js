Ld40.entities.Table = function(game, x = 0, y = 0) {
	
	//extend Phaser.Sprite
	Phaser.Sprite.call(this, game, x, y, 'table');
	
	this.game.physics.p2.enable(this);
	
	this.body.mass = 60;
	this.body.damping = 0.95;
	this.body.angularDamping = 0.98;
	
};

Ld40.entities.Table.prototype = Object.create(Phaser.Sprite.prototype);
Ld40.entities.Table.prototype.constructor = Ld40.entities.Table;