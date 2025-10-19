# Product Requirements Document: Stick Wizard Duel

**Version:** 1.0
**Date:** October 16, 2025
**Status:** Draft
**Owner:** Game Development Team

---

## 1. Overview

### 1.1 Game Concept

**Stick Wizard Duel** is a fast-paced, 2D magical combat game featuring stick-figure wizards battling in a magical arena. The game combines simple, accessible controls with strategic spell-casting mechanics to create engaging head-to-head wizard battles.

### 1.2 Visual Style

The game embraces a minimalist aesthetic with hand-drawn stick figures and vibrant spell effects. The simplicity of the character design contrasts with colorful, dynamic magical effects, creating a distinctive visual identity that is both charming and easy to read during fast-paced combat.

### 1.3 Target Audience

- Casual gamers looking for quick, competitive matches
- Players who enjoy simple but strategic fighting games
- Ages 10+ (E10+ ESRB rating target)
- Suitable for both desktop and mobile platforms

---

## 2. Objectives

### 2.1 Core Pillars

**Accessibility**
Easy to learn controls that anyone can pick up within seconds, with depth that rewards practice and strategy.

**Strategic Depth**
Multiple spell types, resource management (mana), and timing-based mechanics create meaningful decision-making during combat.

**Immediate Fun**
Matches are quick (60-90 seconds average), with satisfying visual and audio feedback for every action.

### 2.2 Win Condition

Victory is achieved by reducing the opponent's health to zero before they defeat you. Each wizard starts with 100 HP and must balance offensive spells, defensive maneuvers, and resource management to outlast their opponent.

### 2.3 Fun Factor

- **Moment-to-Moment Excitement:** Every spell cast and block creates tension
- **Skill Expression:** Players can improve through better timing and strategy
- **Visual Satisfaction:** Spell effects and impact animations provide constant feedback
- **Competitive Drive:** Quick matches encourage "one more game" replayability

---

## 3. Core Gameplay

### 3.1 Player Controls

#### Keyboard Controls (Player 1)
- **W/S:** Move up/down
- **A/D:** Move left/right
- **J:** Cast primary spell (Fireball)
- **K:** Cast secondary spell (Lightning)
- **L:** Cast shield/block
- **Space:** Dash/dodge

#### Keyboard Controls (Player 2)
- **Arrow Keys:** Movement
- **Numpad 1:** Cast primary spell (Fireball)
- **Numpad 2:** Cast secondary spell (Lightning)
- **Numpad 3:** Cast shield/block
- **Enter:** Dash/dodge

#### Touch Controls
- **Virtual Joystick (Left):** Movement
- **Spell Buttons (Right):** Three buttons for spells
- **Swipe Gesture:** Dash in swipe direction

### 3.2 Spell Mechanics

#### Fireball
- **Mana Cost:** 20
- **Damage:** 15 HP
- **Cooldown:** 1.0 seconds
- **Behavior:** Projectile travels in straight line; medium speed; explodes on impact
- **Strategy:** Bread-and-butter attack; reliable and efficient

#### Lightning Bolt
- **Mana Cost:** 35
- **Damage:** 25 HP
- **Cooldown:** 2.5 seconds
- **Behavior:** Instant hitscan beam from caster to target; requires precise aim
- **Strategy:** High damage but expensive; best used when opponent is vulnerable

#### Ice Shard
- **Mana Cost:** 25
- **Damage:** 10 HP + Slow (50% movement for 2 seconds)
- **Cooldown:** 1.5 seconds
- **Behavior:** Projectile with slight homing; slower than fireball
- **Strategy:** Utility spell for controlling opponent movement

#### Shield
- **Mana Cost:** 15
- **Effect:** Blocks next incoming spell; lasts 1.5 seconds
- **Cooldown:** 3.0 seconds
- **Behavior:** Visible barrier appears in front of wizard
- **Strategy:** Timing-based defense; successful blocks restore 10 mana

### 3.3 Mana System

- **Starting Mana:** 100
- **Maximum Mana:** 100
- **Regeneration Rate:** 10 mana per second
- **Design Intent:** Forces players to manage resources; prevents spam; creates rhythm of attack and recovery

### 3.4 Hit Detection

- **Projectile Collision:** Circular hitboxes on projectiles and wizards
- **Hitscan Collision:** Raycast from caster; first wizard in path takes damage
- **Shield Priority:** Shields intercept projectiles and hitscan attacks
- **Environmental Boundaries:** Spells despawn at arena edges; wizards cannot exit arena

### 3.5 Movement Mechanics

- **Base Movement Speed:** 200 pixels/second
- **Dash Distance:** 150 pixels
- **Dash Duration:** 0.3 seconds
- **Dash Cooldown:** 2.0 seconds
- **Invincibility Frames:** 0.2 seconds during dash (allows dodging through projectiles)

---

## 4. Game Flow

### 4.1 Starting Screen

**Main Menu Elements:**
- Game title with animated wizard silhouettes dueling
- **Play Button:** Enter mode selection
- **Settings Button:** Audio, controls, graphics options
- **Tutorial Button:** Interactive spell and movement guide
- **Credits Button:** Development team and acknowledgments

### 4.2 Mode Selection

**Available Modes:**
1. **Single Player vs AI** - Choose difficulty (Easy/Medium/Hard)
2. **Local Multiplayer** - Two players on same device
3. **Survival Mode** - Fight waves of AI wizards (optional stretch goal)
4. **Tournament Mode** - Best of 3/5 matches (optional stretch goal)

### 4.3 Match Start

**Pre-Battle Sequence:**
1. Arena loads with chosen background
2. Wizards spawn on opposite sides (facing each other)
3. 3-second countdown: "3... 2... 1... DUEL!"
4. UI displays: Health bars (top), Mana bars (below health), Spell cooldowns (bottom corners)

### 4.4 Battle Loop

**Active Match:**
- Real-time combat until one wizard reaches 0 HP
- Visual feedback on hits (flash, knockback, damage numbers)
- Audio feedback for all actions
- Dynamic camera shake on powerful hits
- Match timer displayed (optional: for timeout scenarios)

**Timeout Scenario (Optional):**
- If neither wizard defeated after 3 minutes, wizard with higher HP wins
- If HP tied, sudden death (next hit wins)

### 4.5 Victory Screen

**End-of-Match Display:**
- Winning wizard performs victory animation
- Defeated wizard falls/disappears
- **Victory Banner:** "Player 1 Wins!" or "Defeat!"
- **Match Statistics:** Total damage dealt, spells cast, accuracy percentage
- **Options:**
  - **Rematch Button:** Restart with same settings
  - **Main Menu Button:** Return to menu
  - **Next Match Button:** (Tournament mode only)

### 4.6 Restart Options

- Instant rematch preserves mode and settings
- Quick toggle between Single Player and Multiplayer
- "Switch Wizards" option swaps player positions/controls

---

## 5. Art & Animation

### 5.1 Character Design

**Stick Figure Wizards:**
- **Body:** Simple stick figure (head, torso, arms, legs)
- **Distinguishing Features:**
  - Player 1: Red wizard hat/robe accent
  - Player 2: Blue wizard hat/robe accent
- **Proportions:** Head size ~20% of total height for readability
- **Staff:** Held in one hand; glows when casting

**Animation States:**
- **Idle:** Gentle bob/sway; staff resting
- **Walking:** Simple leg alternation; staff sways
- **Casting:** Staff raises; arm extends; slight recoil
- **Blocking:** Staff crosses body; defensive stance
- **Dashing:** Blur effect; lean into direction
- **Hit Reaction:** Knockback; brief stagger
- **Victory:** Staff raised; triumphant pose
- **Defeat:** Falls backward; fades out

### 5.2 Spell Visual Effects

**Fireball:**
- Orange/red sphere with flame particle trail
- Grows slightly as it travels
- Explosion with radial particle burst on impact

**Lightning Bolt:**
- Jagged electric beam from caster to target
- White/cyan color with flickering animation
- Branching arcs around main beam
- Brief electric residue at impact point

**Ice Shard:**
- Crystalline blue projectile
- Rotating slowly as it travels
- Freezing mist trail
- Shattering effect on impact with frost residue

**Shield:**
- Translucent dome or wall (player preference)
- Hexagonal energy pattern
- Pulses when hit
- Shatters dramatically when broken

### 5.3 Background & Arena

**Arena Options:**
1. **Classic Arena:** Stone floor, mystical runes, torch lighting
2. **Forest Clearing:** Trees in background, grass floor, dappled lighting
3. **Volcano Peak:** Lava glow, rocky terrain, ember particles
4. **Frozen Tundra:** Ice crystals, snow particles, aurora sky
5. **Void Dimension:** Abstract geometric shapes, shifting colors

**Environmental Elements:**
- Parallax scrolling background layers
- Ambient particle effects (dust, embers, snow, etc.)
- Animated sky/backdrop
- Simple platforms or terrain features (cosmetic only; no gameplay impact)

### 5.4 UI Design

**HUD Elements:**
- Minimalist bars for health (red gradient) and mana (blue gradient)
- Player indicators (icons/names) above health bars
- Spell cooldown indicators: circular timers or filled bars
- Damage numbers: float upward, fade out (optional toggle)

**Visual Style:**
- Hand-drawn aesthetic for UI borders
- Bold, readable fonts
- Color-coded by player (red vs blue theme)

---

## 6. Audio

### 6.1 Sound Effects

**Spell Casting:**
- **Fireball:** "Whoosh" with crackling flame undertone
- **Lightning:** Electric "zap" with thunder rumble
- **Ice Shard:** Crystalline "chime" with wind whistle
- **Shield:** Magical "hum" activation sound

**Spell Impacts:**
- **Fireball Hit:** Explosion with bass punch
- **Lightning Hit:** Electric crackle/snap
- **Ice Shard Hit:** Glass shatter with freeze effect
- **Shield Block:** Metallic "clang" or energy deflection

**Character Actions:**
- Dash: Quick "swoosh"
- Hit Reaction: Grunt/pain sound
- Footsteps: Light tapping (subtle)

**UI Sounds:**
- Menu navigation: Soft click
- Button selection: Confirm chime
- Mode selection: Spell whoosh transition

### 6.2 Music

**Main Menu:**
- Mystical, mysterious ambient track
- Moderate tempo (90-100 BPM)
- Orchestral with magical instrument accents

**Battle Music:**
- High-energy, driving rhythm
- 120-140 BPM
- Layers of intensity that build during combat
- Different tracks for each arena (optional)

**Victory/Defeat:**
- Victory: Triumphant fanfare (5-10 seconds)
- Defeat: Somber descending tone (3-5 seconds)

### 6.3 Audio Settings

- Master volume slider
- Separate sliders for Music, SFX, and UI sounds
- Mute toggle
- Audio presets: Balanced, FX-Heavy, Music-Heavy

---

## 7. Technical Requirements

### 7.1 Platform & Technology

**Primary Technology Stack:**

**Option A: HTML5/JavaScript**
- **Engine:** Phaser 3 or PixiJS
- **Language:** JavaScript (ES6+) or TypeScript
- **Benefits:** Cross-platform, web-based, easy deployment
- **Deployment:** Web browsers, Electron wrapper for desktop

**Option B: Unity**
- **Engine:** Unity 2021.3 LTS or newer
- **Language:** C#
- **Benefits:** More robust tooling, easier mobile export
- **Deployment:** WebGL, Windows, macOS, iOS, Android

**Recommended Choice:** HTML5/JavaScript (Phaser 3) for rapid prototyping and web accessibility; Unity for feature-complete commercial release.

### 7.2 Supported Platforms

**Launch Platforms:**
- **Web Browsers:** Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Desktop:** Windows 10+, macOS 11+

**Post-Launch (Stretch):**
- **Mobile:** iOS 14+, Android 8+
- **Tablets:** iPad, Android tablets

### 7.3 Input Support

**Required:**
- Keyboard (WASD + arrow key layouts)
- Touch controls (virtual joystick + buttons)
- Mouse/trackpad (menu navigation only)

**Optional:**
- Gamepad/controller support (Xbox, PlayStation, Switch Pro)
- Customizable key bindings

### 7.4 Performance Targets

**Frame Rate:**
- **Target:** 60 FPS stable
- **Minimum:** 30 FPS acceptable on lower-end devices

**Resolution:**
- **Native:** 1920x1080 (16:9 aspect ratio)
- **Supported:** 1280x720 to 2560x1440
- **Mobile:** Responsive scaling to screen size

**Loading Times:**
- **Initial Load:** <5 seconds on broadband
- **Match Start:** <2 seconds
- **Asset Streaming:** Minimal; all core assets preloaded

### 7.5 Save System

**Local Storage:**
- Settings preferences (audio, controls, graphics)
- High scores (optional)
- Tutorial completion status

**No Account Required:**
- All functionality available offline
- Optional: Cloud save for cross-device settings (future feature)

---

## 8. AI and Multiplayer

### 8.1 Single-Player vs AI

**AI Difficulty Levels:**

**Easy AI:**
- **Reaction Time:** 0.8-1.2 seconds
- **Spell Usage:** Primarily fireballs; occasional shield
- **Movement:** Predictable patterns; minimal dodging
- **Strategy:** Aggressive but slow to react
- **Target Audience:** Beginners, tutorial mode

**Medium AI:**
- **Reaction Time:** 0.4-0.6 seconds
- **Spell Usage:** Balanced mix of all spells; shields when health low
- **Movement:** Strafing, occasional dashes
- **Strategy:** Reactive play; punishes player mistakes
- **Target Audience:** Average players seeking challenge

**Hard AI:**
- **Reaction Time:** 0.2-0.3 seconds
- **Spell Usage:** Optimal spell selection based on situation
- **Movement:** Advanced dodging, spacing control
- **Strategy:** Reads player patterns; baits shield usage; pressure and zone control
- **Target Audience:** Skilled players, competitive practice

**AI Behavior Framework:**
- State machine: Aggressive, Defensive, Neutral
- Decision tree for spell selection
- Pathfinding for movement and spacing
- Randomized timing to feel less robotic

### 8.2 Local Multiplayer

**Two-Player Mode:**
- Split-screen-style layout (though both on same screen)
- Simultaneous input support (keyboard for both players OR keyboard + controller)
- No input lag or priority issues
- Fair spawn positions (equidistant from center)

**Controller Support:**
- Player 1: Keyboard or Controller 1
- Player 2: Keyboard (alternate keys) or Controller 2
- Hot-swappable controller assignment

### 8.3 Online Multiplayer (Future Consideration)

**Stretch Goal for Post-Launch:**
- **Matchmaking:** Skill-based or casual quick match
- **Netcode:** Rollback netcode for minimal lag
- **Lobby System:** Create/join rooms, friend invites
- **Ranked Mode:** ELO-based ranking system

**Technical Requirements:**
- Low-latency server architecture
- Anti-cheat measures
- Reconnection handling

---

## 9. Progression & Replayability

### 9.1 Power-Ups (Optional Mid-Match Pickups)

**Spawning Mechanic:**
- Power-ups appear at random locations every 20-30 seconds
- Glowing orbs with distinct colors
- Disappear after 10 seconds if not collected

**Power-Up Types:**

**Health Orb (Green):**
- Restores 25 HP instantly
- Cannot exceed maximum HP

**Mana Surge (Blue):**
- Restores 50 mana instantly
- Grants 5 seconds of doubled mana regeneration

**Speed Boost (Yellow):**
- Increases movement speed by 50% for 8 seconds
- Reduces dash cooldown by 50%

**Spell Amplifier (Purple):**
- Next 3 spells deal double damage
- Visual aura around wizard while active

**Invincibility Star (Rainbow - Rare):**
- 3 seconds of invincibility
- Low spawn rate (5% chance)

### 9.2 Difficulty Progression

**Campaign Mode (Stretch Goal):**
- Series of 10 AI battles with increasing difficulty
- Each victory unlocks next opponent
- Final boss: "Archmage" with unique spells and higher HP
- Rewards: Cosmetic unlocks, achievements

**Dynamic Difficulty:**
- Optional: AI adjusts based on player performance
- If player loses 3 times, offer to lower difficulty

### 9.3 Arena Variations

**Random Arena Selection:**
- Each match randomly selects from unlocked arenas
- New arenas unlock after X victories
- Players can favorite arenas for higher selection chance

**Arena Hazards (Stretch Goal):**
- **Volcano:** Periodic lava eruptions deal damage in zones
- **Forest:** Falling leaves obscure vision briefly
- **Frozen Tundra:** Icy floor reduces friction (slide movement)
- **Void:** Gravity shifts periodically

### 9.4 Customization & Unlocks

**Cosmetic Unlocks:**
- Wizard hat styles (pointy, wide-brim, crown, etc.)
- Staff designs (wooden, crystal, bone, etc.)
- Spell color palettes (purple fire, green lightning, etc.)
- Victory emotes/poses

**Unlock Conditions:**
- Win X matches (10, 25, 50, 100)
- Complete tutorial
- Defeat Hard AI
- Perform perfect match (no damage taken)

### 9.5 Random Spell Sets (Stretch Goal)

**Spell Draft Mode:**
- Before match, each player selects 3 spells from random pool of 6-8 spells
- Encourages adaptation and variety
- Balances by ensuring both players have fair options

**Expanded Spell Roster:**
- Meteor (high damage, long cast time)
- Teleport (instant repositioning)
- Poison Cloud (area denial)
- Life Drain (damage + healing)
- Time Slow (slows opponent and projectiles)

---

## 10. Success Metrics

### 10.1 Player Engagement

**Key Performance Indicators (KPIs):**

**Session Length:**
- **Target:** Average session 10-15 minutes
- **Measurement:** Time from launch to close
- **Success Criteria:** 70%+ of sessions exceed 5 minutes

**Match Completion Rate:**
- **Target:** 90%+ of started matches completed
- **Measurement:** Matches finished vs matches started
- **Success Criteria:** Low abandon rate indicates satisfying gameplay loop

**Rematch Rate:**
- **Target:** 60%+ of players select rematch after first match
- **Measurement:** Rematch button clicks vs main menu exits
- **Success Criteria:** High rematch rate = strong replay value

**Daily Active Users (DAU) - Web Version:**
- **Target:** 500+ DAU within first month
- **Measurement:** Unique players per day
- **Success Criteria:** Steady or growing DAU indicates retention

### 10.2 Fun & Player Satisfaction

**Qualitative Metrics:**

**Playtesting Feedback:**
- Survey questions: "How fun was the game?" (1-10 scale)
- Target: Average score 7+
- Open feedback on controls, balance, visual appeal

**Sentiment Analysis:**
- Monitor player comments/reviews for keywords: "fun," "addictive," "balanced," "fair"
- Target: 80%+ positive sentiment

**Replay Motivation:**
- Exit survey: "Why did you stop playing?"
- Desired responses: "Ran out of time" > "Got bored" or "Too frustrating"

**Control Responsiveness:**
- Survey: "Were the controls responsive?" (Yes/No/Somewhat)
- Target: 90%+ positive response
- Track reported input lag or control issues

### 10.3 Balance Between Wizards

**Competitive Balance Metrics:**

**Win Rate Parity:**
- **Target:** 45-55% win rate for each player position (P1 vs P2)
- **Measurement:** Aggregate win data from multiplayer matches
- **Success Criteria:** No significant advantage to spawn position

**Spell Usage Distribution:**
- **Target:** All spells used regularly (no single spell dominates)
- **Measurement:** Spell cast frequency across all matches
- **Success Criteria:** No spell accounts for >50% of total casts; no spell <10%

**Average Match Duration:**
- **Target:** 60-90 seconds per match
- **Measurement:** Time from match start to victory
- **Success Criteria:** Matches feel neither too quick (lack depth) nor too slow (boring)

**Comeback Potential:**
- **Target:** 30%+ of matches where losing player (below 50% HP) wins
- **Measurement:** HP tracking at mid-match vs final result
- **Success Criteria:** Matches feel winnable even when behind

**AI Balance:**
- **Easy AI:** Player win rate 80-90%
- **Medium AI:** Player win rate 50-60%
- **Hard AI:** Player win rate 30-40%
- **Measurement:** Aggregate player vs AI results
- **Success Criteria:** Each difficulty provides appropriate challenge

### 10.4 Technical Performance

**Performance Metrics:**

**Frame Rate Stability:**
- **Target:** 95%+ of frames at target FPS (60 FPS)
- **Measurement:** Frame time logging during playtest sessions
- **Success Criteria:** Smooth gameplay with minimal stuttering

**Load Times:**
- **Target:** 95%+ of loads complete within target times (5s initial, 2s match start)
- **Measurement:** Telemetry tracking load durations
- **Success Criteria:** Players don't experience frustrating waits

**Crash Rate:**
- **Target:** <0.1% crash rate per session
- **Measurement:** Error reporting system
- **Success Criteria:** Stable experience across all platforms

**Cross-Platform Compatibility:**
- **Target:** 100% feature parity across supported platforms
- **Measurement:** Manual QA testing matrix
- **Success Criteria:** No platform-specific bugs or missing features

### 10.5 Post-Launch Tracking

**Analytics Integration:**
- Implement event tracking for:
  - Match starts/completions
  - Spell usage
  - Player progression (unlocks)
  - Session length
  - Platform/device type

**A/B Testing Opportunities:**
- Balance tweaks (spell damage, mana costs)
- UI layouts
- Tutorial effectiveness
- Power-up spawn rates

**Iterative Improvement:**
- Monthly review of metrics
- Quarterly balance patches based on data
- Community feedback integration (forums, social media)

---

## 11. Development Milestones

### Phase 1: Prototype (4 weeks)
- Core movement and combat mechanics
- Two spells (Fireball, Shield)
- Basic stick figure art
- Single arena
- Local multiplayer functional

### Phase 2: Alpha (6 weeks)
- All core spells implemented
- AI opponent (Medium difficulty)
- Three arenas
- Full animation set
- Sound effects integrated
- Main menu and victory screen

### Phase 3: Beta (6 weeks)
- Easy and Hard AI
- Mobile touch controls
- Power-ups system
- Additional arenas and cosmetics
- Balance tuning
- Bug fixes and polish

### Phase 4: Launch Preparation (4 weeks)
- Final QA testing
- Performance optimization
- Marketing assets
- Deployment to web/app stores
- Documentation and support materials

---

## 12. Risks & Mitigation

### Technical Risks
- **Risk:** Performance issues with particle effects on mobile
- **Mitigation:** Implement quality settings; optimize particle systems; profiling

### Design Risks
- **Risk:** Spell balance issues leading to dominant strategies
- **Mitigation:** Extensive playtesting; data-driven balance adjustments; iterative patches

### Scope Risks
- **Risk:** Feature creep delaying launch
- **Mitigation:** Clearly defined MVP; post-launch roadmap for stretch features

---

## 13. Conclusion

**Stick Wizard Duel** delivers accessible, strategic magic combat with charming stick-figure aesthetics. By focusing on tight controls, satisfying spell mechanics, and quick match pacing, the game creates an immediately fun experience with long-term replayability.

The simple art style keeps development costs low while allowing expressive animations and flashy effects. Cross-platform support ensures broad accessibility, while optional progression systems provide hooks for continued engagement.

Success will be measured through player retention, balanced gameplay metrics, and positive sentiment. With a clear development roadmap and manageable scope, **Stick Wizard Duel** is positioned to become an addictive, polished competitive experience.

---

**Next Steps:**
1. Review and approve PRD with stakeholders
2. Create technical design document
3. Build playable prototype
4. Begin art asset production
5. Set up project repository and development environment

**Document History:**
- v1.0 (2025-10-16): Initial draft