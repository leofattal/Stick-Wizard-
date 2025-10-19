# Stick Wizard Duel - Keyboard Layout Guide

## Visual Keyboard Layout

```
┌────────────────────────────────────────────────────────────────────┐
│                    STANDARD KEYBOARD LAYOUT                         │
└────────────────────────────────────────────────────────────────────┘

   PLAYER 1 ZONE (Left Side)              PLAYER 2 ZONE (Right Side)
   ═════════════════════════              ═════════════════════════

   [Q]   [W]   [E]   [R]                        [I]   [O]   [P]
   Fire  Up    Light Shield                    Fire  Light Shield

   [A]   [S]   [D]                              [↑]
   Left  Down  Right                          Up
                                           [←]  [↓]  [→]
                                           Left Down Right

   [SHIFT]                                          [ENTER]
   Dash                                             Dash

```

## Control Mapping

### Player 1 (Red Wizard) - LEFT SIDE
All controls grouped on the left side of the keyboard for one-handed play.

```
┌─────────────────────────────┐
│  ACTION      │  KEY         │
├─────────────────────────────┤
│  Move Up     │  W           │
│  Move Down   │  S           │
│  Move Left   │  A           │
│  Move Right  │  D           │
├─────────────────────────────┤
│  Fireball    │  Q  (20 MP)  │
│  Lightning   │  E  (35 MP)  │
│  Shield      │  R  (15 MP)  │
│  Dash        │  SHIFT       │
└─────────────────────────────┘
```

**Hand Position:**
- Index finger: D (right) / E (lightning)
- Middle finger: W (up) / R (shield)
- Ring finger: A (left) / Q (fireball)
- Pinky: SHIFT (dash)
- Thumb: SPACE bar (rests)

### Player 2 (Blue Wizard) - RIGHT SIDE
Controls on the right side, using arrow keys for movement.

```
┌─────────────────────────────┐
│  ACTION      │  KEY         │
├─────────────────────────────┤
│  Move Up     │  ↑           │
│  Move Down   │  ↓           │
│  Move Left   │  ←           │
│  Move Right  │  →           │
├─────────────────────────────┤
│  Fireball    │  I  (20 MP)  │
│  Lightning   │  O  (35 MP)  │
│  Shield      │  P  (15 MP)  │
│  Dash        │  ENTER       │
└─────────────────────────────┘
```

**Hand Position (Two-Handed):**
- Left hand: I, O, P for spells
- Right hand: Arrow keys for movement, Enter for dash

**Hand Position (One-Handed Advanced):**
- Thumb: Arrow keys
- Fingers: Reach up to I, O, P
- Pinky: ENTER

## Why These Keys?

### Player 1: Q, E, R + SHIFT
✅ **Pros:**
- All keys are adjacent to WASD movement
- Natural finger placement (QWER row)
- No need to move hand away from home position
- SHIFT is large and easy to hit with pinky
- Commonly used in PC games (LoL, Overwatch, etc.)

❌ **Old Layout (J, K, L, SPACE):**
- Required stretching hand far from WASD
- Uncomfortable finger positioning
- Slower reaction times

### Player 2: I, O, P + ENTER
✅ **Pros:**
- Located directly above arrow keys
- Easy to reach without looking
- Works on ALL keyboards (no numpad needed)
- Natural progression (I→O→P)

❌ **Old Layout (NUMPAD 1, 2, 3):**
- Doesn't exist on many laptops
- Requires NumLock to be ON
- Too far from arrow keys

## Ergonomic Benefits

### 1. **Reduced Hand Strain**
Both players can keep their hands in natural positions without stretching.

### 2. **Faster Reaction Times**
All keys are within immediate reach of the home position.

### 3. **Better Comfort for Long Sessions**
No awkward hand angles or finger gymnastics required.

### 4. **Universal Compatibility**
Works on all keyboard types:
- Full-size keyboards ✅
- Tenkeyless (no numpad) ✅
- Laptop keyboards ✅
- 60% mechanical keyboards ✅

## Tips for Each Player

### Player 1 Tips:
1. **Rest Position:** Keep fingers on WASD like FPS games
2. **Quick Spells:** Flick ring finger to Q, index to E
3. **Emergency Shield:** Middle finger easily reaches R
4. **Instant Dash:** Pinky always ready on SHIFT
5. **Pro Tip:** Practice Q-E-R combos for spell rotation

### Player 2 Tips:
1. **Two-Hand Setup:** Left on I/O/P, right on arrows
2. **One-Hand Setup:** Thumb on arrows, fingers arch to I/O/P
3. **Quick Spells:** Index=I, Middle=O, Ring=P
4. **Emergency Dash:** Pinky drops to ENTER
5. **Pro Tip:** Use left hand for spells while right focuses on movement

## For Accessibility

If these controls don't work for you:
- Edit `src/scenes/GameScene.js` (lines 125-147)
- Change `KeyCodes.X` to any key you prefer
- Common alternatives:
  - Player 1: 1, 2, 3 (number row)
  - Player 1: Z, X, C (bottom row)
  - Player 2: Numpad (if available)
  - Player 2: U, J, K (home row)

## Comparison to Popular Games

**Similar to:**
- **League of Legends:** Q, W, E, R for abilities ✅
- **Overwatch:** Q for ultimate, E for ability ✅
- **Valorant:** Q, E for abilities ✅
- **Minecraft:** WASD + Q for drop, E for inventory ✅

Player 1 controls follow industry-standard QWER layout!

---

**Ready to play?** Refresh your browser and try the new ergonomic controls! 🎮
