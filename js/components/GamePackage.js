"use strict"

export const PACKAGE_TYPES = {
	snorg: {mass: 10, cost: 299, name: "Snörg", image: 'snorg'},
	borgle: {mass: 10, name: "Borgle", cost: 45, image: "borgle"},
	lurt: {mass: 5, name: "Lürt", cost: 32, image: "lurt"},
	lava: {mass: 7, name: "Låva", cost: 20, image: "lava"},
	pulf: {mass: 10, name: "Pulf", cost: 29, image: "pulf"},
	fleeb: {mass: 20, name: "Flëeb", cost: 89, image: "fleeb"},
	borger: {mass: 40, name: "Borger", cost: 169, image: "borger"},
	blarg: {mass: 30, name: "Blarg", cost: 59, image: "blarg"},
	bork: {mass: 8, name: "Bork", cost: 61, image: "bork"}
};

//represents a flat-packed piece of furniture
export class GamePackage {
	constructor({mass = 10, name = "Borker", cost = 50, image = "box", alreadyPurchased = false, damaged = false} = {}) {
		this.mass = mass;
		this.name = name;
		this.cost = cost;
		this.image = image;
		this.alreadyPurchased = alreadyPurchased;
		if(damaged) {
			this.damage();
		}
	}
	
	damage() {
		if(this.name != "Meatballs") {
			this.cost /= 2;
			this.name += " (AS IS)";
		}
	}
};