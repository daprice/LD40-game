Ld40.entities.Player = function(game, x = 0, y = 0) {
	//extend Phaser.Sprite
	Phaser.Sprite.call(this, game, x, y, 'player');
	
	this.state = this.game.state.states[this.game.state.current];
	
	//enable physics
	this.game.physics.p2.enable(this);
	
	//game properties
	this.turnForce = 20;
	this.goForce = 800;
	this.stopFactor = 0.97;
	this.loadedBoxes = [];
	this.itemizedReceipt = [];
	this.damageCost = 0;
	this.startBudget = 5000;
	this.budget = this.startBudget;
	this.baseMass = 20;
	this.pickupDistance = 70;
	
	//physics properties
	this.body.mass = this.baseMass;
	this.body.damping = 0.3;
	this.body.angularDamping = 0.5;
	
	//input
	this.cursors = this.game.input.keyboard.createCursorKeys();
	this.pickupKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	
	//handle hitting things
	this.body.onBeginContact.add(this.onHit, this);
};

Ld40.entities.Player.prototype = Object.create(Phaser.Sprite.prototype);
Ld40.entities.Player.prototype.constructor = Ld40.entities.Player;

Ld40.entities.Player.prototype.update = function() {
	Phaser.Sprite.prototype.update.call(this);
	
	//reset angular damping if it was changed by using the stop button
	this.body.angularDamping = 0.5;
	
	if(this.cursors.left.isDown && this.cursors.right.isUp) {
		this.body.angularForce = -this.turnForce;
	}
	else if(this.cursors.right.isDown && this.cursors.left.isUp) {
		this.body.angularForce = this.turnForce;
	}
	else {
		this.body.angularForce = 0;
	}
	
	if(this.cursors.up.isDown) {
		this.body.thrust(this.goForce);
	}
	else if(this.cursors.down.isDown) {
		this.body.velocity.x *= this.stopFactor; //TODO: make this actually based on the mass of the items in the cart
		this.body.velocity.y *= this.stopFactor;
		this.body.angularDamping = 0.9;
	}
	
	//check to see if any packages can be picked up
	var closestBox = this.game.world.getClosestTo(this, function(obj, dist) {
		return obj.gamePackage && dist < this.pickupDistance;
	}, this);
	
	if(closestBox) {
		this.state.pickupText.setText('[SPACE] ' + closestBox.gamePackage.name + ' ($' + closestBox.gamePackage.cost + ')');
		//TODO: make the pickupText reflect the camera position as well as the player position
		this.state.pickupText.x = this.centerX + 30;
		this.state.pickupText.y = this.centerY - 8;
	}
	else {
		this.state.pickupText.setText('');
	}
	
	if(closestBox && this.pickupKey.isDown) {
		this.gameLoadPackage(closestBox.gamePackage);
		if(!closestBox.gamePackage.alreadyPurchased) { //(don't make a new transaction for already purchased packages that have fallen off the cart)
			this.itemizedReceipt.push(closestBox.gamePackage);
			this.state.showTransaction(closestBox.gamePackage.cost, closestBox.gamePackage.name);
		}
		closestBox.gamePackage.alreadyPurchased = true;
		closestBox.kill();
		this.state.updateReceipt();
	}
};

Ld40.entities.Player.prototype.recalculatePhysicsProps = function() {
	//update mass based on package load
	this.body.mass = this.baseMass;
	for (var p of this.loadedBoxes) {
		this.body.mass += p.gamePackage.mass;
	}
}

Ld40.entities.Player.prototype.gameLoadPackage = function(thePackage) {
	var theBox = new Ld40.entities.Box(this.game, 0, 0, thePackage, false)
	this.loadedBoxes.push(theBox);
	this.addChild(theBox);
	theBox.x = -theBox.width/2;
	theBox.y = -theBox.height/2;
	this.recalculatePhysicsProps();
	console.info('Package loaded on to player cart', thePackage);
};

//randomly drop an item from the load
Ld40.entities.Player.prototype.dropItem = function() {
	if(this.loadedBoxes.length == 0) {return false;}
	
	//select a package at random
	var rand = Math.floor(Math.random() * this.loadedBoxes.length);
	var thePackage = this.loadedBoxes[rand].gamePackage;
	
	this.loadedBoxes[rand].kill();
	this.loadedBoxes.splice(rand, 1);
	
	this.state.addDroppedItem(new Ld40.entities.Box(this.game, this.x, this.y, thePackage));
};

Ld40.entities.Player.prototype.onHit = function(body1, body2, shape1, shape2, contactEq) {
	//get relative velocity
	var rVelX = this.body.velocity.x - body1.velocity.x;
	var rVelY = this.body.velocity.y - body1.velocity.y;
	var rSpeed = Math.sqrt(rVelX*rVelX + rVelY*rVelY);
	//console.log(rSpeed);
	
	//discard collisions under a certain speed
	if(rSpeed < 20) return false;
	
	//TODO: play sounds depending on intensity of impact
	
	//randomly drop item(s) if impact is hard enough
	if(rSpeed > 40) {
		var rand = Math.random();
		if(rand < rSpeed/100) {
			this.dropItem();
		}
	}
	
	//calculate and apply damage cost if the item hasn't already been paid for
	if(body1.sprite && body1.sprite.gamePackage && !body1.sprite.gamePackage.alreadyPurchased && !body1.sprite.alreadyDamaged) {
		this.damageCost += body1.sprite.gamePackage.cost;
		body1.sprite.gamePackage.damage();
		body1.sprite.alreadyDamaged = true;
		this.state.updateReceipt();
		this.state.showTransaction(this.damageCost, "DAMAGED MERCHANDISE", 0xff0000);
	}
	
	this.game.camera.shake(rSpeed/15000, rSpeed*8);
};