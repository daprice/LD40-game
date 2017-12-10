"use strict"

import {GamePackage} from '../components/GamePackage.js';

const FURNITURE_TYPES = {
	'chair': {
		mass: 15,
		damping: 0.95,
		angularDamping: 0.9
	},
	'table': {
		mass: 60,
		damping: 0.95,
		angularDamping: 0.98
	},
	'serving': {
		mass: 6000,
		damping: 0.999,
		angularDamping: 0.999,
		makeGamePackage: () => new GamePackage(0, 'Meatballs', 5.99)
	},
	'checkout': {
		mass: 60000,
		damping: 0.999,
		angularDamping: 0.999,
		makeGamePackage: () => new GamePackage(0, 'Check out', 1000)
	}
};

export class Furniture extends Phaser.Sprite {
	constructor(game, x=0, y=0, type='chair') {
		super(game, x, y, type);
		
		this.game.physics.p2.enable(this);
		
		this.body.mass = FURNITURE_TYPES[type].mass;
		this.body.damping = FURNITURE_TYPES[type].damping;
		this.body.angularDamping = FURNITURE_TYPES[type].angularDamping;
		
		if(FURNITURE_TYPES[type].makeGamePackage) {
			this.gamePackage = FURNITURE_TYPES[type].makeGamePackage();
		}
	}
};