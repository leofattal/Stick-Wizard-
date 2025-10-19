# Stick Wizard Duel

A fast-paced 2D stick figure wizard battle game built with HTML5 and Phaser 3.

## Overview

Two wizards face off in a magical arena, casting spells and blocking attacks in an epic duel. Battle your friend in local multiplayer mode with simple keyboard controls!

## Features

- **Two-Player Local Multiplayer** - Battle on the same keyboard
- **Three Spell Types** - Fireball, Lightning Bolt, and Shield
- **Resource Management** - Manage mana to cast powerful spells
- **Dash Mechanic** - Dodge incoming attacks with invincibility frames
- **Smooth Animations** - Hand-drawn stick figures with particle effects
- **Victory Conditions** - First wizard to defeat opponent wins

## How to Run

### Option 1: Local Server (Python)
```bash
# Navigate to the game directory
cd Stick-Wizard-

# Start a local server
python3 -m http.server 8000

# Open your browser to http://localhost:8000
```

### Option 2: Any HTTP Server
Simply serve the directory with any HTTP server and open `index.html` in a web browser.

### Option 3: Direct File
Open `index.html` directly in your browser (some features may not work due to CORS).

## Controls

### Player 1 (Red Wizard)
- **WASD** - Move
- **Q** - Cast Fireball (20 mana, 15 damage)
- **E** - Cast Lightning (35 mana, 25 damage)
- **R** - Cast Shield (15 mana, blocks next spell)
- **SHIFT** - Dash (invincibility frames)

### Player 2 (Blue Wizard)
- **Arrow Keys** - Move
- **I** - Cast Fireball (20 mana, 15 damage)
- **O** - Cast Lightning (35 mana, 25 damage)
- **P** - Cast Shield (15 mana, blocks next spell)
- **ENTER** - Dash (invincibility frames)

## Gameplay Mechanics

### Health & Mana
- Each wizard starts with **100 HP** and **100 Mana**
- Mana regenerates at **10 mana per second**
- First wizard to reach 0 HP loses

### Spells

**Fireball**
- Fast projectile spell
- Low mana cost, moderate damage
- Bread-and-butter attack

**Lightning Bolt**
- Instant hitscan beam
- High mana cost, high damage
- Requires precise aim

**Shield**
- Blocks the next incoming spell
- Restores 10 mana on successful block
- Lasts 1.5 seconds

### Dash
- Quick movement burst
- 0.2 seconds of invincibility
- Can dodge through projectiles
- 2-second cooldown

## Game Modes

### Current
- **Local Multiplayer** - Two players on same device

### Planned (Future Updates)
- AI opponent with difficulty levels
- Power-ups during matches
- Multiple arena backgrounds
- Touch controls for mobile
- Online multiplayer

## Development

### Technology Stack
- **Engine**: Phaser 3.70.0
- **Language**: JavaScript (ES6)
- **Platform**: HTML5 (cross-platform)

### Project Structure
```
Stick-Wizard-/
├── index.html           # Main HTML file
├── src/
│   ├── main.js         # Game initialization
│   ├── utils/
│   │   └── Constants.js # Game constants
│   ├── entities/
│   │   ├── Wizard.js    # Wizard class
│   │   └── Projectile.js # Projectile class
│   └── scenes/
│       ├── MenuScene.js  # Main menu
│       ├── GameScene.js  # Main gameplay
│       └── VictoryScene.js # End screen
├── assets/
│   ├── images/         # (Future) Sprite assets
│   └── sounds/         # (Future) Audio files
├── PRD.md              # Product Requirements Document
└── README.md           # This file
```

## Tips & Strategy

1. **Manage Your Mana** - Don't spam spells; wait for mana to regenerate
2. **Shield Timing** - Block high-damage lightning bolts to gain mana advantage
3. **Dash for Dodging** - Use dash invincibility to dodge through projectiles
4. **Maintain Distance** - Lightning requires line of sight; use movement to avoid
5. **Combo Attacks** - Follow up a shield break with quick fireball
6. **Bait Shields** - Force opponent to waste their shield cooldown

## Known Issues

- Particle effects are basic (no custom textures yet)
- No sound effects or music (planned)
- Ice Shard spell not yet implemented
- No mobile touch controls yet

## Future Enhancements

See [PRD.md](PRD.md) for complete feature roadmap including:
- AI opponents (Easy/Medium/Hard)
- Ice Shard spell (slowing effect)
- Power-ups (Health, Mana, Speed, etc.)
- Multiple arena backgrounds
- Sound effects and music
- Mobile/touch support
- Campaign mode
- Cosmetic unlocks

## Credits

Built with [Phaser 3](https://phaser.io/) - HTML5 Game Framework

## License

MIT License - Feel free to use and modify for your own projects!

---

**Have fun dueling!** May the best wizard win! ⚡🔥✨
