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
		gamePackageOpts: {mass: 0, name: "Meatballs", price: 5.99}
	},
	'checkout': {
		mass: 60000,
		damping: 0.999,
		angularDamping: 0.999,
		gamePackageOpts: {mass: 0, name: "Check out", price: 1000}
	}
};

export class Furniture extends Phaser.Sprite {
	constructor(game, x=0, y=0, type='chair') {
		super(game, x, y, type);
		
		this.game.physics.p2.enable(this);
		
		this.body.mass = FURNITURE_TYPES[type].mass;
		this.body.damping = FURNITURE_TYPES[type].damping;
		this.body.angularDamping = FURNITURE_TYPES[type].angularDamping;
		
		if(FURNITURE_TYPES[type].gamePackageOpts) {
			this.gamePackage = new GamePackage(FURNITURE_TYPES[type].gamePackageOpts);
		}
	}
	
	static setTable(game, x, y) {
		const rand = [Math.random(), Math.random(), Math.random()];
		game.add.existing(new Furniture(game, x, y, 'table')).body.angle = rand[0]*2-1;
		game.add.existing(new Furniture(game, x, y+30, 'chair')).body.angle = 180 + (rand[1]*10-5);
		game.add.existing(new Furniture(game, x, y-26, 'chair')).body.angle = rand[2]*10-5;
	}
};