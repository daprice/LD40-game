//represents a flat-packed piece of furniture
export class GamePackage {
	constructor(mass = 10, name = "Borker", cost = 50, image = "box", alreadyPurchased = false) {
		this.mass = mass;
		this.name = name;
		this.cost = cost;
		this.image = image;
		this.alreadyPurchased = alreadyPurchased;
	}
	
	damage() {
		if(this.name != "Meatballs") {
			this.cost /= 2;
			this.name += " (AS IS)";
		}
	}
};