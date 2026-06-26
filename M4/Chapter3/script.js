const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const forceInfo = {
  weight: {
    title: "น้ำหนัก (Weight)",
    body: "แรงที่โลกดึงดูดวัตถุ มีทิศเข้าสู่ศูนย์กลางโลก ใกล้ผิวโลกมักเขียนลงด้านล่าง",
    formula: "\\[W=mg\\]",
    vars: "W คือ น้ำหนัก, m คือ มวล, g คือ ความเร่งโน้มถ่วง"
  },
  normal: {
    title: "แรงแนวฉาก (Normal Force)",
    body: "แรงสัมผัสที่พื้นหรือผิวรองรับกระทำต่อวัตถุ มีทิศตั้งฉากกับผิวสัมผัส",
    formula: "\\[N=mg\\quad\\text{เมื่อวัตถุอยู่บนพื้นราบและไม่มีแรงอื่นในแนวดิ่ง}\\]",
    vars: "N คือ แรงแนวฉาก, m คือ มวล, g คือ ความเร่งโน้มถ่วง"
  },
  tension: {
    title: "แรงตึงเชือก (Tension)",
    body: "แรงที่เชือกดึงวัตถุ มีทิศไปตามแนวเชือกและดึงออกจากวัตถุเสมอในแผนภาพวัตถุอิสระ",
    formula: "\\[T\\]",
    vars: "T คือ ขนาดแรงตึงเชือก หน่วยนิวตัน"
  },
  spring: {
    title: "แรงสปริง (Spring Force)",
    body: "แรงจากสปริงมีทิศต้านการยืดหรือหดของสปริง ตามกฎของฮุกในช่วงที่สปริงยังไม่เสียรูปถาวร",
    formula: "\\[F_s=kx\\]",
    vars: "F_s คือ แรงสปริง, k คือ ค่านิจสปริง, x คือ ระยะยืดหรือหดจากตำแหน่งสมดุล"
  },
  friction: {
    title: "แรงเสียดทาน (Friction)",
    body: "แรงที่เกิดจากผิวสัมผัส มีทิศต้านแนวโน้มการเคลื่อนที่หรือต้านการไถลจริง",
    formula: "\\[f_s\\le \\mu_sN,\\qquad f_k=\\mu_kN\\]",
    vars: "f_s คือ แรงเสียดทานสถิต, f_k คือ แรงเสียดทานจลน์, μ คือ สัมประสิทธิ์ความเสียดทาน"
  }
};

function typeset() {
  if (window.MathJax?.typesetPromise) {
    window.MathJax.typesetPromise().catch(() => { });
  }
}

function renderForceDetail(key = "weight") {
  const item = forceInfo[key];
  $("#forceDetail").innerHTML = `
    <h4>${item.title}</h4>
    <p>${item.body}</p>
    <div class="formula">
      <p class="math">${item.formula}</p>
      <p>${item.vars}</p>
    </div>
  `;
  $$(".force-chip").forEach((btn) => btn.classList.toggle("active", btn.dataset.force === key));
  typeset();
}

function arrowDef(color, id) {
  return `<marker id="${id}" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
    <path d="M2,2 L10,6 L2,10 Z" fill="${color}"></path>
  </marker>`;
}

function line(x1, y1, x2, y2, color, width = 6, label = "", lx = x2, ly = y2) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" marker-end="url(#arr-${color.slice(1)})"></line>
    ${label ? `<text x="${lx}" y="${ly}">${label}</text>` : ""}`;
}

const fbdCases = {
  table: {
    note: "วัตถุที่พิจารณาคือกล่อง แรงที่มีคือแรงแนวฉากจากโต๊ะขึ้นบนและน้ำหนักลงล่าง ไม่มีแรงที่โต๊ะถูกกล่องกดใน FBD ของกล่อง",
    draw: () => `
      <rect x="206" y="154" width="108" height="80" rx="10" fill="#fff" stroke="#0f172a" stroke-width="3"></rect>
      ${line(260, 154, 260, 64, "#059669", 4, "N", 274, 88)}
      ${line(260, 234, 260, 322, "#dc2626", 4, "W", 276, 306)}
    `
  },
  pull: {
    note: "กล่องบนพื้นราบมีแรงดึงไปทางขวา แรงเสียดทานต้านไปทางซ้าย แรงแนวฉากขึ้น และน้ำหนักลง ถ้าแรงดึงมากพอจึงเกิดความเร่ง",
    draw: () => `
      <rect x="205" y="160" width="112" height="78" rx="8" fill="#fff" stroke="#0f172a" stroke-width="3"></rect>
      ${line(260, 160, 260, 68, "#059669", 4, "N", 276, 92)}
      ${line(260, 238, 260, 324, "#dc2626", 4, "W", 276, 310)}
      ${line(317, 199, 438, 199, "#2563eb", 4, "F", 378, 184)}
      ${line(205, 235, 90, 235, "#dc2626", 4, "f", 118, 204)}
    `
  },
  slope: {
    note: "บนพื้นเอียงควรเลือกแกนขนานและตั้งฉากกับพื้นเอียง น้ำหนักยังชี้ลงดิ่ง แต่แตกเป็นองค์ประกอบขนานพื้นเอียงและตั้งฉากพื้นเอียง",
    draw: () => `
      <g transform="rotate(-25 260 210)">
        <rect x="206" y="170" width="108" height="70" rx="8" fill="#fff" stroke="#0f172a" stroke-width="3"></rect>
        ${line(260, 170, 260, 78, "#059669", 4, "N", 274, 100)}
        ${line(206, 235, 110, 235, "#dc2626", 4, "f", 160, 225)}
      </g>
      <line x1="88" y1="328" x2="444" y2="162" stroke="#94a3b8" stroke-width="12"></line>
      ${line(260, 210, 260, 326, "#dc2626", 4, "W", 276, 308)}
    `
  },
  air: {
    note: "หลังลูกบอลหลุดจากเท้าและไม่คิดแรงต้านอากาศ จะเหลือเฉพาะน้ำหนักที่โลกดึงดูดลงล่าง ไม่มีแรงเตะติดไปกับลูกบอล",
    draw: () => `
      <circle cx="260" cy="162" r="42" fill="#fff" stroke="#0f172a" stroke-width="3"></circle>
      ${line(260, 204, 260, 324, "#dc2626", 4, "W", 276, 306)}
    `
  }
};

function renderFbd() {
  const key = $("#fbdSelect").value;
  $("#fbdNotes").textContent = fbdCases[key].note;
  $("#fbdCanvas").innerHTML = `
    <defs>
      ${arrowDef("#2563eb", "arr-2563eb")}
      ${arrowDef("#dc2626", "arr-dc2626")}
      ${arrowDef("#059669", "arr-059669")}
    </defs>
    <rect x="40" y="235" width="440" height="10" rx="5" fill="#dbeafe"></rect>
    ${fbdCases[key].draw()}
  `;
}

function renderResultant() {
  const f1 = Number($("#f1").value);
  const f2 = Number($("#f2").value);
  const deg = Number($("#angle").value);
  const rad = (deg * Math.PI) / 180;
  const rx = f1 + f2 * Math.cos(rad);
  const ry = f2 * Math.sin(rad);
  const fr = Math.hypot(rx, ry);
  const direction = Math.atan2(ry, rx) * 180 / Math.PI;
  $("#resultantOutput").innerHTML = `
    <strong>ผลลัพธ์:</strong> \\(F_R=${fr.toFixed(2)}\\,\\text{N}\\), ทำมุม \\(${direction.toFixed(1)}^\\circ\\) กับแนวแรง \\(F_1\\)<br>
    <span>ค่าอินพุต: \\(F_1=${f1}\\,\\text{N}\\), \\(F_2=${f2}\\,\\text{N}\\), \\(\\theta=${deg}^\\circ\\)</span>
  `;

  const scale = 1.9;
  const ox = 95;
  const oy = 235;
  const x1 = ox + f1 * scale;
  const y1 = oy;
  const x2 = x1 + f2 * Math.cos(rad) * scale;
  const y2 = y1 - f2 * Math.sin(rad) * scale;
  $("#vectorCanvas").innerHTML = `
    <defs>
      ${arrowDef("#2563eb", "arr-2563eb")}
      ${arrowDef("#059669", "arr-059669")}
      ${arrowDef("#dc2626", "arr-dc2626")}
    </defs>
    <line x1="40" y1="${oy}" x2="480" y2="${oy}" stroke="#d7e3f2" stroke-width="2"></line>
    ${line(ox, oy, x1, y1, "#2563eb", 3, "F₁", (ox + x1) / 2, oy - 14)}
    ${line(x1, y1, x2, y2, "#059669", 3, "F₂", (x1 + x2) / 2 + 8, (y1 + y2) / 2 - 8)}
    ${line(ox, oy, x2, y2, "#dc2626", 3, "Fᵣ", (ox + x2) / 2, (oy + y2) / 2 - 16)}
    <circle cx="${ox}" cy="${oy}" r="5" fill="#0f172a"></circle>
  `;
  typeset();
}

function renderNewton() {
  const f = Number($("#netForce").value);
  const m = Number($("#mass").value);
  const a = f / m;
  $("#newtonOutput").innerHTML = `
    \\[a=\\frac{\\sum F}{m}=\\frac{${f}}{${m}}=${a.toFixed(2)}\\,\\text{m/s}^2\\]
    <strong>ตัวแปร:</strong> \\(a\\) คือความเร่ง, \\(\\sum F\\) คือแรงลัพธ์, \\(m\\) คือมวล
  `;
  $("#motionCart").style.transform = `translateX(${Math.min(390, a * 28)}px)`;
  typeset();
}

function renderFriction() {
  const m = Number($("#frMass").value);
  const muS = Number($("#muS").value);
  const muK = Number($("#muK").value);
  const pull = Number($("#pullForce").value);
  const g = 9.8;
  const n = m * g;
  const fsMax = muS * n;
  const fk = muK * n;
  const moving = pull > fsMax;
  const friction = moving ? fk : pull;
  const net = moving ? pull - fk : 0;
  const acc = net / m;
  const status = moving ? "วัตถุเคลื่อนที่ ใช้แรงเสียดทานจลน์" : "วัตถุยังหยุดนิ่ง แรงเสียดทานสถิตปรับค่าเท่ากับแรงดึง";
  $("#frictionOutput").innerHTML = `
    <strong>${status}</strong><br>
    \\(N=mg=${n.toFixed(1)}\\,\\text{N}\\),
    \\(f_{s,max}=\\mu_sN=${fsMax.toFixed(1)}\\,\\text{N}\\),
    \\(f=${friction.toFixed(1)}\\,\\text{N}\\),
    \\(a=${acc.toFixed(2)}\\,\\text{m/s}^2\\)
  `;
  $("#frictionCrate").style.transform = `translateX(${moving ? Math.min(360, acc * 42 + 55) : Math.min(38, pull)}px)`;
  typeset();
}

function renderGravity() {
  const m1 = Number($("#gM1").value);
  const m2 = Number($("#gM2").value);
  const r = Number($("#gR").value);
  const gConst = 6.67e-11;
  const force = gConst * m1 * m2 / (r * r);
  $("#gravityOutput").innerHTML = `
    \\[F=G\\frac{m_1m_2}{r^2}=6.67\\times10^{-11}\\frac{(${m1})(${m2})}{${r}^2}
    =${force.toExponential(2)}\\,\\text{N}\\]
    <strong>ตัวแปร:</strong> \\(m_1,m_2\\) คือมวล, \\(r\\) คือระยะห่างศูนย์กลางมวล, \\(G\\) คือค่าคงตัวโน้มถ่วงสากล
  `;
  const gap = 80 + r * 5.2;
  const x1 = 260 - gap / 2;
  const x2 = 260 + gap / 2;
  const rad1 = 18 + m1 * 0.25;
  const rad2 = 18 + m2 * 0.25;
  $("#gravityCanvas").innerHTML = `
    <defs>
      ${arrowDef("#2563eb", "arr-2563eb")}
    </defs>
    <circle cx="${x1}" cy="130" r="${rad1}" fill="#93c5fd" stroke="#1d4ed8" stroke-width="3"></circle>
    <circle cx="${x2}" cy="130" r="${rad2}" fill="#bbf7d0" stroke="#047857" stroke-width="3"></circle>
    ${line(x1 + rad1 + 8, 130, x2 - rad2 - 8, 130, "#2563eb", 2, "แรงดึงดูด", 218, 108)}
    ${line(x2 - rad2 - 8, 150, x1 + rad1 + 8, 150, "#2563eb", 2, "", 0, 0)}
    <text x="${x1 - 18}" y="206">m₁</text>
    <text x="${x2 - 18}" y="206">m₂</text>
    <text x="224" y="232">r = ${r} m</text>
  `;
  typeset();
}

const quizSets = [
  [
    { q: "ข้อใดอธิบายแรงได้ถูกต้องที่สุด", o: ["แรงเป็นปริมาณเวกเตอร์ มีทั้งขนาดและทิศทาง", "แรงเป็นปริมาณสเกลาร์ มีเฉพาะขนาด", "วัตถุที่เคลื่อนที่ต้องมีแรงลัพธ์ไปทางเดียวกับความเร็วเสมอ", "แรงเกิดได้เฉพาะเมื่อวัตถุสัมผัสกัน"], a: 0, e: "แรงเป็นปริมาณเวกเตอร์ และอาจเป็นแรงสัมผัสหรือไม่สัมผัสก็ได้" },
    { q: "ก้อนหินวางนิ่งบนโต๊ะ แรงใดควรอยู่ใน FBD ของก้อนหิน", o: ["น้ำหนักและแรงแนวฉากจากโต๊ะ", "น้ำหนักและแรงที่ก้อนหินกดโต๊ะ", "แรงแนวฉากจากโต๊ะอย่างเดียว", "แรงที่โต๊ะถูกก้อนหินกดอย่างเดียว"], a: 0, e: "FBD ของก้อนหินต้องใส่แรงที่กระทำต่อก้อนหินเท่านั้น" },
    { q: "แรง 30 N และ 40 N ตั้งฉากกัน แรงลัพธ์มีขนาดเท่าใด", o: ["10 N", "50 N", "70 N", "1200 N"], a: 1, e: "ใช้ \\(F_R=\\sqrt{30^2+40^2}=50\\,\\text{N}\\)" },
    { q: "ถ้าแรงลัพธ์ที่กระทำต่อวัตถุเป็นศูนย์ วัตถุจะเป็นอย่างไร", o: ["หยุดนิ่งเท่านั้น", "เคลื่อนที่เร็วขึ้นเสมอ", "คงสภาพอยู่นิ่งหรือเคลื่อนที่ด้วยความเร็วคงตัว", "เคลื่อนที่เป็นวงกลมเสมอ"], a: 2, e: "นี่คือกฎข้อที่ 1 ของนิวตันหรือกฎความเฉื่อย" },
    { q: "วัตถุมวล 4 kg ถูกแรงลัพธ์ 20 N ความเร่งเท่าใด", o: ["5 m/s²", "16 m/s²", "24 m/s²", "80 m/s²"], a: 0, e: "จาก \\(a=F/m=20/4=5\\,\\text{m/s}^2\\)" },
    { q: "แรงกิริยาและแรงปฏิกิริยามีลักษณะอย่างไร", o: ["กระทำต่อวัตถุเดียวกัน", "ขนาดเท่ากัน ทิศตรงข้าม กระทำต่อคนละวัตถุ", "แรงปฏิกิริยามักมากกว่าแรงกิริยา", "เกิดเฉพาะเมื่อวัตถุอยู่นิ่ง"], a: 1, e: "คู่แรงตามกฎข้อที่ 3 กระทำต่อคนละวัตถุ จึงไม่หักล้างกันบนวัตถุเดียว" },
    { q: "แรงเสียดทานสถิตสูงสุดเขียนได้อย่างไร", o: ["\\(f_s=mg\\)", "\\(f_{s,max}=\\mu_sN\\)", "\\(f_k=\\mu_sN\\)", "\\(N=\\mu_smg\\)"], a: 1, e: "แรงเสียดทานสถิตเกิดจริงไม่เกิน \\(\\mu_sN\\)" },
    { q: "เมื่อวัตถุไถลบนพื้นแล้ว ควรใช้แรงเสียดทานชนิดใด", o: ["แรงเสียดทานสถิต", "แรงเสียดทานจลน์", "แรงแนวฉาก", "แรงตึงเชือก"], a: 1, e: "เมื่อผิวสัมผัสไถลสัมพัทธ์กัน ใช้ \\(f_k=\\mu_kN\\)" },
    { q: "ถ้าระยะระหว่างมวลสองก้อนเพิ่มเป็น 2 เท่า แรงโน้มถ่วงเปลี่ยนอย่างไร", o: ["เพิ่มเป็น 2 เท่า", "เพิ่มเป็น 4 เท่า", "เหลือ 1/2", "เหลือ 1/4"], a: 3, e: "เพราะ \\(F\\propto1/r^2\\) เมื่อ \\(r\\) เพิ่ม 2 เท่า แรงเหลือ \\(1/4\\)" },
    { q: "ขั้นตอนใดควรทำก่อนเขียนสมการ \\(\\sum F=ma\\)", o: ["แทนค่าทันที", "วาด FBD และเลือกแกน", "เดาคำตอบ", "ตัดแรงเสียดทานทิ้งเสมอ"], a: 1, e: "FBD และแกนช่วยกำหนดเครื่องหมายและแรงที่เกี่ยวข้องอย่างถูกต้อง" }
  ],
  [
    { q: "แรงแนวฉากมีทิศอย่างไร", o: ["ขนานกับผิวสัมผัส", "ตั้งฉากกับผิวสัมผัส", "ลงล่างเสมอ", "ไปทางเดียวกับความเร็วเสมอ"], a: 1, e: "Normal force ตั้งฉากกับพื้นหรือผิวที่รองรับวัตถุ" },
    { q: "แรง \\(F\\) ทำมุม \\(\\theta\\) กับแกน x องค์ประกอบแนว x คือข้อใด", o: ["\\(F_x=F\\sin\\theta\\)", "\\(F_x=F\\cos\\theta\\)", "\\(F_x=F/\\cos\\theta\\)", "\\(F_x=mg\\)"], a: 1, e: "เมื่อวัดมุมจากแกน x จะได้ \\(F_x=F\\cos\\theta\\)" },
    { q: "ลูกบอลลอยในอากาศหลังถูกเตะแล้ว ไม่คิดแรงต้านอากาศ มีแรงใดกระทำ", o: ["แรงเตะและน้ำหนัก", "แรงเตะเท่านั้น", "น้ำหนักเท่านั้น", "ไม่มีแรงใดเลย"], a: 2, e: "เมื่อเท้าไม่สัมผัสแล้ว แรงเตะไม่กระทำต่อบอล เหลือแรงโน้มถ่วง" },
    { q: "วัตถุมวลมากขึ้นแต่แรงลัพธ์เท่าเดิม ความเร่งจะเป็นอย่างไร", o: ["มากขึ้น", "น้อยลง", "เท่าเดิมเสมอ", "กลายเป็นศูนย์เสมอ"], a: 1, e: "จาก \\(a=F/m\\) เมื่อ \\(m\\) มากขึ้น ความเร่งลดลง" },
    { q: "บนพื้นราบ ไม่มีแรงอื่นในแนวดิ่ง แรงแนวฉากมีค่าเท่าใด", o: ["\\(N=mg\\)", "\\(N=ma\\)", "\\(N=\\mu mg\\)", "\\(N=Gm_1m_2/r^2\\)"], a: 0, e: "แนวดิ่งสมดุล จึงได้ \\(N-W=0\\) หรือ \\(N=mg\\)" },
    { q: "แรงเสียดทานมีทิศอย่างไรโดยทั่วไป", o: ["ต้านแนวโน้มการเคลื่อนที่หรือการไถล", "ไปทางเดียวกับแรงแนวฉาก", "ลงล่างเสมอ", "เข้าหาศูนย์กลางโลกเสมอ"], a: 0, e: "แรงเสียดทานเกิดตามผิวสัมผัสและต้านการไถลสัมพัทธ์" },
    { q: "ถ้า \\(\\mu_s=0.5\\) และ \\(N=40\\,\\text{N}\\) แรงเสียดทานสถิตสูงสุดเท่าใด", o: ["8 N", "20 N", "40 N", "80 N"], a: 1, e: "\\(f_{s,max}=\\mu_sN=0.5(40)=20\\,\\text{N}\\)" },
    { q: "แรงดึงดูดระหว่างมวลขึ้นกับปริมาณใด", o: ["มวลทั้งสองและระยะห่างระหว่างศูนย์กลางมวล", "สีของวัตถุ", "พื้นที่ผิวเท่านั้น", "ความเร็วเสียง"], a: 0, e: "กฎความโน้มถ่วงสากลคือ \\(F=Gm_1m_2/r^2\\)" },
    { q: "กราฟ \\(a-t\\) ของการตกอิสระใกล้ผิวโลก ไม่คิดแรงต้านอากาศ ควรเป็นอย่างไร", o: ["เส้นตรงแนวนอนที่ค่าใกล้ \\(g\\)", "เส้นโค้งเพิ่มขึ้นตลอด", "เส้นตรงเอียงขึ้น", "เป็นศูนย์ตลอด"], a: 0, e: "ความเร่งโน้มถ่วงใกล้ผิวโลกถือว่าคงตัว" },
    { q: "เหตุใดต้องเขียนคำอธิบายสัญลักษณ์แรงในช่วงฝึก FBD", o: ["เพื่อไม่ให้สับสนว่าแรงใดกระทำต่อวัตถุใด", "เพื่อทำให้รูปสวยเท่านั้น", "เพื่อเลี่ยงการใช้สมการ", "เพราะแรงไม่มีทิศทาง"], a: 0, e: "การระบุเช่น \\(N\\) คือแรงที่โต๊ะดันก้อนหิน ช่วยป้องกันการใส่แรงผิดวัตถุ" }
  ]
];

let activeSet = 0;
let activeQuestion = 0;
const answers = [Array(10).fill(null), Array(10).fill(null)];

function renderQuiz() {
  const item = quizSets[activeSet][activeQuestion];
  $("#quizStatus").textContent = `ชุดที่ ${activeSet + 1} | ข้อ ${activeQuestion + 1} จาก 10`;
  $("#quizQuestion").innerHTML = item.q;
  const formulaText = [item.q, ...item.o, item.e].join(" ");
  const hasFormula = formulaText.includes("\\(") || formulaText.includes("\\[");
  $("#quizSymbols").classList.toggle("show", hasFormula);
  $("#quizSymbols").innerHTML = hasFormula
    ? "คำอธิบายสัญลักษณ์ที่อาจพบ: \\(F\\) คือแรง, \\(F_R\\) คือแรงลัพธ์, \\(m\\) คือมวล, \\(a\\) คือความเร่ง, \\(N\\) คือแรงแนวฉาก, \\(\\mu\\) คือสัมประสิทธิ์ความเสียดทาน, \\(r\\) คือระยะห่าง"
    : "";
  $("#quizOptions").innerHTML = item.o.map((option, index) => {
    const chosen = answers[activeSet][activeQuestion];
    const cls = chosen === null ? "" : index === item.a ? "correct" : index === chosen ? "wrong" : "";
    return `<button class="quiz-option ${cls}" data-index="${index}">${option}</button>`;
  }).join("");
  const chosen = answers[activeSet][activeQuestion];
  $("#quizFeedback").innerHTML = chosen === null
    ? "เลือกคำตอบเพื่อดูเฉลย"
    : `${chosen === item.a ? "ถูกต้อง" : "ยังไม่ถูก"}: ${item.e}`;
  $$(".quiz-tab").forEach((btn) => btn.classList.toggle("active", Number(btn.dataset.set) === activeSet));
  typeset();
}

function bindEvents() {
  $("#menuBtn").addEventListener("click", () => $("#sideNav").classList.toggle("open"));
  $$("#sideNav a").forEach((a) => a.addEventListener("click", () => $("#sideNav").classList.remove("open")));
  $$(".force-chip").forEach((btn) => btn.addEventListener("click", () => renderForceDetail(btn.dataset.force)));
  $("#fbdSelect").addEventListener("change", renderFbd);
  ["#f1", "#f2", "#angle"].forEach((id) => $(id).addEventListener("input", renderResultant));
  ["#netForce", "#mass"].forEach((id) => $(id).addEventListener("input", renderNewton));
  ["#frMass", "#muS", "#muK", "#pullForce"].forEach((id) => $(id).addEventListener("input", renderFriction));
  ["#gM1", "#gM2", "#gR"].forEach((id) => $(id).addEventListener("input", renderGravity));

  $("#quizOptions").addEventListener("click", (event) => {
    const btn = event.target.closest(".quiz-option");
    if (!btn) return;
    answers[activeSet][activeQuestion] = Number(btn.dataset.index);
    renderQuiz();
  });
  $("#prevQuestion").addEventListener("click", () => {
    activeQuestion = Math.max(0, activeQuestion - 1);
    renderQuiz();
  });
  $("#nextQuestion").addEventListener("click", () => {
    activeQuestion = Math.min(9, activeQuestion + 1);
    renderQuiz();
  });
  $("#resetQuiz").addEventListener("click", () => {
    answers[activeSet] = Array(10).fill(null);
    activeQuestion = 0;
    renderQuiz();
  });
  $$(".quiz-tab").forEach((btn) => btn.addEventListener("click", () => {
    activeSet = Number(btn.dataset.set);
    activeQuestion = 0;
    renderQuiz();
  }));
}

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  renderForceDetail();
  renderFbd();
  renderResultant();
  renderNewton();
  renderFriction();
  renderGravity();
  renderQuiz();
});
