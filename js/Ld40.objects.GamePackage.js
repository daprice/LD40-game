//represents a flat-packed piece of furniture
Ld40.objects.GamePackage = function(mass = 10, name = "Borker", cost = 50, image = "box", alreadyPurchased = false) {
	this.mass = mass;
	this.name = name;
	this.cost = cost;
	this.image = image;
	this.alreadyPurchased = alreadyPurchased;
};

Ld40.objects.GamePackage.prototype.damage = function() {
	if(this.name != "Meatballs") {
		this.cost /= 2;
		this.name += " (AS IS)";
	}
};