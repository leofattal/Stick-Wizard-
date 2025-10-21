class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    init(data) {
        this.winner = data.winner || 1;
        this.aiMode = data.aiMode || false;
        this.replay = data.replay || null;
    }

    create() {
        // Play replay first if available
        if (this.replay && this.replay.frames && this.replay.frames.length > 0) {
            this.playReplay();
            return; // Return early - replay will call showVictoryScreen() when done
        }

        // No replay - show victory screen immediately
        this.showVictoryScreen();
    }

    playReplay() {
        console.log('🎬 Playing replay...', this.replay.frames.length, 'frames');

        // Dark background
        this.cameras.main.setBackgroundColor('#000000');

        // "REPLAY" text
        const replayText = this.add.text(
            Constants.GAME_WIDTH / 2,
            50,
            'REPLAY - FINAL MOMENTS',
            {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#ffaa00'
            }
        ).setOrigin(0.5).setAlpha(0.8);

        // Playback variables
        let frameIndex = 0;
        const playbackSpeed = 0.5; // Slow motion! (0.5 = half speed)

        // Create graphics for rendering
        this.replayGraphics = this.add.graphics();

        // Playback timer
        this.replayTimer = this.time.addEvent({
            delay: 16 / playbackSpeed, // ~60fps adjusted for slow motion
            callback: () => {
                if (frameIndex >= this.replay.frames.length) {
                    // Replay finished
                    this.replayTimer.remove();
                    this.replayGraphics.destroy();
                    replayText.destroy();

                    // Fade to victory screen
                    this.cameras.main.fadeOut(500, 0, 0, 0);
                    this.time.delayedCall(500, () => {
                        this.showVictoryScreen();
                    });
                    return;
                }

                // Render frame
                this.renderReplayFrame(this.replay.frames[frameIndex]);
                frameIndex++;
            },
            loop: true
        });
    }

    renderReplayFrame(frame) {
        this.replayGraphics.clear();

        // Draw arena background
        this.replayGraphics.fillStyle(Constants.ARENA_BG);
        this.replayGraphics.fillRect(0, 0, Constants.GAME_WIDTH, Constants.GAME_HEIGHT);

        // Draw projectiles
        if (frame.projectiles) {
            frame.projectiles.forEach(proj => {
                if (proj.type === 'fireball') {
                    this.replayGraphics.fillStyle(0xff3300);
                    this.replayGraphics.fillCircle(proj.x, proj.y, 20);
                } else if (proj.type === 'iceshard') {
                    this.replayGraphics.fillStyle(0x00ccff);
                    this.replayGraphics.fillCircle(proj.x, proj.y, 18);
                }
            });
        }

        // Draw players
        if (frame.player1) {
            this.drawWizard(frame.player1, 1);
        }
        if (frame.player2) {
            this.drawWizard(frame.player2, 2);
        }
    }

    drawWizard(playerData, playerNumber) {
        if (!playerData) return;

        const color = playerData.color || (playerNumber === 1 ? Constants.PLAYER1_COLOR : Constants.PLAYER2_COLOR);
        const x = playerData.x;
        const y = playerData.y;
        const alpha = playerData.alpha || 1;

        // Head
        this.replayGraphics.lineStyle(3, color, alpha);
        this.replayGraphics.strokeCircle(x, y - 40, 12);

        // Body
        this.replayGraphics.lineBetween(x, y - 28, x, y);

        // Arms
        this.replayGraphics.lineBetween(x, y - 20, x - 15, y - 5);
        this.replayGraphics.lineBetween(x, y - 20, x + 15, y - 5);

        // Legs
        this.replayGraphics.lineBetween(x, y, x - 12, y + 25);
        this.replayGraphics.lineBetween(x, y, x + 12, y + 25);

        // Hat
        this.replayGraphics.fillStyle(color, alpha * 0.5);
        this.replayGraphics.fillTriangle(x - 10, y - 52, x + 10, y - 52, x, y - 72);

        // Shield if active
        if (playerData.isShielding) {
            this.replayGraphics.lineStyle(3, 0x00ffff, 0.8);
            this.replayGraphics.strokeCircle(x, y - 20, 40);
        }
    }

    showVictoryScreen() {
        // Clear any existing graphics
        if (this.replayGraphics) {
            this.replayGraphics.destroy();
        }

        // Reset camera
        this.cameras.main.setBackgroundColor(Constants.ARENA_BG);
        this.cameras.main.fadeIn(500, 42, 42, 62);

        this.createVictoryUI();
    }

    createVictoryUI() {
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
