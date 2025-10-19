class PowerUp {
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;

        // Randomly choose power-up type
        const types = ['speed', 'damage', 'rapidfire', 'giant', 'health', 'mana'];
        this.type = Phaser.Math.RND.pick(types);

        this.config = this.getConfig();

        // Create visual
        this.container = scene.add.container(x, y);
        this.createVisual();

        // Add physics
        scene.physics.add.existing(this.container);
        this.container.body.setCircle(25);

        // Floating animation
        this.createFloatingAnimation();

        // Auto-despawn after 10 seconds
        this.despawnTimer = scene.time.delayedCall(10000, () => this.destroy());

        console.log('PowerUp spawned:', this.type, 'at', x, y);
    }

    getConfig() {
        const configs = {
            speed: {
                name: 'Speed Boost',
                color: 0xffff00,
                icon: '⚡',
                duration: 8000,
                effect: 'Projectiles 2x faster!'
            },
            damage: {
                name: 'Damage Boost',
                color: 0xff0000,
                icon: '💥',
                duration: 8000,
                effect: 'Spells deal 2x damage!'
            },
            rapidfire: {
                name: 'Rapid Fire',
                color: 0xff8800,
                icon: '🔥',
                duration: 10000,
                effect: 'No cooldowns!'
            },
            giant: {
                name: 'Giant Spells',
                color: 0x00ff00,
                icon: '⭐',
                duration: 8000,
                effect: 'Projectiles 2x size!'
            },
            health: {
                name: 'Health Pack',
                color: 0x00ff00,
                icon: '❤️',
                duration: 0, // Instant
                effect: 'Restore 50 HP!'
            },
            mana: {
                name: 'Mana Surge',
                color: 0x0088ff,
                icon: '💎',
                duration: 0, // Instant
                effect: 'Restore 50 Mana!'
            }
        };

        return configs[this.type];
    }

    createVisual() {
        // Outer glow circle
        const glow = this.scene.add.graphics();
        glow.fillStyle(this.config.color, 0.3);
        glow.fillCircle(0, 0, 30);

        // Main circle
        const circle = this.scene.add.graphics();
        circle.lineStyle(3, this.config.color, 1);
        circle.fillStyle(this.config.color, 0.5);
        circle.fillCircle(0, 0, 25);
        circle.strokeCircle(0, 0, 25);

        // Icon/symbol
        const text = this.scene.add.text(0, 0, this.config.icon, {
            fontSize: '24px',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.container.add([glow, circle, text]);
        this.glow = glow;
        this.circle = circle;
        this.text = text;
    }

    createFloatingAnimation() {
        // Bob up and down
        this.scene.tweens.add({
            targets: this.container,
            y: this.y - 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Pulse glow
        this.scene.tweens.add({
            targets: this.glow,
            alpha: 0.8,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Rotate
        this.scene.tweens.add({
            targets: this.container,
            angle: 360,
            duration: 3000,
            repeat: -1,
            ease: 'Linear'
        });
    }

    collect(player) {
        console.log('Player', player.playerNumber, 'collected', this.type, 'power-up!');

        // Apply effect
        this.applyEffect(player);

        // Visual feedback
        this.scene.tweens.add({
            targets: this.container,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => this.destroy()
        });

        // Show text notification
        const notification = this.scene.add.text(
            this.container.x,
            this.container.y - 40,
            this.config.name + '\n' + this.config.effect,
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: '#' + this.config.color.toString(16).padStart(6, '0'),
                stroke: '#000000',
                strokeThickness: 3,
                align: 'center'
            }
        ).setOrigin(0.5);

        this.scene.tweens.add({
            targets: notification,
            y: notification.y - 30,
            alpha: 0,
            duration: 2000,
            onComplete: () => notification.destroy()
        });
    }

    applyEffect(player) {
        switch(this.type) {
            case 'speed':
                player.activePowerUp = 'speed';
                player.powerUpTimer = this.config.duration;
                console.log('Speed boost active!');
                break;

            case 'damage':
                player.activePowerUp = 'damage';
                player.powerUpTimer = this.config.duration;
                console.log('Damage boost active!');
                break;

            case 'rapidfire':
                player.activePowerUp = 'rapidfire';
                player.powerUpTimer = this.config.duration;
                console.log('Rapid fire active!');
                break;

            case 'giant':
                player.activePowerUp = 'giant';
                player.powerUpTimer = this.config.duration;
                console.log('Giant spells active!');
                break;

            case 'health':
                player.health = Math.min(Constants.MAX_HEALTH, player.health + 50);
                console.log('Health restored! New HP:', player.health);
                break;

            case 'mana':
                player.mana = Math.min(Constants.MAX_MANA, player.mana + 50);
                console.log('Mana restored! New Mana:', player.mana);
                break;
        }
    }

    destroy() {
        if (this.despawnTimer) this.despawnTimer.remove();
        if (this.container) this.container.destroy();
    }
}
