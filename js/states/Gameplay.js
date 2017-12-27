"use strict"

import {Player} from '../entities/Player.js';
import {Furniture} from '../entities/Furniture.js';
import {Box} from '../entities/Box.js';

export class Gameplay{
	create() {
		
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
		//TODO: see if I can display this as an image instead of a Tilemap to improve performance
		this.game.add.existing(new Phaser.Image(this.game, 0, 0, 'ground'));
		this.game.add.existing(new Phaser.Image(this.game, 0, 0, 'landscape'));
		this.game.add.existing(new Phaser.Image(this.game, 0, 0, 'decoration'));
		
		this.map = this.game.add.tilemap('map');
		this.map.addTilesetImage('tilemap', 'tilemap');
		//this.layer = this.map.createLayer('ground');
		this.layer1 = this.map.createLayer('landscape');
		//this.layer2 = this.map.createLayer('decoration');
		//this.layer.resizeWorld();
		this.layer1.resizeWorld();
		this.layer1.visible = false;
		//this.layer2.resizeWorld();
		
		this.map.collisionLayer = this.layer1;
		this.map.setCollisionByExclusion([1], true, this.layer1);
		
		this.game.physics.p2.convertTilemap(this.map, this.layer1);
		
		
		//entities
		
		this.player = this.game.add.existing(new Player(this.game, 90, 60));
		
		this.setupLevel();
		
		
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
		if(!this.player.debug)
			this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN, 0.1, 0.1);
		this.game.camera.roundPx = false;
		
		//audio
		this.bg = this.game.add.audio('background');
		this.bg.play('', 0, 0.1, true);
	}
	
	update() {
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
		if(this.player.hunger / this.player.maxHunger > 0.9) {
			this.hungerText.fill = "red";
		}
		else {
			this.hungerText.fill = "white";
		}
	}
	
	updateReceipt() {
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
	}
	
	showTransaction(value, extraText, textColor = 0x00ff00) {
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
	
	endGame(win = false, message = "Game over") {
		this.game.paused = true;
		this.bg.stop();
		
		alert(message);
	}
	
	addDroppedItem(theItem) {
		this.game.add.existing(theItem);
	}
	
	//huge ugly function that puts all the furniture and boxes in their place
	setupLevel() {
		
		//place tables and chairs in restaurant
		Furniture.setTable(this.game, 50, 1270);
		Furniture.setTable(this.game, 110, 1266);
		Furniture.setTable(this.game, 170, 1271);
		Furniture.setTable(this.game, 232, 1270);
		Furniture.setTable(this.game, 50, 1370);
		Furniture.setTable(this.game, 110, 1366);
		Furniture.setTable(this.game, 170, 1371);
		Furniture.setTable(this.game, 232, 1370);
		
		this.game.add.existing(new Furniture(this.game, 130,1110, 'serving'));
		
		this.game.add.existing(new Furniture(this.game, 1300,150, 'checkout'));
		
		//decor area 1
		Box.place(this.game, "lurt", 270, 380);
		Box.place(this.game, "lurt", 290, 380);
		Box.place(this.game, 'lurt', 310, 380);
		Box.place(this.game, 'lurt', 332, 381);
		Box.place(this.game, 'lava', 355, 380);
		
		//dining
		Box.place(this.game, 'borger', 50, 730);
		Box.place(this.game, 'borger', 50, 790);
		Box.place(this.game, 'borger', 100, 750);
		Box.place(this.game, 'borgle', 80, 745);
		Box.place(this.game, 'borgle', 80, 780);
		Box.place(this.game, 'borger', 130, 730);
		Box.place(this.game, 'borger', 130, 790);
		Box.place(this.game, 'borger', 180, 750);
		Box.place(this.game, 'borgle', 160, 745);
		Box.place(this.game, 'borgle', 160, 780);
		Box.place(this.game, 'borger', 370, 730);
		Box.place(this.game, 'borger', 370, 790);
		Box.place(this.game, 'borger', 420, 750);
		Box.place(this.game, 'borgle', 430, 745);
		Box.place(this.game, 'borgle', 430, 780);
		Box.place(this.game, 'bork', 550, 640);
		Box.place(this.game, 'bork', 550, 680);
		Box.place(this.game, 'bork', 540, 710);
		
		//storage 1
		Box.place(this.game, 'fleeb', 320, 50);
		Box.place(this.game, 'pulf', 390, 53);
		Box.place(this.game, 'pulf', 392, 75);
		Box.place(this.game, 'fleeb', 990, 60);
		
		//living
		Box.place(this.game, 'lurt', 830, 530);
		Box.place(this.game, 'lurt', 830, 670);
		Box.place(this.game, 'blarg', 880, 540);
		Box.place(this.game, 'blarg', 870, 620);
		Box.place(this.game, 'pulf', 880, 760);
		Box.place(this.game, 'pulf', 890, 820);
		
		//bedroom
		Box.place(this.game, 'snorg', 580, 990);
		Box.place(this.game, 'snorg', 530, 1000);
		Box.place(this.game, 'snorg', 450, 950);
		Box.place(this.game, 'snorg', 390, 950);
		Box.place(this.game, 'snorg', 400, 990);
		Box.place(this.game, 'snorg', 490, 990);
		
		//decor area 2
		Box.place(this.game, 'lava', 560, 1260);
		Box.place(this.game, 'lava', 560, 1230);
		Box.place(this.game, 'lava', 560, 1190);
		Box.place(this.game, 'lurt', 560, 1150);
		Box.place(this.game, 'lurt', 590, 1150);
		Box.place(this.game, 'lurt', 630, 1150);
		Box.place(this.game, 'lava', 670, 1140);
		Box.place(this.game, 'lava', 670, 1170);
		Box.place(this.game, 'lava', 710, 1130);
		Box.place(this.game, 'lava', 710, 1170);
		
		//storage 2
		Box.place(this.game, 'snorg', 870, 970);
		Box.place(this.game, 'fleeb', 910, 970);
		Box.place(this.game, 'borgle', 860, 1380);
		Box.place(this.game, 'pulf', 890, 1330);
		Box.place(this.game, 'blarg', 1030, 1020);
		Box.place(this.game, 'fleeb', 1110, 1080);
		Box.place(this.game, 'blarg', 1310, 1140);
		Box.place(this.game, 'lava', 1110, 900);
		Box.place(this.game, 'borgle', 1310, 920);
		Box.place(this.game, 'borgle', 1310, 880);
		Box.place(this.game, 'borger', 1020, 780);
		Box.place(this.game, 'borger', 1090, 770);
		Box.place(this.game, 'snorg', 1120, 540);
	}
}