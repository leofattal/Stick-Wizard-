#!/bin/bash

# Stick Wizard Duel - Production Build Script

echo "🎮 Building Stick Wizard Duel - Production Version"
echo "=================================================="

# Create build directory
echo "📁 Creating build directory..."
rm -rf build
mkdir -p build
mkdir -p build/src/entities
mkdir -p build/src/scenes
mkdir -p build/src/utils

# Copy HTML
echo "📄 Copying HTML..."
cp index.html build/

# Copy JavaScript files
echo "📦 Copying game files..."
cp src/utils/Constants.js build/src/utils/
cp src/entities/Wizard.js build/src/entities/
cp src/entities/Projectile.js build/src/entities/
cp src/entities/PowerUp.js build/src/entities/
cp src/entities/AIController.js build/src/entities/
cp src/scenes/MenuScene.js build/src/scenes/
cp src/scenes/GameScene.js build/src/scenes/
cp src/scenes/VictoryScene.js build/src/scenes/
cp src/scenes/TieScene.js build/src/scenes/
cp src/main.js build/src/

# Copy assets if they exist
if [ -d "assets" ]; then
    echo "🎨 Copying assets..."
    cp -r assets build/
fi

# Create README for build
cat > build/README.md << 'EOF'
# Stick Wizard Duel - Production Build

## How to Deploy

### Option 1: Simple HTTP Server
```bash
cd build
python3 -m http.server 8080
```
Then open http://localhost:8080

### Option 2: Deploy to Static Hosting
Upload the entire `build` folder to:
- GitHub Pages
- Netlify
- Vercel
- Any static web host

### Game Controls

**Player 1 (Red Wizard):**
- Move: WASD
- Fireball: Q
- Lightning: E
- Ice Shard: F
- Shield: R
- Dash: SHIFT

**Player 2 (Blue Wizard):**
- Move: Arrow Keys
- Fireball: I
- Lightning: O
- Ice Shard: U
- Shield: P
- Dash: ENTER

### Game Modes
- **2 PLAYERS**: Local multiplayer
- **VS AI BOT**: Play against computer

### Features
- Epic slow-motion victory sequences
- Projectile reflection with shields
- Power-ups (speed, damage, rapid fire, giant spells, health, mana)
- Knockback effects on all attacks
- Tie detection for simultaneous deaths

---
Made with ❤️ using Phaser 3
EOF

echo ""
echo "✅ Build Complete!"
echo "📦 Production files are in: ./build/"
echo ""
echo "🚀 To test the build:"
echo "   cd build && python3 -m http.server 8080"
echo ""
echo "📤 To deploy:"
echo "   Upload the entire 'build' folder to your web host"
echo ""
