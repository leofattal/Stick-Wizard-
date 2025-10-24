class MobileControls {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.isMobile = this.detectMobile();

        if (!this.isMobile) return;

        this.joystick = null;
        this.buttons = [];
        this.createControls();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    }

    createControls() {
        // Create virtual joystick for movement
        this.createJoystick();

        // Create spell buttons
        this.createSpellButtons();
    }

    createJoystick() {
        const x = 120;
        const y = Constants.GAME_HEIGHT - 120;

        // Outer circle (base)
        const base = this.scene.add.circle(x, y, 60, 0x333333, 0.5);
        base.setScrollFactor(0);
        base.setDepth(1000);
        base.setStrokeStyle(3, 0xffffff, 0.8);

        // Inner circle (stick)
        const stick = this.scene.add.circle(x, y, 30, 0x4444ff, 0.8);
        stick.setScrollFactor(0);
        stick.setDepth(1001);

        this.joystick = {
            base: base,
            stick: stick,
            baseX: x,
            baseY: y,
            active: false,
            pointer: null
        };

        // Make interactive
        base.setInteractive();
        base.on('pointerdown', (pointer) => {
            this.joystick.active = true;
            this.joystick.pointer = pointer;
        });

        this.scene.input.on('pointerup', () => {
            if (this.joystick.active) {
                this.joystick.active = false;
                stick.x = this.joystick.baseX;
                stick.y = this.joystick.baseY;
            }
        });

        this.scene.input.on('pointermove', (pointer) => {
            if (this.joystick.active && pointer === this.joystick.pointer) {
                const distance = Phaser.Math.Distance.Between(
                    this.joystick.baseX,
                    this.joystick.baseY,
                    pointer.x,
                    pointer.y
                );

                const angle = Phaser.Math.Angle.Between(
                    this.joystick.baseX,
                    this.joystick.baseY,
                    pointer.x,
                    pointer.y
                );

                const maxDistance = 40;
                const clampedDistance = Math.min(distance, maxDistance);

                stick.x = this.joystick.baseX + Math.cos(angle) * clampedDistance;
                stick.y = this.joystick.baseY + Math.sin(angle) * clampedDistance;
            }
        });
    }

    createSpellButtons() {
        const startX = Constants.GAME_WIDTH - 240;
        const startY = Constants.GAME_HEIGHT - 120;
        const spacing = 80;

        const spells = [
            { key: 'fireball', label: 'Q', color: 0xff3300 },
            { key: 'lightning', label: 'E', color: 0xffff00 },
            { key: 'iceshard', label: 'F', color: 0x00ccff },
            { key: 'shield', label: 'R', color: 0x00ff00 }
        ];

        spells.forEach((spell, index) => {
            const x = startX + (index % 2) * spacing;
            const y = startY - Math.floor(index / 2) * spacing;

            // Button background
            const bg = this.scene.add.circle(x, y, 35, spell.color, 0.7);
            bg.setScrollFactor(0);
            bg.setDepth(1000);
            bg.setStrokeStyle(3, 0xffffff, 0.9);

            // Button label
            const label = this.scene.add.text(x, y, spell.label, {
                fontSize: '24px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: '#ffffff'
            });
            label.setOrigin(0.5);
            label.setScrollFactor(0);
            label.setDepth(1001);

            // Make interactive
            bg.setInteractive();
            bg.on('pointerdown', () => {
                bg.setScale(0.9);
                this.castSpell(spell.key);
            });
            bg.on('pointerup', () => {
                bg.setScale(1);
            });

            this.buttons.push({ bg, label, spell: spell.key });
        });
    }

    castSpell(spellType) {
        // Simulate key press for spell casting
        // This will be picked up by the wizard's handleActions
        if (!this.player) return;

        // Create a fake "JustDown" event by setting a flag
        if (!this.spellTriggers) {
            this.spellTriggers = {};
        }

        this.spellTriggers[spellType] = true;

        // Clear the trigger after a short delay
        setTimeout(() => {
            if (this.spellTriggers) {
                this.spellTriggers[spellType] = false;
            }
        }, 100);
    }

    update() {
        if (!this.isMobile || !this.joystick) return null;

        // Get joystick input
        const keys = {
            up: { isDown: false },
            down: { isDown: false },
            left: { isDown: false },
            right: { isDown: false },
            fireball: { isDown: false, _justDown: false },
            lightning: { isDown: false, _justDown: false },
            iceShard: { isDown: false, _justDown: false },
            shield: { isDown: false, _justDown: false },
            dash: { isDown: false, _justDown: false }
        };

        if (this.joystick.active) {
            const dx = this.joystick.stick.x - this.joystick.baseX;
            const dy = this.joystick.stick.y - this.joystick.baseY;
            const threshold = 10;

            if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
                if (dy < -threshold) keys.up.isDown = true;
                if (dy > threshold) keys.down.isDown = true;
                if (dx < -threshold) keys.left.isDown = true;
                if (dx > threshold) keys.right.isDown = true;
            }
        }

        // Add spell triggers
        if (this.spellTriggers) {
            if (this.spellTriggers.fireball) {
                keys.fireball._justDown = true;
            }
            if (this.spellTriggers.lightning) {
                keys.lightning._justDown = true;
            }
            if (this.spellTriggers.iceshard) {
                keys.iceShard._justDown = true;
            }
            if (this.spellTriggers.shield) {
                keys.shield._justDown = true;
            }
        }

        return keys;
    }

    destroy() {
        if (this.joystick) {
            this.joystick.base.destroy();
            this.joystick.stick.destroy();
        }

        this.buttons.forEach(btn => {
            btn.bg.destroy();
            btn.label.destroy();
        });
    }
}
