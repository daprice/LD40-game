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
		this.layer2 = this.map.createLayer('decoration');
		this.layer.resizeWorld();
		this.layer1.resizeWorld();
		this.layer2.resizeWorld();
		
		this.map.collisionLayer = this.layer1;
		this.map.setCollisionByExclusion([1], true, this.layer1);
		
		this.game.physics.p2.convertTilemap(this.map, this.layer1);
		
		
		//entities
		
		this.player = this.game.add.existing(new Ld40.entities.Player(this.game, 90, 60));
		
		
		//UI elements
		this.instructions = this.game.add.existing(new Phaser.Text(this.game, 10, this.game.height - 16,
			"[LEFT,RIGHT] Steer, [UP] Push, [DOWN] Attempt to stop, [SPACE] Pick up",
			{
				font: "bold 10pt Verdana",
				fill: 'white'
			}
		));
		this.instructions.fixedToCamera = true;
		
		this.pickupText = this.game.add.existing(new Phaser.Text(this.game, 0, 0, '', {
			font: "bold 8pt Verdana",
			fill: 'white',
			boundsAlignH: 'center'
		}));
		
		this.receiptBackground = this.game.add.existing(new Phaser.Image(this.game, this.game.width - 214, this.game.height - 387, 'receipt'));
		this.receiptBackground.fixedToCamera = true;
		
		this.priceTotal = this.game.add.existing(new Phaser.Text(this.game, this.game.width - 80, this.game.height - 62, '$0.00', {
			font: "bold 8pt Verdana",
			fill: "#494949",
			boundsAlignH: 'right'
		}));
		this.priceTotal.fixedToCamera = true;
		
		this.itemizedList = this.game.add.existing(new Phaser.Text(this.game, this.game.width - 192, this.game.height - 315, "", {
			font: "regular 10pt Verdana",
			fill: "#494949",
			boundsAlignH: 'left'
		}));
		this.itemizedList.fixedToCamera = true;
		
		this.transactionTexts = [];
		
		this.hungerText = this.game.add.existing(new Phaser.Text(this.game, 10, 2, "Hunger: 0%", {
			font: "bold 10pt Verdana",
			fill: 'white'
		}));
		this.hungerText.fixedToCamera = true;
		
		
		//camera
		this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN, 0.1, 0.1);
		this.game.camera.roundPx = false;
		
		
		this.setupLevel();
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
		
		//update hunger UI
		this.hungerText.setText("Hunger: " + ((this.player.hunger / this.player.maxHunger)*100).toFixed(0) + "%");
	},
	
	updateReceipt: function() {
		var priceTotal = 0;
		var receiptText = '';
		for(var item of this.player.itemizedReceipt) {
			priceTotal += item.cost;
			receiptText += item.name + '..........$' + item.cost.toFixed(2) + '\n';
		}
		
		if(this.player.damageCost > 0) {
			priceTotal += this.player.damageCost;
			receiptText += 'DAMAGE..........$' + this.player.damageCost + '\n';
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
		
		
	},
	
	addDroppedItem: function(theItem) {
		this.game.add.existing(theItem);
	},
	
	//huge ugly function that puts all the furniture and boxes in their place
	setupLevel: function() {
		//place tables and chairs in restaurant
		var setTable = function(x, y) {
			var rand = [Math.random(), Math.random(), Math.random()];
			this.game.add.existing(new Ld40.entities.Table(this.game, x, y)).body.angle = rand[0]*2-1;
			this.game.add.existing(new Ld40.entities.Chair(this.game, x, y+30)).body.angle = 180 + (rand[1]*10-5);
			this.game.add.existing(new Ld40.entities.Chair(this.game, x, y-26)).body.angle = rand[2]*10-5;
		};
		
		setTable(50, 1270);
		setTable(110, 1266);
		setTable(170, 1271);
		setTable(232, 1270);
		setTable(50, 1370);
		setTable(110, 1366);
		setTable(170, 1371);
		setTable(232, 1370);
		
		this.game.add.existing(new Ld40.entities.ServingTable(this.game, 130,1110));
	}
}