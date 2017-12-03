Ld40.entities.Player = function(game, x = 0, y = 0) {
	//extend Phaser.Sprite
	Phaser.Sprite.call(this, game, x, y, 'player');
	
	this.state = this.game.state.states[this.game.state.current];
	
	//enable physics
	this.game.physics.p2.enable(this);
	
	//game properties
	this.turnForce = 0.05;
	this.goForce = 500;
	this.stopFactor = 0.97;
	this.gamePackages = [];
	this.itemizedReceipt = [];
	this.damageCost = 0;
	this.startBudget = 5000;
	this.budget = this.startBudget;
	this.baseMass = 20;
	this.pickupDistance = 50;
	
	//physics properties
	this.body.mass = this.baseMass;
	this.body.damping = 0.4;
	this.body.angularDamping = 0.5;
	
	//input
	this.cursors = this.game.input.keyboard.createCursorKeys();
	this.pickupKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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
	
	//check to see if any packages can be picked up
	var closestBox = this.game.world.getClosestTo(this, function(obj, dist) {
		return obj.gamePackage && dist < this.pickupDistance;
	}, this);
	
	if(closestBox) {
		this.state.pickupText.setText('[SPACE] ' + closestBox.gamePackage.name + ' ($' + closestBox.gamePackage.cost + ')');
		this.state.pickupText.x = this.centerX + 30;
		this.state.pickupText.y = this.centerY - 8;
	}
	else {
		this.state.pickupText.setText('');
	}
	
	if(closestBox && this.pickupKey.isDown) {
		this.gameLoadPackage(closestBox.gamePackage);
		this.itemizedReceipt.push(closestBox.gamePackage);
		closestBox.kill();
		this.state.updateReceipt();
	}
};

Ld40.entities.Player.prototype.recalculatePhysicsProps = function() {
	//update mass based on package load
	this.body.mass = this.baseMass;
	for (var p in this.gamePackages) {
		this.body.mass += p.mass;
	}
}

Ld40.entities.Player.prototype.gameLoadPackage = function(thePackage) {
	this.gamePackages.push(thePackage);
	this.recalculatePhysicsProps;
	console.info('Package loaded on to player', thePackage);
};