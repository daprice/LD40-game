Ld40.entities.Checkout = function(game, x = 0, y = 0) {
	
	//extend Phaser.Sprite
	Phaser.Sprite.call(this, game, x, y, 'checkout');
	
	this.game.physics.p2.enable(this);
	
	this.body.mass = 60000;
	this.body.damping = 0.999;
	this.body.angularDamping = 0.999;
	
	this.gamePackage = new Ld40.objects.GamePackage(0, "Check out", cost = 1000);
};

Ld40.entities.Checkout.prototype = Object.create(Phaser.Sprite.prototype);
Ld40.entities.Checkout.prototype.constructor = Ld40.entities.Checkout;