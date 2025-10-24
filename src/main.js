// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: Constants.GAME_WIDTH,
    height: Constants.GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: Constants.GAME_WIDTH,
        height: Constants.GAME_HEIGHT
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [MenuScene, GameScene, VictoryScene, TieScene]
};

// Create game instance
const game = new Phaser.Game(config);

// Log game start
console.log('Stick Wizard Duel - Game Started!');
console.log('Player 1 Controls: WASD (move), Q (fireball), E (lightning), R (shield), SHIFT (dash)');
console.log('Player 2 Controls: Arrows (move), I (fireball), O (lightning), P (shield), ENTER (dash)');
