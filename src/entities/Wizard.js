class Wizard {
    constructor(scene, x, y, playerNumber) {
        this.scene = scene;
        this.playerNumber = playerNumber;
        this.color = playerNumber === 1 ? Constants.PLAYER1_COLOR : Constants.PLAYER2_COLOR;

        // Stats
        this.health = Constants.MAX_HEALTH;
        this.mana = Constants.MAX_MANA;
        this.isAlive = true;
        this.isInvincible = false;

        // Cooldowns
        this.fireballCooldown = 0;
        this.lightningCooldown = 0;
        this.iceShardCooldown = 0;
        this.shieldCooldown = 0;
        this.knockbackCooldown = 0;
        this.dashCooldown = 0;

        // States
        this.isShielding = false;
        this.shieldTimer = 0;
        this.isSlowed = false;
        this.slowTimer = 0;
        this.isDashing = false;
        this.isKnockedBack = false;
        this.knockbackTimer = 0;
        this.isChargingKnockback = false;

        // Power-ups
        this.activePowerUp = null;
        this.powerUpTimer = 0;

        // Create graphics
        this.createSprite(x, y);
        this.createShield();
    }

    createSprite(x, y) {
        // Create container for wizard
        this.container = this.scene.add.container(x, y);

        // Create stick figure body
        const graphics = this.scene.add.graphics();

        // Head
        graphics.lineStyle(3, this.color);
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
        graphics.fillStyle(this.color);
        graphics.fillTriangle(-10, -52, 10, -52, 0, -72);
        graphics.fillRect(-12, -52, 24, 4);

        // Staff
        graphics.lineStyle(2, 0x8B4513);
        graphics.lineBetween(15, -5, 18, 20);

        // Staff orb
        graphics.fillStyle(this.color, 0.7);
        graphics.fillCircle(18, -8, 5);

        this.container.add(graphics);

        // Add physics body
        this.scene.physics.add.existing(this.container);
        this.container.body.setSize(40, 70);
        this.container.body.setCollideWorldBounds(true);

        // Store reference
        this.sprite = this.container;
    }

    createShield() {
        // Shield visual
        this.shieldGraphics = this.scene.add.graphics();
        this.shieldGraphics.lineStyle(3, this.color, 0.8);
        this.shieldGraphics.fillStyle(this.color, 0.2);
        this.shieldGraphics.fillCircle(0, 0, 45);
        this.shieldGraphics.strokeCircle(0, 0, 45);

        // Draw hexagonal pattern
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x1 = Math.cos(angle) * 30;
            const y1 = Math.sin(angle) * 30;
            const x2 = Math.cos(angle + Math.PI / 3) * 30;
            const y2 = Math.sin(angle + Math.PI / 3) * 30;
            this.shieldGraphics.lineStyle(2, this.color, 0.5);
            this.shieldGraphics.lineBetween(x1, y1, x2, y2);
        }

        this.container.add(this.shieldGraphics);
        this.shieldGraphics.setVisible(false);
    }

    update(time, delta, keys) {
        if (!this.isAlive) return;

        // Update cooldowns
        this.updateCooldowns(delta);

        // Regenerate mana
        this.mana = Math.min(Constants.MAX_MANA, this.mana + (Constants.MANA_REGEN_RATE * delta / 1000));

        // Handle movement (disabled during knockback)
        if (!this.isDashing && !this.isKnockedBack) {
            this.handleMovement(keys);
        }

        // Handle actions (disabled during knockback)
        if (!this.isKnockedBack) {
            this.handleActions(keys);
        }

        // Update shield timer
        if (this.isShielding) {
            this.shieldTimer -= delta;
            if (this.shieldTimer <= 0) {
                this.deactivateShield();
            }
        }

        // Update slow timer
        if (this.isSlowed) {
            this.slowTimer -= delta;
            if (this.slowTimer <= 0) {
                this.isSlowed = false;
            }
        }

        // Update power-up timer
        if (this.activePowerUp && this.powerUpTimer > 0) {
            this.powerUpTimer -= delta;
            if (this.powerUpTimer <= 0) {
                console.log('Power-up', this.activePowerUp, 'expired for Player', this.playerNumber);
                this.activePowerUp = null;
            }
        }
    }

    updateCooldowns(delta) {
        // Rapid fire power-up makes cooldowns go down super fast
        const cooldownMultiplier = (this.activePowerUp === 'rapidfire') ? 10 : 1;

        this.fireballCooldown = Math.max(0, this.fireballCooldown - (delta * cooldownMultiplier));
        this.lightningCooldown = Math.max(0, this.lightningCooldown - (delta * cooldownMultiplier));
        this.iceShardCooldown = Math.max(0, this.iceShardCooldown - (delta * cooldownMultiplier));
        this.shieldCooldown = Math.max(0, this.shieldCooldown - (delta * cooldownMultiplier));
        this.knockbackCooldown = Math.max(0, this.knockbackCooldown - (delta * cooldownMultiplier));
        this.dashCooldown = Math.max(0, this.dashCooldown - (delta * cooldownMultiplier));
    }

    handleMovement(keys) {
        const speedMultiplier = this.isSlowed ? Constants.ICE_SHARD.SLOW_AMOUNT : 1;
        const speed = Constants.MOVEMENT_SPEED * speedMultiplier;

        let velocityX = 0;
        let velocityY = 0;

        if (keys.up.isDown) velocityY = -speed;
        if (keys.down.isDown) velocityY = speed;
        if (keys.left.isDown) velocityX = -speed;
        if (keys.right.isDown) velocityX = speed;

        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
            velocityX *= 0.707;
            velocityY *= 0.707;
        }

        this.sprite.body.setVelocity(velocityX, velocityY);
    }

    handleActions(keys) {
        // Fireball
        if (Phaser.Input.Keyboard.JustDown(keys.fireball)) {
            if (this.canCastSpell(Constants.FIREBALL)) {
                this.requestSpellCast('fireball');
            } else {
                console.log('🚫 Cannot cast fireball - Cooldown:', this.fireballCooldown.toFixed(0), 'ms, Mana:', this.mana.toFixed(0));
            }
        }

        // Lightning
        if (Phaser.Input.Keyboard.JustDown(keys.lightning) && this.canCastSpell(Constants.LIGHTNING)) {
            this.requestSpellCast('lightning');
        }

        // Ice Shard
        if (keys.iceShard && Phaser.Input.Keyboard.JustDown(keys.iceShard) && this.canCastSpell(Constants.ICE_SHARD)) {
            this.requestSpellCast('iceshard');
        }

        // Shield
        if (Phaser.Input.Keyboard.JustDown(keys.shield) && this.canCastShield()) {
            this.requestSpellCast('shield');
        }

        // Dash
        if (Phaser.Input.Keyboard.JustDown(keys.dash) && this.dashCooldown <= 0) {
            this.dash(keys);
        }
    }

    requestSpellCast(spellType) {
        // Only show quiz for Player 1 (human player)
        if (this.playerNumber === 1) {
            // Show conjugation quiz
            this.scene.conjugationQuiz.showQuiz(
                () => {
                    // Correct answer - cast spell
                    console.log('✓ Correct conjugation! Casting', spellType);
                    this.executeSpell(spellType);
                },
                () => {
                    // Wrong answer - no spell
                    console.log('✗ Wrong conjugation! Spell failed.');
                }
            );
        } else {
            // AI player (Player 2) - cast directly without quiz
            this.executeSpell(spellType);
        }
    }

    executeSpell(spellType) {
        switch(spellType) {
            case 'fireball':
                this.castFireball();
                break;
            case 'lightning':
                this.castLightning();
                break;
            case 'iceshard':
                this.castIceShard();
                break;
            case 'shield':
                this.activateShield();
                break;
        }
    }

    canCastSpell(spellConfig) {
        const cooldownMap = {
            [Constants.FIREBALL]: this.fireballCooldown,
            [Constants.LIGHTNING]: this.lightningCooldown,
            [Constants.ICE_SHARD]: this.iceShardCooldown
        };

        const cooldown = cooldownMap[spellConfig] || 0;
        return this.mana >= spellConfig.MANA_COST && cooldown <= 0;
    }

    canCastShield() {
        return this.mana >= Constants.SHIELD.MANA_COST &&
               this.shieldCooldown <= 0 &&
               !this.isShielding;
    }

    castFireball() {
        console.log('Player', this.playerNumber, 'casting fireball!');
        this.mana -= Constants.FIREBALL.MANA_COST;
        this.fireballCooldown = Constants.FIREBALL.COOLDOWN;

        // Determine direction (towards opponent)
        const opponent = this.scene.getOpponent(this);
        const angle = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            opponent.sprite.x, opponent.sprite.y
        );

        console.log('Creating fireball at angle:', angle, 'towards opponent at', opponent.sprite.x, opponent.sprite.y);

        // Create fireball projectile
        this.scene.createProjectile(this, 'fireball', angle);
    }

    castIceShard() {
        this.mana -= Constants.ICE_SHARD.MANA_COST;
        this.iceShardCooldown = Constants.ICE_SHARD.COOLDOWN;

        // Determine direction (towards opponent)
        const opponent = this.scene.getOpponent(this);
        const angle = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            opponent.sprite.x, opponent.sprite.y
        );

        // Create ice shard projectile
        this.scene.createProjectile(this, 'iceshard', angle);
    }

    castLightning() {
        this.mana -= Constants.LIGHTNING.MANA_COST;
        this.lightningCooldown = Constants.LIGHTNING.COOLDOWN;

        const opponent = this.scene.getOpponent(this);

        // Check if opponent shield is active
        if (opponent.isShielding) {
            opponent.blockAttack();
            this.scene.createLightningEffect(this.sprite.x, this.sprite.y, opponent.sprite.x, opponent.sprite.y, true);
        } else {
            opponent.takeDamage(Constants.LIGHTNING.DAMAGE);
            this.scene.createLightningEffect(this.sprite.x, this.sprite.y, opponent.sprite.x, opponent.sprite.y, false);
        }
    }

    activateShield() {
        this.mana -= Constants.SHIELD.MANA_COST;
        this.shieldCooldown = Constants.SHIELD.COOLDOWN;
        this.isShielding = true;
        this.shieldTimer = Constants.SHIELD.DURATION;
        this.shieldGraphics.setVisible(true);
    }

    deactivateShield() {
        this.isShielding = false;
        this.shieldGraphics.setVisible(false);
    }

    blockAttack() {
        // Restore mana on successful block
        this.mana = Math.min(Constants.MAX_MANA, this.mana + Constants.SHIELD.MANA_RESTORE);

        console.log('Player', this.playerNumber, 'blocked attack! Mana restored.');

        // Visual feedback - flash and pulse
        this.scene.tweens.add({
            targets: this.shieldGraphics,
            scale: 1.3,
            duration: 100,
            yoyo: true
        });

        // Color flash effect
        this.shieldGraphics.clear();

        // Draw a bright flash
        this.shieldGraphics.lineStyle(4, 0xffffff, 1);
        this.shieldGraphics.fillStyle(this.color, 0.4);
        this.shieldGraphics.fillCircle(0, 0, 45);
        this.shieldGraphics.strokeCircle(0, 0, 45);

        // Draw hexagonal pattern
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x1 = Math.cos(angle) * 30;
            const y1 = Math.sin(angle) * 30;
            const x2 = Math.cos(angle + Math.PI / 3) * 30;
            const y2 = Math.sin(angle + Math.PI / 3) * 30;
            this.shieldGraphics.lineStyle(3, 0xffffff, 0.8);
            this.shieldGraphics.lineBetween(x1, y1, x2, y2);
        }

        // Reset to normal after flash
        this.scene.time.delayedCall(150, () => {
            this.shieldGraphics.clear();
            this.shieldGraphics.lineStyle(3, this.color, 0.8);
            this.shieldGraphics.fillStyle(this.color, 0.2);
            this.shieldGraphics.fillCircle(0, 0, 45);
            this.shieldGraphics.strokeCircle(0, 0, 45);

            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 3) * i;
                const x1 = Math.cos(angle) * 30;
                const y1 = Math.sin(angle) * 30;
                const x2 = Math.cos(angle + Math.PI / 3) * 30;
                const y2 = Math.sin(angle + Math.PI / 3) * 30;
                this.shieldGraphics.lineStyle(2, this.color, 0.5);
                this.shieldGraphics.lineBetween(x1, y1, x2, y2);
            }
        });
    }

    dash(keys) {
        this.dashCooldown = Constants.DASH_COOLDOWN;
        this.isDashing = true;
        this.isInvincible = true;

        // Determine dash direction based on input
        let dashX = 0;
        let dashY = 0;

        if (keys.up.isDown) dashY = -1;
        if (keys.down.isDown) dashY = 1;
        if (keys.left.isDown) dashX = -1;
        if (keys.right.isDown) dashX = 1;

        // Default forward if no direction
        if (dashX === 0 && dashY === 0) {
            const opponent = this.scene.getOpponent(this);
            dashX = opponent.sprite.x > this.sprite.x ? 1 : -1;
        }

        // Normalize
        const length = Math.sqrt(dashX * dashX + dashY * dashY);
        if (length > 0) {
            dashX /= length;
            dashY /= length;
        }

        // Apply dash velocity
        const dashSpeed = Constants.DASH_DISTANCE / (Constants.DASH_DURATION / 1000);
        this.sprite.body.setVelocity(dashX * dashSpeed, dashY * dashSpeed);

        // Visual effect
        this.sprite.setAlpha(0.5);

        // End dash after duration
        this.scene.time.delayedCall(Constants.DASH_DURATION, () => {
            this.isDashing = false;
            this.sprite.body.setVelocity(0, 0);
            this.sprite.setAlpha(1);
        });

        // End invincibility
        this.scene.time.delayedCall(Constants.INVINCIBILITY_DURATION, () => {
            this.isInvincible = false;
        });
    }

    canCastKnockback() {
        const canCast = this.mana >= Constants.KNOCKBACK.MANA_COST &&
               this.knockbackCooldown <= 0 &&
               !this.isChargingKnockback;
        console.log('🔍 Player', this.playerNumber, 'canCastKnockback:', canCast,
                    '(mana:', this.mana, '/', Constants.KNOCKBACK.MANA_COST,
                    'cooldown:', this.knockbackCooldown,
                    'charging:', this.isChargingKnockback, ')');
        return canCast;
    }

    startKnockbackTargeting() {
        console.log('🎯 Player', this.playerNumber, 'started knockback targeting mode');
        this.isChargingKnockback = true;
        this.scene.startKnockbackTargeting(this);
    }

    castKnockback(targetX, targetY) {
        console.log('💫 castKnockback called by Player', this.playerNumber, 'target:', targetX, targetY);

        this.mana -= Constants.KNOCKBACK.MANA_COST;
        this.knockbackCooldown = Constants.KNOCKBACK.COOLDOWN;
        this.isChargingKnockback = false;

        const opponent = this.scene.getOpponent(this);
        console.log('👤 Opponent is Player', opponent.playerNumber);

        // Check if opponent is in range
        const distance = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            opponent.sprite.x, opponent.sprite.y
        );

        console.log('📏 Distance to opponent:', distance, '/ Max range:', Constants.KNOCKBACK.RANGE);

        if (distance > Constants.KNOCKBACK.RANGE) {
            console.log('❌ Opponent out of range! Refunding mana and cooldown.');
            this.mana += Constants.KNOCKBACK.MANA_COST; // Refund mana
            this.knockbackCooldown = 0; // Reset cooldown
            return;
        }

        console.log('✅ Casting knockback! Sending opponent to', targetX, targetY);
        opponent.getKnockedBack(targetX, targetY);
    }

    getKnockedBack(targetX, targetY) {
        console.log('💥 Player', this.playerNumber, 'is being knocked back to', targetX, targetY);

        this.isKnockedBack = true;
        this.knockbackTimer = Constants.KNOCKBACK.STUN_DURATION;

        // Calculate direction to target
        const angle = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            targetX, targetY
        );

        const velocityX = Math.cos(angle) * Constants.KNOCKBACK.FORCE;
        const velocityY = Math.sin(angle) * Constants.KNOCKBACK.FORCE;

        console.log('🚀 Applying knockback velocity:', velocityX, velocityY, 'at angle:', angle);

        // Apply knockback force
        this.sprite.body.setVelocity(velocityX, velocityY);

        // Visual effect - flash
        this.sprite.setAlpha(0.5);

        // Stop knockback after reaching near target or after duration
        this.scene.time.delayedCall(Constants.KNOCKBACK.STUN_DURATION, () => {
            console.log('⏱️ Player', this.playerNumber, 'knockback ended');
            this.isKnockedBack = false;
            this.sprite.body.setVelocity(0, 0);
            this.sprite.setAlpha(1);
        });
    }

    takeDamage(damage) {
        console.log('Player', this.playerNumber, 'takeDamage called. Damage:', damage, 'Current HP:', this.health);

        if (this.isInvincible || !this.isAlive) {
            console.log('Player', this.playerNumber, 'is invincible or dead, ignoring damage');
            return;
        }

        if (this.isShielding) {
            console.log('Player', this.playerNumber, 'is shielding');
            this.blockAttack();
            return;
        }

        this.health -= damage;
        console.log('Player', this.playerNumber, 'took', damage, 'damage. New HP:', this.health);

        // Visual feedback
        this.scene.tweens.add({
            targets: this.sprite,
            x: this.sprite.x + (this.playerNumber === 1 ? -10 : 10),
            duration: 100,
            yoyo: true
        });

        // Flash effect
        this.sprite.setAlpha(0.5);
        this.scene.time.delayedCall(100, () => this.sprite.setAlpha(1));

        if (this.health <= 0) {
            this.health = 0;

            // SLOW MOTION for the killing blow!
            console.log('💀 KILLING BLOW! Activating slow motion...');
            this.scene.physics.world.timeScale = 3; // Slow down physics (higher = slower)
            this.scene.time.timeScale = 0.3; // Slow down time events
            this.scene.tweens.timeScale = 0.3; // Slow down tweens

            // Mark this moment in the replay
            if (this.scene.replayRecorder) {
                this.scene.replayRecorder.markKillingBlow();
            }

            this.die();
        }
    }

    applySlow() {
        this.isSlowed = true;
        this.slowTimer = Constants.ICE_SHARD.SLOW_DURATION;
    }

    die() {
        this.isAlive = false;

        // Death animation
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            angle: 90,
            y: this.sprite.y + 50,
            duration: 500,
            onComplete: () => {
                this.scene.handleGameOver(this.playerNumber === 1 ? 2 : 1);
            }
        });
    }

    getHealthPercent() {
        return this.health / Constants.MAX_HEALTH;
    }

    getManaPercent() {
        return this.mana / Constants.MAX_MANA;
    }
}
