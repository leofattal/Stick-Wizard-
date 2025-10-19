class TieScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TieScene' });
    }

    create() {
        // Dark background
        this.add.rectangle(
            Constants.GAME_WIDTH / 2,
            Constants.GAME_HEIGHT / 2,
            Constants.GAME_WIDTH,
            Constants.GAME_HEIGHT,
            0x000000,
            0.8
        );

        // Title
        const title = this.add.text(
            Constants.GAME_WIDTH / 2,
            150,
            'IT\'S A TIE!',
            {
                fontSize: '72px',
                fontFamily: 'Arial',
                color: '#ffaa00',
                stroke: '#000000',
                strokeThickness: 8
            }
        ).setOrigin(0.5);

        // Animate title
        this.tweens.add({
            targets: title,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Subtitle
        this.add.text(
            Constants.GAME_WIDTH / 2,
            240,
            'Both Wizards Fell!',
            {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#cccccc'
            }
        ).setOrigin(0.5);

        // Draw both wizard symbols (crossed out)
        this.drawWizardSymbol(Constants.GAME_WIDTH / 2 - 100, 350, Constants.PLAYER1_COLOR);
        this.drawWizardSymbol(Constants.GAME_WIDTH / 2 + 100, 350, Constants.PLAYER2_COLOR);

        // Draw X over both
        const graphics = this.add.graphics();
        graphics.lineStyle(6, 0xff0000);
        graphics.lineBetween(
            Constants.GAME_WIDTH / 2 - 150,
            300,
            Constants.GAME_WIDTH / 2 + 150,
            400
        );
        graphics.lineBetween(
            Constants.GAME_WIDTH / 2 - 150,
            400,
            Constants.GAME_WIDTH / 2 + 150,
            300
        );

        // Rematch button
        const rematchButton = this.createButton(
            Constants.GAME_WIDTH / 2,
            500,
            'REMATCH',
            () => this.scene.start('GameScene', { aiMode: this.aiMode })
        );

        // Menu button
        const menuButton = this.createButton(
            Constants.GAME_WIDTH / 2,
            580,
            'MAIN MENU',
            () => this.scene.start('MenuScene')
        );

        // Sparkle effects
        this.createSparkles();
    }

    drawWizardSymbol(x, y, color) {
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

        return graphics;
    }

    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);

        // Button background
        const bg = this.add.rectangle(0, 0, 300, 70, 0x555555);
        bg.setStrokeStyle(4, 0xffffff);

        // Button text
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);

        button.add(bg);
        button.add(buttonText);

        // Make interactive
        bg.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                bg.setFillStyle(0x777777);
                this.tweens.add({
                    targets: button,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 100
                });
            })
            .on('pointerout', () => {
                bg.setFillStyle(0x555555);
                this.tweens.add({
                    targets: button,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 100
                });
            })
            .on('pointerdown', callback);

        return button;
    }

    createSparkles() {
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * Constants.GAME_WIDTH;
            const y = Math.random() * Constants.GAME_HEIGHT;
            const sparkle = this.add.circle(x, y, 2, 0xffaa00, 0.8);

            this.tweens.add({
                targets: sparkle,
                alpha: 0,
                scale: 2,
                duration: 1000 + Math.random() * 1000,
                delay: Math.random() * 2000,
                yoyo: true,
                repeat: -1
            });
        }
    }
}
