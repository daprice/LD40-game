"use strict"

export class Chair extends Phaser.Sprite {
	constructor(game, x = 0, y = 0) {
		super(game, x, y, 'chair');
		
		this.game.physics.p2.enable(this);
		
		this.body.mass = 15;
		this.body.damping = 0.95;
		this.body.angularDamping = 0.9;
	}
};