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
        console.log('🎬 Playing replay...', this.replay.frames.length, 'frames, killing blow at:', this.replay.killingBlowFrame);

        // Dark background
        this.cameras.main.setBackgroundColor('#000000');

        // "REPLAY" text (in French)
        const replayText = this.add.text(
            Constants.GAME_WIDTH / 2,
            50,
            'RELECTURE',
            {
                fontSize: '32px',
                fontFamily: 'Arial',
                color: '#ffaa00'
            }
        ).setOrigin(0.5).setAlpha(0.8);

        // Playback variables
        let frameIndex = 0;
        let currentSpeed = 2.0; // Start at 2x speed (fast forward)
        const normalSpeed = 1.0;
        const slowMoSpeed = 0.3; // Slow motion for killing blow

        // Create graphics for rendering
        this.replayGraphics = this.add.graphics();

        // Track active lightning strikes (frameNumber -> graphics)
        this.activeLightning = [];

        // Playback timer
        this.replayTimer = this.time.addEvent({
            delay: 16, // Base delay (60fps)
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

                // Check if we're approaching or at the killing blow
                const killingBlowFrame = this.replay.killingBlowFrame || this.replay.frames.length - 60;
                const framesBeforeKillingBlow = 240; // Start slowing 4 seconds before (to catch the spell being fired)
                const framesAfterKillingBlow = 90; // Continue for 1.5 seconds after

                // Calculate when to start slow motion (at the start of the killing shot)
                const slowMotionStartFrame = killingBlowFrame - framesBeforeKillingBlow;

                if (frameIndex >= slowMotionStartFrame &&
                    frameIndex <= killingBlowFrame + framesAfterKillingBlow) {
                    // SLOW MOTION mode - from when killing shot is fired until after impact
                    if (currentSpeed !== slowMoSpeed) {
                        currentSpeed = slowMoSpeed;
                        this.replayTimer.delay = 16 / slowMoSpeed;
                        replayText.setText('RALENTI - MOMENTS FINAUX'); // French: Slow motion - Final moments
                        replayText.setColor('#ff3300');
                        console.log('🎬 Entering SLOW MOTION at frame:', frameIndex);
                    }
                } else if (frameIndex < slowMotionStartFrame) {
                    // Fast forward everything before the killing shot
                    if (currentSpeed !== 3.0) {
                        currentSpeed = 3.0; // Even faster to get to the action
                        this.replayTimer.delay = 16 / 3.0;
                        replayText.setText('RELECTURE ACCÉLÉRÉE'); // French: Fast replay
                    }
                }

                // Render frame (skip frames during fast-forward for performance)
                const skipFrames = currentSpeed >= 3.0 ? 2 : 0; // Skip every other frame during fast-forward
                this.renderReplayFrame(this.replay.frames[frameIndex], frameIndex, currentSpeed >= 3.0);
                frameIndex += 1 + skipFrames;
            },
            loop: true
        });
    }

    renderReplayFrame(frame, frameIndex, isFastForward = false) {
        this.replayGraphics.clear();

        // Draw arena background
        this.replayGraphics.fillStyle(Constants.ARENA_BG);
        this.replayGraphics.fillRect(0, 0, Constants.GAME_WIDTH, Constants.GAME_HEIGHT);

        // Clean up old lightning strikes
        this.activeLightning = this.activeLightning.filter(lightning => {
            if (frameIndex - lightning.frameNumber > 10) {
                lightning.graphics.destroy();
                return false;
            }
            return true;
        });

        // Check for new lightning strikes at this frame (skip during fast-forward for performance)
        if (!isFastForward && this.replay.lightningStrikes) {
            const strikesThisFrame = this.replay.lightningStrikes.filter(s => s.frameNumber === frameIndex);
            strikesThisFrame.forEach(strike => {
                const lightningGfx = this.add.graphics();
                this.drawLightning(lightningGfx, strike.fromX, strike.fromY, strike.toX, strike.toY, isFastForward);
                this.activeLightning.push({
                    frameNumber: frameIndex,
                    graphics: lightningGfx
                });
            });
        }

        // Draw power-ups (simplified during fast-forward)
        if (frame.powerUps) {
            frame.powerUps.forEach(powerUp => {
                const color = this.getPowerUpColor(powerUp.type);

                if (isFastForward) {
                    // Simple version for performance
                    this.replayGraphics.fillStyle(color, 0.8);
                    this.replayGraphics.fillCircle(powerUp.x, powerUp.y, 18);
                } else {
                    // Full detail version
                    // Outer glow
                    this.replayGraphics.fillStyle(color, 0.3);
                    this.replayGraphics.fillCircle(powerUp.x, powerUp.y, 25);

                    // Main circle
                    this.replayGraphics.fillStyle(color, 0.8);
                    this.replayGraphics.fillCircle(powerUp.x, powerUp.y, 18);

                    // Inner highlight
                    this.replayGraphics.fillStyle(0xffffff, 0.6);
                    this.replayGraphics.fillCircle(powerUp.x - 5, powerUp.y - 5, 6);
                }
            });
        }

        // Draw projectiles (simplified during fast-forward)
        if (frame.projectiles) {
            frame.projectiles.forEach(proj => {
                if (proj.type === 'fireball') {
                    if (isFastForward) {
                        // Simple fireball
                        this.replayGraphics.fillStyle(0xff3300, 1);
                        this.replayGraphics.fillCircle(proj.x, proj.y, 20);
                    } else {
                        // Full detail fireball
                        this.replayGraphics.fillStyle(0xff6600, 0.5);
                        this.replayGraphics.fillCircle(proj.x, proj.y, 24);
                        this.replayGraphics.fillStyle(0xff3300, 1);
                        this.replayGraphics.fillCircle(proj.x, proj.y, 20);
                        this.replayGraphics.fillStyle(0xffff00, 0.8);
                        this.replayGraphics.fillCircle(proj.x, proj.y, 12);
                    }
                } else if (proj.type === 'iceshard') {
                    const size = 18;
                    if (isFastForward) {
                        // Simple ice shard
                        this.replayGraphics.fillStyle(0x00ccff, 0.8);
                        this.replayGraphics.fillCircle(proj.x, proj.y, size);
                    } else {
                        // Full detail ice shard
                        this.replayGraphics.fillStyle(0x00ccff, 0.8);
                        this.replayGraphics.fillTriangle(proj.x - size, proj.y, proj.x + size, proj.y, proj.x, proj.y - size * 1.5);
                        this.replayGraphics.fillTriangle(proj.x - size, proj.y, proj.x + size, proj.y, proj.x, proj.y + size * 1.5);
                        this.replayGraphics.fillStyle(0xffffff, 0.6);
                        this.replayGraphics.fillTriangle(proj.x - size * 0.3, proj.y, proj.x + size * 0.3, proj.y, proj.x, proj.y - size * 0.8);
                    }
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

    getPowerUpColor(type) {
        switch(type) {
            case 'speed': return 0x00ff00;      // Green
            case 'damage': return 0xff0000;     // Red
            case 'rapidfire': return 0xffff00;  // Yellow
            case 'giant': return 0xff00ff;      // Magenta
            case 'health': return 0xff69b4;     // Pink
            case 'mana': return 0x00ffff;       // Cyan
            default: return 0xffffff;           // White
        }
    }

    drawLightning(graphics, x1, y1, x2, y2) {
        graphics.lineStyle(4, 0x00ffff, 1);

        // Draw jagged lightning bolt
        const steps = 8;
        const dx = (x2 - x1) / steps;
        const dy = (y2 - y1) / steps;

        graphics.beginPath();
        graphics.moveTo(x1, y1);

        for (let i = 1; i < steps; i++) {
            const jitterX = (Math.random() - 0.5) * 40;
            const jitterY = (Math.random() - 0.5) * 40;
            graphics.lineTo(x1 + dx * i + jitterX, y1 + dy * i + jitterY);
        }

        graphics.lineTo(x2, y2);
        graphics.strokePath();

        // Add branching arcs
        for (let i = 0; i < 3; i++) {
            const branchX = x1 + (x2 - x1) * (0.3 + Math.random() * 0.4);
            const branchY = y1 + (y2 - y1) * (0.3 + Math.random() * 0.4);
            const endX = branchX + (Math.random() - 0.5) * 60;
            const endY = branchY + (Math.random() - 0.5) * 60;

            graphics.lineStyle(2, 0x00ffff, 0.7);
            graphics.lineBetween(branchX, branchY, endX, endY);
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
