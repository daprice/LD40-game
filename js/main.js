game = new Phaser.Game(Ld40.phaserConfig);

game.state.add('Ld40.states.Boot', Ld40.states.Boot)
game.state.add('Ld40.states.Gameplay', Ld40.states.Gameplay);
game.state.start('Ld40.states.Boot');