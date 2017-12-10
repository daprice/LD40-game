"use strict"

import {GamePackage} from '../components/GamePackage.js';

export class ServingTable extends Phaser.Sprite {
	constructor (game, x = 0, y = 0) {
		super(game, x, y, 'serving');
		
		this.game.physics.p2.enable(this);
		
		this.body.mass = 6000;
		this.body.damping = 0.999;
		this.body.angularDamping = 0.999;
		
		this.gamePackage = new GamePackage(0, "Meatballs", 5.99);
	}
};