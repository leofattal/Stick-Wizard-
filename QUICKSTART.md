# Quick Start Guide - Stick Wizard Duel

## 🚀 Get Playing in 30 Seconds

### Step 1: Start the Server
```bash
cd Stick-Wizard-
python3 -m http.server 8000
```

### Step 2: Open in Browser
Navigate to: **http://localhost:8000**

### Step 3: Start Playing!
Click **PLAY** and battle begins!

---

## 🎮 Controls Cheat Sheet

### Player 1 (Red Wizard - Left Side)
```
Movement:     W A S D
Fireball:     Q
Lightning:    E
Shield:       R
Dash:         SHIFT
```

### Player 2 (Blue Wizard - Right Side)
```
Movement:     ↑ ← ↓ →
Fireball:     I
Lightning:    O
Shield:       P
Dash:         ENTER
```

---

## ⚡ Spell Guide

### 🔥 Fireball (J / NUM1)
- **Cost:** 20 mana
- **Damage:** 15 HP
- **Speed:** Fast projectile
- **Use:** Your bread-and-butter attack

### ⚡ Lightning (K / NUM2)
- **Cost:** 35 mana
- **Damage:** 25 HP
- **Speed:** Instant beam
- **Use:** High damage, requires aim

### 🛡️ Shield (L / NUM3)
- **Cost:** 15 mana
- **Effect:** Blocks next spell
- **Bonus:** +10 mana on successful block
- **Duration:** 1.5 seconds

### 💨 Dash (SPACE / ENTER)
- **Cost:** Free
- **Effect:** Quick movement burst
- **Bonus:** 0.2s invincibility
- **Cooldown:** 2 seconds

---

## 🎯 Quick Tips

1. **Watch Your Mana** - You regenerate 10 mana/second, don't spam!
2. **Time Your Shield** - Block lightning bolts to gain mana advantage
3. **Dash Through Projectiles** - Use invincibility frames wisely
4. **Close the Distance** - Lightning requires line of sight
5. **Bait Shields** - Make your opponent waste their cooldown

---

## 🏆 Win Condition

**First wizard to reduce opponent's health to 0 HP wins!**

Starting stats:
- Health: 100 HP
- Mana: 100 MP

---

## 🐛 Troubleshooting

**Game won't load?**
- Make sure you're using a modern browser (Chrome, Firefox, Safari, Edge)
- Check that server is running on port 8000
- Try clearing browser cache

**Controls not working?**
- Click on the game window to give it focus
- For Player 2, make sure NumLock is ON
- Check that no other program is capturing keypresses

**Spells won't cast?**
- Check your mana bar (top of screen)
- Wait for cooldowns to finish
- Make sure you're not dashing

---

## 📚 More Info

- Full documentation: [README.md](README.md)
- Game design: [PRD.md](PRD.md)
- Project details: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

---

**Have fun and may the best wizard win!** ⚔️✨
