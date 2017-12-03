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
		this.layer = this.map.createLayer('ground');
		this.layer1 = this.map.createLayer('landscape');
		this.layer.resizeWorld();
		this.layer1.resizeWorld();
		
		this.map.collisionLayer = this.layer1;
		this.map.setCollisionByExclusion([1], true, this.layer1);
		
		this.game.physics.p2.convertTilemap(this.map, this.layer1);
		
		
		//entities
		
		this.player = game.add.existing(new Ld40.entities.Player(this.game, 90, 90));
		
		this.box = game.add.existing(new Ld40.entities.Box(this.game, 40, 40));
		
		
		//UI elements
		this.pickupText = game.add.existing(new Phaser.Text(this.game, 0, 0, '', {
			font: "bold 8pt Verdana",
			fill: 'white',
			boundsAlignH: 'center'
		}));
		
		this.receiptBackground = game.add.existing(new Phaser.Image(this.game, this.game.width - 214, this.game.height - 387, 'receipt'));
		
		this.priceTotal = game.add.existing(new Phaser.Text(this.game, this.game.width - 80, this.game.height - 62, '$0.00', {
			font: "bold 8pt Verdana",
			fill: "#494949",
			boundsAlignH: 'right'
		}));
		
		this.itemizedList = game.add.existing(new Phaser.Text(this.game, this.game.width - 192, this.game.height - 315, "", {
			font: "regular 9pt Verdana",
			fill: "#494949",
			boundsAlignH: 'left'
		}))
		
		
		//camera
		this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN, 0.1, 0.1);
		this.game.camera.roundPx = false;
	},
	
	updateReceipt: function() {
		var priceTotal = 0;
		var receiptText = '';
		for(var item of this.player.itemizedReceipt) {
			priceTotal += item.cost;
			receiptText += item.name + '...................$' + item.cost.toFixed(2) + '\n';
		}
		
		if(this.player.damageCost > 0) {
			priceTotal += this.player.damageCost;
			receiptText += 'DAMAGE...................$' + item.cost.toFixed(2) + '\n';
		}
		
		this.priceTotal.setText('$' + priceTotal.toFixed(2));
		this.itemizedList.setText(receiptText);
	}
}