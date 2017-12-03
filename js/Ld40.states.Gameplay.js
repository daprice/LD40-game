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
		
		this.player = this.game.add.existing(new Ld40.entities.Player(this.game, 90, 90));
		
		this.box = this.game.add.existing(new Ld40.entities.Box(this.game, 40, 40));
		
		
		//UI elements
		this.pickupText = this.game.add.existing(new Phaser.Text(this.game, 0, 0, '', {
			font: "bold 8pt Verdana",
			fill: 'white',
			boundsAlignH: 'center'
		}));
		
		this.receiptBackground = this.game.add.existing(new Phaser.Image(this.game, this.game.width - 214, this.game.height - 387, 'receipt'));
		
		this.priceTotal = this.game.add.existing(new Phaser.Text(this.game, this.game.width - 80, this.game.height - 62, '$0.00', {
			font: "bold 8pt Verdana",
			fill: "#494949",
			boundsAlignH: 'right'
		}));
		
		this.itemizedList = this.game.add.existing(new Phaser.Text(this.game, this.game.width - 192, this.game.height - 315, "", {
			font: "regular 10pt Verdana",
			fill: "#494949",
			boundsAlignH: 'left'
		}));
		
		this.transactionTexts = [];
		
		
		//camera
		this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN, 0.1, 0.1);
		this.game.camera.roundPx = false;
	},
	
	update: function() {
		for(var t = 0; t < this.transactionTexts.length; t++) {
			this.transactionTexts[t].frames += 1;
			this.transactionTexts[t].text.y -= 2;
			this.transactionTexts[t].text.alpha -= 0.01;
			if(this.transactionTexts[t].frames > 120) {
				this.transactionTexts[t].text.destroy();
				this.transactionTexts.splice(t, 1);
				t--;
			}
		}
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
			receiptText += 'DAMAGE...................$' + this.player.damageCost + '\n';
		}
		
		this.priceTotal.setText('$' + priceTotal.toFixed(2));
		this.itemizedList.setText(receiptText);
	},
	
	showTransaction: function(value, extraText, textColor = 0x00ff00) {
		var theText = "$" + value.toFixed(2);
		if(value < 0) {
			theText = "-" + theText;
		}
		if(extraText) {
			theText = extraText + '\n\n' + theText;
		}
		
		this.camera.flash(textColor, 500, true, 0.7);
		
		this.transactionTexts.push( {
			frames: 0,
			text: this.game.add.existing(new Phaser.Text(this.game, this.game.width/2, this.game.height/2, theText, {
				fill: textColor,
				font: "bold 24px Verdana",
				alignH: 'center'
			}))
		});
		
		
	}
}