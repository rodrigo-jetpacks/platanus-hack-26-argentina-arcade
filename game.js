// Crypto Survivors — Platanus Hack 26
// Survive the bear market. Dodge bears, collect crypto, level up weapons.

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const WORLD_W = 2400;
const WORLD_H = 2400;

// DO NOT replace existing keys — they match the physical arcade cabinet wiring.
const CABINET_KEYS = {
  P1_U: ['w'],
  P1_D: ['s'],
  P1_L: ['a'],
  P1_R: ['d'],
  P1_1: ['u'],
  P1_2: ['i'],
  P1_3: ['o'],
  P1_4: ['j'],
  P1_5: ['k'],
  P1_6: ['l'],
  P2_U: ['ArrowUp'],
  P2_D: ['ArrowDown'],
  P2_L: ['ArrowLeft'],
  P2_R: ['ArrowRight'],
  P2_1: ['r'],
  P2_2: ['t'],
  P2_3: ['y'],
  P2_4: ['f'],
  P2_5: ['g'],
  P2_6: ['h'],
  START1: ['Enter'],
  START2: ['2'],
};

function normalizeIncomingKey(key) {
  if (typeof key !== 'string' || key.length === 0) return '';
  if (key === ' ') return 'space';
  return key.toLowerCase();
}

const KEYBOARD_TO_ARCADE = {};
for (const [arcadeCode, keys] of Object.entries(CABINET_KEYS)) {
  for (const key of keys) {
    KEYBOARD_TO_ARCADE[normalizeIncomingKey(key)] = arcadeCode;
  }
}

// --- TEXTURE GENERATION ---
function genTextures(scene) {
  const g = scene.make.graphics({ add: false });

  // Player
  g.clear();
  g.fillStyle(0x00ff88);
  g.fillCircle(16, 16, 14);
  g.fillStyle(0x00cc66);
  g.fillCircle(16, 16, 10);
  g.fillStyle(0xffffff);
  g.fillCircle(12, 13, 3);
  g.fillCircle(20, 13, 3);
  g.fillStyle(0x000000);
  g.fillCircle(12, 13, 1.5);
  g.fillCircle(20, 13, 1.5);
  g.fillStyle(0x00ffff);
  g.fillTriangle(16, 20, 12, 26, 20, 26);
  g.generateTexture('player', 32, 32);

  // Bear enemy
  g.clear();
  g.fillStyle(0xff3344);
  g.fillCircle(12, 12, 11);
  g.fillStyle(0xcc1122);
  g.fillCircle(12, 12, 7);
  g.fillStyle(0xff3344);
  g.fillCircle(5, 4, 4);
  g.fillCircle(19, 4, 4);
  g.fillStyle(0xffffff);
  g.fillCircle(9, 10, 2);
  g.fillCircle(15, 10, 2);
  g.generateTexture('bear', 24, 24);

  // SEC Regulator
  g.clear();
  g.fillStyle(0x4488ff);
  g.fillRect(2, 2, 28, 28);
  g.fillStyle(0x2255cc);
  g.fillRect(6, 6, 20, 20);
  g.fillStyle(0xffffff);
  g.fillRect(10, 10, 12, 2);
  g.fillRect(10, 15, 12, 2);
  g.fillRect(10, 20, 12, 2);
  g.generateTexture('sec', 32, 32);

  // Bot enemy
  g.clear();
  g.fillStyle(0xffaa00);
  g.fillRect(4, 4, 16, 16);
  g.fillStyle(0xff8800);
  g.fillRect(6, 6, 12, 12);
  g.fillStyle(0xffffff);
  g.fillRect(7, 8, 3, 3);
  g.fillRect(13, 8, 3, 3);
  g.fillStyle(0xffaa00);
  g.fillRect(8, 14, 7, 2);
  g.generateTexture('bot', 24, 24);

  // Rug Pull boss
  g.clear();
  g.fillStyle(0xff00ff);
  g.fillCircle(24, 24, 22);
  g.fillStyle(0xcc00cc);
  g.fillCircle(24, 24, 16);
  g.fillStyle(0xff44ff);
  g.fillCircle(24, 24, 8);
  g.lineStyle(2, 0xffffff);
  g.strokeCircle(24, 24, 22);
  g.fillStyle(0xffffff);
  g.fillCircle(17, 20, 3);
  g.fillCircle(31, 20, 3);
  g.fillStyle(0xff0000);
  g.fillCircle(17, 20, 1.5);
  g.fillCircle(31, 20, 1.5);
  g.generateTexture('rugpull', 48, 48);

  // Dip projectile
  g.clear();
  g.fillStyle(0xff0000);
  g.fillTriangle(8, 0, 0, 16, 16, 16);
  g.lineStyle(1, 0xff4444);
  g.strokeTriangle(8, 0, 0, 16, 16, 16);
  g.generateTexture('dip', 16, 16);

  // XP gem
  g.clear();
  g.fillStyle(0xffdd00);
  g.fillCircle(6, 6, 5);
  g.fillStyle(0xffaa00);
  g.fillCircle(6, 6, 3);
  g.generateTexture('xp', 12, 12);

  // BTC coin
  g.clear();
  g.fillStyle(0xf7931a);
  g.fillCircle(8, 8, 7);
  g.fillStyle(0xffa830);
  g.fillCircle(8, 8, 5);
  g.fillStyle(0xffffff);
  g.fillRect(7, 4, 3, 9);
  g.generateTexture('btc', 16, 16);

  // Green candle (heal)
  g.clear();
  g.fillStyle(0x00ff66);
  g.fillRect(6, 4, 4, 16);
  g.fillRect(4, 4, 8, 4);
  g.lineStyle(1, 0x88ffaa);
  g.strokeRect(4, 4, 8, 4);
  g.generateTexture('candle', 16, 24);

  // Whale alert (nuke)
  g.clear();
  g.fillStyle(0x00aaff);
  g.fillEllipse(16, 12, 28, 18);
  g.fillStyle(0x0088cc);
  g.fillEllipse(16, 12, 20, 12);
  g.fillTriangle(28, 10, 32, 4, 32, 16);
  g.fillStyle(0xffffff);
  g.fillCircle(8, 10, 2);
  g.generateTexture('whale', 32, 24);

  // Laser
  g.clear();
  g.fillStyle(0xff6600);
  g.fillRect(0, 2, 16, 4);
  g.fillStyle(0xff9900);
  g.fillRect(0, 3, 16, 2);
  g.generateTexture('laser', 16, 8);

  // Rocket
  g.clear();
  g.fillStyle(0xffffff);
  g.fillTriangle(8, 0, 2, 12, 14, 12);
  g.fillStyle(0xff4400);
  g.fillTriangle(5, 12, 8, 18, 11, 12);
  g.generateTexture('rocket', 16, 20);

  // Pump bomb
  g.clear();
  g.fillStyle(0x44ff44);
  g.fillCircle(8, 8, 7);
  g.fillStyle(0x22cc22);
  g.fillCircle(8, 8, 4);
  g.lineStyle(2, 0x88ff88);
  g.lineBetween(8, 1, 8, -4);
  g.generateTexture('pump', 16, 16);

  // Particle
  g.clear();
  g.fillStyle(0xffffff);
  g.fillCircle(4, 4, 4);
  g.generateTexture('particle', 8, 8);

  g.destroy();
}

// --- CONTROLS ---
function createControls(scene) {
  scene.controls = { held: Object.create(null), pressed: Object.create(null) };
  const onKeyDown = (e) => {
    const key = normalizeIncomingKey(e.key);
    if (!key) return;
    const ac = KEYBOARD_TO_ARCADE[key];
    if (!ac) return;
    if (!scene.controls.held[ac]) scene.controls.pressed[ac] = true;
    scene.controls.held[ac] = true;
  };
  const onKeyUp = (e) => {
    const key = normalizeIncomingKey(e.key);
    if (!key) return;
    const ac = KEYBOARD_TO_ARCADE[key];
    if (!ac) return;
    scene.controls.held[ac] = false;
  };
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  scene.events.once('shutdown', () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  });
}

function consumePressed(scene, codes) {
  for (const c of codes) {
    if (scene.controls.pressed[c]) {
      scene.controls.pressed[c] = false;
      return true;
    }
  }
  return false;
}

function clearPressed(scene) {
  for (const k in scene.controls.pressed) scene.controls.pressed[k] = false;
}

// --- WEAPON DEFINITIONS ---
const WEAPON_DEFS = [
  { id: 'diamond', name: 'Diamond Hands', desc: 'Melee AoE around you', icon: '\u{1F48E}', dmg: 15, rate: 1200, range: 70 },
  { id: 'laser', name: 'Laser Eyes', desc: 'Fires laser beams', icon: '\u{1F525}', dmg: 12, rate: 600, range: 300 },
  { id: 'rocket', name: 'To The Moon', desc: 'Orbiting rockets', icon: '\u{1F680}', dmg: 20, rate: 2000, range: 100 },
  { id: 'fomo', name: 'FOMO Wave', desc: 'Expanding shockwave', icon: '\u{1F30A}', dmg: 25, rate: 3000, range: 120 },
  { id: 'pump', name: 'Pump & Dump', desc: 'Exploding bombs', icon: '\u{1F4A3}', dmg: 35, rate: 3500, range: 80 },
];

// --- SOUND (procedural) ---
function playTone(scene, freq, dur, vol) {
  try {
    const ctx = scene.sound.context;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.value = vol || 0.1;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (dur || 0.1));
    osc.start();
    osc.stop(ctx.currentTime + (dur || 0.1));
  } catch (e) {}
}

// --- MENU SCENE ---
class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    genTextures(this);
    createControls(this);
    const cx = GAME_WIDTH / 2, cy = GAME_HEIGHT / 2;

    this.gridGfx = this.add.graphics();
    this.gridOffset = 0;

    this.add.text(cx, cy - 160, 'CRYPTO', {
      fontSize: '72px', fontFamily: 'monospace', color: '#00ff88',
      stroke: '#003322', strokeThickness: 6
    }).setOrigin(0.5);
    this.add.text(cx, cy - 90, 'SURVIVORS', {
      fontSize: '64px', fontFamily: 'monospace', color: '#ffdd00',
      stroke: '#332200', strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(cx, cy - 30, 'Survive the bear market', {
      fontSize: '18px', fontFamily: 'monospace', color: '#ff3344'
    }).setOrigin(0.5);

    const instrStyle = { fontSize: '16px', fontFamily: 'monospace', color: '#888888', align: 'center' };
    this.add.text(cx, cy + 40, 'Move with joystick / WASD\nWeapons attack automatically\nCollect coins for XP - Level up to get new weapons', instrStyle).setOrigin(0.5);

    this.startText = this.add.text(cx, cy + 130, '[ PRESS START OR BUTTON TO PLAY ]', {
      fontSize: '22px', fontFamily: 'monospace', color: '#00ffff'
    }).setOrigin(0.5);

    this.time.addEvent({
      delay: 500, loop: true,
      callback: () => { this.startText.visible = !this.startText.visible; }
    });
  }

  update() {
    if (consumePressed(this, ['START1', 'START2', 'P1_1', 'P1_2', 'P2_1', 'P2_2'])) {
      this.scene.start('Game');
    }

    this.gridOffset = (this.gridOffset + 0.3) % 40;
    const g = this.gridGfx;
    g.clear();
    g.lineStyle(1, 0x0a2a0a, 0.4);
    for (let x = -40 + this.gridOffset; x < GAME_WIDTH + 40; x += 40) g.lineBetween(x, 0, x, GAME_HEIGHT);
    for (let y = -40 + this.gridOffset; y < GAME_HEIGHT + 40; y += 40) g.lineBetween(0, y, GAME_WIDTH, y);
    g.setDepth(-1);
  }
}

// --- GAME SCENE ---
class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
    createControls(this);
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);

    this.drawBackground();

    // Player
    this.player = this.physics.add.sprite(WORLD_W / 2, WORLD_H / 2, 'player');
    this.player.setCollideWorldBounds(true).setDepth(10);
    this.player.hp = 100;
    this.player.maxHp = 100;
    this.player.speed = 180;
    this.player.invincible = false;

    // Camera
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.setBackgroundColor('#050a05');

    // Groups
    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();
    this.drops = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();

    // State
    this.xp = 0;
    this.level = 1;
    this.xpToNext = 10;
    this.kills = 0;
    this.gameTime = 0;
    this.waveNum = 0;
    this.isPaused = false;
    this.isGameOver = false;
    this.facing = { x: 1, y: 0 };
    this.weapons = [];

    // Start with Diamond Hands
    this.addWeapon({ ...WEAPON_DEFS[0], level: 1 });

    // Collisions
    this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.player, this.drops, this.collectDrop, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.playerHit, null, this);
    this.physics.add.overlap(this.player, this.enemyBullets, this.playerBulletHit, null, this);

    // Timers
    this.spawnTimer = this.time.addEvent({ delay: 3000, callback: this.spawnWave, callbackScope: this, loop: true });
    this.dipTimer = this.time.addEvent({ delay: 8000, callback: this.spawnDips, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 1000, callback: () => { if (!this.isPaused) this.gameTime++; }, loop: true });
    this.time.addEvent({ delay: 45000, callback: this.escalate, callbackScope: this, loop: true });

    this.createUI();

    // Particles
    this.deathEmitter = this.add.particles(0, 0, 'particle', {
      speed: { min: 50, max: 150 }, scale: { start: 0.8, end: 0 },
      lifespan: 400, blendMode: 'ADD', emitting: false,
    }).setDepth(15);

    this.xpEmitter = this.add.particles(0, 0, 'particle', {
      speed: { min: 20, max: 60 }, scale: { start: 0.5, end: 0 },
      tint: 0xffdd00, lifespan: 300, blendMode: 'ADD', emitting: false,
    }).setDepth(15);
  }

  drawBackground() {
    const bg = this.add.graphics().setDepth(-10);
    bg.lineStyle(1, 0x0a2a0a, 0.5);
    for (let x = 0; x <= WORLD_W; x += 40) bg.lineBetween(x, 0, x, WORLD_H);
    for (let y = 0; y <= WORLD_H; y += 40) bg.lineBetween(0, y, WORLD_W, y);

    const cols = [0x00ff66, 0xff3344];
    for (let i = 0; i < 60; i++) {
      const cx = Phaser.Math.Between(50, WORLD_W - 50);
      const cy = Phaser.Math.Between(50, WORLD_H - 50);
      const col = Phaser.Math.RND.pick(cols);
      const h = Phaser.Math.Between(20, 60);
      const bh = Phaser.Math.Between(10, 30);
      bg.fillStyle(col, 0.12);
      bg.fillRect(cx - 1, cy - h / 2, 2, h);
      bg.fillRect(cx - 4, cy - bh / 2, 8, bh);
    }
    bg.lineStyle(3, 0x00ff88, 0.6);
    bg.strokeRect(2, 2, WORLD_W - 4, WORLD_H - 4);
  }

  createUI() {
    const ui = this.add.container(0, 0).setDepth(100).setScrollFactor(0);

    const hpBg = this.add.graphics().setScrollFactor(0);
    hpBg.fillStyle(0x331111); hpBg.fillRect(20, 20, 200, 16);
    hpBg.lineStyle(1, 0xff3344); hpBg.strokeRect(20, 20, 200, 16);
    ui.add(hpBg);

    this.hpBar = this.add.graphics().setScrollFactor(0);
    ui.add(this.hpBar);

    const xpBg = this.add.graphics().setScrollFactor(0);
    xpBg.fillStyle(0x222211); xpBg.fillRect(20, 42, 200, 10);
    xpBg.lineStyle(1, 0xffdd00); xpBg.strokeRect(20, 42, 200, 10);
    ui.add(xpBg);

    this.xpBar = this.add.graphics().setScrollFactor(0);
    ui.add(this.xpBar);

    const ls = { fontSize: '12px', fontFamily: 'monospace', color: '#888888' };
    ui.add(this.add.text(225, 20, 'HP', ls).setScrollFactor(0));
    ui.add(this.add.text(225, 40, 'XP', ls).setScrollFactor(0));

    const ss = { fontSize: '14px', fontFamily: 'monospace', color: '#00ff88' };
    this.levelText = this.add.text(20, 60, 'LVL 1', ss).setScrollFactor(0);
    this.killText = this.add.text(100, 60, 'KILLS: 0', ss).setScrollFactor(0);
    this.timeText = this.add.text(GAME_WIDTH - 100, 20, '0:00', { fontSize: '20px', fontFamily: 'monospace', color: '#00ffff' }).setScrollFactor(0);
    this.waveText = this.add.text(GAME_WIDTH - 100, 45, 'WAVE 0', { fontSize: '12px', fontFamily: 'monospace', color: '#ff8800' }).setScrollFactor(0);
    ui.add(this.levelText); ui.add(this.killText); ui.add(this.timeText); ui.add(this.waveText);

    this.weaponIcons = this.add.text(20, GAME_HEIGHT - 40, '', { fontSize: '14px', fontFamily: 'monospace', color: '#aaaaaa' }).setScrollFactor(0);
    ui.add(this.weaponIcons);
  }

  // --- WEAPONS ---
  addWeapon(w) {
    this.weapons.push({ ...w, timer: 0 });
    this.updateWeaponUI();
  }

  upgradeWeapon(id) {
    const w = this.weapons.find(wp => wp.id === id);
    if (w) {
      w.level++;
      w.dmg = Math.floor(w.dmg * 1.3);
      w.rate = Math.max(200, w.rate - 100);
      if (w.range) w.range += 10;
    }
    this.updateWeaponUI();
  }

  updateWeaponUI() {
    const txt = this.weapons.map(w => `${w.icon} ${w.name} Lv${w.level}`).join('  |  ');
    if (this.weaponIcons) this.weaponIcons.setText(txt);
  }

  fireWeapons(time) {
    this.weapons.forEach(w => {
      if (time < w.timer) return;
      w.timer = time + w.rate;
      switch (w.id) {
        case 'diamond': this.fireDiamond(w); break;
        case 'laser': this.fireLaser(w); break;
        case 'rocket': this.fireRocket(w); break;
        case 'fomo': this.fireFomo(w); break;
        case 'pump': this.firePump(w); break;
      }
    });
  }

  fireDiamond(w) {
    const range = w.range + w.level * 10;
    const circle = this.add.circle(this.player.x, this.player.y, range, 0x00ffff, 0.15);
    circle.setStrokeStyle(2, 0x00ffff, 0.6).setDepth(5);
    this.tweens.add({ targets: circle, alpha: 0, scale: 1.5, duration: 300, onComplete: () => circle.destroy() });
    playTone(this, 220, 0.1, 0.08);
    this.enemies.children.each(e => {
      if (e.active && Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y) < range)
        this.damageEnemy(e, w.dmg);
    });
  }

  fireLaser(w) {
    let nearest = null, minDist = 999999;
    this.enemies.children.each(e => {
      if (!e.active) return;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
      if (d < minDist && d < 400) { minDist = d; nearest = e; }
    });
    const count = Math.min(w.level, 3);
    for (let i = 0; i < count; i++) {
      let angle;
      if (nearest && i === 0) angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, nearest.x, nearest.y);
      else angle = Math.atan2(this.facing.y, this.facing.x) + (i - 1) * 0.3;
      const b = this.projectiles.create(this.player.x, this.player.y, 'laser');
      b.setDepth(8); b.dmg = w.dmg;
      b.body.setVelocity(Math.cos(angle) * 400, Math.sin(angle) * 400);
      b.rotation = angle; b.setTint(0xff6600);
      this.time.delayedCall(1000, () => { if (b.active) b.destroy(); });
    }
    playTone(this, 880, 0.05, 0.06);
  }

  fireRocket(w) {
    const count = Math.min(1 + w.level, 4);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      const r = this.projectiles.create(this.player.x, this.player.y, 'rocket');
      r.setDepth(8); r.dmg = w.dmg;
      r.orbitAngle = angle; r.orbitSpeed = 3; r.orbitRadius = w.range;
      r.isOrbiting = true; r.orbitTime = 0;
      this.time.delayedCall(2500, () => { if (r.active) r.destroy(); });
    }
    playTone(this, 440, 0.15, 0.06);
  }

  fireFomo(w) {
    const ring = this.add.circle(this.player.x, this.player.y, 10, 0x00ffff, 0.0);
    ring.setStrokeStyle(3, 0x00ffff, 0.8).setDepth(5);
    const maxR = w.range + w.level * 20;
    this.tweens.add({ targets: ring, scale: maxR / 10, alpha: 0, duration: 600, onComplete: () => ring.destroy() });
    playTone(this, 330, 0.2, 0.07);
    this.time.delayedCall(100, () => {
      this.enemies.children.each(e => {
        if (e.active && Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y) < maxR * 0.6)
          this.damageEnemy(e, w.dmg);
      });
    });
    this.time.delayedCall(300, () => {
      this.enemies.children.each(e => {
        if (e.active && Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y) < maxR)
          this.damageEnemy(e, Math.floor(w.dmg * 0.6));
      });
    });
  }

  firePump(w) {
    let tx, ty, nearest = null, minDist = 999999;
    this.enemies.children.each(e => {
      if (!e.active) return;
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
      if (d < minDist && d < 300) { minDist = d; nearest = e; }
    });
    if (nearest) { tx = nearest.x; ty = nearest.y; }
    else { tx = this.player.x + this.facing.x * 150; ty = this.player.y + this.facing.y * 150; }

    const bomb = this.add.sprite(this.player.x, this.player.y, 'pump').setDepth(8);
    this.tweens.add({
      targets: bomb, x: tx, y: ty, duration: 500, ease: 'Quad.easeOut',
      onComplete: () => {
        const expl = this.add.circle(bomb.x, bomb.y, 10, 0x44ff44, 0.4);
        expl.setStrokeStyle(3, 0x88ff88).setDepth(5);
        this.tweens.add({ targets: expl, scale: w.range / 10, alpha: 0, duration: 400, onComplete: () => expl.destroy() });
        playTone(this, 110, 0.2, 0.1);
        this.enemies.children.each(e => {
          if (e.active && Phaser.Math.Distance.Between(bomb.x, bomb.y, e.x, e.y) < w.range + w.level * 10)
            this.damageEnemy(e, w.dmg);
        });
        this.cameras.main.shake(150, 0.005);
        bomb.destroy();
      }
    });
  }

  // --- SPAWNING ---
  spawnWave() {
    if (this.isPaused || this.isGameOver) return;
    this.waveNum++;
    const diff = Math.floor(this.gameTime / 60) + 1;
    const count = Math.min(3 + this.waveNum + diff * 2, 30);
    for (let i = 0; i < count; i++) this.time.delayedCall(i * 100, () => this.spawnEnemy(diff));
    if (this.waveNum % 7 === 0) this.time.delayedCall(1000, () => this.spawnBoss());
  }

  spawnEnemy(diff) {
    if (this.isGameOver) return;
    const pos = this.getSpawnPos();
    const roll = Math.random();
    let type, hp, speed, xpVal, tex;
    if (roll < 0.55) {
      type = 'bear'; hp = 12 + diff * 3; speed = 50 + diff * 4; xpVal = 1; tex = 'bear';
    } else if (roll < 0.8) {
      type = 'bot'; hp = 6 + diff * 2; speed = 80 + diff * 5; xpVal = 1; tex = 'bot';
    } else {
      type = 'sec'; hp = 30 + diff * 8; speed = 30 + diff * 2; xpVal = 3; tex = 'sec';
    }
    const e = this.enemies.create(pos.x, pos.y, tex);
    e.setDepth(5); e.etype = type; e.hp = hp; e.maxHp = hp;
    e.speed = speed; e.xpVal = xpVal; e.dmg = 5 + diff * 1.5; e.hitCooldown = 0;
  }

  spawnBoss() {
    if (this.isGameOver) return;
    const pos = this.getSpawnPos();
    const diff = Math.floor(this.gameTime / 60) + 1;
    const e = this.enemies.create(pos.x, pos.y, 'rugpull');
    e.setDepth(5); e.setScale(1.5 + diff * 0.15); e.etype = 'rugpull';
    e.hp = 150 + diff * 50; e.maxHp = e.hp; e.speed = 40;
    e.xpVal = 20; e.dmg = 18; e.hitCooldown = 0; e.isBoss = true;
    playTone(this, 150, 0.3, 0.12);
    const warn = this.add.text(this.player.x, this.player.y - 80, 'RUG PULL INCOMING!', {
      fontSize: '20px', fontFamily: 'monospace', color: '#ff00ff'
    }).setOrigin(0.5).setDepth(50);
    this.tweens.add({ targets: warn, alpha: 0, y: warn.y - 40, duration: 2000, onComplete: () => warn.destroy() });
  }

  spawnDips() {
    if (this.isPaused || this.isGameOver) return;
    const count = Math.min(2 + Math.floor(this.gameTime / 40), 8);
    for (let i = 0; i < count; i++) {
      const x = this.player.x + Phaser.Math.Between(-300, 300);
      const y = this.player.y - 400;
      const dip = this.enemyBullets.create(x, y, 'dip');
      dip.setDepth(8);
      dip.body.setVelocity(Phaser.Math.Between(-30, 30), 200 + Phaser.Math.Between(0, 100));
      dip.dmg = 10 + Math.floor(this.gameTime / 30) * 3;
      dip.setTint(0xff3344);
      this.time.delayedCall(3000, () => { if (dip.active) dip.destroy(); });
    }
  }

  getSpawnPos() {
    const angle = Math.random() * Math.PI * 2;
    const dist = 400 + Math.random() * 100;
    return {
      x: Phaser.Math.Clamp(this.player.x + Math.cos(angle) * dist, 50, WORLD_W - 50),
      y: Phaser.Math.Clamp(this.player.y + Math.sin(angle) * dist, 50, WORLD_H - 50),
    };
  }

  // --- COMBAT ---
  damageEnemy(enemy, dmg) {
    enemy.hp -= dmg;
    const dt = this.add.text(enemy.x, enemy.y - 15, dmg.toString(), {
      fontSize: '14px', fontFamily: 'monospace', color: '#ffdd00', stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(20);
    this.tweens.add({ targets: dt, y: dt.y - 30, alpha: 0, duration: 600, onComplete: () => dt.destroy() });
    enemy.setTintFill(0xffffff);
    this.time.delayedCall(60, () => { if (enemy.active) enemy.clearTint(); });
    if (enemy.hp <= 0) this.killEnemy(enemy);
  }

  hitEnemy(proj, enemy) {
    if (proj.dmg) this.damageEnemy(enemy, proj.dmg);
    if (!proj.isOrbiting) proj.destroy();
  }

  killEnemy(enemy) {
    const tint = enemy.etype === 'bear' ? 0xff3344 : enemy.etype === 'sec' ? 0x4488ff : enemy.etype === 'bot' ? 0xffaa00 : 0xff00ff;
    this.deathEmitter.setParticleTint(tint);
    this.deathEmitter.emitParticleAt(enemy.x, enemy.y, 8);
    playTone(this, 200 + Math.random() * 200, 0.08, 0.06);

    const xpCount = enemy.xpVal || 1;
    for (let i = 0; i < xpCount; i++) {
      const drop = this.drops.create(
        enemy.x + Phaser.Math.Between(-15, 15),
        enemy.y + Phaser.Math.Between(-15, 15),
        enemy.isBoss ? 'btc' : 'xp'
      );
      drop.setDepth(4); drop.dropType = 'xp'; drop.xpVal = enemy.isBoss ? 5 : 1;
    }

    const roll = Math.random();
    if (roll < 0.06) {
      const heal = this.drops.create(enemy.x, enemy.y, 'candle');
      heal.setDepth(4); heal.dropType = 'heal';
    } else if (roll < 0.07 && this.gameTime > 30) {
      const nuke = this.drops.create(enemy.x, enemy.y, 'whale');
      nuke.setDepth(4); nuke.dropType = 'whale';
    }

    this.kills++;
    enemy.destroy();
  }

  playerHit(player, enemy) {
    if (this.player.invincible || this.isPaused) return;
    const now = this.time.now;
    if (enemy.hitCooldown && now < enemy.hitCooldown) return;
    enemy.hitCooldown = now + 500;

    this.player.hp -= enemy.dmg;
    this.player.invincible = true;
    this.time.delayedCall(300, () => { this.player.invincible = false; });

    this.player.setTintFill(0xff0000);
    this.time.delayedCall(100, () => { if (this.player.active) this.player.clearTint(); });

    const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
    player.body.setVelocity(Math.cos(angle) * 250, Math.sin(angle) * 250);
    this.cameras.main.shake(100, 0.008);
    playTone(this, 100, 0.15, 0.1);

    if (this.player.hp <= 0) this.gameOver();
  }

  playerBulletHit(player, bullet) {
    if (this.player.invincible || this.isPaused) return;
    this.player.hp -= (bullet.dmg || 10);
    bullet.destroy();
    this.player.setTintFill(0xff0000);
    this.time.delayedCall(100, () => { if (this.player.active) this.player.clearTint(); });
    this.player.invincible = true;
    this.time.delayedCall(200, () => { this.player.invincible = false; });
    if (this.player.hp <= 0) this.gameOver();
  }

  collectDrop(player, drop) {
    if (drop.dropType === 'xp') {
      this.xp += drop.xpVal || 1;
      this.xpEmitter.emitParticleAt(drop.x, drop.y, 4);
      playTone(this, 600 + Math.random() * 200, 0.05, 0.05);
      if (this.xp >= this.xpToNext) this.levelUp();
    } else if (drop.dropType === 'heal') {
      this.player.hp = Math.min(this.player.hp + 30, this.player.maxHp);
      this.showFloatText(player.x, player.y - 20, '+30 HP', '#00ff66');
      playTone(this, 523, 0.15, 0.08);
    } else if (drop.dropType === 'whale') {
      this.showFloatText(player.x, player.y - 30, 'WHALE ALERT!', '#00aaff');
      this.cameras.main.flash(300, 0, 100, 255);
      this.cameras.main.shake(300, 0.01);
      playTone(this, 80, 0.4, 0.15);
      this.enemies.children.each(e => {
        if (e.active) {
          this.deathEmitter.emitParticleAt(e.x, e.y, 6);
          this.kills++;
          const xdrop = this.drops.create(e.x, e.y, 'xp');
          xdrop.setDepth(4); xdrop.dropType = 'xp'; xdrop.xpVal = 1;
          e.destroy();
        }
      });
    }
    drop.destroy();
  }

  showFloatText(x, y, text, color) {
    const t = this.add.text(x, y, text, {
      fontSize: '16px', fontFamily: 'monospace', color: color, stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(50);
    this.tweens.add({ targets: t, y: t.y - 40, alpha: 0, duration: 1000, onComplete: () => t.destroy() });
  }

  // --- LEVELING ---
  levelUp() {
    this.level++;
    this.xp = 0;
    this.xpToNext = Math.floor(this.xpToNext * 1.5);
    this.cameras.main.flash(200, 0, 255, 100);
    this.showFloatText(this.player.x, this.player.y - 40, `LEVEL ${this.level}!`, '#00ffff');
    playTone(this, 660, 0.2, 0.1);
    this.player.maxHp += 5;
    this.player.hp = Math.min(this.player.hp + 20, this.player.maxHp);
    this.showWeaponChoice();
  }

  showWeaponChoice() {
    this.isPaused = true;
    this.physics.pause();
    clearPressed(this);

    const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.75).setScrollFactor(0).setDepth(90);
    const title = this.add.text(GAME_WIDTH / 2, 80, 'LEVEL UP! Choose upgrade:', {
      fontSize: '24px', fontFamily: 'monospace', color: '#ffdd00'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(91);

    const options = [];
    this.weapons.forEach(w => {
      if (w.level < 5) options.push({ type: 'upgrade', weapon: w });
    });
    WEAPON_DEFS.forEach(aw => {
      if (!this.weapons.find(w => w.id === aw.id))
        options.push({ type: 'new', weapon: { ...aw, level: 1 } });
    });
    options.push({ type: 'stat', stat: 'speed', name: 'Bull Run', desc: '+15% move speed', icon: '\u{1F402}' });
    options.push({ type: 'stat', stat: 'maxhp', name: 'HODL', desc: '+25 max HP', icon: '\u{1F4AA}' });

    Phaser.Utils.Array.Shuffle(options);
    const picks = options.slice(0, 3);

    const elements = [overlay, title];
    this.choicePicks = picks;
    this.choiceElements = elements;
    this.choiceCursor = 0;

    picks.forEach((opt, i) => {
      const cx = GAME_WIDTH / 2 - 220 + i * 220;
      const cy = GAME_HEIGHT / 2;

      const card = this.add.rectangle(cx, cy, 190, 180, 0x112211, 0.9).setScrollFactor(0).setDepth(91);
      card.setStrokeStyle(2, i === 0 ? 0x00ffff : 0x00ff88);

      let titleText, descText, iconText;
      if (opt.type === 'upgrade') {
        iconText = opt.weapon.icon; titleText = opt.weapon.name;
        descText = `Upgrade to Lv${opt.weapon.level + 1}\n+DMG +Rate +Range`;
      } else if (opt.type === 'new') {
        iconText = opt.weapon.icon; titleText = opt.weapon.name; descText = opt.weapon.desc;
      } else {
        iconText = opt.icon; titleText = opt.name; descText = opt.desc;
      }

      const icon = this.add.text(cx, cy - 50, iconText, { fontSize: '32px' }).setOrigin(0.5).setScrollFactor(0).setDepth(92);
      const name = this.add.text(cx, cy - 10, titleText, {
        fontSize: '14px', fontFamily: 'monospace', color: '#00ff88', align: 'center'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(92);
      const desc = this.add.text(cx, cy + 25, descText, {
        fontSize: '11px', fontFamily: 'monospace', color: '#aaaaaa', align: 'center'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(92);

      const btnLabel = this.add.text(cx, cy + 65, i === 0 ? '> SELECT <' : '', {
        fontSize: '14px', fontFamily: 'monospace', color: '#ffdd00'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(92);

      opt._card = card;
      opt._btnLabel = btnLabel;
      elements.push(card, icon, name, desc, btnLabel);
    });
  }

  updateChoiceCursor(dir) {
    if (!this.choicePicks) return;
    const old = this.choiceCursor;
    this.choiceCursor = Phaser.Math.Wrap(this.choiceCursor + dir, 0, this.choicePicks.length);
    if (old !== this.choiceCursor) playTone(this, 500, 0.03, 0.05);
    this.choicePicks.forEach((p, i) => {
      p._card.setStrokeStyle(2, i === this.choiceCursor ? 0x00ffff : 0x00ff88);
      p._btnLabel.setText(i === this.choiceCursor ? '> SELECT <' : '');
    });
  }

  confirmChoice() {
    if (!this.choicePicks) return;
    const opt = this.choicePicks[this.choiceCursor];
    if (opt.type === 'upgrade') {
      this.upgradeWeapon(opt.weapon.id);
      this.showFloatText(this.player.x, this.player.y - 30, `${opt.weapon.icon} UPGRADED!`, '#00ff88');
    } else if (opt.type === 'new') {
      this.addWeapon({ ...opt.weapon });
      this.showFloatText(this.player.x, this.player.y - 30, `${opt.weapon.icon} NEW WEAPON!`, '#00ffff');
    } else if (opt.stat === 'speed') {
      this.player.speed = Math.floor(this.player.speed * 1.15);
      this.showFloatText(this.player.x, this.player.y - 30, 'FASTER!', '#00ff88');
    } else if (opt.stat === 'maxhp') {
      this.player.maxHp += 25;
      this.player.hp = Math.min(this.player.hp + 25, this.player.maxHp);
      this.showFloatText(this.player.x, this.player.y - 30, 'TANKIER!', '#00ff88');
    }
    playTone(this, 800, 0.1, 0.08);
    this.choiceElements.forEach(e => e.destroy());
    this.choicePicks = null;
    this.choiceElements = null;
    this.isPaused = false;
    this.physics.resume();
  }

  // --- DIFFICULTY ---
  escalate() {
    if (this.spawnTimer.delay > 1200) this.spawnTimer.delay -= 150;
  }

  // --- GAME OVER ---
  gameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.physics.pause();
    this.cameras.main.shake(500, 0.02);
    this.cameras.main.flash(500, 255, 0, 0);
    playTone(this, 80, 0.5, 0.15);

    const m = Math.floor(this.gameTime / 60);
    const s = this.gameTime % 60;
    this.time.delayedCall(1000, () => {
      this.scene.start('GameOver', {
        kills: this.kills, level: this.level,
        time: `${m}:${s.toString().padStart(2, '0')}`, wave: this.waveNum,
      });
    });
  }

  // --- UPDATE ---
  update(time) {
    if (this.isGameOver) return;

    // Weapon choice navigation with arcade controls
    if (this.isPaused && this.choicePicks) {
      if (consumePressed(this, ['P1_L', 'P2_L'])) this.updateChoiceCursor(-1);
      if (consumePressed(this, ['P1_R', 'P2_R'])) this.updateChoiceCursor(1);
      if (consumePressed(this, ['P1_1', 'P1_2', 'P2_1', 'P2_2', 'START1', 'START2'])) this.confirmChoice();
      return;
    }
    if (this.isPaused) return;

    // Player movement via arcade controls
    let vx = 0, vy = 0;
    if (this.controls.held['P1_L'] || this.controls.held['P2_L']) vx = -1;
    if (this.controls.held['P1_R'] || this.controls.held['P2_R']) vx = 1;
    if (this.controls.held['P1_U'] || this.controls.held['P2_U']) vy = -1;
    if (this.controls.held['P1_D'] || this.controls.held['P2_D']) vy = 1;

    if (vx !== 0 || vy !== 0) {
      const len = Math.sqrt(vx * vx + vy * vy);
      vx /= len; vy /= len;
      this.facing = { x: vx, y: vy };
    }
    this.player.body.setVelocity(vx * this.player.speed, vy * this.player.speed);

    // Enemy AI
    this.enemies.children.each(e => {
      if (!e.active) return;
      const angle = Phaser.Math.Angle.Between(e.x, e.y, this.player.x, this.player.y);
      e.body.setVelocity(Math.cos(angle) * e.speed, Math.sin(angle) * e.speed);
      if (e.isBoss) e.setScale(e.scaleX + Math.sin(time * 0.005) * 0.002);
    });

    // Orbiting projectiles
    this.projectiles.children.each(p => {
      if (p.active && p.isOrbiting) {
        p.orbitTime += 0.016;
        const a = p.orbitAngle + p.orbitTime * p.orbitSpeed;
        p.x = this.player.x + Math.cos(a) * p.orbitRadius;
        p.y = this.player.y + Math.sin(a) * p.orbitRadius;
        p.rotation = a + Math.PI / 2;
      }
    });

    this.fireWeapons(time);

    // XP magnet
    this.drops.children.each(d => {
      if (!d.active || d.dropType !== 'xp') return;
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, d.x, d.y);
      if (dist < 80) {
        const angle = Phaser.Math.Angle.Between(d.x, d.y, this.player.x, this.player.y);
        d.x += Math.cos(angle) * 4;
        d.y += Math.sin(angle) * 4;
      }
    });

    this.updateUI();
  }

  updateUI() {
    this.hpBar.clear();
    const hpPct = Math.max(0, this.player.hp / this.player.maxHp);
    const hpCol = hpPct > 0.5 ? 0x00ff66 : hpPct > 0.25 ? 0xffaa00 : 0xff3344;
    this.hpBar.fillStyle(hpCol);
    this.hpBar.fillRect(21, 21, 198 * hpPct, 14);

    this.xpBar.clear();
    this.xpBar.fillStyle(0xffdd00);
    this.xpBar.fillRect(21, 43, 198 * (this.xp / this.xpToNext), 8);

    this.levelText.setText(`LVL ${this.level}`);
    this.killText.setText(`KILLS: ${this.kills}`);
    const m = Math.floor(this.gameTime / 60);
    const s = this.gameTime % 60;
    this.timeText.setText(`${m}:${s.toString().padStart(2, '0')}`);
    this.waveText.setText(`WAVE ${this.waveNum}`);
  }
}

// --- GAME OVER SCENE ---
class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }

  create(data) {
    createControls(this);
    const cx = GAME_WIDTH / 2, cy = GAME_HEIGHT / 2;

    this.gridGfx = this.add.graphics();
    this.gridOffset = 0;

    this.add.text(cx, cy - 140, 'LIQUIDATED', {
      fontSize: '56px', fontFamily: 'monospace', color: '#ff3344',
      stroke: '#330000', strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(cx, cy - 70, 'Your portfolio has been wiped out.', {
      fontSize: '16px', fontFamily: 'monospace', color: '#ff6666'
    }).setOrigin(0.5);

    const statStyle = { fontSize: '20px', fontFamily: 'monospace', color: '#00ff88' };
    const labelStyle = { fontSize: '14px', fontFamily: 'monospace', color: '#888888' };

    this.add.text(cx - 100, cy - 10, 'Survived', labelStyle).setOrigin(0.5);
    this.add.text(cx - 100, cy + 15, data.time || '0:00', statStyle).setOrigin(0.5);
    this.add.text(cx + 100, cy - 10, 'Kills', labelStyle).setOrigin(0.5);
    this.add.text(cx + 100, cy + 15, `${data.kills || 0}`, statStyle).setOrigin(0.5);
    this.add.text(cx - 100, cy + 55, 'Level', labelStyle).setOrigin(0.5);
    this.add.text(cx - 100, cy + 80, `${data.level || 1}`, statStyle).setOrigin(0.5);
    this.add.text(cx + 100, cy + 55, 'Wave', labelStyle).setOrigin(0.5);
    this.add.text(cx + 100, cy + 80, `${data.wave || 0}`, statStyle).setOrigin(0.5);

    const retry = this.add.text(cx, cy + 150, '[ PRESS START OR BUTTON TO RETRY ]', {
      fontSize: '20px', fontFamily: 'monospace', color: '#00ffff'
    }).setOrigin(0.5);
    this.time.addEvent({ delay: 500, loop: true, callback: () => { retry.visible = !retry.visible; } });
  }

  update() {
    if (consumePressed(this, ['START1', 'START2', 'P1_1', 'P1_2', 'P2_1', 'P2_2'])) {
      this.scene.start('Game');
    }

    this.gridOffset = (this.gridOffset + 0.2) % 40;
    const g = this.gridGfx;
    g.clear();
    g.lineStyle(1, 0x1a0a0a, 0.5);
    for (let x = -40 + this.gridOffset; x < GAME_WIDTH + 40; x += 40) g.lineBetween(x, 0, x, GAME_HEIGHT);
    for (let y = -40 + this.gridOffset; y < GAME_HEIGHT + 40; y += 40) g.lineBetween(0, y, GAME_WIDTH, y);
    g.setDepth(-1);
  }
}

// --- PHASER CONFIG ---
const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-root',
  backgroundColor: '#050a05',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: [MenuScene, GameScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
