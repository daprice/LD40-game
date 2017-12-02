Ld40.states.Gameplay = function() {};

Ld40.states.Gameplay.prototype = {
	create: function() {
		this.game.world.setBounds(0, 0 , 200, 200);
		
		//set up physics
		this.game.physics.startSystem(Phaser.Physics.P2JS);
		this.game.physics.p2.setImpactEvents(true);
		this.game.physics.p2.restitution = 0.05;
		
		this.collisionGroups = {};
		this.getCollisionGroup = function(groupName) {
			if(!this.collisionGroups[groupName]) {
				this.collisionGroups[groupName] = this.game.physics.p2.createCollisionGroup();
				console.info('created collision group', groupName);
			}
			return this.collisionGroups[groupName];
		}
		
		this.player = game.add.existing(new Ld40.entities.Player(this.game, 60, 60));
		
		this.box = game.add.existing(new Ld40.entities.Box(this.game, 20, 20));
	}
}