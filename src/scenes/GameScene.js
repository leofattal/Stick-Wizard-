class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.projectiles = [];
        this.powerUps = [];
    }

    create(data) {
        // Check if AI mode
        this.aiMode = data.aiMode || false;
        console.log('🎮 Game started -', this.aiMode ? 'VS AI BOT' : '2 PLAYERS');

        // Create replay recorder
        this.replayRecorder = new ReplayRecorder(this);
        this.replayRecorder.startRecording();

        // Create conjugation quiz system
        this.conjugationQuiz = new ConjugationQuiz(this);
        this.player1PendingAction = null;
        this.player2PendingAction = null;

        // Create platformer race level
        this.createPlatformerLevel();

        // Create checkpoints array
        this.checkpoints = [];
        this.createCheckpoints();

        // Create players at start line
        this.player1 = new Wizard(this, 100, Constants.GROUND_Y - 100, 1);
        this.player2 = new Wizard(this, 100, Constants.GROUND_Y - 200, 2);

        // Track player checkpoints
        this.player1.currentCheckpoint = 0;
        this.player1.checkpointX = 100;
        this.player1.checkpointY = Constants.GROUND_Y - 100;
        this.player2.currentCheckpoint = 0;
        this.player2.checkpointX = 100;
        this.player2.checkpointY = Constants.GROUND_Y - 200;

        // Setup AI controller for Player 2 if in AI mode
        if (this.aiMode) {
            this.aiController = new AIController(this.player2, this.player1);
            console.log('🤖 AI Controller activated for Player 2');
        }

        // Setup input
        this.setupInput();

        // Create mobile controls if on mobile device
        this.mobileControls = new MobileControls(this, this.player1);

        // Create UI
        this.createUI();

        // Setup collisions
        this.setupCollisions();

        // Create particle texture (simple circle for now)
        this.createParticleTexture();

        // Start power-up spawning
        this.setupPowerUpSpawning();

        // Setup camera to follow player 1
        this.cameras.main.setBounds(0, 0, Constants.LEVEL_WIDTH, Constants.GAME_HEIGHT);
        this.cameras.main.startFollow(this.player1.sprite, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(200, 100);

        // Set world bounds for physics
        this.physics.world.setBounds(0, 0, Constants.LEVEL_WIDTH, Constants.GAME_HEIGHT);
    }

    createPlatformerLevel() {
        // Create platforms group
        this.platforms = this.physics.add.staticGroup();

        // Ground - create one long rectangle instead of many small ones
        const ground = this.add.rectangle(Constants.LEVEL_WIDTH / 2, Constants.GROUND_Y, Constants.LEVEL_WIDTH, Constants.PLATFORM_HEIGHT, 0x4a4a4a);
        this.physics.add.existing(ground, true); // true = static body
        this.platforms.add(ground);

        // Create varied platforms for platforming challenge
        const platformData = [
            // Starting area - easy
            { x: 400, y: 550, width: 150 },
            { x: 600, y: 500, width: 100 },
            { x: 800, y: 450, width: 150 },

            // First checkpoint area
            { x: 1100, y: 500, width: 120 },
            { x: 1300, y: 400, width: 100 },

            // Mid section - more challenging
            { x: 1800, y: 500, width: 100 },
            { x: 2000, y: 450, width: 80 },
            { x: 2150, y: 400, width: 80 },
            { x: 2300, y: 350, width: 100 },

            // Second checkpoint area
            { x: 2700, y: 500, width: 150 },
            { x: 2900, y: 450, width: 100 },

            // Advanced section
            { x: 3300, y: 400, width: 100 },
            { x: 3500, y: 350, width: 80 },
            { x: 3650, y: 300, width: 80 },
            { x: 3800, y: 400, width: 100 },

            // Third checkpoint area
            { x: 4200, y: 500, width: 150 },

            // Final challenge
            { x: 4600, y: 450, width: 100 },
            { x: 4800, y: 400, width: 100 },
            { x: 5000, y: 350, width: 100 },
            { x: 5200, y: 450, width: 100 },

            // Finish line platform
            { x: 5800, y: 500, width: 400 }
        ];

        platformData.forEach(p => {
            const platform = this.add.rectangle(p.x, p.y, p.width, Constants.PLATFORM_HEIGHT, 0x6666aa);
            this.platforms.add(platform);
            platform.refreshBody();
        });

        // Background handled by game config
    }

    createCheckpoints() {
        // Create checkpoints every CHECKPOINT_SPACING pixels
        for (let i = 1; i <= 4; i++) {
            const x = i * Constants.CHECKPOINT_SPACING;

            // Checkpoint flag pole
            const pole = this.add.rectangle(x, Constants.GROUND_Y - 100, 10, 200, 0x888888);
            pole.setDepth(5);

            // Checkpoint flag
            const flag = this.add.triangle(x, Constants.GROUND_Y - 180, 0, 0, 60, 20, 0, 40, 0x00ff00, 0.8);
            flag.setOrigin(0, 0.5);
            flag.setDepth(5);

            // Checkpoint number
            const text = this.add.text(x, Constants.GROUND_Y - 220, `#${i}`, {
                fontSize: '32px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: '#00ff00'
            }).setOrigin(0.5);
            text.setDepth(5);

            // Create trigger zone
            const trigger = this.add.rectangle(x, Constants.GROUND_Y - 100, 50, 200, 0x00ff00, 0);
            this.physics.add.existing(trigger);
            trigger.body.setAllowGravity(false);

            this.checkpoints.push({
                index: i,
                x: x,
                y: Constants.GROUND_Y - 100,
                pole, flag, text, trigger
            });
        }

        // Finish line
        const finishX = Constants.LEVEL_WIDTH - 300;
        const finishLine = this.add.rectangle(finishX, Constants.GROUND_Y - 100, 20, 200, 0xffaa00);
        finishLine.setDepth(5);

        const finishText = this.add.text(finishX, Constants.GROUND_Y - 220, 'FINISH', {
            fontSize: '48px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ffaa00'
        }).setOrigin(0.5);
        finishText.setDepth(5);

        const finishTrigger = this.add.rectangle(finishX, Constants.GROUND_Y - 100, 100, 200, 0xffaa00, 0);
        this.physics.add.existing(finishTrigger);
        finishTrigger.body.setAllowGravity(false);

        this.finishLine = { x: finishX, trigger: finishTrigger, line: finishLine, text: finishText };
    }

    createArena() {
        // Background
        this.add.rectangle(
            Constants.GAME_WIDTH / 2,
            Constants.GAME_HEIGHT / 2,
            Constants.GAME_WIDTH,
            Constants.GAME_HEIGHT,
            Constants.ARENA_BG
        );

        // Arena floor with mystical runes
        const floor = this.add.graphics();
        floor.fillStyle(0x1a1a28, 0.8);
        floor.fillRect(0, Constants.GAME_HEIGHT - 100, Constants.GAME_WIDTH, 100);

        // Draw mystical runes
        for (let i = 0; i < 5; i++) {
            const x = 200 + i * 200;
            const y = Constants.GAME_HEIGHT - 50;
            this.drawRune(floor, x, y);
        }

        // Add torches
        this.createTorch(100, 200);
        this.createTorch(Constants.GAME_WIDTH - 100, 200);

        // Add ambient particles
        this.createAmbientParticles();
    }

    drawRune(graphics, x, y) {
        graphics.lineStyle(2, 0x8844ff, 0.5);

        // Simple mystical circle with star
        graphics.strokeCircle(x, y, 20);

        for (let i = 0; i < 5; i++) {
            const angle1 = (Math.PI * 2 / 5) * i - Math.PI / 2;
            const angle2 = (Math.PI * 2 / 5) * (i + 2) - Math.PI / 2;
            const x1 = x + Math.cos(angle1) * 15;
            const y1 = y + Math.sin(angle1) * 15;
            const x2 = x + Math.cos(angle2) * 15;
            const y2 = y + Math.sin(angle2) * 15;
            graphics.lineBetween(x1, y1, x2, y2);
        }
    }

    createTorch(x, y) {
        // Torch stand
        const torch = this.add.graphics();
        torch.fillStyle(0x8B4513);
        torch.fillRect(x - 5, y, 10, 80);
        torch.fillRect(x - 15, y, 30, 10);

        // Flame
        const flame = this.add.circle(x, y - 10, 15, 0xff6600, 0.8);

        this.tweens.add({
            targets: flame,
            scaleY: 1.3,
            scaleX: 0.9,
            alpha: 0.6,
            duration: 300,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createAmbientParticles() {
        // Floating dust particles
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * Constants.GAME_WIDTH;
            const y = Math.random() * Constants.GAME_HEIGHT;
            const particle = this.add.circle(x, y, 1, 0xffffff, 0.3);

            this.tweens.add({
                targets: particle,
                y: y - 100,
                alpha: 0,
                duration: 5000 + Math.random() * 3000,
                delay: Math.random() * 5000,
                repeat: -1
            });
        }
    }

    createParticleTexture() {
        // Create a simple circular particle texture
        const graphics = this.add.graphics();
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture('particle', 8, 8);
        graphics.destroy();
    }

    setupInput() {
        // Player 1 controls (left side of keyboard)
        this.player1Keys = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            fireball: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            lightning: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            iceShard: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
            shield: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
            dash: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
        };

        // Player 2 controls - only if NOT in AI mode
        if (!this.aiMode) {
            // Player 2 controls (using I, O, P for attacks - near arrow keys)
            this.player2Keys = {
                up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
                down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
                left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
                right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
                fireball: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I),
                lightning: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O),
                iceShard: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U),
                shield: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P),
                dash: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
            };
        } else {
            // AI mode - create dummy keys that won't respond to keyboard
            this.player2Keys = {
                up: { isDown: false, _justDown: false },
                down: { isDown: false, _justDown: false },
                left: { isDown: false, _justDown: false },
                right: { isDown: false, _justDown: false },
                fireball: { isDown: false, _justDown: false },
                lightning: { isDown: false, _justDown: false },
                iceShard: { isDown: false, _justDown: false },
                shield: { isDown: false, _justDown: false },
                dash: { isDown: false, _justDown: false }
            };
            console.log('🤖 Player 2 keyboard controls disabled (AI mode)');
        }

        // Setup mouse click for knockback targeting
        this.knockbackCaster = null;
        this.knockbackTargetX = 0;
        this.knockbackTargetY = 0;

        this.input.on('pointerdown', (pointer) => {
            if (this.knockbackCaster) {
                console.log('💥 Knockback click detected at', pointer.x, pointer.y);
                this.knockbackCaster.castKnockback(pointer.x, pointer.y);
                this.knockbackCaster.isChargingKnockback = false;
                this.knockbackCaster = null;
            }
        });

        // Track mouse movement for knockback targeting visual
        this.input.on('pointermove', (pointer) => {
            if (this.knockbackCaster) {
                this.knockbackTargetX = pointer.x;
                this.knockbackTargetY = pointer.y;
            }
        });
    }

    startKnockbackTargeting(caster) {
        this.knockbackCaster = caster;
        // Initialize target position to caster's current position
        this.knockbackTargetX = caster.sprite.x;
        this.knockbackTargetY = caster.sprite.y;
        console.log('🎯 Knockback targeting started for Player', caster.playerNumber, '- Move mouse and click to target!');
    }

    createUI() {
        const barWidth = 300;
        const barHeight = 25;
        const padding = 20;

        // Player 1 UI (top left)
        this.createPlayerUI(1, padding, padding, barWidth, barHeight);

        // Player 2 UI (top right)
        this.createPlayerUI(2, Constants.GAME_WIDTH - padding - barWidth, padding, barWidth, barHeight);
    }

    createPlayerUI(playerNumber, x, y, width, height) {
        const player = playerNumber === 1 ? this.player1 : this.player2;
        const color = playerNumber === 1 ? Constants.PLAYER1_COLOR : Constants.PLAYER2_COLOR;

        // Player label
        this.add.text(x, y - 20, `Player ${playerNumber}`, {
            fontSize: '18px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ffffff'
        });

        // Health bar background
        const healthBg = this.add.rectangle(x, y + 10, width, height, 0x333333);
        healthBg.setOrigin(0, 0);

        // Health bar
        const healthBar = this.add.rectangle(x + 2, y + 12, width - 4, height - 4, Constants.HEALTH_COLOR);
        healthBar.setOrigin(0, 0);

        // Health text
        const healthText = this.add.text(x + width / 2, y + 10 + height / 2, '100', {
            fontSize: '16px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Mana bar background
        const manaBg = this.add.rectangle(x, y + 40, width, height, 0x333333);
        manaBg.setOrigin(0, 0);

        // Mana bar
        const manaBar = this.add.rectangle(x + 2, y + 42, width - 4, height - 4, Constants.MANA_COLOR);
        manaBar.setOrigin(0, 0);

        // Mana text
        const manaText = this.add.text(x + width / 2, y + 40 + height / 2, '100', {
            fontSize: '16px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Store references
        if (playerNumber === 1) {
            this.p1HealthBar = healthBar;
            this.p1HealthText = healthText;
            this.p1ManaBar = manaBar;
            this.p1ManaText = manaText;
        } else {
            this.p2HealthBar = healthBar;
            this.p2HealthText = healthText;
            this.p2ManaBar = manaBar;
            this.p2ManaText = manaText;
        }
    }

    setupCollisions() {
        // Platform collisions
        this.physics.add.collider(this.player1.sprite, this.platforms);
        this.physics.add.collider(this.player2.sprite, this.platforms);

        // Checkpoint overlaps
        this.checkpoints.forEach(checkpoint => {
            this.physics.add.overlap(this.player1.sprite, checkpoint.trigger, () => {
                this.activateCheckpoint(this.player1, checkpoint);
            });
            this.physics.add.overlap(this.player2.sprite, checkpoint.trigger, () => {
                this.activateCheckpoint(this.player2, checkpoint);
            });
        });

        // Finish line overlaps
        this.physics.add.overlap(this.player1.sprite, this.finishLine.trigger, () => {
            this.playerFinished(this.player1, 1);
        });
        this.physics.add.overlap(this.player2.sprite, this.finishLine.trigger, () => {
            this.playerFinished(this.player2, 2);
        });
    }

    activateCheckpoint(player, checkpoint) {
        if (player.currentCheckpoint < checkpoint.index) {
            player.currentCheckpoint = checkpoint.index;
            player.checkpointX = checkpoint.x;
            player.checkpointY = checkpoint.y - 50;

            // Visual feedback
            checkpoint.flag.setTint(player.playerNumber === 1 ? 0xff6666 : 0x6666ff);

            // Show message
            const msg = this.add.text(checkpoint.x, checkpoint.y - 250, `CHECKPOINT!\nPlayer ${player.playerNumber}`, {
                fontSize: '24px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: player.playerNumber === 1 ? '#ff6666' : '#6666ff',
                align: 'center'
            }).setOrigin(0.5);
            msg.setScrollFactor(1);

            this.tweens.add({
                targets: msg,
                y: checkpoint.y - 300,
                alpha: 0,
                duration: 1500,
                onComplete: () => msg.destroy()
            });
        }
    }

    playerFinished(player, playerNumber) {
        if (this.raceFinished) return;

        this.raceFinished = true;
        console.log(`🏁 Player ${playerNumber} finished the race!`);

        // Stop the game
        this.physics.pause();

        this.scene.start('VictoryScene', {
            winner: playerNumber,
            aiMode: this.aiMode,
            replay: this.replayRecorder ? this.replayRecorder.stopRecording() : null
        });
    }

    setupPowerUpSpawning() {
        // Spawn first power-up after 5 seconds
        this.time.delayedCall(5000, () => this.spawnPowerUp());

        // Then spawn every 15-20 seconds
        this.powerUpSpawner = this.time.addEvent({
            delay: Phaser.Math.Between(15000, 20000),
            callback: () => this.spawnPowerUp(),
            loop: true
        });
    }

    spawnPowerUp() {
        // Random position in the middle area of the arena
        const x = Phaser.Math.Between(400, Constants.GAME_WIDTH - 400);
        const y = Phaser.Math.Between(200, Constants.GAME_HEIGHT - 200);

        const powerUp = new PowerUp(this, x, y);
        this.powerUps.push(powerUp);
    }

    checkPowerUpCollection() {
        this.powerUps = this.powerUps.filter(powerUp => {
            if (!powerUp.container || !powerUp.container.active) {
                return false;
            }

            // Check collision with Player 1
            const dist1 = Phaser.Math.Distance.Between(
                powerUp.container.x, powerUp.container.y,
                this.player1.sprite.x, this.player1.sprite.y
            );

            if (dist1 < 40) {
                powerUp.collect(this.player1);
                return false;
            }

            // Check collision with Player 2
            const dist2 = Phaser.Math.Distance.Between(
                powerUp.container.x, powerUp.container.y,
                this.player2.sprite.x, this.player2.sprite.y
            );

            if (dist2 < 40) {
                powerUp.collect(this.player2);
                return false;
            }

            return true;
        });
    }

    checkFallingDeath(player) {
        if (!player.isAlive) return;

        // Check if fell off the world
        if (player.sprite.y > Constants.DEATH_Y) {
            player.isAlive = false;
            console.log(`💀 Player ${player.playerNumber} fell to their death!`);

            // Visual feedback (fade out)
            this.tweens.add({
                targets: player.sprite,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    // Respawn after delay
                    this.time.delayedCall(Constants.RESPAWN_DELAY, () => {
                        this.respawnPlayer(player);
                    });
                }
            });
        }
    }

    respawnPlayer(player) {
        // Reset position to last checkpoint
        player.sprite.setPosition(player.checkpointX, player.checkpointY);
        player.sprite.setVelocity(0, 0);
        player.sprite.setAlpha(1);
        player.isAlive = true;
        player.health = Constants.MAX_HEALTH;
        player.mana = Constants.MAX_MANA;

        console.log(`✨ Player ${player.playerNumber} respawned at checkpoint ${player.currentCheckpoint}`);

        // Visual feedback - spawn effect
        const spawnEffect = this.add.circle(player.checkpointX, player.checkpointY, 80,
            player.playerNumber === 1 ? Constants.PLAYER1_COLOR : Constants.PLAYER2_COLOR, 0.5);
        spawnEffect.setScrollFactor(1);

        this.tweens.add({
            targets: spawnEffect,
            scale: 1.5,
            alpha: 0,
            duration: 500,
            onComplete: () => spawnEffect.destroy()
        });
    }

    update(time, delta) {
        // Check for falling deaths
        this.checkFallingDeath(this.player1);
        this.checkFallingDeath(this.player2);

        // Record frame for replay
        if (this.replayRecorder) {
            this.replayRecorder.recordFrame();
        }

        // Draw knockback targeting visual (simplified, no debug graphics)
        if (this.knockbackCaster && !this.debugGraphics) {
            this.debugGraphics = this.add.graphics();
            this.debugGraphics.setDepth(1000);
        }

        if (this.knockbackCaster && this.debugGraphics) {
            this.debugGraphics.clear();
            const casterColor = this.knockbackCaster.playerNumber === 1 ? 0xff0000 : 0x0000ff;

            // Calculate distance from caster to target
            const distanceToTarget = Phaser.Math.Distance.Between(
                this.knockbackCaster.sprite.x,
                this.knockbackCaster.sprite.y,
                this.knockbackTargetX,
                this.knockbackTargetY
            );
            const inRange = distanceToTarget <= Constants.KNOCKBACK.RANGE;

            // Draw range circle around caster
            this.debugGraphics.lineStyle(2, casterColor, 0.3);
            this.debugGraphics.strokeCircle(
                this.knockbackCaster.sprite.x,
                this.knockbackCaster.sprite.y,
                Constants.KNOCKBACK.RANGE
            );

            // Draw line to target (color changes based on range)
            this.debugGraphics.lineStyle(3, inRange ? 0x00ff00 : 0xff0000, 0.8);
            this.debugGraphics.lineBetween(
                this.knockbackCaster.sprite.x,
                this.knockbackCaster.sprite.y,
                this.knockbackTargetX,
                this.knockbackTargetY
            );

            // Draw target circle
            this.debugGraphics.fillStyle(inRange ? 0x00ff00 : 0xff0000, 0.5);
            this.debugGraphics.fillCircle(this.knockbackTargetX, this.knockbackTargetY, 30);

            // Draw crosshair at target
            this.debugGraphics.lineStyle(2, 0xffffff, 1);
            this.debugGraphics.lineBetween(
                this.knockbackTargetX - 20, this.knockbackTargetY,
                this.knockbackTargetX + 20, this.knockbackTargetY
            );
            this.debugGraphics.lineBetween(
                this.knockbackTargetX, this.knockbackTargetY - 20,
                this.knockbackTargetX, this.knockbackTargetY + 20
            );
        }

        // Update players
        if (this.player1) {
            this.player1.update(time, delta, this.player1Keys);
            this.updatePlayerUI(1);
        }

        if (this.player2) {
            // Use AI controller if in AI mode
            if (this.aiMode && this.aiController) {
                this.aiController.update(delta, this.player2Keys);
            }

            this.player2.update(time, delta, this.player2Keys);
            this.updatePlayerUI(2);
        }

        // Update projectiles and check collisions
        this.projectiles = this.projectiles.filter(projectile => {
            if (!projectile.sprite || !projectile.sprite.active) {
                console.log('Projectile inactive or missing sprite');
                return false;
            }

            projectile.update();

            // Check collision with players (but skip the owner!)
            // Debug: Log owner for reflected projectiles
            if (projectile.type && !this._reflectedLogged) {
                console.log('⚡ Projectile owner: P' + projectile.owner.playerNumber);
                this._reflectedLogged = true;
                setTimeout(() => this._reflectedLogged = false, 1000);
            }

            // Check Player 1 only if projectile doesn't belong to Player 1
            if (projectile.owner !== this.player1) {
                const hit1 = this.checkProjectileCollision(projectile, this.player1);
                if (hit1) {
                    console.log('✅ COLLISION DETECTED: Projectile (owner: P' + projectile.owner.playerNumber + ') hitting P1');
                    const shouldRemove = projectile.hitTarget(this.player1);
                    return !shouldRemove; // Return false to remove, true to keep
                }
            }

            // Check Player 2 only if projectile doesn't belong to Player 2
            if (projectile.owner !== this.player2) {
                const hit2 = this.checkProjectileCollision(projectile, this.player2);
                if (hit2) {
                    console.log('✅ COLLISION DETECTED: Projectile (owner: P' + projectile.owner.playerNumber + ') hitting P2');
                    const shouldRemove = projectile.hitTarget(this.player2);
                    return !shouldRemove; // Return false to remove, true to keep
                }
            }

            return true;
        });

        // Check power-up collection
        this.checkPowerUpCollection();
    }

    updatePlayerUI(playerNumber) {
        const player = playerNumber === 1 ? this.player1 : this.player2;
        const healthBar = playerNumber === 1 ? this.p1HealthBar : this.p2HealthBar;
        const healthText = playerNumber === 1 ? this.p1HealthText : this.p2HealthText;
        const manaBar = playerNumber === 1 ? this.p1ManaBar : this.p2ManaBar;
        const manaText = playerNumber === 1 ? this.p1ManaText : this.p2ManaText;

        // Update health
        const healthPercent = player.getHealthPercent();
        healthBar.width = (298) * healthPercent; // 298 = 300 - 4 (padding)
        healthText.setText(Math.ceil(player.health).toString());

        // Update mana
        const manaPercent = player.getManaPercent();
        manaBar.width = (298) * manaPercent;
        manaText.setText(Math.ceil(player.mana).toString());
    }

    checkProjectileCollision(projectile, player) {
        if (!player.isAlive) {
            return false;
        }

        const distance = Phaser.Math.Distance.Between(
            projectile.sprite.x,
            projectile.sprite.y,
            player.sprite.x,
            player.sprite.y
        );

        return distance < 50; // Collision threshold
    }

    createProjectile(owner, type, angle) {
        const projectile = new Projectile(
            this,
            owner.sprite.x,
            owner.sprite.y,
            angle,
            type,
            owner,
            owner.activePowerUp // Pass power-up info
        );

        this.projectiles.push(projectile);
    }

    createLightningEffect(x1, y1, x2, y2, blocked) {
        // Record in replay
        if (this.replayRecorder && !blocked) {
            this.replayRecorder.recordLightningStrike(x1, y1, x2, y2);
        }

        const lightning = this.add.graphics();
        lightning.lineStyle(4, blocked ? 0xffff00 : 0x00ffff, 1);

        // Draw jagged lightning bolt
        const steps = 8;
        const dx = (x2 - x1) / steps;
        const dy = (y2 - y1) / steps;

        lightning.beginPath();
        lightning.moveTo(x1, y1);

        for (let i = 1; i < steps; i++) {
            const jitterX = (Math.random() - 0.5) * 40;
            const jitterY = (Math.random() - 0.5) * 40;
            lightning.lineTo(x1 + dx * i + jitterX, y1 + dy * i + jitterY);
        }

        lightning.lineTo(x2, y2);
        lightning.strokePath();

        // Add branching arcs
        for (let i = 0; i < 3; i++) {
            const branchX = x1 + (x2 - x1) * (0.3 + Math.random() * 0.4);
            const branchY = y1 + (y2 - y1) * (0.3 + Math.random() * 0.4);
            const endX = branchX + (Math.random() - 0.5) * 60;
            const endY = branchY + (Math.random() - 0.5) * 60;

            lightning.lineStyle(2, blocked ? 0xffff00 : 0x00ffff, 0.7);
            lightning.lineBetween(branchX, branchY, endX, endY);
        }

        // Fade out and destroy
        this.tweens.add({
            targets: lightning,
            alpha: 0,
            duration: Constants.LIGHTNING.DURATION,
            onComplete: () => lightning.destroy()
        });

        // Camera shake
        this.cameras.main.shake(100, 0.005);
    }

    getOpponent(player) {
        return player === this.player1 ? this.player2 : this.player1;
    }

    handleGameOver(winnerNumber) {
        // Stop recording and capture replay
        const replay = this.replayRecorder ? this.replayRecorder.stopRecording() : null;

        // Check if both players are dead (tie)
        if (!this.player1.isAlive && !this.player2.isAlive) {
            console.log('🤝 TIE! Both players died!');
            // Delay before showing tie screen (longer because of slow-mo)
            this.time.delayedCall(3000, () => {
                // Reset time scale before transitioning
                this.resetTimeScale();
                this.scene.start('TieScene', { aiMode: this.aiMode, replay: replay });
            });
        } else {
            // Normal victory
            console.log('🏆 Player', winnerNumber, 'wins!');
            // Delay before showing victory screen (longer because of slow-mo)
            this.time.delayedCall(3000, () => {
                // Reset time scale before transitioning
                this.resetTimeScale();
                this.scene.start('VictoryScene', {
                    winner: winnerNumber,
                    aiMode: this.aiMode,
                    replay: replay
                });
            });
        }
    }

    resetTimeScale() {
        this.physics.world.timeScale = 1;
        this.time.timeScale = 1;
        this.tweens.timeScale = 1;
        console.log('⏱️ Time scale reset to normal');
    }
}
