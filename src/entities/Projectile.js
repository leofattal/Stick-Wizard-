class Projectile {
    constructor(scene, x, y, angle, type, owner, powerUp) {
        this.scene = scene;
        this.type = type;
        this.owner = owner;
        this.powerUp = powerUp; // Store power-up type

        const config = this.getConfig();

        // Apply power-up modifiers
        const sizeMultiplier = (powerUp === 'giant') ? 2 : 1;
        const speedMultiplier = (powerUp === 'speed') ? 2 : 1;
        this.damageMultiplier = (powerUp === 'damage') ? 2 : 1;

        // Create a container for the projectile (containers work better with physics)
        this.container = scene.add.container(x, y);

        // Create graphics for visual
        this.graphics = scene.add.graphics();

        // Draw based on type with size modifier
        this.sizeMultiplier = sizeMultiplier;
        if (type === 'fireball') {
            this.drawFireball();
        } else if (type === 'iceshard') {
            this.drawIceShard();
        }

        // Add graphics to container
        this.container.add(this.graphics);

        // Add physics to container
        scene.physics.add.existing(this.container);
        this.container.body.setCircle(config.SIZE * sizeMultiplier);

        // Set velocity with speed modifier
        const speed = config.SPEED * speedMultiplier;
        this.container.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        // Store reference for easier access
        this.sprite = this.container;
        this.angle = angle;

        console.log('Projectile created at', x, y, 'with velocity', this.container.body.velocity, 'power-up:', powerUp);

        // Create particle trail
        this.createTrail();

        // Auto-destroy when off screen
        this.checkBounds();
    }

    getConfig() {
        if (this.type === 'fireball') return Constants.FIREBALL;
        if (this.type === 'iceshard') return Constants.ICE_SHARD;
        return Constants.FIREBALL;
    }

    drawFireball() {
        const size = Constants.FIREBALL.SIZE * (this.sizeMultiplier || 1);

        // Outer glow
        this.graphics.fillStyle(0xff6600, 0.5);
        this.graphics.fillCircle(0, 0, size + 4);

        // Main body
        this.graphics.fillStyle(0xff3300, 1);
        this.graphics.fillCircle(0, 0, size);

        // Inner bright core
        this.graphics.fillStyle(0xffff00, 0.8);
        this.graphics.fillCircle(0, 0, size * 0.6);
    }

    drawIceShard() {
        const size = Constants.ICE_SHARD.SIZE * (this.sizeMultiplier || 1);

        // Crystal shape
        this.graphics.fillStyle(0x00ccff, 0.8);
        this.graphics.fillTriangle(-size, 0, size, 0, 0, -size * 1.5);
        this.graphics.fillTriangle(-size, 0, size, 0, 0, size * 1.5);

        // Highlight
        this.graphics.fillStyle(0xffffff, 0.6);
        this.graphics.fillTriangle(-size * 0.3, 0, size * 0.3, 0, 0, -size * 0.8);
    }

    createTrail() {
        try {
            if (this.type === 'fireball') {
                // Fire particles
                const emitter = this.scene.add.particles(this.sprite.x, this.sprite.y, 'particle', {
                    speed: { min: 20, max: 50 },
                    scale: { start: 0.6, end: 0 },
                    alpha: { start: 0.8, end: 0 },
                    lifespan: 300,
                    tint: [0xff6600, 0xff3300, 0xffff00],
                    frequency: 20
                });

                // Note: Using default particle since we don't have textures yet
                // Will create a simple circle as fallback
                this.trailEmitter = emitter;
            } else if (this.type === 'iceshard') {
                // Ice mist particles
                const emitter = this.scene.add.particles(this.sprite.x, this.sprite.y, 'particle', {
                    speed: { min: 10, max: 30 },
                    scale: { start: 0.4, end: 0 },
                    alpha: { start: 0.6, end: 0 },
                    lifespan: 400,
                    tint: [0x00ccff, 0xffffff],
                    frequency: 30
                });

                this.trailEmitter = emitter;
            }
        } catch (error) {
            console.warn('Could not create particle trail:', error);
            this.trailEmitter = null;
        }
    }

    checkBounds() {
        this.boundCheck = this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                if (this.sprite.x < -50 || this.sprite.x > Constants.GAME_WIDTH + 50 ||
                    this.sprite.y < -50 || this.sprite.y > Constants.GAME_HEIGHT + 50) {
                    this.destroy();
                }
            },
            loop: true
        });
    }

    update() {
        // Update trail position
        if (this.trailEmitter) {
            this.trailEmitter.setPosition(this.sprite.x, this.sprite.y);
        }

        // Rotate ice shard
        if (this.type === 'iceshard') {
            this.sprite.rotation += 0.1;
        }
    }

    hitTarget(target) {
        console.log('🎯 HIT CHECK - Type:', this.type, 'Owner: P' + this.owner.playerNumber, 'Target: P' + target.playerNumber);

        // Can't hit yourself (the owner)
        if (target === this.owner) {
            console.log('  ❌ Skipping - target is owner');
            return false; // Don't remove projectile
        }

        // Handle shield reflection
        if (target.isShielding) {
            console.log('  🛡️ Target is shielding - REFLECTING!');
            target.blockAttack();
            this.reflect(target);
            return false; // Don't remove - projectile is reflected!
        }

        // Deal damage
        const config = this.getConfig();
        const damage = config.DAMAGE * (this.damageMultiplier || 1);
        console.log('  💥 DEALING DAMAGE:', damage, 'to Player', target.playerNumber);
        target.takeDamage(damage);

        // Apply knockback based on projectile direction
        const angle = Math.atan2(
            this.sprite.body.velocity.y,
            this.sprite.body.velocity.x
        );
        target.getKnockedBack(
            target.sprite.x + Math.cos(angle) * 200,
            target.sprite.y + Math.sin(angle) * 200
        );

        // Ice shard slow effect
        if (this.type === 'iceshard') {
            target.applySlow();
        }

        this.explode();
        return true; // Remove projectile - it exploded
    }

    reflect(blocker) {
        console.log('🔄 REFLECTING projectile!');

        // Change ownership to the blocker
        const originalOwner = this.scene.getOpponent(blocker);
        console.log('  📝 Changing owner from P' + this.owner.playerNumber + ' to P' + blocker.playerNumber);
        this.owner = blocker;

        // Calculate angle toward the original caster
        const angle = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            originalOwner.sprite.x, originalOwner.sprite.y
        );

        console.log('  🎯 Redirecting toward P' + originalOwner.playerNumber + ' at angle', angle.toFixed(2));

        // Reverse velocity (faster!)
        const config = this.getConfig();
        const speed = config.SPEED * 1.5;
        this.sprite.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        // Visual feedback - change color
        this.graphics.clear();
        if (this.type === 'fireball') {
            this.drawReflectedFireball();
        } else if (this.type === 'iceshard') {
            this.drawReflectedIceShard();
        }

        // Flash effect
        this.scene.tweens.add({
            targets: this.container,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 100,
            yoyo: true
        });
    }

    drawReflectedFireball() {
        const size = Constants.FIREBALL.SIZE;

        // Make it purple/pink to show it's reflected
        this.graphics.fillStyle(0xff00ff, 0.5);
        this.graphics.fillCircle(0, 0, size + 4);

        this.graphics.fillStyle(0xff00aa, 1);
        this.graphics.fillCircle(0, 0, size);

        this.graphics.fillStyle(0xffff00, 0.8);
        this.graphics.fillCircle(0, 0, size * 0.6);
    }

    drawReflectedIceShard() {
        const size = Constants.ICE_SHARD.SIZE;

        // Make it bright cyan to show it's reflected
        this.graphics.fillStyle(0x00ffff, 0.9);
        this.graphics.fillTriangle(-size, 0, size, 0, 0, -size * 1.5);
        this.graphics.fillTriangle(-size, 0, size, 0, 0, size * 1.5);

        this.graphics.fillStyle(0xffffff, 0.8);
        this.graphics.fillTriangle(-size * 0.3, 0, size * 0.3, 0, 0, -size * 0.8);
    }

    explode() {
        // Create explosion effect
        if (this.type === 'fireball') {
            this.createFireballExplosion();
        } else if (this.type === 'iceshard') {
            this.createIceExplosion();
        }

        this.destroy();
    }

    createFireballExplosion() {
        const explosion = this.scene.add.graphics();
        explosion.x = this.sprite.x;
        explosion.y = this.sprite.y;

        // Expanding circle
        this.scene.tweens.add({
            targets: explosion,
            alpha: 0,
            duration: 300,
            onUpdate: (tween) => {
                explosion.clear();
                const progress = tween.progress;
                const radius = 10 + progress * 30;
                explosion.fillStyle(0xff6600, 1 - progress);
                explosion.fillCircle(0, 0, radius);
            },
            onComplete: () => explosion.destroy()
        });
    }

    createIceExplosion() {
        const explosion = this.scene.add.graphics();
        explosion.x = this.sprite.x;
        explosion.y = this.sprite.y;

        // Shattering effect
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            const shard = this.scene.add.graphics();
            shard.fillStyle(0x00ccff, 0.8);
            shard.fillTriangle(-3, 0, 3, 0, 0, -10);
            shard.x = this.sprite.x;
            shard.y = this.sprite.y;

            this.scene.tweens.add({
                targets: shard,
                x: shard.x + Math.cos(angle) * 30,
                y: shard.y + Math.sin(angle) * 30,
                alpha: 0,
                rotation: angle + Math.PI * 2,
                duration: 400,
                onComplete: () => shard.destroy()
            });
        }
    }

    destroy() {
        if (this.boundCheck) this.boundCheck.remove();
        if (this.trailEmitter) this.trailEmitter.destroy();
        if (this.sprite) this.sprite.destroy();
    }
}
