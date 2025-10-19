class AIController {
    constructor(wizard, opponent) {
        this.wizard = wizard;
        this.opponent = opponent;
        this.difficulty = 'medium'; // easy, medium, hard

        // AI timers
        this.decisionTimer = 0;
        this.decisionDelay = 300; // Make decision every 300ms

        // AI state
        this.currentAction = 'idle';
        this.targetX = 0;
        this.targetY = 0;

        // Reaction times based on difficulty
        this.reactionTimes = {
            easy: 800,
            medium: 400,
            hard: 150
        };

        console.log('🤖 AI Controller initialized for Player', wizard.playerNumber);
    }

    update(delta, keys) {
        this.decisionTimer += delta;

        // Make decisions at regular intervals
        if (this.decisionTimer >= this.decisionDelay) {
            this.decisionTimer = 0;
            this.makeDecision();
        }

        // Execute current action
        this.executeAction(keys);
    }

    makeDecision() {
        if (!this.wizard.isAlive || !this.opponent.isAlive) return;

        const distance = Phaser.Math.Distance.Between(
            this.wizard.sprite.x, this.wizard.sprite.y,
            this.opponent.sprite.x, this.opponent.sprite.y
        );

        // Prioritize actions

        // 1. Shield incoming projectiles
        if (this.shouldShield()) {
            this.currentAction = 'shield';
            return;
        }

        // 2. Collect power-ups
        const nearbyPowerUp = this.findNearestPowerUp();
        if (nearbyPowerUp) {
            this.currentAction = 'getPowerUp';
            this.targetX = nearbyPowerUp.sprite.x;
            this.targetY = nearbyPowerUp.sprite.y;
            return;
        }

        // 3. Attack if in range and have mana
        if (distance < 400 && this.wizard.mana > 30) {
            // Choose attack type
            const rand = Math.random();
            if (rand < 0.4) {
                this.currentAction = 'fireball';
            } else if (rand < 0.7 && this.wizard.mana >= 35) {
                this.currentAction = 'lightning';
            } else if (this.wizard.mana >= 25) {
                this.currentAction = 'iceShard';
            }
            return;
        }

        // 4. Maintain distance (circle strafe)
        if (distance < 200) {
            this.currentAction = 'retreat';
        } else if (distance > 500) {
            this.currentAction = 'advance';
        } else {
            this.currentAction = 'strafe';
        }
    }

    shouldShield() {
        // Check if projectiles are coming toward us
        const projectiles = this.wizard.scene.projectiles;

        for (const proj of projectiles) {
            if (proj.owner === this.wizard) continue; // Ignore our own projectiles

            const distance = Phaser.Math.Distance.Between(
                proj.sprite.x, proj.sprite.y,
                this.wizard.sprite.x, this.wizard.sprite.y
            );

            // If projectile is close and coming toward us
            if (distance < 200 && this.wizard.mana >= Constants.SHIELD.MANA_COST) {
                const angle = Math.atan2(
                    proj.sprite.body.velocity.y,
                    proj.sprite.body.velocity.x
                );
                const projDirection = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle));
                const toUs = new Phaser.Math.Vector2(
                    this.wizard.sprite.x - proj.sprite.x,
                    this.wizard.sprite.y - proj.sprite.y
                ).normalize();

                // Check if projectile is heading toward us (dot product > 0.5)
                if (projDirection.dot(toUs) > 0.5) {
                    return true;
                }
            }
        }

        return false;
    }

    findNearestPowerUp() {
        const powerUps = this.wizard.scene.powerUps;
        if (!powerUps || powerUps.length === 0) return null;

        let nearest = null;
        let minDist = 999999;

        for (const powerUp of powerUps) {
            const dist = Phaser.Math.Distance.Between(
                this.wizard.sprite.x, this.wizard.sprite.y,
                powerUp.sprite.x, powerUp.sprite.y
            );

            if (dist < minDist && dist < 400) {
                minDist = dist;
                nearest = powerUp;
            }
        }

        return nearest;
    }

    executeAction(keys) {
        // Reset all keys
        this.resetKeys(keys);

        switch (this.currentAction) {
            case 'fireball':
                keys.fireball.isDown = true;
                break;

            case 'lightning':
                keys.lightning.isDown = true;
                break;

            case 'iceShard':
                keys.iceShard.isDown = true;
                break;

            case 'shield':
                keys.shield.isDown = true;
                this.currentAction = 'idle'; // Only shield once
                break;

            case 'advance':
                this.moveToward(this.opponent.sprite.x, this.opponent.sprite.y, keys);
                break;

            case 'retreat':
                this.moveAwayFrom(this.opponent.sprite.x, this.opponent.sprite.y, keys);
                break;

            case 'strafe':
                this.strafe(keys);
                break;

            case 'getPowerUp':
                this.moveToward(this.targetX, this.targetY, keys);
                break;
        }
    }

    moveToward(targetX, targetY, keys) {
        const dx = targetX - this.wizard.sprite.x;
        const dy = targetY - this.wizard.sprite.y;

        if (Math.abs(dx) > 20) {
            if (dx > 0) keys.right.isDown = true;
            else keys.left.isDown = true;
        }

        if (Math.abs(dy) > 20) {
            if (dy > 0) keys.down.isDown = true;
            else keys.up.isDown = true;
        }
    }

    moveAwayFrom(targetX, targetY, keys) {
        const dx = targetX - this.wizard.sprite.x;
        const dy = targetY - this.wizard.sprite.y;

        if (Math.abs(dx) > 20) {
            if (dx > 0) keys.left.isDown = true;
            else keys.right.isDown = true;
        }

        if (Math.abs(dy) > 20) {
            if (dy > 0) keys.up.isDown = true;
            else keys.down.isDown = true;
        }
    }

    strafe(keys) {
        // Circle around opponent
        const angle = Phaser.Math.Angle.Between(
            this.wizard.sprite.x, this.wizard.sprite.y,
            this.opponent.sprite.x, this.opponent.sprite.y
        );

        // Move perpendicular to angle
        const perpAngle = angle + Math.PI / 2;
        const targetX = this.wizard.sprite.x + Math.cos(perpAngle) * 100;
        const targetY = this.wizard.sprite.y + Math.sin(perpAngle) * 100;

        this.moveToward(targetX, targetY, keys);
    }

    resetKeys(keys) {
        keys.up.isDown = false;
        keys.down.isDown = false;
        keys.left.isDown = false;
        keys.right.isDown = false;
        keys.fireball.isDown = false;
        keys.lightning.isDown = false;
        keys.iceShard.isDown = false;
        keys.shield.isDown = false;
    }
}
