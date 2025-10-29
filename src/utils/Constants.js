// Game Constants
const Constants = {
    // Game dimensions
    GAME_WIDTH: 1280,
    GAME_HEIGHT: 720,
    LEVEL_WIDTH: 6400,  // Long race track (5x screen width)

    // Player stats
    MAX_HEALTH: 100,
    MAX_MANA: 100,
    MANA_REGEN_RATE: 10, // per second

    // Movement
    MOVEMENT_SPEED: 250,
    JUMP_VELOCITY: -400,  // Platformer jump
    DASH_DISTANCE: 150,
    DASH_DURATION: 300, // milliseconds
    DASH_COOLDOWN: 2000, // milliseconds
    INVINCIBILITY_DURATION: 200, // milliseconds

    // Platformer
    GRAVITY: 800,
    GROUND_Y: 650,  // Ground level
    PLATFORM_HEIGHT: 20,

    // Checkpoints
    CHECKPOINT_SPACING: 1280,  // Every screen width
    CHECKPOINT_COLOR: 0x00ff00,

    // Death
    RESPAWN_DELAY: 1000,  // 1 second delay before respawn
    DEATH_Y: 800,  // Fall death boundary

    // Spell costs and stats
    FIREBALL: {
        MANA_COST: 20,
        DAMAGE: 15,
        COOLDOWN: 2000, // milliseconds
        SPEED: 400,
        SIZE: 20
    },

    LIGHTNING: {
        MANA_COST: 35,
        DAMAGE: 25,
        COOLDOWN: 2000, // milliseconds
        DURATION: 200 // milliseconds for visual
    },

    ICE_SHARD: {
        MANA_COST: 25,
        DAMAGE: 10,
        COOLDOWN: 2000, // milliseconds
        SPEED: 300,
        SIZE: 18,
        SLOW_AMOUNT: 0.5,
        SLOW_DURATION: 2000 // milliseconds
    },

    SHIELD: {
        MANA_COST: 15,
        COOLDOWN: 2000, // milliseconds
        DURATION: 1500, // milliseconds
        MANA_RESTORE: 10 // on successful block
    },

    KNOCKBACK: {
        MANA_COST: 30,
        COOLDOWN: 4000, // milliseconds
        RANGE: 400, // max distance to target
        FORCE: 800, // knockback speed
        STUN_DURATION: 300 // milliseconds opponent is stunned
    },

    // Colors
    PLAYER1_COLOR: 0xff0000, // Red
    PLAYER2_COLOR: 0x0000ff, // Blue
    ARENA_BG: 0x2a2a3e,
    HEALTH_COLOR: 0xff4444,
    MANA_COLOR: 0x4444ff,

    // Player keys
    PLAYER1_KEYS: {
        UP: 'W',
        DOWN: 'S',
        LEFT: 'A',
        RIGHT: 'D',
        FIREBALL: 'Q',
        LIGHTNING: 'E',
        ICE_SHARD: 'F',
        SHIELD: 'R',
        DASH: 'SHIFT'
    },

    PLAYER2_KEYS: {
        UP: 'UP',
        DOWN: 'DOWN',
        LEFT: 'LEFT',
        RIGHT: 'RIGHT',
        FIREBALL: 'I',
        LIGHTNING: 'O',
        ICE_SHARD: 'U',
        SHIELD: 'P',
        DASH: 'ENTER'
    }
};
