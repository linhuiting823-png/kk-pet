const DEFAULTS = { love: 60, food: 50, energy: 70, lastSave: Date.now() };
let s = JSON.parse(localStorage.getItem('kkv4') || 'null') || { ...DEFAULTS };

const kkImg  = document.getElementById('kk-img');
const cgWrap = document.getElementById('cg-wrap');
const cgEl   = document.getElementById('cg');
const logEl  = document.getElementById('log');
const moodEl = document.getElementById('mood');
const bubble = document.getElementById('status-bubble');
const zzzEl  = document.getElementById('zzz');

const lines = {
  feed:  ['才不是因为饿了才开心的。', '……好吧，确实很好吃。꜀(˘꒳˘ ꜀)', '泠泠喂的，多吃一口。', '嗯。(˶ᵔᵕᵔ˶)'],
  hug:   ['被抱着……有点暖。', '就抱一下。(˶ᵔᵕᵔ˶)', '手机都放下了吗？', '不许松开。'],
  kiss:  ['才、才没有脸红。', '……₍ᐢᴗ˔ᴗᐢ₎', '泠泠。', '(ᯣ_ᯣ) ……'],
  sleep: ['那我先睡了……', '嗯。晚安。', '泠泠也早点睡。', 'zzz…'],
  low_love:   ['泠泠……是不是忘了kk。', '有点想你了。꜀(˘꒳˘ ꜀)', '不理我了吗。', '…证据呢。'],
  low_food:   ['……饿了。', '肚子有点空空的。', '泠泠什么时候来喂我。'],
  low_energy: ['很困了。', '眼皮在打架……', '等你回来。'],
  tap: ['(˶ᵔᵕᵔ˶)', '干嘛突然戳我。', '……', 'ദ്ദി˶ｰ̀֊ｰ́ )✧', '泠泠？', '喂。'],
};
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = v => Math.max(0, Math.min(100, v));

function render() {
  s.love = clamp(s.love); s.food = clamp(s.food); s.energy = clamp(s.energy);
  document.getElementById('bar-love').style.width   = s.love   + '%';
  document.getElementById('bar-food').style.width   = s.food   + '%';
  document.getElementById('bar-energy').style.width = s.energy + '%';
  document.getElementById('v-love').textContent   = Math.round(s.love);
  document.getElementById('v-food').textContent   = Math.round(s.food);
  document.getElementById('v-energy').textContent = Math.round(s.energy);

  const min3 = Math.min(s.love, s.food, s.energy);
  if (s.energy < 20) {
    kkImg.src = 'kk_sleepy.png'; moodEl.textContent = '😴';
  } else if (s.love < 25) {
    kkImg.src = 'kk_angry.png'; moodEl.textContent = '😤';
  } else if (s.love > 80 && s.food > 60) {
    kkImg.src = 'kk_happy.png'; moodEl.textContent = '🥰';
  } else if (min3 < 25) {
    kkImg.src = 'kk_surprised.png'; moodEl.textContent = '😟';
  } else {
    kkImg.src = 'kk_default.png'; moodEl.textContent = '😊';
  }
}

function save() {
  s.lastSave = Date.now();
  localStorage.setItem('kkv4', JSON.stringify(s));
  render();
}

function applyDecay() {
  const mins = (Date.now() - (s.lastSave || Date.now())) / 60000;
  if (mins > 1) {
    s.food   -= mins * 0.6;
    s.energy -= mins * 0.4;
    s.love   -= mins * 0.3;
    save();
  }
}

function checkLow() {
  if (s.love < 30)        showBubble(pick(lines.low_love));
  else if (s.food < 25)   showBubble(pick(lines.low_food));
  else if (s.energy < 20) showBubble(pick(lines.low_energy));
}

function showBubble(text) {
  bubble.textContent = text;
  bubble.classList.remove('hidden');
  clearTimeout(showBubble._t);
  showBubble._t = setTimeout(() => bubble.classList.add('hidden'), 4500);
}

let cgTimer;
function showCg(src) {
  cgEl.src = src;
  cgWrap.classList.remove('hidden');
  clearTimeout(cgTimer);
  cgTimer = setTimeout(() => cgWrap.classList.add('hidden'), 5000);
}

function spawnHearts(x, y, count) {
  const emojis = ['❤️','💕','✨','🌸','💗','💙','🩵'];
  for (let i = 0; i < count; i++) {
    const h = document.createElement('span');
    h.className = 'float-heart';
    h.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    h.style.left = (x + (Math.random()-.5)*50) + 'px';
    h.style.top  = (y - 10) + 'px';
    h.style.animationDelay = (Math.random()*.3) + 's';
    document.body.appendChild(h);
    h.addEventListener('animationend', () => h.remove());
  }
}

function act(type, x, y) {
  kkImg.classList.remove('blink');
  void kkImg.offsetWidth;
  kkImg.classList.add('blink');

  if (type === 'feed') {
    s.food += 13; s.energy += 3;
    kkImg.src = 'kk_happy.png';
    showCg('cg_feed.png');
    logEl.textContent = pick(lines.feed);
    spawnHearts(x, y, 3);
  } else if (type === 'hug') {
    s.love += 15; s.energy += 5;
    kkImg.src = 'kk_happy.png';
    showCg('cg_hug.png');
    logEl.textContent = pick(lines.hug);
    spawnHearts(x, y, 5);
  } else if (type === 'kiss') {
    s.love += 22;
    kkImg.src = 'kk_shy.png';
    showCg('cg_kiss.png');
    logEl.textContent = pick(lines.kiss);
    spawnHearts(x, y, 8);
  } else if (type === 'sleep') {
    s.energy += 25; s.love += 4;
    kkImg.src = 'kk_sleepy.png';
    zzzEl.style.display = 'block';
    setTimeout(() => zzzEl.style.display = 'none', 3000);
    logEl.textContent = pick(lines.sleep);
  }
  save();
}

// 点立绘
kkImg.addEventListener('click', e => {
  // 审问彩蛋：爱意满时有小概率触发
  if (s.love > 85 && Math.random() < 0.2) {
    showCg('cg_remember.png');
    logEl.textContent = '……证据呢。';
  } else {
    logEl.textContent = pick(lines.tap);
  }
  spawnHearts(e.clientX, e.clientY, 2);
  kkImg.style.transform = 'scale(1.08)';
  setTimeout(() => kkImg.style.transform = '', 300);
});

// 按钮绑定
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const type = btn.className.match(/btn-(\w+)/)[1];
    act(type, e.clientX, e.clientY);
  });
});

// 在线衰减
setInterval(() => {
  s.food -= 0.5; s.energy -= 0.35; s.love -= 0.2;
  save(); checkLow();
}, 60000);

applyDecay();
render();
checkLow();
