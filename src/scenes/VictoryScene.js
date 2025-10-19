class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    init(data) {
        this.winner = data.winner || 1;
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

        // Victory banner
        const bannerText = `PLAYER ${this.winner} WINS!`;
        const winnerColor = this.winner === 1 ? '#ff6666' : '#6666ff';

        const banner = this.add.text(
            Constants.GAME_WIDTH / 2,
            200,
            bannerText,
            {
                fontSize: '72px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: winnerColor,
                stroke: '#000000',
                strokeThickness: 8
            }
        ).setOrigin(0.5);

        // Animate banner
        banner.setScale(0);
        this.tweens.add({
            targets: banner,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });

        // Add confetti/celebration effect
        this.createCelebration();

        // Victory wizard
        this.createVictoryWizard();

        // Stats (placeholder for now)
        this.add.text(
            Constants.GAME_WIDTH / 2,
            350,
            'VICTORY',
            {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        // Buttons
        this.createButton(
            Constants.GAME_WIDTH / 2 - 150,
            500,
            'REMATCH',
            () => this.scene.start('GameScene')
        );

        this.createButton(
            Constants.GAME_WIDTH / 2 + 150,
            500,
            'MENU',
            () => this.scene.start('MenuScene')
        );

        // Instruction
        this.add.text(
            Constants.GAME_WIDTH / 2,
            Constants.GAME_HEIGHT - 50,
            'Press ESC for Menu',
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#888888'
            }
        ).setOrigin(0.5);

        // ESC key handler
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });
    }

    createVictoryWizard() {
        const x = Constants.GAME_WIDTH / 2;
        const y = 280;
        const color = this.winner === 1 ? Constants.PLAYER1_COLOR : Constants.PLAYER2_COLOR;

        const wizard = this.add.graphics();
        wizard.x = x;
        wizard.y = y;

        // Head
        wizard.lineStyle(3, color);
        wizard.strokeCircle(0, -40, 12);

        // Body
        wizard.lineBetween(0, -28, 0, 0);

        // Arms (raised in victory)
        wizard.lineBetween(0, -20, -20, -35);
        wizard.lineBetween(0, -20, 20, -35);

        // Legs
        wizard.lineBetween(0, 0, -12, 25);
        wizard.lineBetween(0, 0, 12, 25);

        // Wizard hat
        wizard.fillStyle(color);
        wizard.fillTriangle(-10, -52, 10, -52, 0, -72);
        wizard.fillRect(-12, -52, 24, 4);

        // Staff (raised high)
        wizard.lineStyle(2, 0x8B4513);
        wizard.lineBetween(20, -35, 25, -55);

        // Staff orb (glowing)
        wizard.fillStyle(color, 1);
        wizard.fillCircle(25, -60, 8);

        // Animate wizard
        this.tweens.add({
            targets: wizard,
            y: y - 10,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createCelebration() {
        // Create particle bursts
        for (let i = 0; i < 50; i++) {
            const x = Constants.GAME_WIDTH / 2 + (Math.random() - 0.5) * 300;
            const y = 150 + Math.random() * 100;

            const particle = this.add.circle(
                Constants.GAME_WIDTH / 2,
                200,
                3 + Math.random() * 3,
                Phaser.Display.Color.GetColor(
                    Math.random() * 255,
                    Math.random() * 255,
                    Math.random() * 255
                )
            );

            this.tweens.add({
                targets: particle,
                x: x,
                y: y + 200,
                alpha: 0,
                scale: 0,
                duration: 1000 + Math.random() * 1000,
                delay: Math.random() * 500,
                ease: 'Cubic.easeOut'
            });
        }

        // Continuous sparkles
        this.time.addEvent({
            delay: 200,
            callback: () => this.createSparkle(),
            loop: true
        });
    }

    createSparkle() {
        const x = Constants.GAME_WIDTH / 2 + (Math.random() - 0.5) * 400;
        const y = 100 + Math.random() * 200;

        const sparkle = this.add.star(
            x, y,
            5,
            4, 8,
            0xffff00
        );

        this.tweens.add({
            targets: sparkle,
            alpha: 0,
            scale: 0,
            rotation: Math.PI * 2,
            duration: 800,
            ease: 'Cubic.easeOut',
            onComplete: () => sparkle.destroy()
        });
    }

    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);

        // Button background
        const bg = this.add.rectangle(0, 0, 200, 60, 0x4444ff);
        bg.setStrokeStyle(3, 0xffffff);

        // Button text
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '28px',
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
}
