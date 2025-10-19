# Power-Ups System - Stick Wizard Duel

## Overview
Power-ups now spawn randomly during battles, giving temporary boosts or instant effects!

## Power-Up Types

### ⚡ Speed Boost (Yellow)
- **Icon:** ⚡
- **Duration:** 8 seconds
- **Effect:** Projectiles travel 2x faster!
- **Strategy:** Great for overwhelming slow opponents or hitting from long range

### 💥 Damage Boost (Red)
- **Icon:** 💥
- **Duration:** 8 seconds
- **Effect:** All spells deal 2x damage!
- **Strategy:** Combo with lightning for instant 50 damage kills

### 🔥 Rapid Fire (Orange)
- **Icon:** 🔥
- **Duration:** 10 seconds
- **Effect:** Cooldowns reduced by 90% - spam spells!
- **Strategy:** Unleash a barrage of fireballs, opponent can't keep up

### ⭐ Giant Spells (Green)
- **Icon:** ⭐
- **Duration:** 8 seconds
- **Effect:** Projectiles are 2x larger - easier to hit!
- **Strategy:** Huge hitboxes make dodging nearly impossible

### ❤️ Health Pack (Green)
- **Icon:** ❤️
- **Duration:** Instant
- **Effect:** Restore 50 HP immediately!
- **Strategy:** Grab when low on health to turn the tide

### 💎 Mana Surge (Blue)
- **Icon:** 💎
- **Duration:** Instant
- **Effect:** Restore 50 Mana immediately!
- **Strategy:** Grab for a quick mana refill, cast expensive spells

## Spawning System

### Timing:
- **First spawn:** 5 seconds after match starts
- **After that:** Every 15-20 seconds (random)
- **Auto-despawn:** After 10 seconds if not collected

### Location:
- Spawns in random positions in the middle area of the arena
- Avoids edges to prevent camping

## Visual Effects

### Power-Up Display:
- **Glowing circle** with colored aura
- **Floating animation** - bobs up and down
- **Rotating** - spins slowly
- **Pulsing glow** - breathes in and out

### Collection Feedback:
- Power-up **expands and fades**
- **Text notification** appears showing name and effect
- **Console log** confirms collection

### Active Power-Up Indicators:
- Check console for "power-up active" messages
- Timer counts down automatically
- Expires with console notification

## Power-Up Interactions

### Stacking:
❌ Power-ups **DO NOT stack**
- Collecting a new power-up **replaces** the current one
- Timer resets

### With Reflection:
✅ Reflected projectiles **keep** power-up effects!
- Reflected 2x damage fireball still deals 2x damage
- Reflected giant projectile stays giant

### With Ice Shard:
✅ Power-ups work on ALL spell types
- Ice shards can be giant, fast, or deal more damage

### With Lightning:
⚠️ Lightning is instant (no projectile)
- Speed/Giant power-ups don't affect lightning
- Damage boost **DOES** affect lightning (50 damage!)
- Rapid fire **DOES** affect lightning cooldown

## Strategy Guide

### Offensive Combinations:

**Glass Cannon:**
1. Grab **Damage Boost**
2. Spam lightning bolts (50 damage each!)
3. Two hits = instant kill

**Machine Gun:**
1. Grab **Rapid Fire**
2. Spam fireballs non-stop
3. Create projectile storm

**Sniper:**
1. Grab **Speed Boost**
2. Fire from max range
3. Opponent can't dodge fast projectiles

**Tank Buster:**
1. Grab **Giant Spells**
2. Impossible to miss
3. Force opponent to shield constantly

### Defensive Tactics:

**Deny Power-Ups:**
- Grab power-ups even if you don't need them
- Prevents opponent from getting them
- Health/Mana are always useful

**Bait and Switch:**
- Pretend to go for power-up
- Opponent commits
- Attack while they're distracted

**Power-Up Control:**
- Position near center where power-ups spawn
- React quickly to new spawns
- Use dash to grab faster

## Advanced Techniques

### Power-Up Combos (Sequential):
1. **Mana Surge** → **Damage Boost** → Lightning spam
2. **Health Pack** → **Rapid Fire** → Aggressive pressure
3. **Speed Boost** → Reflect enemy shots back faster

### Timing Windows:
- **8-second power-ups:** Plan your attack burst
- **10-second Rapid Fire:** Maximum spell output
- **Instant effects:** Emergency saves

### Risk vs Reward:
- Going for power-ups exposes you to attacks
- Sometimes better to maintain position
- Health packs worth the risk when low

## Power-Up Spawn Prediction

Power-ups spawn **15-20 seconds** apart:
- After collecting one, expect next in ~17 seconds (average)
- Start moving toward center around 15 second mark
- Be ready to contest

## Fun Facts

- **Fastest match:** Damage Boost + 2 Lightning Bolts = 6 seconds
- **Longest barrage:** Rapid Fire = ~30 fireballs in 10 seconds
- **Biggest projectile:** Giant + reflected fireball = screen-filling
- **Highest damage:** Damage Boost Lightning = 50 HP (half health!)

---

**Try them all!** Refresh your browser and wait for power-ups to spawn. Can you win using only power-ups? 🎮✨
