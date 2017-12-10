"use strict"

import {Player} from '../entities/Player.js';
import {Table} from '../entities/Table.js';
import {ServingTable} from '../entities/ServingTable.js';
import {Chair} from '../entities/Chair.js';
import {Checkout} from '../entities/Checkout.js';
import {Box} from '../entities/Box.js';
import {GamePackage} from '../components/GamePackage.js';

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
		var setTable = (x, y) => {
			var rand = [Math.random(), Math.random(), Math.random()];
			this.game.add.existing(new Table(this.game, x, y)).body.angle = rand[0]*2-1;
			this.game.add.existing(new Chair(this.game, x, y+30)).body.angle = 180 + (rand[1]*10-5);
			this.game.add.existing(new Chair(this.game, x, y-26)).body.angle = rand[2]*10-5;
		};
		
		var placeBox = (type, x, y) => {
			var thePackage;
			switch(type) {
				case "snorg":
					thePackage = new GamePackage(70, "Snörg", 299, "snorg");
					break;
				case "borgle":
					thePackage = new GamePackage(10, "Borgle", 45, "borgle");
					break;
				case "lurt":
					thePackage = new GamePackage(5, "Lürt", 32, "lurt");
					break;
				case "lava":
					thePackage = new GamePackage(7, "Låva", 20, "lava");
					break;
				case "pulf":
					thePackage = new GamePackage(10, "Pulf", 29, "pulf");
					break;
				case "fleeb":
					thePackage = new GamePackage(20, "Flëeb", 89, "fleeb");
					break;
				case "borger":
					thePackage = new GamePackage(40, "Borger", 169, "borger");
					break;
				case "blarg":
					thePackage = new GamePackage(30, "Blarg", 59, "blarg");
					break;
				case "bork":
					thePackage = new GamePackage(8, "Bork", 61, "bork");
					break;
				default:
					console.warn("Generic pacakge placed at ", x, y);
					thePackage = new GamePackage();
			}
			this.game.add.existing(new Box(this.game, x, y, thePackage));
		};
		
		setTable(50, 1270);
		setTable(110, 1266);
		setTable(170, 1271);
		setTable(232, 1270);
		setTable(50, 1370);
		setTable(110, 1366);
		setTable(170, 1371);
		setTable(232, 1370);
		
		this.game.add.existing(new ServingTable(this.game, 130,1110));
		
		this.game.add.existing(new Checkout(this.game, 1300,150));
		
		//decor area 1
		placeBox("lurt", 270, 380);
		placeBox("lurt", 290, 380);
		placeBox('lurt', 310, 380);
		placeBox('lurt', 332, 381);
		placeBox('lava', 355, 380);
		
		//dining
		placeBox('borger', 50, 730);
		placeBox('borger', 50, 790);
		placeBox('borger', 100, 750);
		placeBox('borgle', 80, 745);
		placeBox('borgle', 80, 780);
		placeBox('borger', 130, 730);
		placeBox('borger', 130, 790);
		placeBox('borger', 180, 750);
		placeBox('borgle', 160, 745);
		placeBox('borgle', 160, 780);
		placeBox('borger', 370, 730);
		placeBox('borger', 370, 790);
		placeBox('borger', 420, 750);
		placeBox('borgle', 430, 745);
		placeBox('borgle', 430, 780);
		placeBox('bork', 550, 640);
		placeBox('bork', 550, 680);
		placeBox('bork', 540, 710);
		
		//storage 1
		placeBox('fleeb', 320, 50);
		placeBox('pulf', 390, 53);
		placeBox('pulf', 392, 75);
		placeBox('fleeb', 990, 60);
		
		//living
		placeBox('lurt', 830, 530);
		placeBox('lurt', 830, 670);
		placeBox('blarg', 880, 540);
		placeBox('blarg', 870, 620);
		placeBox('pulf', 880, 760);
		placeBox('pulf', 890, 820);
		
		//bedroom
		placeBox('snorg', 580, 990);
		placeBox('snorg', 530, 1000);
		placeBox('snorg', 450, 950);
		placeBox('snorg', 390, 950);
		placeBox('snorg', 400, 990);
		placeBox('snorg', 490, 990);
		
		//decor area 2
		placeBox('lava', 560, 1260);
		placeBox('lava', 560, 1230);
		placeBox('lava', 560, 1190);
		placeBox('lurt', 560, 1150);
		placeBox('lurt', 590, 1150);
		placeBox('lurt', 630, 1150);
		placeBox('lava', 670, 1140);
		placeBox('lava', 670, 1170);
		placeBox('lava', 710, 1130);
		placeBox('lava', 710, 1170);
		
		//storage 2
		placeBox('snorg', 870, 970);
		placeBox('fleeb', 910, 970);
		placeBox('borgle', 860, 1380);
		placeBox('pulf', 890, 1330);
		placeBox('blarg', 1030, 1020);
		placeBox('fleeb', 1110, 1080);
		placeBox('blarg', 1310, 1140);
		placeBox('lava', 1110, 900);
		placeBox('borgle', 1310, 920);
		placeBox('borgle', 1310, 880);
		placeBox('borger', 1020, 780);
		placeBox('borger', 1090, 770);
		placeBox('snorg', 1120, 540);
	}
}