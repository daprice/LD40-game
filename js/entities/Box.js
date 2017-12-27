"use strict"

import {GamePackage} from '../components/GamePackage.js';
import {PACKAGE_TYPES} from '../components/GamePackage.js';

export class Box extends Phaser.Sprite {
	constructor(game, x = 0, y = 0, gamePackageOpts = {}, loose = true) {
		var gamePackage = new GamePackage(gamePackageOpts);
		
		super(game, x, y, gamePackage.image);
		this.gamePackage = gamePackage;
		
		this.state = this.game.state.states[this.game.state.current];
		
		//enable physics if necessary
		if(loose) {
			this.setupPhysics();
		}
	}
	
	setupPhysics() {
		this.game.physics.p2.enable(this);
		
		this.body.mass = this.gamePackage.mass;
		this.body.damping = 0.9;
		this.body.angularDamping = 0.9;
	}
	
	update() {
		super.update.call(this);
		
		
	}
	
	static place(game, type, x, y) {
		const typeOptions = PACKAGE_TYPES[type] || {};
		game.add.existing(new Box(game, x, y, typeOptions));
	}
};