// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  links.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

function scrollTo(selector) {
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
}

// ===== PREFIX SEARCH =====
const prefixSearch = document.getElementById('prefixSearch');
if (prefixSearch) {
  prefixSearch.addEventListener('input', () => {
    const q = prefixSearch.value.toLowerCase();
    document.querySelectorAll('.prefix-card').forEach(card => {
      const name = (card.dataset.name || '') + (card.dataset.symbol || '') + (card.dataset.power || '');
      const match = !q || name.toLowerCase().includes(q) || card.innerText.toLowerCase().includes(q);
      card.classList.toggle('hidden', !match);
    });
  });
}

// ===== UNIT CONVERTER =====
function convertUnits() {
  const val = parseFloat(document.getElementById('convertValue').value);
  const from = parseInt(document.getElementById('fromPrefix').value);
  const to = parseInt(document.getElementById('toPrefix').value);
  if (isNaN(val)) { document.getElementById('convertExplain').textContent = 'กรุณาใส่ตัวเลข'; return; }
  const result = val * Math.pow(10, from - to);
  const fromText = document.getElementById('fromPrefix').options[document.getElementById('fromPrefix').selectedIndex].text;
  const toText = document.getElementById('toPrefix').options[document.getElementById('toPrefix').selectedIndex].text;
  document.getElementById('convertResult').value = result.toPrecision(6).replace(/\.?0+$/, '');
  document.getElementById('convertExplain').innerHTML =
    `${val} (${fromText.split(' ')[0]}) = ${val} × 10^(${from}) / 10^(${to}) = ${val} × 10^(${from-to}) = <strong>${result.toExponential(3)}</strong> (${toText.split(' ')[0]})`;
}

// ===== SCIENTIFIC NOTATION =====
function toScientific() {
  const raw = document.getElementById('notationInput').value.trim();
  const num = parseFloat(raw);
  const el = document.getElementById('notationResult');
  if (isNaN(num)) { el.innerHTML = '❌ ไม่ใช่ตัวเลขที่ถูกต้อง'; return; }
  if (num === 0) { el.innerHTML = '0 = 0 × 10⁰'; return; }
  const exp = Math.floor(Math.log10(Math.abs(num)));
  const mantissa = num / Math.pow(10, exp);
  const mStr = mantissa.toPrecision(6).replace(/\.?0+$/, '');
  el.innerHTML = `${raw} = <strong>${mStr} × 10<sup>${exp}</sup></strong>`;
}

// ===== ACCORDION =====
function toggleAccordion(item) {
  const header = item.querySelector('.accordion-header');
  const body = item.querySelector('.accordion-body');
  const isOpen = body.classList.contains('open');
  // Close all
  document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('open'));
  if (!isOpen) {
    body.classList.add('open');
    header.classList.add('open');
  }
}

// ===== SIGNIFICANT FIGURES =====
function countSigFigs() {
  const raw = document.getElementById('sfInput').value.trim();
  const el = document.getElementById('sfResult');
  if (!raw) { el.innerHTML = 'กรุณาใส่ตัวเลข'; return; }

  let count = 0, explanation = [], highlighted = '', num = raw;

  // Remove scientific notation part for counting
  const sciMatch = raw.match(/^([+-]?\d*\.?\d+)\s*[×x]\s*10/i);
  const baseNum = sciMatch ? sciMatch[1] : raw;

  // Remove sign
  const stripped = baseNum.replace(/^[+-]/, '');
  const dotIdx = stripped.indexOf('.');
  const hasDot = dotIdx !== -1;

  // Count sig figs
  const digits = stripped.replace('.', '');
  let started = false;
  let sigDigits = [];
  let nonSigLeading = 0;

  for (let i = 0; i < digits.length; i++) {
    const d = digits[i];
    if (!started && d === '0') { nonSigLeading++; continue; }
    started = true;
    sigDigits.push(d);
  }

  // Handle trailing zeros in integer (ambiguous)
  let trailing = 0;
  if (!hasDot) {
    let j = sigDigits.length - 1;
    while (j >= 0 && sigDigits[j] === '0') { trailing++; j--; }
  }

  count = hasDot ? sigDigits.length : sigDigits.length - trailing;

  // Build explanation
  highlighted = `<div style="font-size:1.3rem;font-family:'Fira Code',monospace;letter-spacing:0.1em;margin:0.5rem 0">`;
  
  const allDigits = raw.replace('.', '').replace(/^[+-]/, '');
  let sigStart = false, sigCount = 0;
  const rawChars = raw.split('');
  
  for (let c of rawChars) {
    if (c === '.' || c === '+' || c === '-') {
      highlighted += `<span style="color:var(--text-muted)">${c}</span>`;
    } else if (c === '0' && !sigStart) {
      highlighted += `<span style="color:var(--red);text-decoration:underline" title="ไม่มีนัยสำคัญ">${c}</span>`;
    } else {
      sigStart = true; sigCount++;
      highlighted += `<span style="color:var(--accent);font-weight:bold" title="มีนัยสำคัญ">${c}</span>`;
    }
  }
  highlighted += '</div>';

  let interpretNote = '';
  if (!hasDot && trailing > 0) {
    interpretNote = `<div style="margin-top:0.5rem;color:var(--orange);font-size:0.9rem">⚠️ ศูนย์ท้ายของจำนวนเต็ม อาจมีหรือไม่มีนัยสำคัญ ควรใช้สัญกรณ์วิทยาศาสตร์เพื่อความชัดเจน</div>`;
  }

  el.innerHTML = `
    ${highlighted}
    <div style="font-size:1rem;color:var(--text)">
      เลขนัยสำคัญ = <strong style="color:var(--accent);font-size:1.4rem">${count}</strong> ตัว
    </div>
    <div style="font-size:0.88rem;color:var(--text-muted);margin-top:0.4rem">
      <span style="color:var(--accent)">■</span> มีนัยสำคัญ &nbsp; <span style="color:var(--red)">■</span> ไม่มีนัยสำคัญ
    </div>
    ${interpretNote}
  `;
}

// ===== UNCERTAINTY CALCULATOR =====
function calcUncertainty() {
  const raw = document.getElementById('measureInput').value;
  const el = document.getElementById('uncertaintyResult');
  const arr = raw.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
  if (arr.length < 2) { el.innerHTML = '❌ ต้องการอย่างน้อย 2 ค่า'; return; }

  const n = arr.length;
  const mean = arr.reduce((a,b) => a+b, 0) / n;
  const variance = arr.reduce((s,v) => s + Math.pow(v - mean, 2), 0) / (n - 1);
  const sd = Math.sqrt(variance);
  const sem = sd / Math.sqrt(n);
  const range = Math.max(...arr) - Math.min(...arr);
  const halfRange = range / 2;

  el.innerHTML = `
    <div><strong>จำนวนการวัด:</strong> ${n} ครั้ง</div>
    <div><strong>ค่าที่วัด:</strong> ${arr.join(', ')}</div>
    <div><strong>ค่าเฉลี่ย (x̄):</strong> <span style="color:var(--accent)">${mean.toFixed(4)}</span></div>
    <div><strong>ส่วนเบี่ยงเบนมาตรฐาน (s):</strong> <span style="color:var(--blue)">${sd.toFixed(4)}</span></div>
    <div><strong>ความไม่แน่นอน (SEM = s/√n):</strong> <span style="color:var(--purple)">${sem.toFixed(4)}</span></div>
    <div><strong>พิสัย (Range):</strong> ${range.toFixed(4)} → ±${halfRange.toFixed(4)}</div>
    <div style="margin-top:0.8rem;padding:0.8rem;background:rgba(100,255,218,0.08);border-radius:8px;border-left:3px solid var(--accent)">
      <strong>ผลการวัด:</strong> x̄ = <strong style="color:var(--accent)">${mean.toFixed(3)} ± ${sem.toFixed(3)}</strong>
    </div>
  `;
}

// ===== INSTRUMENT DETAIL =====
const instrumentDetails = {
  ruler: { name: 'ไม้บรรทัด', precision: '±0.5 mm', detail: 'ไม้บรรทัดทั่วไปมีขีดย่อยทุก 1 mm สามารถประมาณได้ถึง 0.5 mm ตัวอย่าง: วัดได้ 12.5 ± 0.5 mm' },
  vernier: { name: 'เวอร์เนียร์คาลิปเปอร์', precision: '±0.05 mm', detail: 'เวอร์เนียร์ใช้สเกลเวอร์เนียร์อ่านค่าถึง 0.05 mm หรือ 0.02 mm ตัวอย่าง: วัดได้ 25.35 ± 0.05 mm' },
  micrometer: { name: 'ไมโครมิเตอร์', precision: '±0.005 mm', detail: 'ไมโครมิเตอร์สกรูวัดได้ละเอียดถึง 0.01 mm ประมาณได้ถึง 0.005 mm ตัวอย่าง: 5.235 ± 0.005 mm' },
  digital: { name: 'เครื่องมือดิจิตัล', precision: '±1 หน่วยสุดท้าย', detail: 'อ่านค่าตรงตามที่แสดง ความไม่แน่นอน = ±1 ของหลักสุดท้ายที่แสดง เช่น แสดง 12.34 → ±0.01' }
};

function showInstrumentDetail(type) {
  const d = instrumentDetails[type];
  const el = document.getElementById('instrumentDetail');
  el.classList.remove('hidden');
  el.innerHTML = `
    <strong style="color:var(--blue)">${d.name}</strong> — ความละเอียด ${d.precision}<br>
    <span style="color:var(--text-muted)">${d.detail}</span>
  `;
}

// ===== ACCURACY & PRECISION =====
function calcAccuracyPrecision() {
  const trueVal = parseFloat(document.getElementById('trueValue').value);
  const raw = document.getElementById('measuredValues').value;
  const el = document.getElementById('apResult');

  if (isNaN(trueVal)) { el.innerHTML = '❌ กรุณาใส่ค่าจริง'; return; }
  const arr = raw.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
  if (arr.length < 2) { el.innerHTML = '❌ ต้องการอย่างน้อย 2 ค่า'; return; }

  const n = arr.length;
  const mean = arr.reduce((a,b) => a+b, 0) / n;
  const sd = Math.sqrt(arr.reduce((s,v) => s + Math.pow(v - mean, 2), 0) / (n-1));
  const pctError = Math.abs((mean - trueVal) / trueVal * 100);
  const pctSD = Math.abs(sd / mean * 100);

  const accRating = pctError < 1 ? '🟢 สูงมาก' : pctError < 5 ? '🟡 ปานกลาง' : '🔴 ต่ำ';
  const preRating = pctSD < 1 ? '🟢 สูงมาก' : pctSD < 5 ? '🟡 ปานกลาง' : '🔴 ต่ำ';

  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      <div style="padding:1rem;background:#eef2ff;border-radius:10px;border:1.5px solid rgba(99,102,241,0.25)">
        <div style="color:#4338ca;font-weight:800;margin-bottom:0.5rem">🎯 ความแม่น (Accuracy)</div>
        <div style="color:#1a1e3c">ค่าเฉลี่ย x̄ = <strong>${mean.toFixed(4)}</strong></div>
        <div style="color:#1a1e3c">% Error = <strong style="color:#6366f1">${pctError.toFixed(2)}%</strong></div>
        <div style="margin-top:0.4rem">${accRating}</div>
      </div>
      <div style="padding:1rem;background:#f0fdf4;border-radius:10px;border:1.5px solid rgba(13,148,136,0.25)">
        <div style="color:#0d9488;font-weight:800;margin-bottom:0.5rem">🔁 ความเที่ยง (Precision)</div>
        <div style="color:#1a1e3c">SD = <strong>${sd.toFixed(4)}</strong></div>
        <div style="color:#1a1e3c">%RSD = <strong style="color:#0d9488">${pctSD.toFixed(2)}%</strong></div>
        <div style="margin-top:0.4rem">${preRating}</div>
      </div>
    </div>
    <div style="margin-top:1rem;padding:0.8rem 1rem;background:#f5f8ff;border-radius:8px;font-size:0.9rem;color:#5c6489;border:1px solid rgba(99,102,241,0.15)">
      <strong style="color:#1a1e3c">ข้อมูลทั้งหมด:</strong> ${arr.join(', ')} | ค่าจริง: ${trueVal} | ค่าเฉลี่ย: ${mean.toFixed(4)} | SD: ${sd.toFixed(4)}
    </div>
  `;
}

// ===== TARGET DRAWINGS =====
function drawTarget(id, dots) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 90, cy = 90, r = 80;

  // Background
  ctx.fillStyle = '#f8faff'; ctx.fillRect(0,0,180,180);
  ctx.beginPath(); ctx.arc(cx,cy,r+2,0,Math.PI*2);
  ctx.fillStyle='#f8faff'; ctx.fill();

  // Rings
  const colors = ['#dc2626','#f97316','#eab308','#22c55e','#ffffff'];
  for (let i = 4; i >= 0; i--) {
    ctx.beginPath();
    ctx.arc(cx, cy, r * (i+1)/5, 0, Math.PI*2);
    ctx.fillStyle = colors[4-i];
    ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.08)'; ctx.lineWidth=0.5; ctx.stroke();
  }
  // Crosshair
  ctx.strokeStyle='rgba(0,0,0,0.15)'; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(cx-r,cy); ctx.lineTo(cx+r,cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx,cy-r); ctx.lineTo(cx,cy+r); ctx.stroke();
  // Center dot
  ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI*2);
  ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.fill();

  // Data dots
  dots.forEach(([dx, dy]) => {
    ctx.beginPath(); ctx.arc(cx+dx, cy+dy, 7.5, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(99,102,241,0.25)'; ctx.fill();
    ctx.beginPath(); ctx.arc(cx+dx, cy+dy, 5.5, 0, Math.PI*2);
    ctx.fillStyle = '#6366f1'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
  });
}

// Target data
const targets = [
  { id:'target1', dots:[[-5,3],[3,-4],[-2,6],[4,2],[0,-5]] }, // accurate+precise
  { id:'target2', dots:[[40,30],[35,38],[42,25],[38,35],[30,28]] }, // precise, not accurate
  { id:'target3', dots:[[-15,20],[25,-10],[-5,-30],[30,15],[-20,-5]] }, // accurate (avg near center), not precise
  { id:'target4', dots:[[-40,20],[30,-35],[10,40],[-20,-25],[35,30]] }, // neither
];

targets.forEach(t => {
  setTimeout(() => drawTarget(t.id, t.dots), 100);
});

// ===== QUIZ =====
const quizData = [
  {
    q: 'หน่วยฐานของมวลในระบบ SI คืออะไร?',
    opts: ['กรัม (g)', 'กิโลกรัม (kg)', 'ปอนด์ (lb)', 'มิลลิกรัม (mg)'],
    ans: 1, exp: 'กิโลกรัม (kg) คือหน่วยฐาน SI ของมวล ไม่ใช่กรัม แม้ว่ากรัมจะเป็นคำนำหน้าของ kg'
  },
  {
    q: 'คำนำหน้าหน่วย "mega" (M) แทนกำลังของ 10 เท่าใด?',
    opts: ['10³', '10⁶', '10⁹', '10¹²'],
    ans: 1, exp: 'Mega = 10⁶ = 1,000,000 เช่น 1 MHz = 10⁶ Hz'
  },
  {
    q: 'ตัวเลข 0.00450 มีเลขนัยสำคัญกี่ตัว?',
    opts: ['2', '3', '5', '6'],
    ans: 1, exp: 'เลข 0.00450: ศูนย์นำหน้า 3 ตัวไม่มีนัยสำคัญ เหลือ 4, 5, 0 → 3 ตัว (ศูนย์หลัง 5 มีนัยสำคัญเพราะอยู่หลังทศนิยม)'
  },
  {
    q: '3.00 × 10⁸ มีเลขนัยสำคัญกี่ตัว?',
    opts: ['1', '2', '3', '4'],
    ans: 2, exp: '3.00 × 10⁸ มีตัวเลข 3, 0, 0 ทั้งสามตัวมีนัยสำคัญ (ศูนย์ท้ายหลังจุดทศนิยม = มีนัยสำคัญ)'
  },
  {
    q: 'ค่าความยาวที่วัดได้คือ 12.34 ± 0.05 cm หมายความว่าอย่างไร?',
    opts: ['ค่าผิดพลาด 0.05 cm เสมอ', 'ค่าจริงอยู่ระหว่าง 12.29 ถึง 12.39 cm', 'วัดผิดพลาด', 'ใช้เวอร์เนียร์คาลิปเปอร์วัด'],
    ans: 1, exp: 'ค่า 12.34 ± 0.05 cm หมายถึง ค่าจริงน่าจะอยู่ระหว่าง 12.34-0.05 = 12.29 และ 12.34+0.05 = 12.39 cm'
  },
  {
    q: 'ความคลาดเคลื่อนเชิงระบบ (Systematic Error) แก้ไขได้ด้วยวิธีใด?',
    opts: ['วัดซ้ำหลายครั้ง', 'สอบเทียบเครื่องมือ (Calibration)', 'หาค่าเฉลี่ย', 'ใช้เครื่องมือใหม่'],
    ans: 1, exp: 'Systematic Error เกิดจากเครื่องมือหรือวิธีการที่มีข้อผิดพลาดเชิงระบบ แก้ได้ด้วยการสอบเทียบ (Calibration)'
  },
  {
    q: 'คำนวณ: 2.45 × 3.2 = ? (ตอบเป็นเลขนัยสำคัญที่เหมาะสม)',
    opts: ['7.84', '7.8', '7.840', '8.0'],
    ans: 1, exp: '2.45 (3 นัยสำคัญ) × 3.2 (2 นัยสำคัญ) → ผลลัพธ์ใช้ 2 นัยสำคัญ = 7.84 → ปัดเป็น 7.8'
  },
  {
    q: 'ถ้าผลการวัดมีความเที่ยงสูงแต่ความแม่นต่ำ แสดงว่า...',
    opts: [
      'มีความคลาดเคลื่อนสุ่มมาก',
      'มีความคลาดเคลื่อนเชิงระบบ',
      'วัดซ้ำได้ครั้งเดียว',
      'เครื่องมือดีมาก'
    ],
    ans: 1, exp: 'ความเที่ยงสูงแต่แม่นต่ำ → ผลกระจุกตัวแต่อยู่ห่างจากค่าจริง = มีความคลาดเคลื่อนเชิงระบบ (Systematic Error)'
  },
  {
    q: '450,000 เขียนในรูปสัญกรณ์วิทยาศาสตร์ได้ว่าอย่างไร?',
    opts: ['45 × 10⁴', '4.5 × 10⁵', '0.45 × 10⁶', '4.50 × 10⁴'],
    ans: 1, exp: '450,000 = 4.5 × 10⁵ โดยที่ a = 4.5 (1 ≤ a < 10) และ n = 5'
  },
  {
    q: 'คำนวณ: 18.25 + 1.3 = ? (บันทึกด้วยเลขนัยสำคัญที่เหมาะสม)',
    opts: ['19.55', '19.6', '19.550', '20'],
    ans: 1, exp: '18.25 มีทศนิยม 2 ตำแหน่ง, 1.3 มีทศนิยม 1 ตำแหน่ง → ผลลัพธ์มีทศนิยม 1 ตำแหน่ง = 19.55 → 19.6'
  }
];

let currentQ = 0, score = 0, answered = false;

function loadQuestion() {
  if (currentQ >= quizData.length) { showQuizResult(); return; }
  const q = quizData[currentQ];
  const pct = (currentQ / quizData.length) * 100;
  document.getElementById('quizProgressBar').style.width = pct + '%';
  document.getElementById('quizCounter').textContent = `ข้อที่ ${currentQ+1} / ${quizData.length}`;
  document.getElementById('quizQuestion').textContent = q.q;
  document.getElementById('quizFeedback').className = 'quiz-feedback hidden';
  document.getElementById('quizNext').classList.add('hidden');
  answered = false;

  const optsEl = document.getElementById('quizOptions');
  optsEl.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = `${['ก','ข','ค','ง'][i]}) ${opt}`;
    btn.onclick = () => selectAnswer(i);
    optsEl.appendChild(btn);
  });
}

function selectAnswer(idx) {
  if (answered) return;
  answered = true;
  const q = quizData[currentQ];
  const opts = document.querySelectorAll('.quiz-option');
  opts.forEach(o => o.disabled = true);
  opts[idx].classList.add(idx === q.ans ? 'correct' : 'wrong');
  if (idx !== q.ans) opts[q.ans].classList.add('correct');
  const fb = document.getElementById('quizFeedback');
  if (idx === q.ans) {
    score++;
    fb.className = 'quiz-feedback correct-fb';
    fb.innerHTML = `✅ ถูกต้อง! ${q.exp}`;
  } else {
    fb.className = 'quiz-feedback wrong-fb';
    fb.innerHTML = `❌ ไม่ถูกต้อง เฉลย: ${q.opts[q.ans]}<br>${q.exp}`;
  }
  document.getElementById('quizScore').textContent = `คะแนน: ${score}`;
  document.getElementById('quizNext').classList.remove('hidden');
}

function nextQuestion() {
  currentQ++;
  loadQuestion();
}

function showQuizResult() {
  document.getElementById('quizContainer').classList.add('hidden');
  const res = document.getElementById('quizResult');
  res.classList.remove('hidden');
  const pct = Math.round(score / quizData.length * 100);
  let emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : pct >= 40 ? '😊' : '📚';
  let msg = pct >= 80 ? 'ยอดเยี่ยมมาก!' : pct >= 60 ? 'ดีมาก!' : pct >= 40 ? 'พัฒนาได้อีก' : 'ต้องทบทวนเนื้อหาเพิ่ม';
  res.innerHTML = `
    <div style="font-size:4rem">${emoji}</div>
    <div class="result-score">${score}/${quizData.length}</div>
    <div class="result-msg">${msg}</div>
    <div class="result-sub">คะแนน ${pct}% — ${pct >= 60 ? 'ผ่าน' : 'ยังไม่ผ่านเกณฑ์ 60%'}</div>
    <div style="height:12px;background:var(--surface2);border-radius:6px;margin:1.5rem 0;overflow:hidden">
      <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--accent),var(--blue));border-radius:6px;transition:width 1s ease"></div>
    </div>
    <button class="btn btn-primary" onclick="restartQuiz()">ทำใหม่อีกครั้ง 🔄</button>
  `;
}

function restartQuiz() {
  currentQ = 0; score = 0; answered = false;
  document.getElementById('quizResult').classList.add('hidden');
  document.getElementById('quizContainer').classList.remove('hidden');
  document.getElementById('quizScore').textContent = 'คะแนน: 0';
  loadQuestion();
}

// ===== FORMULA TOOLTIP =====
(function() {
  const tip = document.getElementById('formula-tooltip');
  if (!tip) return;
  const ttType = tip.querySelector('.tt-type');
  const ttLabel = tip.querySelector('.tt-label');

  function showTip(el, x, y) {
    const type = el.dataset.ttType || '';
    const label = el.dataset.ttLabel || '';
    const isVar = el.classList.contains('var-token');
    ttType.textContent = type;
    ttType.className = 'tt-type ' + (isVar ? 'is-var' : 'is-unit');
    ttLabel.textContent = label;
    const vw = window.innerWidth, vh = window.innerHeight;
    let lx = x + 18, ly = y - 12;
    tip.style.left = '-999px';
    tip.classList.add('visible');
    const w = tip.offsetWidth, h = tip.offsetHeight;
    if (lx + w > vw - 8) lx = x - w - 12;
    if (ly + h > vh - 8) ly = y - h - 10;
    if (lx < 8) lx = 8;
    if (ly < 8) ly = 8;
    tip.style.left = lx + 'px';
    tip.style.top = ly + 'px';
  }
  function hideTip() {
    tip.classList.remove('visible');
    tip.style.left = '-999px';
  }

  // Desktop
  document.addEventListener('mouseover', e => {
    const el = e.target.closest('.var-token,.unit-token');
    if (el) showTip(el, e.clientX, e.clientY);
    else hideTip();
  });
  document.addEventListener('mousemove', e => {
    if (!tip.classList.contains('visible')) return;
    const el = e.target.closest('.var-token,.unit-token');
    if (el) showTip(el, e.clientX, e.clientY);
  });
  document.addEventListener('mouseout', e => {
    if (!e.target.closest('.var-token,.unit-token')) hideTip();
  });

  // Mobile touch
  let touchTipEl = null;
  document.addEventListener('touchstart', e => {
    const el = e.target.closest('.var-token,.unit-token');
    if (el) {
      const t = e.touches[0];
      showTip(el, t.clientX, t.clientY);
      touchTipEl = el;
      e.preventDefault();
    } else {
      hideTip();
      touchTipEl = null;
    }
  }, { passive: false });
  document.addEventListener('touchend', () => {
    setTimeout(hideTip, 2000);
  });
})();

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadQuestion();
});
