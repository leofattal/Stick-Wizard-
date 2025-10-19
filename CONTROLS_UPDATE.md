# Controls Update - Ergonomic Layout

## Issues Identified
1. **Player 2:** Attack controls were mapped to NUMPAD keys (NUMPAD 1, 2, 3), which don't work on:
   - Laptops without numpads
   - Keyboards with NumLock off
   - Some international keyboard layouts

2. **Player 1:** Attack controls (J, K, L) were too far from movement keys (WASD), requiring awkward hand positioning

## Solution Implemented

### Player 1: Moved to Left Side of Keyboard
Changed from **J, K, L, SPACE** to **Q, E, R, SHIFT**
- All controls now grouped on the left side
- Natural hand positioning around WASD
- SHIFT for dash is easily accessible with pinky

### Player 2: Changed to Letter Keys
Changed from **NUMPAD 1, 2, 3** to **I, O, P**
- Located conveniently near the arrow keys
- Easy to reach with right hand
- Works on all keyboard layouts

## New Controls

### Player 1 (Red Wizard - Left Side)
```
Movement:     W A S D
Fireball:     Q
Lightning:    E
Shield:       R
Knockback:    F
Dash:         SHIFT
```

### Player 2 (Blue Wizard - Right Side)
```
Movement:     ↑ ← ↓ →
Fireball:     I
Lightning:    O
Shield:       P
Knockback:    U
Dash:         ENTER
```

## Updated Files
✅ [src/scenes/GameScene.js](src/scenes/GameScene.js) - Key bindings
✅ [src/scenes/MenuScene.js](src/scenes/MenuScene.js) - Controls display
✅ [src/utils/Constants.js](src/utils/Constants.js) - Documentation
✅ [src/main.js](src/main.js) - Console log
✅ [README.md](README.md) - User guide
✅ [QUICKSTART.md](QUICKSTART.md) - Quick reference

## Testing Instructions

1. **Refresh your browser** (Ctrl+Shift+R or Cmd+Shift+R to force reload)
2. Start a new game
3. Test Player 2 controls:
   - Press **I** for Fireball
   - Press **O** for Lightning
   - Press **P** for Shield
   - Press **ENTER** for Dash

## Controls Layout Visualization

```
Player 1 Hand Position (Left Side):
  [Q]   [W]   [E]   [R]    ← Attacks above movement
    [A] [S] [D] [F]          ← Movement + Knockback
[SHIFT]                      ← Dash (pinky)

Player 2 Hand Position (Right Side):
  [U] [I]   [O]   [P]      ← Knockback + Attack keys
      [↑]
  [←] [↓] [→]              ← Movement
                [Enter]    ← Dash
```

## Keyboard Ergonomics

**Player 1 (Left hand only):**
- Fingers rest naturally on WASD
- Ring/Index/Middle fingers reach Q/E/R easily
- Pinky on SHIFT for quick dashes
- All actions accessible without moving hand

**Player 2 (Right hand dominant):**
- **Option A:** Right hand on arrows, left hand on I/O/P
- **Option B:** Single-hand (advanced) - thumb on arrows, fingers on I/O/P

## Notes

The new key layout is much more accessible and should work on all keyboards. The keys are also logically grouped near the arrow keys for easier access.

If you need further customization, the key bindings are easily modified in [src/scenes/GameScene.js](src/scenes/GameScene.js) line 137-147.
