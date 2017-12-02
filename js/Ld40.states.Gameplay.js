Ld40.states.Gameplay = function() {};

Ld40.states.Gameplay.prototype = {
	create: function() {
		
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
		
		//tilemap
		this.map = this.game.add.tilemap('map');
		this.map.addTilesetImage('tilemap', 'tilemap');
		this.layer = this.map.createLayer(0);
		this.layer.resizeWorld();
		
		this.map.setCollision([3, 4, 9, 10, 11, 12, 13, 43, 44, 49, 50, 51, 52, 53]);
		
		this.game.physics.p2.convertTilemap(this.map, this.layer);
		
		
		//entities
		
		this.player = game.add.existing(new Ld40.entities.Player(this.game, 90, 90));
		
		this.box = game.add.existing(new Ld40.entities.Box(this.game, 40, 40));
	}
}