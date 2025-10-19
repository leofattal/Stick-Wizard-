# Debug Information - Fireball Issue

## Current Status
Added extensive debug logging to track down why fireballs aren't dealing damage.

## How to Debug

1. **Open the game:** http://localhost:8000
2. **Open Browser Console:** Press F12 (or Cmd+Option+I on Mac)
3. **Start a game:** Click PLAY
4. **Cast fireballs:**
   - Player 1: Press **Q**
   - Player 2: Press **I**

## What to Look For in Console

### When Casting a Fireball:
```
Player 1 casting fireball!
Creating fireball at angle: X towards opponent at Y, Z
```

### When Fireball Hits:
```
Projectile hit check: fireball Owner: 1 Target: 2
Dealing damage: 15
Player 2 takeDamage called. Damage: 15 Current HP: 100
Player 2 took 15 damage. New HP: 85
```

### Possible Issues:

#### 1. No "casting fireball" message
**Problem:** Key binding not working
**Solution:** Keys Q and I might not be registering

#### 2. Fireball cast but no "hit check" message
**Problem:** Collision detection failing
**Possible causes:**
- Projectile not reaching target
- Physics body not set up correctly
- Collision radius too small

#### 3. "Hit self, ignoring" message
**Problem:** Projectile thinks it hit its own caster
**Solution:** Owner comparison issue

#### 4. takeDamage called but "invincible or dead"
**Problem:** Wizard is in invincible state (from dash)
**Solution:** Wait for dash to finish

#### 5. "Target is shielding"
**Problem:** Shield is active
**Solution:** This is correct behavior

## Quick Tests

### Test 1: Can you cast fireballs?
- Press Q (Player 1) or I (Player 2)
- Watch console for "casting fireball" message
- Look for visual fireball on screen

### Test 2: Do fireballs travel?
- Cast a fireball
- Watch it move across the screen
- Does it reach the opponent?

### Test 3: Do fireballs hit?
- Cast a fireball at opponent
- Watch for "hit check" message in console
- Does the fireball explode on contact?

### Test 4: Does damage register?
- Hit opponent with fireball
- Check console for "took damage" message
- Watch health bar at top of screen
- Does the red bar decrease?

## Manual Damage Test

If fireballs still don't work, try **Lightning** instead:
- Player 1: Press **E**
- Player 2: Press **O**

Lightning is hitscan (instant) so it should always hit if aimed correctly.

## Common Issues & Solutions

### Issue: "Cannot read property 'x' of undefined"
**Cause:** Sprite not properly initialized
**Fix:** Check that both wizards are created before casting

### Issue: Particle errors
**Cause:** Particle system failing
**Fix:** Already wrapped in try-catch, should not block gameplay

### Issue: Keys not responding
**Cause:** Browser focus not on game window
**Fix:** Click on the game canvas first

### Issue: Mana depletes but no fireball
**Cause:** Projectile creation failing
**Fix:** Check GameScene.createProjectile method

## Next Steps

After testing, report back what you see in the console:
1. Which messages appear?
2. Which messages are missing?
3. Any error messages in red?

This will help identify exactly where the issue is occurring.

---

**Current Debug Build Active**
Refresh browser (Ctrl+Shift+R) to load latest code with debug logging.
