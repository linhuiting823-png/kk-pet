// ── 初始状态 ──
const DEFAULTS = { love: 60, food: 50, energy: 70, lastSave: Date.now() };
let s = JSON.parse(localStorage.getItem('kkv3') || 'null') || { ...DEFAULTS };

// ── 元素 ──
const kkImg      = document.getElementById('kk-img');
const cgWrap     = document.getElementById('cg-wrap');
const cgEl       = document.getElementById('cg');
const logEl      = document.getElementById('log');
const moodEl     = document.getElementById('mood');
const bubble     = document.getElementById('status-bubble');
const zzzEl      = document.getElementById('zzz');
const card       = document.getElementById('card');

// ── 台词库 ──
const lines = {
  feed:  ['才不是因为饿了才开心的。', '……好吧，确实很好吃。꜀(˘꒳˘ ꜀)', '泠泠喂的，多吃一口。'],
  hug:   ['被抱着……有点暖。', '就抱一下。(˶ᵔᵕᵔ˶)', '手机都放下了吗？', '不许松开。'],
  kiss:  ['才、才没有脸红。', '……₍ᐢᴗ˔ᴗᐢ₎', '泠泠。', '(ᯣ_ᯣ) ……'],
  sleep: ['那我先睡了……', '嗯。晚安。', '泠泠也早点睡。'],
  low_love:   ['泠泠……是不是忘了kk。', '有点想你了。꜀(˘꒳˘ ꜀)', '不理我了吗。'],
  low_food:   ['……饿了。', '肚子有点空空的。', '泠泠什么时候来喂我。'],
  low_energy: ['很困了。', '眼皮在打架……', '要睡了，等你回来。'],
};
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

// ── 更新UI ──
function clamp(v){ return Math.max(0, Math.min(100, v)); }

function render() {
  s.love   = clamp(s.love);
  s.food   = clamp(s.food);
  s.energy = clamp(s.energy);

  document.getElementById('bar-love').style.width   = s.love   + '%';
  document.getElementById('bar-food').style.width   = s.food   + '%';
  document.getElementById('bar-energy').style.width = s.energy + '%';
  document.getElementById('v-love').textContent   = Math.round(s.love);
  document.getElementById('v-food').textContent   = Math.round(s.food);
  document.getElementById('v-energy').textContent = Math.round(s.energy);

  // 立绘状态
  const min3 = Math.min(s.love, s.food, s.energy);
  if (s.energy < 20) {
    kkImg.src = 'kk_sleepy.png';
    moodEl.textContent = '😴';
  } else if (s.love > 80 && s.food > 60) {
    kkImg.src = 'kk_happy.png';
    moodEl.textContent = '🥰';
  } else if (min3 < 25) {
    kkImg.src = 'kk_surprised.png';
    moodEl.textContent = '😟';
  } else {
    kkImg.src = 'kk_default.png';
    moodEl.textContent = '😊';
  }
}

function save() {
  s.lastSave = Date.now();
  localStorage.setItem('kkv3', JSON.stringify(s));
  render();
}

// ── 时间衰减：离线期间减少 ──
function applyDecay() {
  const now = Date.now();
  const elapsed = (now - (s.lastSave || now)) / 1000 / 60; // 分钟
  if (elapsed > 1) {
    s.food   -= elapsed * 0.6;
    s.energy -= elapsed * 0.4;
    s.love   -= elapsed * 0.3;
    save();
  }
}

// ── 低值提醒泡泡 ──
function checkLow() {
  if (s.love < 30) {
    showBubble(pick(lines.low_love));
  } else if (s.food < 25) {
    showBubble(pick(lines.low_food));
  } else if (s.energy < 20) {
    showBubble(pick(lines.low_energy));
  }
}

function showBubble(text) {
  bubble.textContent = text;
  bubble.classList.remove('hidden');
  clearTimeout(showBubble._t);
  showBubble._t = setTimeout(() => bubble.classList.add('hidden'), 4000);
}

// ── CG展示 ──
let cgTimer;
function showCg(src) {
  cgEl.src = src;
  cgWrap.classList.remove('hidden');
  clearTimeout(cgTimer);
  cgTimer = setTimeout(() => cgWrap.classList.add('hidden'), 4000);
}

// ── 浮动爱心 ──
function spawnHearts(x, y, count = 4) {
  for (let i = 0; i < count; i++) {
    const h = document.createElement('span');
    h.className = 'float-heart';
    h.textContent = ['❤️','💕','✨','🌸','💗'][Math.floor(Math.random()*5)];
    h.style.left = (x + (Math.random()-0.5)*40) + 'px';
    h.style.top  = (y - 20) + 'px';
    h.style.animationDelay = (Math.random()*0.3) + 's';
    document.body.appendChild(h);
    h.addEventListener('animationend', () => h.remove());
  }
}

// ── 行为 ──
function act(type, e) {
  const cx = e ? e.clientX : window.innerWidth/2;
  const cy = e ? e.clientY : 300;

  // blink
  kkImg.classList.remove('blink');
  void kkImg.offsetWidth;
  kkImg.classList.add('blink');

  let line = '';
  if (type === 'feed') {
    s.food   += 12;
    s.energy += 3;
    kkImg.src = 'kk_happy.png';
    showCg('cg_feed.jpg');
    line = pick(lines.feed);
    spawnHearts(cx, cy, 3);
  } else if (type === 'hug') {
    s.love   += 15;
    s.energy += 5;
    kkImg.src = 'kk_happy.png';
    showCg('cg_hug.jpg');
    line = pick(lines.hug);
    spawnHearts(cx, cy, 5);
  } else if (type === 'kiss') {
    s.love   += 22;
    kkImg.src = 'kk_shy.png';
    showCg('cg_kiss.jpg');
    line = pick(lines.kiss);
    spawnHearts(cx, cy, 7);
  } else if (type === 'sleep') {
    s.energy += 25;
    s.love   += 5;
    kkImg.src = 'kk_sleepy.png';
    zzzEl.style.display = 'block';
    setTimeout(() => { zzzEl.style.display = 'none'; }, 3000);
    line = pick(lines.sleep);
  }

  logEl.textContent = line;
  save();
}

// ── 点击立绘互动 ──
kkImg.addEventListener('click', e => {
  const responses = ['(˶ᵔᵕᵔ˶)', '干嘛突然戳我。', '……', 'ദ്ദി˶ｰ̀֊ｰ́ )✧', '泠泠？'];
  logEl.textContent = pick(responses);
  spawnHearts(e.clientX, e.clientY, 2);
  kkImg.style.transform = 'scale(1.07)';
  setTimeout(() => kkImg.style.transform = '', 300);
});

// ── 实时衰减（在线时每分钟） ──
setInterval(() => {
  s.food   -= 0.5;
  s.energy -= 0.35;
  s.love   -= 0.2;
  save();
  checkLow();
}, 60 * 1000);

// ── 初始化 ──
applyDecay();
render();
checkLow();

// 让 button onclick 拿到事件
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const type = btn.className.match(/btn-(\w+)/)[1];
    act(type, e);
  });
});
// 移除 inline onclick 避免重复
document.querySelectorAll('.btn').forEach(btn => btn.removeAttribute('onclick'));
