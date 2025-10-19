# Knockback Spell Feature - Stick Wizard Duel

## Overview
The **Knockback Spell** is a tactical utility spell that lets you blast your opponent across the arena! It's perfect for denying power-ups, creating space, or setting up combos.

## How to Use

### Activation (Two-Phase Casting):
1. **Press the knockback key** (F for Player 1, U for Player 2)
   - Enters targeting mode
   - Your character becomes highlighted with a colored circle showing range (400px radius)
2. **Click anywhere on the screen**
   - Your opponent gets knocked back toward that location
   - Only works if opponent is within range!

### Controls:
- **Player 1 (Red Wizard):** Press **F** to activate, then click to target
- **Player 2 (Blue Wizard):** Press **U** to activate, then click to target

## Spell Statistics

| Property | Value |
|----------|-------|
| **Mana Cost** | 30 mana |
| **Cooldown** | 4 seconds |
| **Range** | 400 pixels (shown as circle during targeting) |
| **Knockback Force** | 800 units/second |
| **Stun Duration** | 300ms (0.3 seconds) |

## Visual Feedback

### Targeting Mode:
When you press the knockback key, you'll see:
- **Range Circle:** Shows maximum effective range (400px) around your character
- **Targeting Line:** Yellow line from you to your mouse cursor
- **Target Circle:** Shows where opponent will be knocked to
- **Color Coding:**
  - **Green:** Opponent is in range, knockback will work
  - **Red:** Opponent is out of range, won't work (mana refunded)
- **Crosshair:** White crosshair at the target location

### During Knockback:
- Victim becomes semi-transparent (50% opacity)
- Victim cannot move or cast spells for 300ms
- Victim is launched toward the targeted location at high speed
- After 300ms, victim regains control

## Strategic Uses

### Deny Power-Ups:
The primary use case! When a power-up spawns:
1. If opponent is running toward it
2. Press knockback key
3. Click on the opposite side of the arena
4. Opponent gets blasted away from the power-up
5. You grab it while they're recovering!

### Create Space:
- Low on health? Knock opponent away to create breathing room
- Need time to regenerate mana? Push them back
- Set up distance for lightning bolt or long-range attacks

### Environmental Control:
- Knock opponent into corners where they can't dodge easily
- Push them away from favorable positions
- Control the center of the arena

### Combo Setups:
1. **Knockback → Lightning:** Push opponent away, then hit with instant lightning
2. **Knockback → Fireball Spam:** Create distance, spam projectiles while they recover
3. **Power-up → Knockback:** Grab power-up, immediately deny opponent access
4. **Shield Bait → Knockback:** Bait their shield, then knock them away when vulnerable

## Advanced Techniques

### Power-Up Denial Flow:
```
Power-up spawns at center
    ↓
Both players rush toward it
    ↓
You reach range first (400px)
    ↓
Press F/U to start targeting
    ↓
Click behind opponent (away from power-up)
    ↓
Opponent gets knocked back
    ↓
You collect power-up during their 300ms stun
    ↓
Profit! 💰
```

### Range Management:
- The 400px range is shown as a circle during targeting
- Stay within range but not too close (vulnerable to their attacks)
- If opponent is out of range, the spell won't fire and you get mana/cooldown refunded
- No penalty for missing!

### Baiting and Positioning:
- **Fake-out:** Start targeting to make opponent nervous, cancel by right-clicking
- **Prediction:** Click where opponent is moving, not where they currently are
- **Corner Traps:** Knock into corners, then follow up with projectiles

## Counters and Weaknesses

### How to Avoid Being Knocked Back:
1. **Stay out of range:** Keep distance > 400px when you see them charging
2. **Use dash:** Dash away as soon as you see the targeting circle appear
3. **Cast lightning:** Interrupt them with instant lightning before they click
4. **Shield up:** While shield doesn't prevent knockback, it protects during recovery
5. **Constant movement:** Harder to predict where you'll be when they click

### Limitations:
- **Mana Cost:** 30 mana is expensive (almost as much as lightning's 35)
- **Cooldown:** 4 seconds means you can't spam it
- **Range:** 400px isn't huge - opponent can stay far away
- **No Damage:** Purely utility, doesn't deal damage
- **Telegraphed:** Opponent sees the targeting visuals
- **Requires Precision:** Must click accurately

## Interactions with Other Systems

### With Power-Ups:
✅ Works normally - no special interactions
- Can knock back opponents who have power-ups active
- Can be used while you have a power-up active
- **Rapid Fire** power-up reduces knockback cooldown by 90%!

### With Shield:
❌ Shield does NOT prevent knockback
- You can still be knocked back while shielding
- However, you can shield during the stun to block follow-up attacks

### With Dash:
⚡ Can dash during targeting mode to reposition
- Press F/U to start targeting
- Dash to better position
- Then click to execute

### With Reflection:
N/A - Knockback has no projectile to reflect

### With Stunned/Slowed States:
- Cannot cast knockback while knocked back yourself
- Can cast knockback on slowed opponents (from ice shard)
- Ice shard slow does not affect knockback force

## Tips and Tricks

### Pro Tips:
1. **Predict movement:** Click ahead of where opponent is moving
2. **Use during chaos:** When opponent is focused on dodging projectiles
3. **Guard power-ups:** Position yourself to knock back anyone approaching
4. **Combo with rapid fire:** Get rapid fire power-up, spam knockback every 0.4 seconds!
5. **Corner push:** Knock opponents into corners for guaranteed projectile hits

### Common Mistakes:
- ❌ Forgetting about the 400px range requirement
- ❌ Clicking too late (opponent already grabbed power-up)
- ❌ Using it when low on mana (leaves you vulnerable)
- ❌ Clicking on opponent instead of where you want them to go
- ❌ Staying in targeting mode too long (exposes you to attacks)

## Fun Facts

- **Fastest power-up denial:** Knockback → dash → grab = under 1 second
- **Maximum distance:** With 800 force over 300ms = ~240 pixels of displacement
- **Combo with rapid fire:** Can knockback every 0.4 seconds (10x cooldown reduction!)
- **Two-way fight:** Both players can knockback simultaneously (hilarious results!)
- **Physics fun:** Knocked back into walls = instant stop (wall collision)

## Changelog

### Version 1.0 (Initial Release)
- Two-phase casting: key press → mouse click
- Visual targeting system with range indicator
- 400px range, 30 mana cost, 4s cooldown
- 300ms stun duration, 800 knockback force
- Color-coded range feedback (green/red)
- Mana/cooldown refund when out of range

---

**Master the knockback spell and control the battlefield!** 🎮✨

No one will ever steal your power-ups again! 💪
