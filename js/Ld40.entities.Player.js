Ld40.entities.Player = function(game, x = 0, y = 0) {
	//extend Phaser.Sprite
	Phaser.Sprite.call(this, game, x, y, 'player');
	
	this.state = this.game.state.states[this.game.state.current];
	
	//enable physics
	this.game.physics.p2.enable(this);
	
	//game properties
	this.turnForce = 0.05;
	this.goForce = 400;
	this.stopFactor = 0.97;
	this.gamePackages = [];
	this.baseMass = 20;
	
	//physics properties
	this.body.mass = baseMass;
	this.body.damping = 0.4;
	this.body.angularDamping = 0.5;
	
	//input
	this.cursors = this.game.input.keyboard.createCursorKeys();
};

Ld40.entities.Player.prototype = Object.create(Phaser.Sprite.prototype);
Ld40.entities.Player.prototype.constructor = Ld40.entities.Player;

Ld40.entities.Player.prototype.update = function() {
	Phaser.Sprite.prototype.update.call(this);
	
	//reset angular damping if it was changed by using the stop button
	this.body.angularDamping = 0.5;
	
	if(this.cursors.left.isDown && this.cursors.right.isUp) {
		this.body.angularVelocity -= this.turnForce;
	}
	else if(this.cursors.right.isDown && this.cursors.left.isUp) {
		this.body.angularVelocity += this.turnForce;
	}
	
	if(this.cursors.up.isDown) {
		this.body.thrust(this.goForce);
	}
	else if(this.cursors.down.isDown) {
		this.body.velocity.x *= this.stopFactor;
		this.body.velocity.y *= this.stopFactor;
		this.body.angularDamping = 0.9;
	}
};

Ld40.entities.Player.prototype.recalculatePhysicsProps = function() {
	//update mass based on package load
	this.body.mass = baseMass;
	for (var p in this.gamePackages) {
		this.body.mass += p.mass;
	}
}

Ld40.entities.Player.prototype.gameLoadPackage = function(thePackage) {
	this.gamePackageWeights.push(thePackage);
	this.recalculatePhysicsProps;
};