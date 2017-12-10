const PHASER_CONFIG = {
	parent: 'game',
	width: '100%',
	height: '100%',
	renderer: Phaser.AUTO
};

import {Boot} from './states/Boot.js';
import {Gameplay} from './states/Gameplay.js';

var game = new Phaser.Game(PHASER_CONFIG);

game.state.add('Boot', Boot);
game.state.add('Gameplay', Gameplay);
game.state.start('Boot', true, false, 'Gameplay');