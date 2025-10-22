class ReplayRecorder {
    constructor(scene) {
        this.scene = scene;
        this.frames = [];
        this.isRecording = false;
        this.replayData = null;
        this.killingBlowFrame = null; // Track when killing blow happens
        this.lightningStrikes = []; // Track lightning effects
    }

    startRecording() {
        this.isRecording = true;
        this.frames = [];
        this.killingBlowFrame = null;
        this.lightningStrikes = [];
        console.log('📹 Replay recorder started');
    }

    recordLightningStrike(fromX, fromY, toX, toY) {
        if (!this.isRecording) return;

        this.lightningStrikes.push({
            frameNumber: this.frames.length,
            fromX, fromY, toX, toY,
            timestamp: Date.now()
        });
    }

    recordFrame() {
        if (!this.isRecording) return;

        // Capture current game state
        const frame = {
            timestamp: Date.now(),
            frameNumber: this.frames.length,
            player1: this.capturePlayerState(this.scene.player1),
            player2: this.capturePlayerState(this.scene.player2),
            projectiles: this.captureProjectiles(),
            powerUps: this.capturePowerUps()
        };

        this.frames.push(frame);
    }

    markKillingBlow() {
        // Mark the current frame as when the killing blow happened
        this.killingBlowFrame = this.frames.length - 1;
        console.log('💀 Killing blow marked at frame:', this.killingBlowFrame);
    }

    capturePlayerState(player) {
        if (!player || !player.sprite) return null;

        return {
            x: player.sprite.x,
            y: player.sprite.y,
            alpha: player.sprite.alpha,
            angle: player.sprite.angle,
            health: player.health,
            mana: player.mana,
            isAlive: player.isAlive,
            isShielding: player.isShielding,
            color: player.color
        };
    }

    captureProjectiles() {
        if (!this.scene.projectiles) return [];

        return this.scene.projectiles.map(proj => {
            if (!proj || !proj.sprite) return null;

            return {
                x: proj.sprite.x,
                y: proj.sprite.y,
                type: proj.type,
                angle: proj.angle,
                ownerNumber: proj.owner ? proj.owner.playerNumber : 0
            };
        }).filter(p => p !== null);
    }

    capturePowerUps() {
        if (!this.scene.powerUps) return [];

        return this.scene.powerUps.map(powerUp => {
            if (!powerUp || !powerUp.sprite) return null;

            return {
                x: powerUp.sprite.x,
                y: powerUp.sprite.y,
                type: powerUp.type
            };
        }).filter(p => p !== null);
    }

    stopRecording() {
        this.isRecording = false;
        this.replayData = {
            frames: [...this.frames],
            duration: this.frames.length,
            killingBlowFrame: this.killingBlowFrame,
            lightningStrikes: [...this.lightningStrikes]
        };
        console.log('🎬 Replay captured:', this.frames.length, 'frames, killing blow at frame:', this.killingBlowFrame, 'lightning strikes:', this.lightningStrikes.length);
        return this.replayData;
    }

    getReplay() {
        return this.replayData;
    }

    clear() {
        this.frames = [];
        this.replayData = null;
        this.isRecording = false;
    }
}
