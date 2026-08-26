/* ════════════════════════════════════════════
   AI-CURSUS SINT-REMBERT — STYLESHEET
   Volledige design: Layout, Colors, Typography
   ════════════════════════════════════════════ */

:root {
  --blue: #0A1FA8;
  --green: #7FE000;
  --orange: #FF9F43;
  --red: #e02020;
  --text: #1e293b;
  --muted: #64748b;
  --gray: #cbd5e1;
  --off: #f1f5f9;
  --white: #ffffff;
  --radius: 12px;
  --rsm: 8px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { font-family: 'Nunito', sans-serif; color: var(--text); background: var(--off); }
body { line-height: 1.6; }

a { color: var(--blue); text-decoration: none; }
a:hover { text-decoration: underline; }

button { font-family: inherit; cursor: pointer; border: none; }

/* ════════════════════════════════════════════
   LAYOUT — App Grid
   ════════════════════════════════════════════ */

#app {
  display: grid;
  grid-template-columns: 340px 1fr;
  height: 100vh;
  overflow: hidden;
}

#sidebar {
  background: white;
  border-right: 1px solid var(--gray);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 24px 20px;
  gap: 28px;
}

#main {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: var(--off);
}

.view { display: none; }
.view.active { display: block; }

/* ════════════════════════════════════════════
   SIDEBAR
   ════════════════════════════════════════════ */

.sb-logo {
  padding-bottom: 20px;
  border-bottom: 2px solid var(--gray);
}

.sb-badge {
  display: inline-block;
  background: var(--blue);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.sb-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: 18px;
  color: var(--blue);
  line-height: 1.2;
  margin-bottom: 6px;
}

.sb-title em {
  color: var(--green);
  font-style: normal;
}

.sb-sub {
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
}

.prog-wrap {
  padding: 16px;
  background: var(--off);
  border-radius: var(--rsm);
}

.prog-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.prog-track {
  width: 100%;
  height: 6px;
  background: var(--gray);
  border-radius: 3px;
  overflow: hidden;
}

.prog-fill {
  height: 100%;
  background: var(--green);
  transition: width 0.3s ease;
}

.nav-sec {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-lbl {
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  color: var(--muted);
  letter-spacing: 1px;
  padding: 0 8px;
}

.ni {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--rsm);
  background: transparent;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
}

.ni:hover { background: var(--off); }
.ni.active { border-color: var(--green); background: rgba(127,224,0,0.1); }
.ni.done { border-color: var(--green); }
.ni.locked { opacity: 0.5; cursor: not-allowed; }
.ni.available { border-color: var(--blue); }

.ni-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.ni-info {
  flex: 1;
  min-width: 0;
}

.ni-title {
  font-size: 13px;
  font-weight: 800;
  color: var(--text);
}

.ni-sub {
  font-size: 11px;
  color: var(--muted);
  font-weight: 600;
}

.ni-badge {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 800;
  color: var(--green);
}

.sb-bot {
  margin-top: auto;
  padding-top: 20px;
  border-top: 2px solid var(--gray);
}

.uc {
  display: flex;
  align-items: center;
  gap: 10px;
}

.av {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--blue);
  color: white;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.un-inp {
  flex: 1;
  background: var(--off);
  border: 1px solid var(--gray);
  padding: 8px 10px;
  border-radius: var(--rsm);
  font-size: 12px;
  font-weight: 600;
}

.un-inp:focus { outline: none; border-color: var(--blue); }

.eh {
  font-size: 10px;
  color: var(--muted);
  font-weight: 600;
  margin-top: 4px;
}

/* ════════════════════════════════════════════
   MAIN CONTENT
   ════════════════════════════════════════════ */

.mc-content {
  padding: 40px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

/* ════════════════════════════════════════════
   HERO SECTION
   ════════════════════════════════════════════ */

.hero {
  background: linear-gradient(135deg, var(--blue) 0%, #3a2b9e 55%, #6d28d9 100%);
  color: white;
  padding: 60px 40px;
  text-align: center;
  margin-bottom: 40px;
}

.hero-ey {
  display: inline-block;
  background: rgba(127,224,0,0.15);
  border: 1px solid var(--green);
  color: var(--green);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.hero-h1 {
  font-family: 'Archivo Black', sans-serif;
  font-size: 48px;
  text-transform: uppercase;
  line-height: 1.1;
  margin-bottom: 20px;
}

.hero-h1 .g { color: var(--green); }

.hero-p {
  font-size: 16px;
  line-height: 1.8;
  max-width: 700px;
  margin: 0 auto 32px;
  opacity: 0.95;
  font-weight: 600;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-top: 32px;
}

.hs {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--rsm);
  padding: 16px;
}

.hs-num {
  font-size: 28px;
  display: block;
  margin-bottom: 8px;
}

.hs-lbl {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

/* ════════════════════════════════════════════
   SECTIONS (sw = section wrap)
   ════════════════════════════════════════════ */

.sw {
  background: white;
  border-radius: var(--radius);
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 2px 8px rgba(10,31,168,0.06);
}

.sw-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: 28px;
  color: var(--blue);
  text-transform: uppercase;
  margin-bottom: 8px;
  line-height: 1.1;
}

.sw-title em {
  color: var(--green);
  font-style: normal;
}

.sw-sub {
  font-size: 16px;
  color: var(--muted);
  font-weight: 600;
  margin-bottom: 28px;
}

/* ════════════════════════════════════════════
   VISION BOX
   ════════════════════════════════════════════ */

.vision-box {
  background: var(--off);
  border-radius: var(--rsm);
  padding: 24px;
  border-left: 4px solid var(--blue);
}

.vision-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: 14px;
  color: var(--blue);
  text-transform: uppercase;
  margin-bottom: 12px;
}

.vision-text {
  font-size: 15px;
  line-height: 1.8;
  color: #3d4f8a;
  font-weight: 600;
}

.vision-text strong { color: var(--blue); }

/* ════════════════════════════════════════════
   REGELS (SR-ROW)
   ════════════════════════════════════════════ */

.sr-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 28px;
}

.sr-box {
  border-radius: var(--rsm);
  padding: 20px;
  border: 2px solid var(--gray);
}

.sr-box.wel {
  background: rgba(127,224,0,0.08);
  border-color: var(--green);
}

.sr-box.niet {
  background: rgba(224,32,32,0.08);
  border-color: var(--red);
}

.sr-box-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: 13px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.sr-box.wel .sr-box-title { color: var(--green); }
.sr-box.niet .sr-box-title { color: var(--red); }

.sri {
  font-size: 13px;
  color: #3d4f8a;
  font-weight: 700;
  line-height: 1.8;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.sr-chk, .sr-x {
  flex-shrink: 0;
  font-weight: 900;
}

.sr-chk { color: var(--green); }
.sr-x { color: var(--red); }

/* ════════════════════════════════════════════
   MODULS GRID (mods-grid)
   ════════════════════════════════════════════ */

.mods-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 28px;
}

.mc {
  background: white;
  border: 2px solid var(--gray);
  border-radius: var(--radius);
  padding: 28px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mc:hover:not(.locked) {
  border-color: var(--blue);
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(10,31,168,0.12);
}

.mc.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.mc.done {
  border-color: var(--green);
  background: rgba(127,224,0,0.05);
}

.mc.optional-mod {
  border-color: var(--orange);
  background: rgba(255,159,67,0.05);
}

.mc-badge {
  display: inline-block;
  background: var(--blue);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.mc.optional-mod .mc-badge {
  background: var(--orange);
}

.mc-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.mc-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: 16px;
  color: var(--blue);
  text-transform: uppercase;
  margin-bottom: 10px;
  line-height: 1.2;
}

.mc-desc {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.7;
  font-weight: 600;
  margin-bottom: 20px;
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mc-meta {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--gray);
  font-size: 12px;
  font-weight: 700;
}

.mc-dur { color: var(--muted); }
.mc-stat { color: var(--blue); }
.mc-stat.locked { color: #64748b; }
.mc-stat.ok { color: var(--green); }
.mc-stat.opt { color: var(--orange); }

/* ════════════════════════════════════════════
   BUTTONS (sr-btn)
   ════════════════════════════════════════════ */

.sr-btn {
  padding: 12px 20px;
  border-radius: var(--rsm);
  font-weight: 800;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.sr-btn.g {
  background: var(--green);
  color: var(--blue);
}

.sr-btn.g:hover:not([disabled]) {
  background: #5fd100;
  transform: scale(1.02);
}

.sr-btn.b {
  background: white;
  color: var(--blue);
  border: 2px solid var(--gray);
}

.sr-btn.b:hover:not([disabled]) {
  border-color: var(--blue);
  background: var(--off);
}

.sr-btn.o {
  background: var(--orange);
  color: white;
}

.sr-btn.o:hover:not([disabled]) {
  background: #ff8b1f;
}

.sr-btn[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ════════════════════════════════════════════
   PROMO BOX & MINI
   ════════════════════════════════════════════ */

.promo-box {
  background: linear-gradient(135deg, var(--blue) 0%, #3a2b9e 100%);
  border-radius: var(--radius);
  padding: 40px;
  color: white;
  margin-top: 40px;
  margin-bottom: 40px;
}

.promo-ey {
  display: inline-block;
  background: rgba(127,224,0,0.15);
  border: 1px solid var(--green);
  color: var(--green);
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.promo-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: 26px;
  text-transform: uppercase;
  line-height: 1.1;
  margin-bottom: 12px;
}

.promo-title em { color: var(--green); font-style: normal; }

.promo-sub {
  font-size: 15px;
  line-height: 1.7;
  opacity: 0.9;
  margin-bottom: 28px;
  font-weight: 600;
}

.promo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 28px;
}

.promo-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: var(--rsm);
  padding: 20px;
}

.promo-icon {
  font-size: 28px;
  margin-bottom: 12px;
}

.promo-date {
  font-size: 12px;
  opacity: 0.7;
  font-weight: 700;
  margin-bottom: 8px;
}

.promo-card-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: 14px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.promo-card-desc {
  font-size: 13px;
  line-height: 1.6;
  opacity: 0.9;
  font-weight: 600;
}

.promo-btn {
  display: inline-block;
  background: var(--green);
  color: var(--blue);
  padding: 14px 28px;
  border-radius: var(--rsm);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 13px;
  transition: all 0.2s ease;
}

.promo-btn:hover {
  background: #5fd100;
  transform: scale(1.02);
}

.promo-mini {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(127,224,0,0.1);
  border: 1px solid var(--green);
  border-radius: var(--rsm);
  padding: 16px;
  margin: 20px 0;
}

.promo-mini-icon { font-size: 20px; flex-shrink: 0; }
.promo-mini-title { font-family: 'Archivo Black', sans-serif; font-size: 11px; color: var(--green); text-transform: uppercase; letter-spacing: 1px; }
.promo-mini-desc { font-size: 13px; color: #3d4f8a; font-weight: 600; margin-top: 2px; }
.promo-mini-btn { display: inline-block; background: var(--green); color: var(--blue); padding: 6px 12px; border-radius: 4px; font-weight: 800; font-size: 10px; text-transform: uppercase; flex-shrink: 0; }
.promo-mini-btn:hover { background: #5fd100; }

/* ════════════════════════════════════════════
   MODULE HEADER (mh)
   ════════════════════════════════════════════ */

.mh {
  background: white;
  border-bottom: 1px solid var(--gray);
  padding: 24px 40px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.bk {
  background: white;
  border: 1px solid var(--gray);
  padding: 8px 14px;
  border-radius: var(--rsm);
  font-size: 12px;
  font-weight: 800;
  color: var(--blue);
  cursor: pointer;
  transition: all 0.2s ease;
}

.bk:hover { border-color: var(--blue); background: var(--off); }

.mh-info { flex: 1; }
.mh-num { font-size: 11px; color: var(--muted); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.mh-title { font-family: 'Archivo Black', sans-serif; font-size: 18px; color: var(--blue); text-transform: uppercase; }
.mh-title em { color: var(--green); font-style: normal; }

.mh.opt-mh { background: rgba(255,159,67,0.05); border-color: var(--orange); }

.dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gray);
  transition: all 0.2s ease;
}

.dot.active { background: var(--blue); transform: scale(1.3); }
.dot.done { background: var(--green); }

/* ════════════════════════════════════════════
   STEP CONTENT
   ════════════════════════════════════════════ */

.s-badge {
  display: inline-block;
  background: var(--blue);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.ch2 {
  font-family: 'Archivo Black', sans-serif;
  font-size: 26px;
  color: var(--blue);
  text-transform: uppercase;
  line-height: 1.1;
  margin-bottom: 20px;
}

.ch2 em { color: var(--green); font-style: normal; }

.ch3 {
  font-family: 'Archivo Black', sans-serif;
  font-size: 14px;
  color: var(--blue);
  text-transform: uppercase;
  margin-top: 24px;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.cp {
  font-size: 15px;
  color: #3d4f8a;
  line-height: 1.8;
  font-weight: 600;
  margin-bottom: 16px;
}

/* ════════════════════════════════════════════
   INFO BOXES (ib = info box)
   ════════════════════════════════════════════ */

.ib {
  border-radius: var(--rsm);
  padding: 16px;
  margin: 20px 0;
  border-left: 4px solid;
  display: flex;
  gap: 12px;
}

.ib.warn {
  background: rgba(255,159,67,0.1);
  border-color: var(--orange);
}

.ib-t {
  font-family: 'Archivo Black', sans-serif;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 900;
  color: var(--orange);
  flex-shrink: 0;
}

.ib-b {
  font-size: 13px;
  color: #3d4f8a;
  line-height: 1.6;
  font-weight: 600;
}

/* ════════════════════════════════════════════
   GRID2 (zwei kolommen)
   ════════════════════════════════════════════ */

.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.pane-ok, .pane-nok {
  border-radius: var(--rsm);
  padding: 20px;
  border: 2px solid var(--gray);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pane-ok { background: rgba(127,224,0,0.08); border-color: var(--green); }
.pane-nok { background: rgba(224,32,32,0.08); border-color: var(--red); }

.lijst-ok, .lijst-nok { font-size: 13px; font-weight: 700; line-height: 1.8; color: #3d4f8a; }

.lijst-h-ok {
  font-family: 'Archivo Black', sans-serif;
  font-size: 12px;
  color: var(--green);
  text-transform: uppercase;
  font-weight: 900;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(127,224,0,0.2);
}

.lijst-h-nok {
  font-family: 'Archivo Black', sans-serif;
  font-size: 12px;
  color: var(--red);
  text-transform: uppercase;
  font-weight: 900;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(224,32,32,0.2);
}

/* ════════════════════════════════════════════
   REFLECTIE & STELLINGEN
   ════════════════════════════════════════════ */

.sr-ta {
  width: 100%;
  min-height: 120px;
  padding: 14px;
  border: 2px solid var(--gray);
  border-radius: var(--rsm);
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  resize: vertical;
  margin: 16px 0;
}

.sr-ta:focus { outline: none; border-color: var(--blue); }

.stl-card {
  background: var(--off);
  border-radius: var(--rsm);
  padding: 16px;
  margin-bottom: 12px;
}

.stl-q {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 12px;
  line-height: 1.6;
}

.stl-opts {
  display: flex;
  gap: 8px;
}

.stl-btn {
  flex: 1;
  background: white;
  border: 2px solid var(--gray);
  padding: 8px 12px;
  border-radius: var(--rsm);
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.stl-btn:hover:not(.active) { border-color: var(--blue); }
.stl-btn.active { background: var(--green); color: var(--blue); border-color: var(--green); }

/* ════════════════════════════════════════════
   NAVIGATION WRAP (nw)
   ════════════════════════════════════════════ */

.nw {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid var(--gray);
}

.nh {
  font-size: 11px;
  color: var(--muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ════════════════════════════════════════════
   QUIZ INTERFACE
   ════════════════════════════════════════════ */

.qc {
  background: white;
  border: 2px solid var(--gray);
  border-radius: var(--radius);
  padding: 24px;
  margin: 20px 0;
}

.qh {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--gray);
}

.qi { font-size: 32px; }

.qt {
  font-family: 'Archivo Black', sans-serif;
  font-size: 14px;
  color: var(--blue);
  text-transform: uppercase;
  font-weight: 900;
}

.qs {
  font-size: 12px;
  color: var(--muted);
  font-weight: 700;
  margin-top: 2px;
}

.qb {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.qq {
  font-size: 15px;
  font-weight: 800;
  color: var(--text);
}

.opts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.opt {
  background: white;
  border: 2px solid var(--gray);
  border-radius: var(--rsm);
  padding: 12px 16px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  transition: all 0.2s ease;
}

.opt:hover:not([disabled]) { border-color: var(--blue); background: var(--off); }
.opt[disabled] { opacity: 0.7; cursor: not-allowed; }

.opt.cor { background: rgba(127,224,0,0.15); border-color: var(--green); color: #2d6a00; }
.opt.wr { background: rgba(224,32,32,0.15); border-color: var(--red); color: var(--red); }

.ol {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--blue);
  color: white;
  border-radius: 50%;
  font-weight: 900;
  flex-shrink: 0;
  font-size: 12px;
}

.fb {
  display: none;
  padding: 10px 12px;
  border-radius: var(--rsm);
  font-size: 12px;
  font-weight: 700;
}

.fb.show { display: block; }
.fb.ok { background: rgba(127,224,0,0.15); color: #2d6a00; }
.fb.nok { background: rgba(224,32,32,0.15); color: var(--red); }

.q-res {
  display: none;
  background: white;
  border: 2px solid var(--gray);
  border-radius: var(--rsm);
  padding: 24px;
  text-align: center;
  margin-top: 20px;
}

.q-res.show { display: block; }

.q-score {
  font-family: 'Archivo Black', sans-serif;
  font-size: 48px;
  font-weight: 900;
  margin-bottom: 12px;
}

.q-score.pass { color: var(--green); }
.q-score.fail { color: var(--red); }

.q-msg {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
}

.q-next {
  background: var(--green);
  color: var(--blue);
  padding: 12px 24px;
  border-radius: var(--rsm);
  font-weight: 800;
  font-size: 13px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
}

.q-next:hover:not([disabled]) { background: #5fd100; }
.q-next[disabled] { opacity: 0.5; cursor: not-allowed; }

/* ════════════════════════════════════════════
   YOUTUBE EMBEDS
   ════════════════════════════════════════════ */

.yt-wrap {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  border-radius: var(--rsm);
  margin: 20px 0;
}

.yt-wrap iframe {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* ════════════════════════════════════════════
   DOE-OPDRACHTEN
   ════════════════════════════════════════════ */

.ai-card {
  background: white;
  border: 2px solid var(--gray);
  padding: 16px;
  border-radius: var(--rsm);
  cursor: pointer;
  font-weight: 700;
  font-size: 13px;
  text-align: center;
  transition: all 0.2s ease;
  margin-bottom: 10px;
}

.ai-card:hover { border-color: var(--blue); transform: translateX(4px); }

.lm-card {
  background: white;
  border: 2px solid var(--gray);
  border-radius: var(--rsm);
  padding: 16px;
  margin-bottom: 16px;
}

.lm-q {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 12px;
  line-height: 1.6;
}

.lm-opts {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.lm-btn {
  background: white;
  border: 2px solid var(--gray);
  padding: 8px 16px;
  border-radius: var(--rsm);
  font-weight: 800;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.lm-btn:hover:not([disabled]) { border-color: var(--blue); }
.lm-btn[disabled] { opacity: 0.7; cursor: not-allowed; }
.lm-btn.correct { background: var(--green); color: var(--blue); border-color: var(--green); }
.lm-btn.wrong { background: var(--red); color: white; border-color: var(--red); }

.lm-fb {
  display: none;
  margin-top: 12px;
  padding: 10px 12px;
  background: var(--off);
  border-radius: var(--rsm);
  font-size: 12px;
  font-weight: 700;
  color: #3d4f8a;
}

.lm-fb.show { display: block; }

/* ════════════════════════════════════════════
   DISCUSSIE KAARTEN
   ════════════════════════════════════════════ */

.disc-card {
  background: var(--off);
  border-radius: var(--rsm);
  padding: 20px;
  margin-bottom: 16px;
  border-left: 4px solid var(--blue);
}

.disc-q {
  font-weight: 800;
  font-size: 14px;
  color: var(--text);
  margin-bottom: 12px;
}

.disc-a {
  font-size: 13px;
  color: #3d4f8a;
  line-height: 1.7;
  font-weight: 600;
}

/* ════════════════════════════════════════════
   CERTIFICAAT
   ════════════════════════════════════════════ */

#cert-view {
  display: none;
  padding: 40px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.cert-wrap {
  background: white;
  border-radius: var(--radius);
  padding: 40px;
  box-shadow: 0 8px 24px rgba(10,31,168,0.12);
}

.cert-intro {
  text-align: center;
  margin-bottom: 32px;
}

.cert-fire { font-size: 48px; margin-bottom: 12px; }

.ss-box {
  background: var(--off);
  border-radius: var(--rsm);
  padding: 24px;
  margin-bottom: 24px;
  border-left: 4px solid var(--blue);
}

.ss-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: 14px;
  color: var(--blue);
  text-transform: uppercase;
  margin-bottom: 16px;
}

.ss-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ss-step {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.ss-step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--blue);
  color: white;
  border-radius: 50%;
  font-weight: 900;
  flex-shrink: 0;
}

.ss-step-text {
  font-size: 13px;
  color: #3d4f8a;
  line-height: 1.6;
  font-weight: 600;
}

.cert-box {
  background: linear-gradient(135deg, #fefdfb 0%, #f9f5f0 100%);
  border: 3px solid var(--blue);
  border-radius: var(--radius);
  padding: 60px 40px;
  text-align: center;
  margin: 32px 0;
  position: relative;
  page-break-inside: avoid;
}

.cert-wm {
  position: absolute;
  top: -20px;
  right: 20px;
  font-size: 80px;
  opacity: 0.05;
  z-index: 0;
}

.cert-school {
  font-family: 'Archivo Black', sans-serif;
  font-size: 14px;
  color: var(--blue);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.cert-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: 32px;
  color: var(--blue);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.cert-title em { color: var(--green); font-style: normal; }

.cert-dec {
  font-size: 13px;
  color: var(--text);
  font-weight: 700;
  margin: 16px 0 8px;
}

.cert-name {
  font-size: 24px;
  font-weight: 900;
  color: var(--blue);
  margin: 16px 0;
}

.cert-desc {
  font-size: 12px;
  color: #3d4f8a;
  line-height: 1.7;
  font-weight: 600;
  max-width: 600px;
  margin: 20px auto;
  text-align: left;
}

.cert-comps {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 28px 0;
  text-align: left;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.cert-comp {
  font-size: 11px;
  color: #3d4f8a;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ck { color: var(--green); font-weight: 900; }

.cert-sr {
  font-family: 'Archivo Black', sans-serif;
  font-size: 24px;
  color: var(--blue);
  margin: 24px 0;
  letter-spacing: 2px;
}

.cert-sr span { font-weight: 700; }
.cert-sr em { font-style: normal; color: var(--green); }

.cert-meta {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--gray);
  font-size: 11px;
}

.cm-i { text-align: center; }
.cm-lbl { font-weight: 900; color: var(--muted); text-transform: uppercase; }
.cm-val { color: var(--text); font-weight: 800; margin-top: 4px; }

.cert-warn {
  background: rgba(224,32,32,0.1);
  border: 1px solid var(--red);
  border-radius: var(--rsm);
  padding: 12px;
  font-size: 12px;
  color: var(--red);
  font-weight: 700;
  margin-top: 16px;
  text-align: center;
}

.print-btn {
  background: var(--blue);
  color: white;
  padding: 12px 24px;
  border-radius: var(--rsm);
  font-weight: 800;
  font-size: 13px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
}

.print-btn:hover:not([disabled]) { background: #1a2fa8; }
.print-btn[disabled] { opacity: 0.5; cursor: not-allowed; }

.summary-btn {
  background: var(--green);
  color: var(--blue);
  padding: 12px 24px;
  border-radius: var(--rsm);
  font-weight: 800;
  font-size: 13px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
}

.summary-btn:hover { background: #5fd100; }

#cert-dl-info {
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  margin: 16px 0;
  min-height: 20px;
}

/* ════════════════════════════════════════════
   STARTTEST RESULT
   ════════════════════════════════════════════ */

.tr-box {
  background: white;
  border: 2px solid var(--gray);
  border-radius: var(--rsm);
  padding: 28px;
  text-align: center;
  margin: 20px 0;
}

.tr-box.pass { border-color: var(--green); background: rgba(127,224,0,0.05); }
.tr-box.fail { border-color: var(--red); background: rgba(224,32,32,0.05); }

.tr-score {
  font-family: 'Archivo Black', sans-serif;
  font-size: 56px;
  font-weight: 900;
  margin-bottom: 12px;
}

.tr-score.pass { color: var(--green); }
.tr-score.fail { color: var(--red); }

.tr-msg {
  font-size: 16px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 12px;
}

.tr-sub {
  font-size: 13px;
  color: #3d4f8a;
  line-height: 1.6;
  font-weight: 600;
  margin-bottom: 20px;
}

.st-pass { color: var(--green); }
.st-fail { color: var(--red); }

/* ════════════════════════════════════════════
   PROMPT BUILDER
   ════════════════════════════════════════════ */

.pb-row {
  background: var(--off);
  border-radius: var(--rsm);
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pb-label {
  font-family: 'Archivo Black', sans-serif;
  font-size: 11px;
  color: var(--blue);
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 1px;
}

.pb-input {
  background: white;
  border: 1px solid var(--gray);
  padding: 10px 12px;
  border-radius: var(--rsm);
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  font-family: 'Nunito', sans-serif;
}

.pb-input:focus { outline: none; border-color: var(--blue); }

.pb-preview {
  background: white;
  border: 2px solid var(--green);
  border-radius: var(--rsm);
  padding: 16px;
  font-size: 12px;
  color: #3d4f8a;
  line-height: 1.7;
  font-weight: 600;
  white-space: pre-wrap;
  word-break: break-word;
  margin-top: 16px;
}

/* ════════════════════════════════════════════
   LABELS GRID
   ════════════════════════════════════════════ */

.labels-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin: 28px 0;
}

.label-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;
  border-radius: var(--rsm);
  border: 2px solid var(--gray);
  cursor: pointer;
  transition: all 0.2s ease;
  aspect-ratio: 1;
}

.label-card:hover { transform: scale(1.05); }

.label-card.l1 { background: rgba(224,32,32,0.1); border-color: var(--red); }
.label-card.l2 { background: rgba(255,159,67,0.1); border-color: var(--orange); }
.label-card.l3 { background: rgba(58,43,158,0.1); border-color: #3a2b9e; }
.label-card.l4 { background: rgba(127,224,0,0.1); border-color: var(--green); }
.label-card.l5 { background: rgba(10,31,168,0.1); border-color: var(--blue); }

.lc-num {
  font-family: 'Archivo Black', sans-serif;
  font-size: 28px;
  font-weight: 900;
  margin-bottom: 8px;
}

.label-card.l1 .lc-num { color: var(--red); }
.label-card.l2 .lc-num { color: var(--orange); }
.label-card.l3 .lc-num { color: #3a2b9e; }
.label-card.l4 .lc-num { color: var(--green); }
.label-card.l5 .lc-num { color: var(--blue); }

.lc-name {
  font-family: 'Archivo Black', sans-serif;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 900;
  text-align: center;
}

/* ════════════════════════════════════════════
   ROLE SELECTOR (NIEUW)
   ════════════════════════════════════════════ */

.role-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0A1FA8 0%, #3a2b9e 55%, #6d28d9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.4s ease;
  overflow-y: auto;
  padding: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.role-wrap {
  max-width: 1000px;
  width: 100%;
}

.role-hero {
  text-align: center;
  margin-bottom: 40px;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--green);
  border-radius: 8px;
  padding: 8px 16px;
  font-family: 'Archivo Black', sans-serif;
  font-size: 12px;
  color: var(--blue);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.role-h1 {
  font-family: 'Archivo Black', sans-serif;
  font-size: 44px;
  color: white;
  text-transform: uppercase;
  line-height: 1.1;
  margin-bottom: 16px;
}

.role-h1 em {
  color: var(--green);
  font-style: normal;
}

.role-sub {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  max-width: 600px;
  margin: 0 auto;
}

.role-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.role-card {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 28px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  backdrop-filter: blur(10px);
}

.role-card:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--green);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.role-icon {
  font-size: 48px;
  margin-bottom: 14px;
}

.role-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: 18px;
  color: white;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.role-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 16px;
  line-height: 1.5;
}

.role-includes {
  font-size: 12px;
  color: var(--green);
  font-weight: 700;
  text-align: left;
  line-height: 1.8;
  background: rgba(127, 224, 0, 0.1);
  border-radius: 8px;
  padding: 12px;
}

.role-note {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(127, 224, 0, 0.15);
  border-radius: 12px;
  padding: 16px 20px;
  border-left: 4px solid var(--green);
  max-width: 600px;
  margin: 0 auto;
}

.role-note-icon {
  font-size: 24px;
}

.role-note-text {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
}

/* ════════════════════════════════════════════
   CASUS (NIEUW)
   ════════════════════════════════════════════ */

.casus-wrap {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 20px 0;
}

.casus-scenario {
  background: white;
  border: 2px solid var(--gray);
  border-left: 5px solid var(--blue);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: 0 6px 18px rgba(10, 31, 168, 0.07);
}

.casus-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: 16px;
  color: var(--blue);
  text-transform: uppercase;
  margin-bottom: 12px;
}

.casus-desc {
  font-size: 15px;
  color: #3d4f8a;
  line-height: 1.7;
  font-weight: 600;
  margin-bottom: 18px;
  padding: 14px;
  background: var(--off);
  border-radius: 8px;
}

.casus-choices {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.casus-choice {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.casus-choice-label {
  font-family: 'Archivo Black', sans-serif;
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.casus-btn {
  background: white;
  border: 2px solid var(--gray);
  border-radius: 10px;
  padding: 16px;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  transition: all 0.2s ease;
}

.casus-btn:hover:not([disabled]) {
  border-color: var(--blue);
  background: rgba(10, 31, 168, 0.04);
}

.casus-btn[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

.casus-fb {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  display: none;
  margin-top: 8px;
}

.casus-fb.show {
  display: block;
}

.casus-fb.correct {
  background: rgba(127, 224, 0, 0.15);
  border-left: 4px solid var(--green);
  color: #2d6a00;
}

.casus-fb.wrong {
  background: rgba(224, 32, 32, 0.1);
  border-left: 4px solid var(--red);
  color: var(--red);
}

/* ════════════════════════════════════════════
   PROMPT COMPARISON (NIEUW)
   ════════════════════════════════════════════ */

.prompt-comp-wrap {
  margin: 24px 0;
  background: white;
  border: 2px solid var(--gray);
  border-radius: var(--radius);
  padding: 28px;
  box-shadow: 0 6px 18px rgba(10, 31, 168, 0.07);
}

.prompt-comp-intro {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--gray);
}

.prompt-comp-icon {
  font-size: 32px;
}

.prompt-comp-title {
  font-family: 'Archivo Black', sans-serif;
  font-size: 16px;
  color: var(--blue);
  text-transform: uppercase;
}

.prompt-comp-sub {
  font-size: 14px;
  color: var(--muted);
  font-weight: 600;
  margin-top: 4px;
}

.prompt-comp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.prompt-comp-col {
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.prompt-comp-col.bad {
  background: #FFF7ED;
  border: 2px solid var(--orange);
}

.prompt-comp-col.good {
  background: rgba(127, 224, 0, 0.08);
  border: 2px solid var(--green);
}

.prompt-comp-col-header {
  font-family: 'Archivo Black', sans-serif;
  font-size: 13px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.prompt-comp-col.bad .prompt-comp-col-header {
  color: var(--orange);
}

.prompt-comp-col.good .prompt-comp-col-header {
  color: var(--green);
}

.prompt-comp-label {
  font-family: 'Archivo Black', sans-serif;
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 8px;
}

.prompt-comp-content {
  background: white;
  border-radius: 8px;
  padding: 14px;
  font-size: 13px;
  color: #3d4f8a;
  line-height: 1.6;
  font-weight: 600;
  min-height: 80px;
}

.prompt-comp-content.small {
  min-height: 140px;
  font-size: 12px;
}

.rdcbv-badge {
  width: 100%;
  height: 60px;
  margin: 10px 0;
}

.prompt-comp-divider {
  font-family: 'Archivo Black', sans-serif;
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  margin-top: 10px;
}

.prompt-comp-result {
  background: white;
  border-radius: 8px;
  padding: 14px;
  font-size: 13px;
  color: #3d4f8a;
  line-height: 1.6;
  font-weight: 600;
  min-height: 60px;
  border-left: 4px solid var(--orange);
}

.prompt-comp-result.good {
  border-left-color: var(--green);
  background: rgba(127, 224, 0, 0.05);
}

.prompt-comp-verdict {
  font-size: 12px;
  font-weight: 800;
  color: var(--orange);
  text-align: center;
  padding-top: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.prompt-comp-verdict.ok {
  color: var(--green);
}

.prompt-comp-tip {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, rgba(10, 31, 168, 0.1), rgba(127, 224, 0, 0.1));
  border-radius: 12px;
  padding: 16px;
  border-left: 4px solid var(--blue);
}

.prompt-comp-tip-icon {
  font-size: 20px;
}

.prompt-comp-tip-text {
  font-size: 13px;
  color: #3d4f8a;
  line-height: 1.6;
  font-weight: 600;
}

/* ════════════════════════════════════════════
   FAQ (NIEUW)
   ════════════════════════════════════════════ */

.faq-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
}

.faq-item {
  background: white;
  border: 2px solid var(--gray);
  border-radius: var(--rsm);
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(10, 31, 168, 0.05);
}

.faq-q {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border: none;
  padding: 16px 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  color: var(--blue);
  transition: all 0.2s ease;
  text-align: left;
}

.faq-q:hover {
  background: var(--off);
}

.faq-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  color: var(--green);
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.faq-a {
  padding: 0 20px 0 20px;
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-a p {
  font-size: 14px;
  color: #3d4f8a;
  line-height: 1.7;
  font-weight: 600;
  padding-bottom: 16px;
}

/* ════════════════════════════════════════════
   RESPONSIVE
   ════════════════════════════════════════════ */

@media (max-width: 1200px) {
  .mods-grid { grid-template-columns: 1fr 1fr; }
  .role-grid { grid-template-columns: 1fr; }
  .hero-stats { grid-template-columns: repeat(3, 1fr); }
  .labels-grid { grid-template-columns: repeat(3, 1fr); }
  .grid2 { grid-template-columns: 1fr; }
  .prompt-comp-grid { grid-template-columns: 1fr; }
}

@media (max-width: 900px) {
  #app { grid-template-columns: 1fr; }
  #sidebar { display: none; }
  .hero { padding: 40px 24px; }
  .hero-h1 { font-size: 32px; }
  .mc-content { padding: 24px; }
  .sw { padding: 24px; }
}

@media (max-width: 520px) {
  .hero-h1 { font-size: 24px; }
  .ch2 { font-size: 18px; }
  .mc-content { padding: 16px; }
  .sw { padding: 16px; }
  .sr-row { grid-template-columns: 1fr; }
  .cert-comps { grid-template-columns: 1fr; }
  .cert-meta { grid-template-columns: repeat(2, 1fr); }
  .faq-q { font-size: 13px; }
}

@media print {
  #sidebar, .mh, .nw, .sr-btn, .mods-grid, .promo-box { display: none; }
  .cert-box { border: none; box-shadow: none; page-break-inside: avoid; }
  body { background: white; }
  #app { display: block; }
  #main { background: white; }
}

/* ════════════════════════════════════════════
   TIMER VERBERGEN
   ════════════════════════════════════════════ */
.reading-time-hint,
.step-timer,
.timer-display,
[data-timer],
.lockNextButtons:disabled::after {
  display: none !important;
}
