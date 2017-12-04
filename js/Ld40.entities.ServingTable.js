Ld40.entities.ServingTable = function(game, x = 0, y = 0) {
	
	//extend Phaser.Sprite
	Phaser.Sprite.call(this, game, x, y, 'serving');
	
	this.game.physics.p2.enable(this);
	
	this.body.mass = 6000;
	this.body.damping = 0.999;
	this.body.angularDamping = 0.999;
	
	this.gamePackage = new Ld40.objects.GamePackage(0, "Meatballs", cost = 5.99);
};

Ld40.entities.ServingTable.prototype = Object.create(Phaser.Sprite.prototype);
Ld40.entities.ServingTable.prototype.constructor = Ld40.entities.ServingTable;