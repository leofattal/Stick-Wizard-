# Fireball Collision Test

## Current Status
Added comprehensive debug logging to track collision detection.

## How to Test

1. **Refresh browser** (Ctrl+Shift+R / Cmd+Shift+R)
2. **Open Console** (F12)
3. **Start game**
4. **Cast a fireball** with Q or I
5. **Watch console output**

## Expected Console Output

### When Fireball is Cast:
```
Player 1 casting fireball!
Creating fireball at angle: 0.0 towards opponent at 1080, 360
Projectile created at 200 360 with velocity {x: 400, y: 0}
```

### During Flight:
```
Active projectiles: 1
Projectile position: 250 360
Player 1 position: 200 360
Player 2 position: 1080 360
```

### When Getting Close:
```
Projectile distance to Player 2: 95.5 Threshold: 35 Will hit: false
Projectile distance to Player 2: 85.2 Threshold: 35 Will hit: false
Projectile distance to Player 2: 65.8 Threshold: 35 Will hit: false
Projectile distance to Player 2: 45.3 Threshold: 35 Will hit: false
Projectile distance to Player 2: 32.1 Threshold: 35 Will hit: true
```

### On Hit:
```
HIT DETECTED on Player 2!
Projectile hit check: fireball Owner: 1 Target: 2
Dealing damage: 15
Player 2 takeDamage called. Damage: 15 Current HP: 100
Player 2 took 15 damage. New HP: 85
```

## What We're Looking For

### Issue 1: Distance Never Gets Small
**Symptom:** Distance stays > 100, never approaches 35
**Cause:** Projectile not traveling toward player
**Check:** Velocity and angle calculations

### Issue 2: Distance Gets Close But Never < 35
**Symptom:** Distance reaches 40-50 but never hits threshold
**Cause:** Collision threshold too small or projectile too fast
**Fix:** Increase threshold or slow projectile

### Issue 3: Hit Detected But No Damage
**Symptom:** "HIT DETECTED" appears but no "takeDamage"
**Cause:** hitTarget not being called or failing
**Check:** Projectile.hitTarget method

### Issue 4: takeDamage Called But No Effect
**Symptom:** "took damage" appears but health bar doesn't change
**Cause:** UI update issue
**Check:** updatePlayerUI method

## Quick Fixes to Try

### If Distance Never Gets Small:
The projectile might not be traveling. Check velocity in console.

### If Distance Approaches But Misses:
Try increasing collision threshold in GameScene.js line 306:
```javascript
return distance < 50; // Increased from 35
```

### If Positions Look Wrong:
Player or projectile positions might be wrong.
Expected:
- Player 1: around x=200
- Player 2: around x=1080
- Projectile: moving from one toward the other

---

**Run the test now and paste console output here!**
