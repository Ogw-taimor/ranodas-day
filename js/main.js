/* =========================================================
   Our Little Universe — birthday world
   Edit the CONFIG block below to change names, captions and text.
   ========================================================= */

const CONFIG = {
  name: "Ranoda",
  signature: "Yours, always",

  // Photos live in images/full (big) and images/thumb (small). Same file name in both.
  memories: [
    { file: "snow-hug.jpg",      caption: "The day we hugged in the snow, in the middle of Egypt" },
    { file: "red-gloves.jpg",    caption: "Red gloves, zero skiing skills, one hundred percent happy" },
    { file: "ski-smile.jpg",     caption: "This smile is the whole reason" },
    { file: "blue-light.jpg",    caption: "It was freezing. I didn't notice." },
    { file: "elevator.jpg",      caption: "Us, plus every emotion at once" },
    { file: "train.jpg",         caption: "Train rides feel shorter with you" },
    { file: "late-night.jpg",    caption: "Late night, closed shops, still our favorite spot" },
    { file: "glasses.jpg",       caption: "Matching glasses, matching mood" },
    { file: "golden-hour.jpg",   caption: "Golden hour, pink shirt, my favorite view" },
    { file: "dinner-mirror.jpg", caption: "Mirror photo always" },
    { file: "hands.jpg",         caption: "Your hand, my favorite place to be" },
  ],
  memoriesToLight: 4, // how many photos she has to open to earn the candle

  letter: [
    { cls: "greet", text: "To my favorite person," },
    { text: "I don't know how I got lucky enough to have you in my life, but I stopped asking questions a long time ago." },
    { text: "You turned random days into memories. Train rides, late nights, a snow day in the middle of the desert." },
    { text: "You make me laugh harder than anyone, and somehow you make everything feel lighter." },
    { text: "Thank you for being you. Loudly, softly, completely you." },
    { text: "Today is all about you. Honestly, so is every other day." },
    { cls: "sign", text: "Yours, always" },
  ],

  promises: [
    { icon: "snow",   bg: "blue-light.jpg",    html: "More snow days, <em>even in Egypt.</em>" },
    { icon: "moon",   bg: "late-night.jpg",    html: "More late nights, <em>wherever we end up.</em>" },
    { icon: "camera", bg: "dinner-mirror.jpg", html: "A photo in <em>every mirror</em> we pass." },
    { icon: "heart",  bg: "snow-hug.jpg",      html: "And me, <em>always on your side.</em>", last: true },
  ],

  loves: [
    { word: "your smile",           note: "It fixes my worst days in about three seconds." },
    { word: "your laugh",           note: "I could listen to it forever. I'd buy tickets." },
    { word: "your eyes",            note: "Especially right before you say something chaotic." },
    { word: "your hugs",            note: "Even in ski jackets, the best place on earth." },
    { word: "your random texts",    note: "The best notifications I get all day." },
    { word: "our late nights",      note: "Closed shops, empty streets, full hearts." },
    { word: "your matcha era",      note: "Green drink, dramatic face. Iconic." },
    { word: "your mirror selfies",  note: "We have more mirror photos than mirrors." },
  ],
  lovesToUnlock: 5,

  secrets: [
    "You found a secret. Of course you did.",
    "This star is officially named after you.",
    "Psst… you're my favorite notification.",
    "I'd hug you in the snow again. Any day.",
    "One more secret: I'm really, really lucky.",
  ],
};

/* ---------------------------------------------------------
   helpers
   --------------------------------------------------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const COLORS = ["#FF9DC0", "#E8457A", "#FFCF7A", "#FBF5EA", "#B9A3FF"];
const center = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, r }; };

/* ---------------------------------------------------------
   SOUND — everything is synthesized, no audio files needed
   --------------------------------------------------------- */
const Sound = {
  ctx: null, master: null, wet: null, on: true,
  init() {
    if (this.ctx) { this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = (this.ctx = new AC());
    this.master = ctx.createGain(); this.master.gain.value = 0.7;
    const comp = ctx.createDynamicsCompressor();
    this.master.connect(comp).connect(ctx.destination);
    // tiny echo "room"
    const delay = ctx.createDelay(); delay.delayTime.value = 0.21;
    const fb = ctx.createGain(); fb.gain.value = 0.32;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2600;
    this.wet = ctx.createGain(); this.wet.gain.value = 0.28;
    this.wet.connect(delay); delay.connect(lp).connect(fb).connect(delay); lp.connect(this.master);
  },
  setOn(v) {
    this.on = v;
    if (this.master) this.master.gain.setTargetAtTime(v ? 0.7 : 0, this.ctx.currentTime, 0.05);
  },
  tone(freq, when = 0, dur = 1.2, { type = "sine", gain = 0.18, attack = 0.005, wet = true } = {}) {
    if (!this.ctx || !this.on) return;
    const t = this.ctx.currentTime + when;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master); if (wet) g.connect(this.wet);
    o.start(t); o.stop(t + dur + 0.05);
  },
  bell(freq, when = 0, gain = 0.16, dur = 1.6) {
    this.tone(freq, when, dur, { gain });
    this.tone(freq * 2, when, dur * 0.6, { gain: gain * 0.35 });
    this.tone(freq * 3.01, when, dur * 0.35, { gain: gain * 0.12 });
  },
  chime() {
    const scale = [1046.5, 1174.7, 1318.5, 1568, 1760, 2093];
    for (let i = 0; i < 3; i++) this.bell(pick(scale), i * 0.07, 0.07, 0.9);
  },
  pop() {
    if (!this.ctx || !this.on) return;
    const t = this.ctx.currentTime, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.frequency.setValueAtTime(520, t); o.frequency.exponentialRampToValueAtTime(1300, t + 0.08);
    g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
    o.connect(g).connect(this.master); o.start(t); o.stop(t + 0.16);
  },
  thud(power = 1) {
    if (!this.ctx || !this.on) return;
    const t = this.ctx.currentTime, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(50, t + 0.2);
    g.gain.setValueAtTime(0.45 * power, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    o.connect(g).connect(this.master); o.start(t); o.stop(t + 0.3);
  },
  noise(dur, { from = 400, to = 3000, gain = 0.25, type = "bandpass", q = 0.8 } = {}) {
    if (!this.ctx || !this.on) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.45);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(this.master); src.start(t);
  },
  whoosh() { this.noise(1.8, { from: 300, to: 4200, gain: 0.3 }); },
  wind() { this.noise(1.3, { from: 1400, to: 300, gain: 0.35, type: "lowpass", q: 0.3 }); },
  boom() { this.thud(1.4); this.noise(0.9, { from: 3000, to: 200, gain: 0.3, type: "lowpass" }); },
  // Happy Birthday (public-domain melody) as a music box
  happyBirthday() {
    const N = { G4: 392, A4: 440, B4: 493.9, C5: 523.3, D5: 587.3, E5: 659.3, F5: 698.5, G5: 784 };
    const song = [
      ["G4", .75], ["G4", .25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
      ["G4", .75], ["G4", .25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
      ["G4", .75], ["G4", .25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2],
      ["F5", .75], ["F5", .25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 3],
    ];
    const beat = 0.4; let t = 0.1;
    const bass = { 0: 130.8, 6: 98, 12: 130.8, 19: 87.3, 22: 98, 24: 130.8 };
    song.forEach(([n, d], i) => {
      this.bell(N[n] * 2, t, 0.13, Math.max(1.2, d * beat * 2.5));
      if (bass[i]) this.tone(bass[i] * 2, t, 2.2, { type: "triangle", gain: 0.06 });
      t += d * beat;
    });
    return t;
  },
};

/* ---------------------------------------------------------
   SKY — 3D starfield that can warp, and turn into snow
   --------------------------------------------------------- */
const Sky = {
  c: $("#sky"), ctx: null, w: 0, h: 0, stars: [], flakes: [],
  speed: 0.018, starAlpha: 1, snowAlpha: 0, mx: 0, my: 0, tx: 0, ty: 0, last: 0, nextShoot: 4,
  shooting: null,
  init() {
    this.ctx = this.c.getContext("2d");
    this.resize(); addEventListener("resize", () => this.resize());
    addEventListener("pointermove", (e) => { this.tx = e.clientX / this.w - 0.5; this.ty = e.clientY / this.h - 0.5; });
    requestAnimationFrame((t) => this.loop(t));
  },
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.w = innerWidth; this.h = innerHeight;
    this.c.width = this.w * dpr; this.c.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(850, Math.max(260, ((this.w * this.h) / 1700) | 0));
    const tint = ["#ffffff", "#ffffff", "#ffffff", "#FFD9E6", "#E2D8FF", "#FFE7B8"];
    this.stars = Array.from({ length: n }, () => ({
      x: rand(-1, 1), y: rand(-1, 1), z: rand(0.05, 1), s: rand(0.4, 1.3),
      tw: rand(0, Math.PI * 2), tws: rand(0.6, 2.2), col: pick(tint),
    }));
    const fn = Math.min(220, ((this.w * this.h) / 6500) | 0);
    this.flakes = Array.from({ length: fn }, () => this.newFlake(true));
  },
  newFlake(anywhere) {
    return { x: rand(0, this.w), y: anywhere ? rand(-this.h, this.h) : rand(-60, -10), r: rand(1, 3.6), vy: rand(22, 70), sway: rand(10, 40), ph: rand(0, 6.28), a: rand(0.45, 0.95) };
  },
  warp(dur = 1.6) {
    if (RM) return Promise.resolve();
    return new Promise((res) => {
      gsap.timeline({ onComplete: res })
        .to(this, { speed: 2.6, duration: dur * 0.5, ease: "power3.in" })
        .to(this, { speed: 0.018, duration: dur * 0.7, ease: "power3.out" });
    });
  },
  loop(t) {
    const dt = Math.min(0.05, (t - this.last) / 1000 || 0.016); this.last = t;
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);
    this.mx += (this.tx - this.mx) * 0.04; this.my += (this.ty - this.my) * 0.04;
    const cx = w / 2, cy = h / 2, f = Math.max(w, h) * 0.55;
    const warping = this.speed > 0.25;

    if (this.starAlpha > 0.01) {
      for (const s of this.stars) {
        const pz = s.z;
        s.z -= this.speed * dt * (RM ? 0 : 1);
        if (s.z <= 0.04) { s.z = 1; s.x = rand(-1, 1); s.y = rand(-1, 1); continue; }
        const par = (1 - s.z) * 40;
        const sx = cx + (s.x / s.z) * f - this.mx * par, sy = cy + (s.y / s.z) * f - this.my * par;
        if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) { if (warping) { s.z = 1; s.x = rand(-1, 1); s.y = rand(-1, 1); } continue; }
        s.tw += s.tws * dt;
        const tw = warping ? 1 : 0.55 + Math.sin(s.tw) * 0.45;
        const a = Math.min(1, (1 - s.z) * 1.5) * tw * this.starAlpha;
        const r = (1 - s.z) * 1.9 * s.s + 0.25;
        if (warping) {
          const px = cx + (s.x / pz) * f - this.mx * par, py = cy + (s.y / pz) * f - this.my * par;
          ctx.strokeStyle = s.col; ctx.globalAlpha = a; ctx.lineWidth = r * 1.2;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sx, sy); ctx.stroke();
        } else {
          ctx.globalAlpha = a; ctx.fillStyle = s.col;
          ctx.beginPath(); ctx.arc(sx, sy, r, 0, 6.283); ctx.fill();
        }
      }
      // shooting star
      if (!RM && !warping) {
        this.nextShoot -= dt;
        if (this.nextShoot <= 0 && !this.shooting) {
          this.shooting = { x: rand(w * 0.1, w * 0.9), y: rand(0, h * 0.35), vx: rand(-1, 1) > 0 ? 900 : -900, vy: 380, life: 0 };
          this.nextShoot = rand(6, 13);
        }
        const sh = this.shooting;
        if (sh) {
          sh.life += dt; sh.x += sh.vx * dt; sh.y += sh.vy * dt;
          const len = 0.12, g = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * len, sh.y - sh.vy * len);
          g.addColorStop(0, "rgba(255,240,210,.95)"); g.addColorStop(1, "rgba(255,240,210,0)");
          ctx.globalAlpha = Math.max(0, 1 - sh.life / 0.9) * this.starAlpha;
          ctx.strokeStyle = g; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(sh.x, sh.y); ctx.lineTo(sh.x - sh.vx * len, sh.y - sh.vy * len); ctx.stroke();
          if (sh.life > 0.9) this.shooting = null;
        }
      }
    }

    if (this.snowAlpha > 0.01) {
      ctx.fillStyle = "#fff";
      for (const fl of this.flakes) {
        fl.y += fl.vy * dt * (RM ? 0.3 : 1); fl.ph += dt;
        const x = fl.x + Math.sin(fl.ph) * fl.sway;
        if (fl.y > h + 10) Object.assign(fl, this.newFlake(false));
        ctx.globalAlpha = fl.a * this.snowAlpha;
        ctx.beginPath(); ctx.arc(x, fl.y, fl.r, 0, 6.283); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame((tt) => this.loop(tt));
  },
};

/* ---------------------------------------------------------
   FX — confetti, hearts, sparks, smoke
   --------------------------------------------------------- */
const FX = {
  c: $("#fx"), ctx: null, p: [], running: false, w: 0, h: 0,
  init() { this.ctx = this.c.getContext("2d"); this.resize(); addEventListener("resize", () => this.resize()); },
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2); this.w = innerWidth; this.h = innerHeight;
    this.c.width = this.w * dpr; this.c.height = this.h * dpr; this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  },
  add(o) { this.p.push(o); if (!this.running) { this.running = true; this.last = performance.now(); requestAnimationFrame((t) => this.loop(t)); } },
  burst(x, y, { count = 60, power = 520, shapes = ["rect", "heart", "dot"], colors = COLORS, gravity = 620, spread = Math.PI * 2, angle = -Math.PI / 2, size = [5, 11] } = {}) {
    if (RM) count = Math.min(count, 18);
    for (let i = 0; i < count; i++) {
      const a = angle + rand(-spread / 2, spread / 2), v = rand(power * 0.3, power);
      this.add({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: gravity, drag: 0.985, rot: rand(0, 6.28), vr: rand(-8, 8),
        size: rand(size[0], size[1]), color: pick(colors), shape: pick(shapes), life: 0, max: rand(1.6, 3.2), flip: rand(0, 6.28) });
    }
  },
  rain(duration = 3, perSec = 70) {
    const end = performance.now() + duration * 1000;
    const tick = () => {
      const n = Math.round(perSec / 30);
      for (let i = 0; i < n; i++) this.add({ x: rand(0, this.w), y: -20, vx: rand(-40, 40), vy: rand(80, 220), g: 60, drag: 0.995, rot: rand(0, 6.28), vr: rand(-3, 3),
        size: rand(8, 16), color: pick(["#FF9DC0", "#E8457A", "#FBF5EA"]), shape: "heart", life: 0, max: 6, flip: 0 });
      if (performance.now() < end) setTimeout(tick, 33);
    };
    tick();
  },
  smoke(x, y) {
    for (let i = 0; i < 7; i++) this.add({ x: x + rand(-3, 3), y, vx: rand(-12, 12), vy: rand(-70, -35), g: -10, drag: 0.99, rot: 0, vr: 0,
      size: rand(3, 6), grow: rand(14, 26), color: "rgba(220,215,235,1)", shape: "smoke", life: -i * 0.06, max: rand(1.6, 2.4), flip: 0 });
  },
  heart(ctx, s) {
    ctx.beginPath(); ctx.moveTo(0, s * 0.35);
    ctx.bezierCurveTo(-s * 1.1, -s * 0.35, -s * 0.45, -s * 1.05, 0, -s * 0.45);
    ctx.bezierCurveTo(s * 0.45, -s * 1.05, s * 1.1, -s * 0.35, 0, s * 0.35); ctx.fill();
  },
  loop(t) {
    const dt = Math.min(0.04, (t - this.last) / 1000); this.last = t;
    const { ctx } = this; ctx.clearRect(0, 0, this.w, this.h);
    this.p = this.p.filter((q) => q.life < q.max && q.y < this.h + 60);
    for (const q of this.p) {
      q.life += dt; if (q.life < 0) continue;
      q.vx *= q.drag; q.vy = q.vy * q.drag + q.g * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt; q.flip += dt * 6;
      const a = Math.max(0, 1 - Math.max(0, q.life - q.max * 0.6) / (q.max * 0.4));
      ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.globalAlpha = a; ctx.fillStyle = q.color;
      if (q.shape === "rect") { ctx.scale(1, Math.cos(q.flip)); ctx.fillRect(-q.size / 2, -q.size / 4, q.size, q.size / 2); }
      else if (q.shape === "heart") this.heart(ctx, q.size * 0.6);
      else if (q.shape === "smoke") { ctx.globalAlpha = a * 0.28; const r = q.size + q.grow * (q.life / q.max); ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fill(); }
      else { ctx.beginPath(); ctx.arc(0, 0, q.size / 3, 0, 6.283); ctx.fill(); }
      ctx.restore();
    }
    if (this.p.length) requestAnimationFrame((tt) => this.loop(tt));
    else { this.running = false; ctx.clearRect(0, 0, this.w, this.h); }
  },
};

/* ---------------------------------------------------------
   CAKE — one SVG used for the small progress cake and the big finale cake
   --------------------------------------------------------- */
let cakeId = 0;
function cakeSVG(candles = 4) {
  const id = "ck" + cakeId++;
  const xs = Array.from({ length: candles }, (_, i) => 100 + (i - (candles - 1) / 2) * 20);
  const drips = [30, 44, 58, 74, 90, 104, 120, 136, 150, 166].map((x, i) => `<ellipse cx="${x}" cy="${126 + (i % 3) * 3}" rx="6" ry="${5 + (i % 3) * 3}" />`).join("");
  const scallop = Array.from({ length: 12 }, (_, i) => `<circle cx="${49 + i * 9.3}" cy="80" r="5" />`).join("");
  const sprinkles = [[60, 96, 20], [78, 104, -30], [98, 94, 60], [120, 102, 10], [140, 95, -50], [52, 150, 30], [84, 160, -20], [116, 156, 70], [150, 150, -10], [34, 158, 40], [168, 160, 20]]
    .map(([x, y, r], i) => `<rect x="${x}" y="${y}" width="7" height="2.6" rx="1.3" transform="rotate(${r} ${x} ${y})" fill="${["#FFCF7A", "#B9A3FF", "#FBF5EA", "#E8457A"][i % 4]}"/>`).join("");
  const candleEls = xs.map((c, i) => `
    <g class="candle">
      <rect x="${c - 4}" y="36" width="8" height="36" rx="2" fill="#FBF5EA"/>
      <path d="M${c - 4} 44l8-5M${c - 4} 54l8-5M${c - 4} 64l8-5" stroke="#E8457A" stroke-width="2.4"/>
      <path d="M${c} 36v-5" stroke="#2A1B3D" stroke-width="1.6" stroke-linecap="round"/>
      <g class="flame-wrap" data-i="${i}" opacity="0">
        <circle class="flame-glow" cx="${c}" cy="20" r="17" fill="url(#${id}g)"/>
        <path class="flame" d="M${c} 3C${c + 7.5} 13 ${c + 7.5} 24 ${c} 30C${c - 7.5} 24 ${c - 7.5} 13 ${c} 3Z" fill="url(#${id}f)"/>
        <path class="flame" d="M${c} 14C${c + 3.4} 19 ${c + 3.4} 25 ${c} 28C${c - 3.4} 25 ${c - 3.4} 19 ${c} 14Z" fill="#FFF6DC"/>
      </g>
    </g>`).join("");
  return `<svg viewBox="0 0 200 190" role="img" aria-label="Birthday cake with ${candles} candles">
    <defs>
      <radialGradient id="${id}g"><stop offset="0" stop-color="#FFCF7A" stop-opacity=".75"/><stop offset="1" stop-color="#FFCF7A" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A8"/><stop offset=".6" stop-color="#FFB547"/><stop offset="1" stop-color="#FF7A45"/></linearGradient>
    </defs>
    <ellipse cx="100" cy="178" rx="94" ry="10" fill="#3A2860"/>
    <rect x="20" y="112" width="160" height="64" rx="12" fill="#FBF5EA"/>
    <rect x="20" y="152" width="160" height="7" fill="#F1E6D4"/>
    <g fill="#FF9DC0"><rect x="20" y="112" width="160" height="15" rx="10"/>${drips}</g>
    <rect x="44" y="72" width="112" height="46" rx="10" fill="#EE6B98"/>
    <g fill="#FBF5EA"><rect x="44" y="72" width="112" height="9" rx="6"/>${scallop}</g>
    ${sprinkles}
    ${candleEls}
  </svg>`;
}
function lightCandle(root, i, instant = false) {
  const f = $$(".flame-wrap", root)[i]; if (!f) return;
  f.classList.add("is-lit");
  if (instant || RM) { f.setAttribute("opacity", "1"); return; }
  gsap.fromTo(f, { attr: { opacity: 0 }, scale: 0.2, transformOrigin: "50% 100%" }, { attr: { opacity: 1 }, scale: 1, duration: 0.6, ease: "back.out(3)" });
}

/* ---------------------------------------------------------
   STATE
   --------------------------------------------------------- */
const state = {
  current: null,             // open scene name
  done: { memories: false, letter: false, gift: false, loves: false },
  lit: { memories: false, letter: false, gift: false, loves: false },
  candles: 0,
  seen: new Set(),
  opened: new Set(),
  giftClicks: 0,
  finaleStarted: false,
};

/* ---------------------------------------------------------
   INTRO
   --------------------------------------------------------- */
function splitChars(el) {
  const text = el.textContent; el.textContent = ""; el.setAttribute("aria-label", text);
  return text.split(" ").map((word, wi, arr) => {
    const w = document.createElement("span"); w.style.whiteSpace = "nowrap"; w.setAttribute("aria-hidden", "true");
    [...word].forEach((ch) => { const s = document.createElement("span"); s.className = "ch"; s.textContent = ch; w.appendChild(s); });
    el.appendChild(w); if (wi < arr.length - 1) el.appendChild(document.createTextNode(" "));
    return w;
  }).flatMap((w) => [...w.children]);
}

function introIn() {
  const chars = splitChars($("#introTitle"));
  const tl = gsap.timeline({ delay: 0.4 });
  tl.from(chars, { opacity: 0, y: 50, rotation: () => rand(-20, 20), filter: "blur(12px)", duration: 1.3, ease: "expo.out", stagger: 0.055 })
    .from(".intro-sub", { opacity: 0, y: 20, duration: 1, ease: "power3.out" }, "-=.6")
    .from("#enterBtn", { opacity: 0, y: 16, scale: 0.9, duration: 0.9, ease: "back.out(2)" }, "-=.5")
    .from(".intro-hint", { opacity: 0, duration: 1 }, "-=.3");
  if (RM) tl.progress(1);
}

async function enterWorld() {
  Sound.init(); Sound.whoosh();
  $("#soundToggle").hidden = false;
  gsap.from("#soundToggle", { opacity: 0, scale: 0.6, duration: 0.6, delay: 1.2 });
  gsap.to(".intro-inner", { opacity: 0, scale: 1.4, filter: "blur(10px)", duration: 1, ease: "power2.in" });
  await Sky.warp(1.8);
  $("#intro").hidden = true;
  showHub(true);
}

/* ---------------------------------------------------------
   HUB
   --------------------------------------------------------- */
const hubObjs = $$(".obj");
let parallaxOn = false;

function buildHub() {
  $("#miniCakeArt").innerHTML = cakeSVG(4);
  // secrets (hidden stars)
  const spots = [[7, 16], [93, 16], [6, 48], [94, 47], [50, 83]];
  CONFIG.secrets.forEach((msg, i) => {
    const b = document.createElement("button");
    b.className = "secret"; b.setAttribute("aria-label", "A hidden star");
    const [x, y] = spots[i % spots.length];
    b.style.left = x + "%"; b.style.top = y + "%"; b.style.setProperty("--d", (i * 0.7).toFixed(1) + "s");
    b.addEventListener("click", () => showSecret(b, msg));
    $("#secrets").appendChild(b);
  });
  hubObjs.forEach((o) => o.addEventListener("click", () => openScene(o.dataset.scene, o)));
  gsap.set([...hubObjs, "#moon"], { x: 0, y: 0, xPercent: -50, yPercent: -50 });
  gsap.set("#miniCake", { x: 0, xPercent: -50 });

  // gentle parallax
  const movers = [
    ...hubObjs.map((el) => ({ el, k: 18, x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3" }), y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3" }) })),
    { el: $("#moon"), k: -10, x: gsap.quickTo("#moon", "x", { duration: 1.4, ease: "power3" }), y: gsap.quickTo("#moon", "y", { duration: 1.4, ease: "power3" }) },
  ];
  addEventListener("pointermove", (e) => {
    if (!parallaxOn || RM || e.pointerType === "touch") return;
    const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
    movers.forEach((m) => { m.x(-nx * m.k); m.y(-ny * m.k); });
  });
}

function showHub(first = false) {
  const hub = $("#hub"); hub.hidden = false; parallaxOn = true;
  if (!first) return;
  const tl = gsap.timeline();
  tl.from("#moon", { scale: 0, opacity: 0, duration: 1.4, ease: "expo.out" })
    .from(hubObjs, { opacity: 0, scale: 0, x: (i, el) => (innerWidth / 2 - el.offsetLeft) * 0.8, y: (i, el) => (innerHeight / 2 - el.offsetTop) * 0.8, duration: 1.2, ease: "expo.out", stagger: 0.12 }, "-=1")
    .from(".hub-head > *", { opacity: 0, y: -14, duration: 0.9, stagger: 0.15 }, "-=.8")
    .from(".secret", { opacity: 0, duration: 1.2, stagger: 0.2 }, "-=.6")
    .from("#miniCake", { opacity: 0, y: 30, duration: 0.9, ease: "back.out(1.6)" }, "-=1");
  if (RM) tl.progress(1);
}

let toastTimer;
function showSecret(btn, msg) {
  Sound.chime();
  btn.classList.add("is-found");
  const t = $("#starToast"); t.textContent = msg; t.hidden = false;
  const { x, y } = center(btn);
  const tw = Math.min(300, innerWidth - 32);
  t.style.maxWidth = tw + "px";
  const r = t.getBoundingClientRect();
  let left = Math.min(Math.max(16, x - r.width / 2), innerWidth - r.width - 16);
  let top = y - r.height - 18; if (top < 16) top = y + 24;
  t.style.left = left + "px"; t.style.top = top + "px";
  gsap.fromTo(t, { opacity: 0, scale: 0.6, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(2.2)" });
  FX.burst(x, y, { count: 22, power: 220, shapes: ["dot", "heart"], colors: ["#FFCF7A", "#FBF5EA", "#FF9DC0"], gravity: 120, size: [4, 8] });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => gsap.to(t, { opacity: 0, y: -8, duration: 0.4, onComplete: () => (t.hidden = true) }), 3200);
}

/* candle earned → spark flies from the object to the mini cake */
async function processCandles() {
  for (const key of Object.keys(state.done)) {
    if (state.done[key] && !state.lit[key]) {
      state.lit[key] = true;
      const obj = $(`.obj[data-scene="${key}"]`);
      const i = state.candles; state.candles++;
      await flySpark(obj, i);
      obj.classList.add("is-done");
      obj.setAttribute("aria-label", obj.textContent.trim() + " (candle lit)");
      $("#miniCakeText").textContent = state.candles === 4 ? "All four candles are lit" : `${state.candles} of 4 candles lit`;
      await wait(250);
    }
  }
  if (state.candles >= 4 && !state.finaleStarted) { state.finaleStarted = true; await wait(1400); startFinale(); }
}
function flySpark(fromEl, i) {
  return new Promise((res) => {
    const a = center(fromEl);
    const flame = $$("#miniCakeArt .flame-wrap")[i];
    const b = center(flame);
    const s = document.createElement("div");
    Object.assign(s.style, { position: "fixed", left: "0", top: "0", width: "14px", height: "14px", borderRadius: "50%", zIndex: 85, pointerEvents: "none",
      background: "#FFF3D1", boxShadow: "0 0 12px 4px #FFCF7A, 0 0 30px 10px rgba(255,157,192,.6)" });
    document.body.appendChild(s);
    Sound.bell(880, 0, 0.1, 0.8);
    const midX = (a.x + b.x) / 2 + rand(-120, 120), midY = Math.min(a.y, b.y) - 120;
    const p = { t: 0 };
    gsap.to(p, {
      t: 1, duration: RM ? 0.2 : 1.1, ease: "power2.inOut",
      onUpdate() {
        const t = p.t, x = (1 - t) ** 2 * a.x + 2 * (1 - t) * t * midX + t * t * b.x, y = (1 - t) ** 2 * a.y + 2 * (1 - t) * t * midY + t * t * b.y;
        gsap.set(s, { x: x - 7, y: y - 7 });
        if (Math.random() < 0.5) FX.add({ x, y, vx: rand(-20, 20), vy: rand(-20, 20), g: 40, drag: 0.96, rot: 0, vr: 0, size: rand(3, 6), color: "#FFCF7A", shape: "dot", life: 0, max: 0.6, flip: 0 });
      },
      onComplete() {
        s.remove(); lightCandle($("#miniCakeArt"), i);
        Sound.bell([1046.5, 1174.7, 1318.5, 1568][i] || 1568, 0, 0.18, 1.6);
        FX.burst(b.x, b.y, { count: 26, power: 200, shapes: ["dot"], colors: ["#FFCF7A", "#FFF3D1"], gravity: 200, size: [4, 7] });
        gsap.fromTo("#miniCake", { scale: 1.08 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, .4)" });
        res();
      },
    });
  });
}

/* ---------------------------------------------------------
   SCENE MANAGER — circular reveal from the object you tapped
   --------------------------------------------------------- */
let lastOrigin = null;
function openScene(name, originEl) {
  if (state.current) return;
  Sound.init(); Sound.pop();
  const scene = $("#scene-" + name);
  const o = originEl ? center(originEl) : { x: innerWidth / 2, y: innerHeight / 2 };
  lastOrigin = o; state.current = name; parallaxOn = false;
  scene.hidden = false;
  const R = Math.hypot(Math.max(o.x, innerWidth - o.x), Math.max(o.y, innerHeight - o.y)) + 40;
  if (originEl) gsap.fromTo(originEl.querySelector("svg"), { scale: 1 }, { scale: 1.5, duration: 0.5, ease: "power2.out", yoyo: true, repeat: 1 });
  gsap.fromTo(scene, { clipPath: `circle(0px at ${o.x}px ${o.y}px)` }, { clipPath: `circle(${R}px at ${o.x}px ${o.y}px)`, duration: RM ? 0.01 : 1.05, ease: "expo.inOut", clearProps: "clipPath" });
  (onOpen[name] || (() => {}))();
  setTimeout(() => $(".back", scene)?.focus({ preventScroll: true }), 900);
}
function closeScene(then) {
  const name = state.current; if (!name) return;
  const scene = $("#scene-" + name);
  const o = lastOrigin || { x: innerWidth / 2, y: innerHeight / 2 };
  const R = Math.hypot(Math.max(o.x, innerWidth - o.x), Math.max(o.y, innerHeight - o.y)) + 40;
  Sound.pop();
  (onClose[name] || (() => {}))();
  gsap.fromTo(scene, { clipPath: `circle(${R}px at ${o.x}px ${o.y}px)` }, {
    clipPath: `circle(0px at ${o.x}px ${o.y}px)`, duration: RM ? 0.01 : 0.85, ease: "expo.inOut",
    onComplete: () => {
      scene.hidden = true; gsap.set(scene, { clearProps: "clipPath" }); state.current = null;
      if (typeof then === "function") then();
      else { parallaxOn = true; $(`.obj[data-scene="${name}"]`)?.focus({ preventScroll: true }); processCandles(); }
    },
  });
}
$$("[data-close]").forEach((b) => b.addEventListener("click", () => closeScene()));
const onOpen = {}, onClose = {};

/* ---------------------------------------------------------
   MEMORIES
   --------------------------------------------------------- */
const floaters = [];
function buildMemories() {
  const wrap = $("#polaroids");
  CONFIG.memories.forEach((m, i) => {
    const b = document.createElement("button");
    b.className = "polaroid"; b.dataset.i = i;
    b.setAttribute("aria-label", "Open memory: " + m.caption);
    b.innerHTML = `<span class="tape" aria-hidden="true"></span><span class="ph"><img src="images/thumb/${m.file}" alt="" loading="lazy" decoding="async"></span><span class="cap">${m.caption}</span>`;
    const r = rand(-7, 7); b.dataset.r = r;
    gsap.set(b, { rotation: r, transformPerspective: 700 });
    b.addEventListener("click", () => openLightbox(i));
    if (!RM) {
      const rx = gsap.quickTo(b, "rotationX", { duration: 0.5 }), ry = gsap.quickTo(b, "rotationY", { duration: 0.5 });
      b.addEventListener("pointermove", (e) => {
        if (e.pointerType === "touch") return;
        const rc = b.getBoundingClientRect();
        rx(-((e.clientY - rc.top) / rc.height - 0.5) * 16); ry(((e.clientX - rc.left) / rc.width - 0.5) * 16);
      });
      b.addEventListener("pointerleave", () => { rx(0); ry(0); });
    }
    wrap.appendChild(b);
  });
}
onOpen.memories = () => {
  const cards = $$(".polaroid");
  if (!RM) {
    gsap.from(cards, {
      y: () => innerHeight * 0.7, x: () => rand(-200, 200), rotation: () => rand(-60, 60), opacity: 0, scale: 0.6,
      duration: 1.2, ease: "back.out(1.1)", stagger: { each: 0.06, from: "random" }, delay: 0.35,
      onComplete: () => cards.forEach((c) => {
        const r = +c.dataset.r;
        floaters.push(gsap.to(c, { y: rand(-8, 8), rotation: r + rand(-2, 2), duration: rand(3, 5), ease: "sine.inOut", yoyo: true, repeat: -1 }));
      }),
    });
  }
  gsap.from("#scene-memories .scene-head > *", { opacity: 0, y: 20, stagger: 0.15, duration: 0.9, delay: 0.3 });
};
onClose.memories = () => { floaters.splice(0).forEach((t) => t.kill()); $$(".polaroid").forEach((c) => gsap.set(c, { y: 0, rotation: +c.dataset.r })); };

let lbIndex = 0, lbOpen = false;
function openLightbox(i) {
  lbIndex = i; lbOpen = true;
  const lb = $("#lightbox"), fig = $("#lbFigure"), card = $$(".polaroid")[i];
  setLightbox(i);
  lb.hidden = false;
  Sound.chime();
  const from = card.getBoundingClientRect();
  requestAnimationFrame(() => {
    const to = fig.getBoundingClientRect();
    const dx = from.left + from.width / 2 - (to.left + to.width / 2), dy = from.top + from.height / 2 - (to.top + to.height / 2);
    gsap.fromTo(".lb-backdrop", { opacity: 0 }, { opacity: 1, duration: 0.5 });
    gsap.fromTo(fig, { x: dx, y: dy, scale: from.width / to.width, rotation: +card.dataset.r }, { x: 0, y: 0, scale: 1, rotation: 0, duration: RM ? 0.01 : 0.8, ease: "expo.out" });
    gsap.fromTo([".lb-nav", ".lb-close"], { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.3 });
    gsap.set(card, { opacity: 0 });
    $(".lb-close").focus({ preventScroll: true });
  });
}
function setLightbox(i) {
  const m = CONFIG.memories[i], img = $("#lbImg");
  img.src = "images/thumb/" + m.file;
  const full = new Image(); full.src = "images/full/" + m.file; full.onload = () => { if (lbIndex === i) img.src = full.src; };
  img.alt = m.caption; $("#lbCap").textContent = m.caption;
  const card = $$(".polaroid")[i]; card.classList.add("seen");
  if (!state.seen.has(i)) {
    state.seen.add(i);
    const left = CONFIG.memoriesToLight - state.seen.size;
    if (left > 0) $("#memFoot").textContent = `${left} more ${left === 1 ? "memory" : "memories"} and this place lights a candle.`;
    else if (!state.done.memories) { state.done.memories = true; $("#memFoot").textContent = "Candle earned. Keep looking, or head back to our world."; }
  }
}
function stepLightbox(dir) {
  const n = CONFIG.memories.length, prev = $$(".polaroid")[lbIndex];
  gsap.set(prev, { opacity: 1 });
  lbIndex = (lbIndex + dir + n) % n;
  gsap.set($$(".polaroid")[lbIndex], { opacity: 0 });
  const fig = $("#lbFigure");
  gsap.timeline()
    .to(fig, { x: -dir * 60, opacity: 0, rotation: -dir * 4, duration: 0.22, ease: "power2.in" })
    .add(() => setLightbox(lbIndex))
    .fromTo(fig, { x: dir * 60, rotation: dir * 4 }, { x: 0, opacity: 1, rotation: 0, duration: 0.45, ease: "expo.out" });
  Sound.bell(1318.5, 0, 0.06, 0.6);
}
function closeLightbox() {
  if (!lbOpen) return; lbOpen = false;
  const lb = $("#lightbox"), fig = $("#lbFigure"), card = $$(".polaroid")[lbIndex];
  const from = fig.getBoundingClientRect(), to = card.getBoundingClientRect();
  const dx = to.left + to.width / 2 - (from.left + from.width / 2), dy = to.top + to.height / 2 - (from.top + from.height / 2);
  gsap.to(".lb-backdrop", { opacity: 0, duration: 0.45 });
  gsap.to([".lb-nav", ".lb-close"], { opacity: 0, duration: 0.2 });
  gsap.to(fig, {
    x: dx, y: dy, scale: to.width / from.width, rotation: +card.dataset.r, duration: RM ? 0.01 : 0.65, ease: "expo.inOut",
    onComplete: () => { lb.hidden = true; gsap.set(fig, { clearProps: "all" }); gsap.set(card, { opacity: 1 }); card.focus({ preventScroll: true }); },
  });
}
$$("[data-lb-close]").forEach((b) => b.addEventListener("click", closeLightbox));
$("#lbPrev").addEventListener("click", () => stepLightbox(-1));
$("#lbNext").addEventListener("click", () => stepLightbox(1));
(() => { // swipe
  let sx = null;
  $("#lightbox").addEventListener("pointerdown", (e) => (sx = e.clientX));
  $("#lightbox").addEventListener("pointerup", (e) => { if (sx !== null && Math.abs(e.clientX - sx) > 50) stepLightbox(e.clientX < sx ? 1 : -1); sx = null; });
})();

/* ---------------------------------------------------------
   LETTER
   --------------------------------------------------------- */
let letterBgTimer, letterTl;
function buildLetter() {
  $("#letterLines").innerHTML = CONFIG.letter.map((l) => `<p class="${l.cls || ""}">${l.text}</p>`).join("");
}
onOpen.letter = () => {
  // slow cross-fading photos behind everything
  const imgs = $$(".letter-bg img"); const files = ["glasses.jpg", "blue-light.jpg", "golden-hour.jpg", "late-night.jpg", "ski-smile.jpg", "train.jpg"];
  let k = 0, front = 0;
  const swap = () => {
    const img = imgs[front]; img.src = "images/thumb/" + files[k++ % files.length];
    gsap.fromTo(img, { opacity: 0, scale: 1.18 }, { opacity: 1, scale: 1.04, duration: 7, ease: "none" });
    gsap.to(imgs[1 - front], { opacity: 0, duration: 2.5 });
    front = 1 - front;
  };
  swap(); letterBgTimer = setInterval(swap, 6000);
  if (!state.done.letter) {
    gsap.from("#envelope", { y: 80, rotation: -8, opacity: 0, duration: 1.2, ease: "expo.out", delay: 0.4 });
  }
};
onClose.letter = () => clearInterval(letterBgTimer);

function openEnvelope() {
  const env = $("#envelope"); if (env.dataset.open) return; env.dataset.open = "1";
  Sound.pop(); Sound.noise(0.6, { from: 2000, to: 5000, gain: 0.12 });
  const tl = gsap.timeline();
  tl.to(".envelope-hint", { opacity: 0, duration: 0.3 })
    .to(".env-seal", { scale: 1.3, duration: 0.15 })
    .to(".env-seal", { scale: 0, rotation: 90, opacity: 0, duration: 0.3, ease: "back.in(2)" })
    .to(".env-flap", { rotationX: 180, transformPerspective: 900, duration: 0.8, ease: "power2.inOut" }, "-=.05")
    .set(".env-flap", { zIndex: 0 }, "-=.4")
    .to(".env-paper", { yPercent: -62, duration: 0.9, ease: "power3.out" })
    .to("#envelope", { y: 160, opacity: 0, duration: 0.7, ease: "power2.in" }, "+=.15")
    .add(showLetterSheet, "-=.3");
}
function showLetterSheet() {
  $("#envelopeWrap").hidden = true;
  const sheet = $("#letterSheet"); sheet.hidden = false;
  const lines = $$("#letterLines p");
  gsap.set("#letterEnd", { opacity: 0, y: 12 });
  letterTl = gsap.timeline({ onComplete: () => { state.done.letter = true; } });
  letterTl.fromTo(sheet, { opacity: 0, scale: 0.7, x: 0, xPercent: -50, yPercent: -50, y: 60, rotation: -3 }, { opacity: 1, scale: 1, y: 0, rotation: 0, duration: 1, ease: "expo.out" })
    .from(lines, { opacity: 0, y: 14, filter: "blur(8px)", duration: 1, ease: "power2.out", stagger: { each: 1.05, onStart() { Sound.bell(pick([659.3, 784, 880, 1046.5]), 0, 0.05, 0.9); const el = this.targets()[0]; const over = el.offsetTop + el.offsetHeight - (sheet.scrollTop + sheet.clientHeight) + 40; if (over > 0) sheet.scrollBy({ top: over, behavior: "smooth" }); } } }, "-=.3")
    .to("#letterEnd", { opacity: 1, y: 0, duration: 0.8, onStart: () => sheet.scrollTo({ top: sheet.scrollHeight, behavior: "smooth" }) }, "+=.4");
  if (RM) letterTl.progress(1);
  // tap the letter to skip ahead
  sheet.addEventListener("click", (e) => { if (!e.target.closest("button") && letterTl.progress() < 1) letterTl.progress(1); });
}
$("#envelope").addEventListener("click", openEnvelope);
$("#toGiftBtn").addEventListener("click", () => {
  state.done.letter = true;
  closeScene(() => openScene("gift", null));
});

/* ---------------------------------------------------------
   GIFT
   --------------------------------------------------------- */
const ICONS = {
  snow: '<svg viewBox="0 0 24 24"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 4l3 2 3-2M9 20l3-2 3 2"/></svg>',
  moon: '<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
  camera: '<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8.5 7l1.5-3h4l1.5 3"/><circle cx="12" cy="13.5" r="3.5"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20c-5-3.8-8.5-6.8-8.5-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8.5 2.5C20.5 13.2 17 16.2 12 20z"/></svg>',
};
function buildGift() {
  $("#promiseCards").innerHTML = CONFIG.promises.map((p) =>
    `<div class="promise ${p.last ? "promise-last" : ""}">${ICONS[p.icon]}<p>${p.html}</p></div>`).join("");
  const back = document.createElement("button"); back.className = "btn btn-glow"; back.textContent = "Back to our world";
  back.addEventListener("click", () => closeScene()); $("#giftReveal").appendChild(back);
  // background image path is relative to CSS file when set via var(); fix it for inline usage:
  $$(".promise").forEach((el, i) => el.style.setProperty("--bg", `url("${new URL("images/thumb/" + CONFIG.promises[i].bg, location.href).href}")`));
}
onOpen.gift = () => {
  if (state.done.gift) return;
  gsap.from("#giftbox", { y: -300, rotation: 20, duration: 1.1, ease: "bounce.out", delay: 0.4 });
  gsap.from(".gift-title", { opacity: 0, y: -20, duration: 1, delay: 0.3 });
  gsap.to(".gb-glow", { scale: 1.15, opacity: 0.7, duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
};
function clickGift() {
  const box = $("#giftbox"); if (box.dataset.opened) return;
  state.giftClicks++;
  const hint = $("#giftHint");
  if (state.giftClicks === 1) {
    Sound.thud(0.8); hint.textContent = "Hmm… try again";
    gsap.fromTo(box, { rotation: 0 }, { keyframes: { rotation: [-7, 7, -5, 5, 0] }, duration: 0.5, ease: "none" });
  } else if (state.giftClicks === 2) {
    Sound.thud(1.1); hint.textContent = "Almost…";
    gsap.timeline().to(box, { y: -26, scaleY: 1.05, duration: 0.18, ease: "power2.out" })
      .to(box, { y: 0, scaleY: 0.92, duration: 0.2, ease: "power2.in" })
      .to(box, { scaleY: 1, keyframes: { rotation: [-10, 10, -8, 8, -4, 0] }, duration: 0.55 });
  } else {
    box.dataset.opened = "1"; hint.textContent = "";
    const c = center(box);
    const tl = gsap.timeline();
    tl.to(box, { scaleY: 0.82, scaleX: 1.08, duration: 0.25, ease: "power2.in" })
      .add(() => {
        Sound.boom(); setTimeout(() => Sound.chime(), 120);
        FX.burst(c.x, c.y - 30, { count: 170, power: 900, gravity: 700 });
        FX.burst(c.x, c.y - 30, { count: 40, power: 400, shapes: ["heart"], colors: ["#FF9DC0", "#E8457A"], gravity: 300, size: [10, 18] });
      })
      .to(box, { scaleY: 1, scaleX: 1, duration: 0.5, ease: "elastic.out(1,.4)" })
      .to(".gb-lid", { y: -innerHeight * 0.6, x: 120, rotation: -40, duration: 1, ease: "power3.out" }, "<")
      .to(".gb-glow", { scale: 4, opacity: 1, duration: 0.6 }, "<")
      .to("#giftStage", { opacity: 0, duration: 0.6 }, "+=.1")
      .add(() => {
        state.done.gift = true;
        $("#giftStage").hidden = true; $("#giftReveal").hidden = false;
        const cards = $$(".promise");
        const froms = [{ x: -260, rotation: -25 }, { y: 240 }, { rotationY: -100, transformOrigin: "0 50%" }, { scale: 0.2, rotation: 12 }];
        gsap.from("#giftReveal h3", { opacity: 0, y: 30, filter: "blur(10px)", duration: 1 });
        cards.forEach((card, i) => gsap.from(card, { ...froms[i % froms.length], opacity: 0, duration: 1.1, ease: "expo.out", delay: 0.4 + i * 0.35, onStart: () => Sound.bell([784, 880, 1046.5, 1318.5][i], 0, 0.1, 1.2) }));
        gsap.from("#giftReveal .btn", { opacity: 0, y: 20, delay: 2.2, duration: 0.8 });
      });
  }
}
$("#giftbox").addEventListener("click", clickGift);

/* ---------------------------------------------------------
   THINGS I LOVE
   --------------------------------------------------------- */
const drifts = new Map();
function buildLoves() {
  CONFIG.loves.forEach((l, i) => {
    const b = document.createElement("button");
    b.className = "bubble"; b.textContent = l.word; b.dataset.i = i;
    b.addEventListener("click", () => openLove(b, i));
    b.addEventListener("pointerenter", (e) => { if (e.pointerType !== "touch") drifts.get(b)?.pause(); });
    b.addEventListener("pointerleave", () => drifts.get(b)?.resume());
    $("#bubbles").appendChild(b);
  });
}
function bubbleBounds(b) {
  const top = innerWidth < 760 ? 190 : 210, bottom = innerHeight - (innerWidth < 760 ? 200 : 180);
  return { minX: 16, maxX: Math.max(16, innerWidth - b.offsetWidth - 16), minY: top, maxY: Math.max(top + 10, bottom - b.offsetHeight) };
}
function drift(b) {
  const B = bubbleBounds(b);
  const tw = gsap.to(b, { x: rand(B.minX, B.maxX), y: rand(B.minY, B.maxY), rotation: rand(-6, 6), duration: rand(7, 12), ease: "sine.inOut", onComplete: () => drift(b) });
  drifts.set(b, tw);
}
onOpen.loves = () => {
  const bs = $$(".bubble");
  // lay them out on a loose grid first so nothing overlaps at the start
  const cols = innerWidth < 760 ? 2 : 4;
  bs.forEach((b, i) => {
    const B = bubbleBounds(b);
    const col = i % cols, row = Math.floor(i / cols), rows = Math.ceil(bs.length / cols);
    const x = B.minX + ((col + 0.5) / cols) * (innerWidth - 32) - b.offsetWidth / 2 + rand(-20, 20);
    const y = B.minY + ((row + 0.5) / rows) * (B.maxY - B.minY) + rand(-15, 15);
    gsap.set(b, { x: Math.min(Math.max(B.minX, x), B.maxX), y: Math.min(Math.max(B.minY, y), B.maxY) });
    gsap.from(b, { scale: 0, opacity: 0, duration: 0.9, ease: "back.out(2)", delay: 0.4 + i * 0.07 });
    if (!RM) setTimeout(() => drift(b), 1500 + i * 200);
  });
  gsap.from("#scene-loves .scene-head > *", { opacity: 0, y: 20, stagger: 0.15, duration: 0.9, delay: 0.3 });
};
onClose.loves = () => { drifts.forEach((t) => t.kill()); drifts.clear(); };

let noteTimer;
function openLove(b, i) {
  const l = CONFIG.loves[i];
  const c = center(b);
  Sound.pop(); setTimeout(() => Sound.bell(pick([1046.5, 1174.7, 1318.5, 1568]), 0, 0.1, 1), 60);
  FX.burst(c.x, c.y, { count: 24, power: 260, shapes: ["heart", "dot"], gravity: 250, size: [6, 11] });
  gsap.fromTo(b, { scale: 1.3 }, { scale: 1, duration: 0.6, ease: "elastic.out(1,.4)" });
  b.classList.add("is-open");
  const note = $("#loveNote"); $("#loveNoteWord").textContent = l.word; $("#loveNoteText").textContent = l.note;
  note.hidden = false;
  gsap.fromTo(note, { opacity: 0, x: 0, xPercent: -50, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2)" });
  clearTimeout(noteTimer);
  noteTimer = setTimeout(() => gsap.to(note, { opacity: 0, y: 20, duration: 0.4, onComplete: () => (note.hidden = true) }), 4200);

  state.opened.add(i);
  const need = CONFIG.lovesToUnlock, n = state.opened.size;
  if (!state.done.loves) {
    $("#lovesCount").textContent = n < need ? `${n} of ${need} opened. Keep going.` : "That's five.";
    if (n >= need) {
      state.done.loves = true;
      setTimeout(() => {
        const u = $("#unlock"); u.hidden = false;
        gsap.from(u, { opacity: 0, duration: 0.8 });
        gsap.from("#unlock p", { opacity: 0, y: 20, filter: "blur(10px)", duration: 1.2, delay: 0.2 });
        gsap.from("#unlock .btn", { opacity: 0, scale: 0.8, duration: 0.8, delay: 1, ease: "back.out(2)" });
        Sound.chime();
        setTimeout(() => $("#unlock .btn").focus({ preventScroll: true }), 1100);
      }, 2400);
    }
  }
}

/* ---------------------------------------------------------
   FINALE — the cake
   --------------------------------------------------------- */
async function startFinale() {
  parallaxOn = false;
  const fin = $("#finale"); fin.hidden = false;
  $("#bigCake").innerHTML = cakeSVG(4);
  gsap.set(["#finaleWait", "#finaleLast", "#cakeStage"], { opacity: 0 });
  gsap.fromTo(fin, { opacity: 0 }, { opacity: 1, duration: 2.2, ease: "power1.inOut" });
  gsap.to(Sky, { starAlpha: 0.35, duration: 2.5 });
  gsap.to("#hub", { opacity: 0, duration: 2.5, onComplete: () => ($("#hub").hidden = true) });
  Sound.bell(261.6, 0.4, 0.12, 3); Sound.bell(329.6, 0.4, 0.08, 3);
  await wait(2000);
  await gsap.fromTo("#finaleWait", { opacity: 0, y: 20, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2 }).then();
  await wait(900);
  await gsap.to("#finaleWait", { opacity: 0, y: -20, filter: "blur(10px)", duration: 0.8 }).then();
  await gsap.fromTo("#finaleLast", { opacity: 0, y: 20, filter: "blur(10px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2 }).then();
  await wait(1100);
  await gsap.to("#finaleLast", { opacity: 0, y: -20, filter: "blur(10px)", duration: 0.8 }).then();
  $("#finaleWait").hidden = $("#finaleLast").hidden = true;

  gsap.set("#cakeStage", { opacity: 1 });
  gsap.set(["#wishText", "#wishActions"], { opacity: 0, y: 14 });
  const title = $("#finaleTitle"); const chars = splitChars(title);
  gsap.from(chars, { opacity: 0, y: 40, filter: "blur(10px)", stagger: 0.05, duration: 1, ease: "expo.out" });
  await gsap.from("#bigCake", { y: 120, opacity: 0, scale: 0.8, duration: 1.3, ease: "expo.out", delay: 0.4 }).then();
  const root = $("#bigCake");
  for (let i = 0; i < 4; i++) {
    lightCandle(root, i); Sound.bell([523.3, 659.3, 784, 1046.5][i], 0, 0.14, 1.6);
    const f = center($$(".flame-wrap", root)[i]);
    FX.burst(f.x, f.y, { count: 14, power: 140, shapes: ["dot"], colors: ["#FFCF7A", "#FFF3D1"], gravity: 150, size: [3, 6] });
    await wait(420);
  }
  gsap.to(["#wishText", "#wishActions"], { opacity: 1, y: 0, duration: 0.9, stagger: 0.25 });
  setTimeout(() => $("#blowTapBtn").focus({ preventScroll: true }), 900);
}

let blown = false;
async function blowOut() {
  if (blown) return; blown = true;
  Sound.wind();
  gsap.to("#wishActions", { opacity: 0, y: 10, duration: 0.4, onComplete: () => ($("#wishActions").style.visibility = "hidden") });
  const flames = $$("#bigCake .flame-wrap");
  for (const [i, f] of flames.entries()) {
    const c = center(f);
    gsap.to(f, { skewX: -35, scaleY: 0, attr: { opacity: 0 }, duration: 0.35, delay: i * 0.12, transformOrigin: "50% 100%", ease: "power2.in",
      onComplete: () => { f.classList.remove("is-lit"); FX.smoke(c.x, c.y + 10); } });
  }
  await wait(900);
  $("#finale").classList.add("is-dark");
  $("#wishText").textContent = "Wish sent.";
  await wait(900);
  celebrate();
}

function celebrate() {
  const cx = innerWidth / 2, cy = innerHeight / 2;
  Sound.boom();
  const songLen = Sound.happyBirthday();
  $("#finale").classList.remove("is-dark");
  gsap.fromTo("#finale", { backgroundColor: "rgba(255,207,122,.35)" }, { backgroundColor: "rgba(0,0,0,0)", duration: 1.2 });
  FX.burst(cx, cy, { count: 220, power: 1100, gravity: 650 });
  setTimeout(() => FX.burst(innerWidth * 0.15, innerHeight, { count: 90, power: 1100, angle: -Math.PI / 2.6, spread: 0.7 }), 350);
  setTimeout(() => FX.burst(innerWidth * 0.85, innerHeight, { count: 90, power: 1100, angle: -Math.PI + Math.PI / 2.6, spread: 0.7 }), 600);
  FX.rain(6, 60);
  flyPhotos();
  gsap.fromTo("#bigCake", { scale: 1 }, { scale: 1.06, duration: 0.25, yoyo: true, repeat: 1 });
  setTimeout(toEnding, Math.max(7500, songLen * 1000 - 3500));
}
function flyPhotos() {
  const box = $("#flyers");
  const files = CONFIG.memories.map((m) => m.file);
  files.slice(0, RM ? 4 : 14).forEach((f, i) => {
    const d = document.createElement("div"); d.className = "flyer";
    d.innerHTML = `<img src="images/thumb/${f}" alt="">`; box.appendChild(d);
    const fromLeft = i % 2 === 0;
    const sx = fromLeft ? -140 : innerWidth + 20, sy = rand(innerHeight * 0.3, innerHeight + 60);
    const ex = fromLeft ? innerWidth + 140 : -160, ey = rand(-200, innerHeight * 0.4);
    gsap.fromTo(d, { x: sx, y: sy, rotation: rand(-40, 40), scale: rand(0.7, 1.15) },
      { x: ex, y: ey, rotation: rand(-30, 30), duration: rand(4, 6.5), delay: 0.3 + i * 0.35, ease: "power1.inOut", onComplete: () => d.remove() });
  });
}

/* ---------------------------------------------------------
   ENDING
   --------------------------------------------------------- */
async function toEnding() {
  const end = $("#ending");
  gsap.to("#finale", { opacity: 0, duration: 1.4, onComplete: () => ($("#finale").hidden = true) });
  gsap.to(Sky, { starAlpha: 0.25, snowAlpha: 1, duration: 3 });
  $("#hub").hidden = true;
  end.hidden = false;
  gsap.set("[data-end]", { opacity: 0, y: 24 });
  gsap.fromTo(end, { opacity: 0 }, { opacity: 1, duration: 1.6, delay: 0.6 });
  gsap.fromTo("#endPhoto", { y: 80, rotation: -12, scale: 0.85, opacity: 0 }, { y: 0, rotation: -3, scale: 1, opacity: 1, duration: 2, ease: "expo.out", delay: 1 });
  gsap.fromTo("#endPhoto img", { scale: 1.15 }, { scale: 1, duration: 12, ease: "none", delay: 1 });
  const items = $$("[data-end]");
  const delays = [2, 3.2, 4.6, 6.2, 8];
  items.forEach((el, i) => gsap.to(el, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.3, ease: "power3.out", delay: delays[i] ?? 8 + i,
    onStart: () => { const r = el.getBoundingClientRect(); if (r.bottom > innerHeight - 20) end.scrollBy({ top: r.bottom - innerHeight + 60, behavior: "smooth" }); } }));
  setTimeout(() => $("#ofCourseBtn").focus({ preventScroll: true }), 8800);
}
$("#ofCourseBtn").addEventListener("click", (e) => {
  const c = center(e.currentTarget);
  Sound.chime(); [523.3, 659.3, 784, 1046.5].forEach((f, i) => Sound.bell(f, i * 0.09, 0.12, 2));
  FX.burst(c.x, c.y, { count: 90, power: 700, shapes: ["heart"], colors: ["#FF9DC0", "#E8457A", "#FBF5EA"], gravity: 500, size: [10, 18] });
  FX.rain(4, 50);
  gsap.to(".end-question", { opacity: 0, y: -10, duration: 0.4, onComplete: () => {
    $(".end-question").hidden = true;
    const k = $("#endKnew"); k.hidden = false;
    gsap.fromTo(k, { opacity: 0, scale: 0.4, rotation: -8 }, { opacity: 1, scale: 1, rotation: -3, duration: 0.9, ease: "back.out(2.4)" });
    setTimeout(() => { const r = $("#replayBtn"); r.hidden = false; gsap.from(r, { opacity: 0, duration: 1 }); }, 2500);
  } });
});
$("#replayBtn").addEventListener("click", () => location.reload());

/* ---------------------------------------------------------
   BOOT
   --------------------------------------------------------- */
function applyName() {
  document.title = `For ${CONFIG.name}`;
  $("#finaleTitle").textContent = `Happy birthday, ${CONFIG.name}`;
  $("#endTitle").textContent = `Happy birthday, ${CONFIG.name}`;
  $(".env-paper-text").textContent = `for ${CONFIG.name}`;
}

function boot() {
  applyName();
  Sky.init(); FX.init();
  buildHub(); buildMemories(); buildLetter(); buildGift(); buildLoves();
  introIn();
  $("#enterBtn").addEventListener("click", enterWorld, { once: true });
  $("#blowTapBtn").addEventListener("click", blowOut);
  $("#soundToggle").addEventListener("click", (e) => {
    const on = e.currentTarget.getAttribute("aria-pressed") !== "true";
    e.currentTarget.setAttribute("aria-pressed", String(on));
    e.currentTarget.setAttribute("aria-label", on ? "Turn sound off" : "Turn sound on");
    Sound.setOn(on);
  });
  addEventListener("keydown", (e) => {
    if (lbOpen) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") stepLightbox(1);
      if (e.key === "ArrowLeft") stepLightbox(-1);
      return;
    }
    if (e.key === "Escape" && state.current) closeScene();
  });
  // warm up the big photos in the background
  addEventListener("load", () => setTimeout(() => CONFIG.memories.forEach((m) => { const i = new Image(); i.src = "images/full/" + m.file; }), 1500));
}
boot();
