class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Background
        this.add.rectangle(
            Constants.GAME_WIDTH / 2,
            Constants.GAME_HEIGHT / 2,
            Constants.GAME_WIDTH,
            Constants.GAME_HEIGHT,
            Constants.ARENA_BG
        );

        // Add animated wizard silhouettes
        this.createWizardSilhouettes();

        // Title
        const title = this.add.text(
            Constants.GAME_WIDTH / 2,
            150,
            'STICK WIZARD DUEL',
            {
                fontSize: '64px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        // Title glow animation
        this.tweens.add({
            targets: title,
            alpha: 0.7,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Subtitle
        this.add.text(
            Constants.GAME_WIDTH / 2,
            220,
            'Battle of Magical Stickmen',
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#cccccc'
            }
        ).setOrigin(0.5);

        // Play button (2 Player)
        const playButton = this.createButton(
            Constants.GAME_WIDTH / 2,
            320,
            '2 PLAYERS',
            () => this.scene.start('GameScene', { aiMode: false })
        );

        // AI button
        const aiButton = this.createButton(
            Constants.GAME_WIDTH / 2,
            420,
            'VS AI BOT',
            () => this.scene.start('GameScene', { aiMode: true })
        );

        // Controls instruction
        this.createControlsDisplay();

        // Credits
        this.add.text(
            Constants.GAME_WIDTH / 2,
            Constants.GAME_HEIGHT - 30,
            'Press PLAY to start | Made with Phaser 3',
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#888888'
            }
        ).setOrigin(0.5);
    }

    createWizardSilhouettes() {
        // Left wizard (red)
        const leftWizard = this.createWizardGraphic(300, 400, Constants.PLAYER1_COLOR);
        this.tweens.add({
            targets: leftWizard,
            y: 390,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Right wizard (blue)
        const rightWizard = this.createWizardGraphic(980, 400, Constants.PLAYER2_COLOR);
        this.tweens.add({
            targets: rightWizard,
            y: 410,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Add magical sparkles between them
        this.createSparkles();
    }

    createWizardGraphic(x, y, color) {
        const graphics = this.add.graphics();
        graphics.x = x;
        graphics.y = y;

        // Head
        graphics.lineStyle(3, color, 0.5);
        graphics.strokeCircle(0, -40, 12);

        // Body
        graphics.lineBetween(0, -28, 0, 0);

        // Arms
        graphics.lineBetween(0, -20, -15, -5);
        graphics.lineBetween(0, -20, 15, -5);

        // Legs
        graphics.lineBetween(0, 0, -12, 25);
        graphics.lineBetween(0, 0, 12, 25);

        // Wizard hat
        graphics.fillStyle(color, 0.5);
        graphics.fillTriangle(-10, -52, 10, -52, 0, -72);
        graphics.fillRect(-12, -52, 24, 4);

        // Staff
        graphics.lineStyle(2, 0x8B4513, 0.5);
        graphics.lineBetween(15, -5, 18, 20);

        // Staff orb
        graphics.fillStyle(color, 0.7);
        graphics.fillCircle(18, -8, 5);

        return graphics;
    }

    createSparkles() {
        for (let i = 0; i < 20; i++) {
            const x = 400 + Math.random() * 480;
            const y = 300 + Math.random() * 200;
            const sparkle = this.add.circle(x, y, 2, 0xffff00, 0.8);

            this.tweens.add({
                targets: sparkle,
                alpha: 0,
                scale: 1.5,
                duration: 1000 + Math.random() * 1000,
                delay: Math.random() * 2000,
                yoyo: true,
                repeat: -1
            });
        }
    }

    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);

        // Button background
        const bg = this.add.rectangle(0, 0, 300, 80, 0x4444ff);
        bg.setStrokeStyle(4, 0xffffff);

        // Button text
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '36px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        button.add([bg, buttonText]);

        // Make interactive
        bg.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                bg.setFillStyle(0x6666ff);
                button.setScale(1.05);
            })
            .on('pointerout', () => {
                bg.setFillStyle(0x4444ff);
                button.setScale(1);
            })
            .on('pointerdown', () => {
                button.setScale(0.95);
            })
            .on('pointerup', () => {
                button.setScale(1.05);
                callback();
            });

        return button;
    }

    createControlsDisplay() {
        const controlsY = 480;

        // Player 1 controls
        this.add.text(
            200,
            controlsY,
            'PLAYER 1\nMove: WASD\nFireball: Q\nLightning: E\nIce Shard: F\nShield: R\nDash: SHIFT',
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#ff6666',
                align: 'left',
                lineSpacing: 8
            }
        );

        // Player 2 controls
        this.add.text(
            Constants.GAME_WIDTH - 200,
            controlsY,
            'PLAYER 2\nMove: ARROWS\nFireball: I\nLightning: O\nIce Shard: U\nShield: P\nDash: ENTER',
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#6666ff',
                align: 'right',
                lineSpacing: 8
            }
        ).setOrigin(1, 0);
    }
}
