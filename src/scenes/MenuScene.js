class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        // Start background music
        this.music = document.getElementById('background-music');
        this.musicEnabled = true;

        if (this.music) {
            this.music.volume = 0.3; // Set volume to 30%
            this.music.play().catch(e => {
                console.log('Music autoplay prevented. Click to start music.');
                // Add click listener to start music on first interaction
                document.addEventListener('click', () => {
                    if (this.musicEnabled) {
                        this.music.play();
                    }
                }, { once: true });
            });
        }

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
            'Learn French Through Magical Combat',
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#cccccc'
            }
        ).setOrigin(0.5);

        // Play button (AI only)
        const playButton = this.createButton(
            Constants.GAME_WIDTH / 2,
            370,
            'PLAY',
            () => this.scene.start('GameScene', { aiMode: true })
        );

        // Music toggle button
        this.createMusicToggle();

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

        // Player controls (centered)
        this.add.text(
            Constants.GAME_WIDTH / 2,
            controlsY,
            'CONTROLS\nMove: WASD\nFireball: Q\nLightning: E\nIce Shard: F\nShield: R\nDash: SHIFT\n\nConjugate French verbs correctly to cast spells!',
            {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#ffaa00',
                align: 'center',
                lineSpacing: 8
            }
        ).setOrigin(0.5, 0);
    }

    createMusicToggle() {
        const x = Constants.GAME_WIDTH - 60;
        const y = 30;

        // Container for the toggle
        const container = this.add.container(x, y);

        // Background circle
        const bg = this.add.circle(0, 0, 25, 0x333333);
        bg.setStrokeStyle(2, 0xffffff);

        // Music icon (note symbol)
        this.musicIcon = this.add.text(0, 0, '♪', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#00ff00'
        }).setOrigin(0.5);

        container.add([bg, this.musicIcon]);

        // Make interactive
        bg.setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                bg.setFillStyle(0x444444);
                container.setScale(1.1);
            })
            .on('pointerout', () => {
                bg.setFillStyle(0x333333);
                container.setScale(1);
            })
            .on('pointerdown', () => {
                container.setScale(0.95);
            })
            .on('pointerup', () => {
                container.setScale(1.1);
                this.toggleMusic();
            });

        return container;
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;

        if (this.music) {
            if (this.musicEnabled) {
                this.music.play();
                this.musicIcon.setColor('#00ff00'); // Green = on
            } else {
                this.music.pause();
                this.musicIcon.setColor('#ff0000'); // Red = off
            }
        }
    }
}
