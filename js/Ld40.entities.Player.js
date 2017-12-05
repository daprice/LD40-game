Ld40.entities.Player = function(game, x = 0, y = 0) {
	//extend Phaser.Sprite
	Phaser.Sprite.call(this, game, x, y, 'player');
	
	this.state = this.game.state.states[this.game.state.current];
	
	//enable physics
	this.game.physics.p2.enable(this);
	
	//game properties
	this.turnForce = 130;
	this.goForce = 1800;
	this.stopFactor = 0.8;
	this.loadedBoxes = [];
	this.itemizedReceipt = [];
	this.damageCost = 0;
	this.startBudget = 5000;
	this.hunger = 0;
	this.maxHunger = 100;
	this.budget = this.startBudget;
	this.baseMass = 20;
	this.pickupDistance = 80;
	this.pickupCooldown = 1000;
	
	//physics properties
	this.body.mass = this.baseMass;
	this.body.damping = 0.2;
	this.body.angularDamping = 0.5;
	
	this.body.angle = 90;
	
	//audio
	this.hitSound = this.game.add.audio('carthit');
	this.boxHitSound = this.game.add.sound('boxhit');
	this.boxDropSound = this.game.add.sound('boxdrop');
	
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
	
	this.pickupCooldown += 1;
	this.hunger += 0.008;
	if(this.hunger >= this.maxHunger) {
		this.state.endGame(false, "You have died of starvation in a store that has its own restaurant. Congratulations.");
	}
	
	//reset angular damping if it was changed by using the stop button
	this.body.angularDamping = 0.5;
	this.body.damping = 0.2;
	
	if(this.cursors.left.isDown && this.cursors.right.isUp) {
		this.body.angularForce = -this.turnForce;
		if(this.debug) {this.state.camera.x -= 5;}
	}
	else if(this.cursors.right.isDown && this.cursors.left.isUp) {
		this.body.angularForce = this.turnForce;
		if(this.debug) {this.state.camera.x += 5;}
	}
	else {
		this.body.angularForce = 0;
	}
	
	if(this.cursors.up.isDown) {
		this.body.thrust(this.goForce);
		if(this.debug) {this.state.camera.y -= 5;}
	}
	else if(this.cursors.down.isDown) {
		if(this.debug) {this.state.camera.y += 5;}
		this.body.damping = this.stopFactor;
		this.body.angularDamping = 0.9;
		
		//apply some angular force because it always works that way in real life when you try to stop an ikea cart
		this.speed = Math.sqrt(Math.pow(this.body.velocity.x, 2) + Math.pow(this.body.velocity.y, 2));
		
		if(this.speed > 4) {
			var velAngle = Math.atan2(this.body.velocity.x, -this.body.velocity.y);
			var diffLeft = Phaser.Math.normalizeAngle(this.body.rotation - velAngle);
			var diffRight = Phaser.Math.normalizeAngle(velAngle - this.body.rotation);
			if(diffLeft >= diffRight) {
				this.body.angularForce += (this.body.mass*diffRight);
			}
			else if (diffRight > diffLeft) {
				this.body.angularForce -= (this.body.mass*diffLeft);
			}
		}
	}
	
	//check to see if any packages can be picked up
	var closestBox = this.game.world.getClosestTo(this, function(obj, dist) {
		return obj.gamePackage && dist < this.pickupDistance;
	}, this);
	
	if(closestBox && this.pickupCooldown > 100) {
		if(closestBox.gamePackage.name != "Check out") {
			this.state.pickupText.setText('[SPACE] ' + closestBox.gamePackage.name + ' ($' + closestBox.gamePackage.cost + ')');
		}
		else {
			this.state.pickupText.setText('[SPACE] Check out');
		}
		
		this.state.pickupText.x = this.centerX + 30;
		this.state.pickupText.y = this.centerY - 8;
	}
	else {
		this.state.pickupText.setText('');
	}
	
	if(closestBox && this.pickupCooldown > 100 && this.pickupKey.isDown) {
		if(!closestBox.gamePackage.alreadyPurchased && closestBox.gamePackage.name != "Check out") { //(don't make a new transaction for already purchased packages that have fallen off the cart)
			this.itemizedReceipt.push(closestBox.gamePackage);
			this.state.showTransaction(closestBox.gamePackage.cost, closestBox.gamePackage.name);
		}
		if(closestBox.gamePackage.name == "Meatballs") {
			this.hunger = 0;
		}
		else if(closestBox.gamePackage.name == "Check out") {
			var priceTotal = 0.000001;  //stupidly low number so it doesn't divide by zero if the player hasn't paid for anything
			for(var item of this.itemizedReceipt) {
				priceTotal += item.cost;
			}
			if(this.damageCost > 0) {
				priceTotal += this.damageCost;
			}
			
			var valueTotal = 0;
			for(var item of this.loadedBoxes) {
				valueTotal += item.gamePackage.cost;
			}
			
			this.state.endGame(true, "You survived a trip to FLÅTPAK! You brought home $" + valueTotal.toFixed(2) + " worth of furniture at a cost of $" + priceTotal.toFixed(2) + " (including $" + this.damageCost.toFixed(2) + " worth of damage to store property). That makes your efficiency score " + (valueTotal/priceTotal*100).toFixed(0) + " out of 100.");
		}
		else {
			this.gameLoadPackage(closestBox.gamePackage);
			closestBox.gamePackage.alreadyPurchased = true;
			closestBox.kill();
		}
		this.state.updateReceipt();
		this.pickupCooldown = 0;
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
	this.boxDropSound.play('', 0, 1, false, true);
	this.recalculatePhysicsProps();
};

Ld40.entities.Player.prototype.onHit = function(body1, body2, shape1, shape2, contactEq) {
	//get relative velocity
	var rVelX = this.body.velocity.x - body1.velocity.x;
	var rVelY = this.body.velocity.y - body1.velocity.y;
	var rSpeed = Math.sqrt(rVelX*rVelX + rVelY*rVelY);
	//console.log(rSpeed);
	
	//discard collisions under a certain speed
	if(rSpeed < 18) return false;
	
	//play sounds depending on intensity of impact
	this.hitSound.play('', 0, rSpeed/100, false, true);
	
	//randomly drop item(s) if impact is hard enough
	//TODO: instead of making it random, just randomly jostle the items proportionally to the impact and have the ones that go over the edge of the cart fall off
	if(rSpeed > 40) {
		var rand = Math.random();
		if(rand < rSpeed/100) {
			this.dropItem();
		}
	}
	
	//calculate and apply damage cost if the item hasn't already been paid for
	if(body1.sprite && body1.sprite.gamePackage && !body1.sprite.gamePackage.alreadyPurchased && !body1.sprite.alreadyDamaged) {
		this.boxHitSound.play('', 0, rSpeed/20, false, true);
		this.damageCost += body1.sprite.gamePackage.cost;
		body1.sprite.gamePackage.damage();
		body1.sprite.alreadyDamaged = true;
		this.state.updateReceipt();
		this.state.showTransaction(this.damageCost, "DAMAGED MERCHANDISE", 0xff0000);
	}
	
	this.game.camera.shake(rSpeed/15000, rSpeed*8);
};