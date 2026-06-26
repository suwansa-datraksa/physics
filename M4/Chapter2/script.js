const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const fmt = (value, digits = 2) => Number(value).toFixed(digits);

const menuButton = $(".menu-button");
const siteNav = $("#site-nav");
menuButton.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

siteNav.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    siteNav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

function setupHero() {
  const canvas = $("#heroCanvas");
  const ctx = canvas.getContext("2d");
  const readout = $("#heroX");
  let t = 0;

  function draw() {
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f7fbff";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#dce5ef";
    ctx.lineWidth = 1;
    for (let x = 70; x < width - 50; x += 58) {
      ctx.beginPath();
      ctx.moveTo(x, 76);
      ctx.lineTo(x, height - 80);
      ctx.stroke();
    }

    const originX = width / 2;
    const axisY = height * 0.62;
    ctx.strokeStyle = "#a9bed4";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(70, axisY);
    ctx.lineTo(width - 70, axisY);
    ctx.stroke();

    ctx.fillStyle = "#5d6a7c";
    ctx.font = "700 18px Tahoma";
    ctx.fillText("-x", 70, axisY + 34);
    ctx.fillText("0", originX - 6, axisY + 34);
    ctx.fillText("+x", width - 92, axisY + 34);

    const x = Math.sin(t) * 7.2;
    const carX = originX + (x / 10) * (width * 0.38);
    readout.textContent = `${fmt(x, 1)} m`;

    ctx.strokeStyle = "#2267c7";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 7]);
    ctx.beginPath();
    ctx.moveTo(originX, axisY - 52);
    ctx.lineTo(carX, axisY - 52);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#2267c7";
    ctx.beginPath();
    ctx.arc(originX, axisY, 7, 0, Math.PI * 2);
    ctx.fill();

    drawCar(ctx, carX - 42, axisY - 56, 84, "#f4b942");
    t += 0.018;
    requestAnimationFrame(draw);
  }

  draw();
}

function drawCar(ctx, x, y, width, color) {
  const height = width * 0.42;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y + height * 0.22, width, height * 0.58, 8);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(x + width * 0.2, y, width * 0.38, height * 0.32, 6);
  ctx.fill();
  ctx.fillStyle = "#213047";
  [x + width * 0.22, x + width * 0.76].forEach((cx) => {
    ctx.beginPath();
    ctx.arc(cx, y + height * 0.82, width * 0.09, 0, Math.PI * 2);
    ctx.fill();
  });
}

function setupPosition() {
  const slider = $("#positionSlider");
  const car = $("#positionCar");
  const output = $("#positionValue");

  function update() {
    const x = Number(slider.value);
    const percent = 50 + (x / 10) * 42;
    car.style.left = `${percent}%`;
    output.textContent = `x = ${fmt(x, 1)} m`;
  }

  slider.addEventListener("input", update);
  update();
}

function setupWalk() {
  const forward = $("#walkForward");
  const back = $("#walkBack");
  const output = $("#walkOutput");
  const canvas = $("#walkCanvas");
  const ctx = canvas.getContext("2d");

  function update() {
    const f = Number(forward.value);
    const b = Number(back.value);
    const distance = f + b;
    const displacement = f - b;
    output.textContent = `ระยะทาง ${distance} m, การกระจัด ${displacement} m`;

    const w = canvas.width;
    const h = canvas.height;
    const startX = 80;
    const scale = (w - 160) / 16;
    const y = h * 0.55;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#dce5ef";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 16; i += 2) {
      const x = startX + i * scale;
      ctx.beginPath();
      ctx.moveTo(x, 42);
      ctx.lineTo(x, h - 38);
      ctx.stroke();
      ctx.fillStyle = "#5d6a7c";
      ctx.font = "14px Tahoma";
      ctx.fillText(String(i), x - 5, h - 16);
    }
    ctx.strokeStyle = "#a9bed4";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(w - 80, y);
    ctx.stroke();

    const midX = startX + f * scale;
    const endX = startX + displacement * scale;
    drawArrow(ctx, startX, y - 28, midX, y - 28, "#2267c7");
    drawArrow(ctx, midX, y - 58, endX, y - 58, "#d94a38");
    drawArrow(ctx, startX, y + 36, endX, y + 36, "#0f8c8d");

    ctx.fillStyle = "#172033";
    ctx.font = "700 16px Tahoma";
    ctx.fillText("เริ่ม", startX - 16, y + 26);
    ctx.fillText("สุดท้าย", endX - 24, y + 64);
  }

  forward.addEventListener("input", update);
  back.addEventListener("input", update);
  update();
}

function drawArrow(ctx, x1, y1, x2, y2, color) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 12 * Math.cos(angle - Math.PI / 6), y2 - 12 * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - 12 * Math.cos(angle + Math.PI / 6), y2 - 12 * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}

function setupSpeed() {
  const distance = $("#distanceInput");
  const disp = $("#dispInput");
  const time = $("#timeInput");
  const output = $("#speedOutput");

  function update() {
    const t = Math.max(0.1, Number(time.value));
    const speed = Math.max(0, Number(distance.value)) / t;
    const velocity = Number(disp.value) / t;
    output.textContent = `อัตราเร็วเฉลี่ย ${fmt(speed)} m/s, ความเร็วเฉลี่ย ${fmt(velocity)} m/s`;
  }

  [distance, disp, time].forEach((input) => input.addEventListener("input", update));
  update();
}

function setupAcceleration() {
  const vi = $("#viInput");
  const vf = $("#vfInput");
  const dt = $("#dtInput");
  const output = $("#accelOutput");

  function update() {
    const a = (Number(vf.value) - Number(vi.value)) / Math.max(0.1, Number(dt.value));
    const sign = a > 0 ? "เร็วขึ้น" : a < 0 ? "ช้าลง (หรือเปลี่ยนทิศ)" : "ความเร็วคงตัว";
    output.textContent = `a = ${fmt(a)} m/s²  (${sign})`;
  }

  [vi, vf, dt].forEach((input) => input.addEventListener("input", update));
  update();
}

function setupGraphs() {
  const x0Slider = $("#x0Slider");
  const uSlider = $("#uSlider");
  const aSlider = $("#aSlider");
  const canvas = $("#graphCanvas");
  const ctx = canvas.getContext("2d");
  const hint = $("#graphHint");
  let graphType = "x";

  const hints = {
    x: "กราฟ x-t: เส้นโค้งเมื่อมีความเร่ง — ความชันของเส้นสัมผัส ณ จุดใดคือ ความเร็วขณะหนึ่ง ณ จุดนั้น",
    v: "กราฟ v-t: ความชันของกราฟ = ความเร่ง | พื้นที่ใต้กราฟ = การกระจัด Δx | กราฟเส้นตรง = ความเร่งคงตัว",
    a: "กราฟ a-t: เมื่อความเร่งคงตัว กราฟเป็นเส้นขนานแกนเวลา | พื้นที่ใต้กราฟ = การเปลี่ยนความเร็ว Δv",
  };

  function valueAt(t, type) {
    const x0 = Number(x0Slider.value);
    const u = Number(uSlider.value);
    const a = Number(aSlider.value);
    if (type === "x") return x0 + u * t + 0.5 * a * t * t;
    if (type === "v") return u + a * t;
    return a;
  }

  function draw() {
    const x0 = Number(x0Slider.value);
    const u = Number(uSlider.value);
    const a = Number(aSlider.value);
    $("#x0Readout").textContent = fmt(x0, 1);
    $("#uReadout").textContent = fmt(u, 1);
    $("#aReadout").textContent = fmt(a, 2);
    hint.textContent = hints[graphType];

    // Sync canvas resolution to its CSS display size
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const pad = Math.round(52 * dpr);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    const samples = Array.from({ length: 121 }, (_, i) => {
      const t = (i / 120) * 8;
      return { t, y: valueAt(t, graphType) };
    });

    // Compute a nice integer yMax so grid labels are exact integers
    const maxAbs = Math.max(1, ...samples.map((p) => Math.abs(p.y)));
    const rawMax = Math.ceil(maxAbs);
    // Pick step size so we get 4-6 grid lines above and below zero
    let step = 1;
    if (rawMax > 20) step = 10;
    else if (rawMax > 10) step = 5;
    else if (rawMax > 5) step = 2;
    const yMax = Math.ceil(rawMax / step) * step;

    const plotLeft = pad;
    const plotRight = w - Math.round(30 * dpr);
    const plotTop = Math.round(30 * dpr);
    const plotBottom = h - pad;

    const xMap = (t) => plotLeft + (t / 8) * (plotRight - plotLeft);
    const yMap = (y) => plotTop + (plotBottom - plotTop) * (1 - (y + yMax) / (2 * yMax));

    // Grid lines and labels at exact integer multiples of step
    ctx.font = `${Math.round(12 * dpr)}px Tahoma`;
    ctx.textBaseline = "middle";
    for (let val = -yMax; val <= yMax; val += step) {
      const py = yMap(val);
      ctx.strokeStyle = val === 0 ? "#b0bcc8" : "#e5edf5";
      ctx.lineWidth = val === 0 ? Math.round(1.5 * dpr) : Math.round(dpr);
      ctx.beginPath();
      ctx.moveTo(plotLeft, py);
      ctx.lineTo(plotRight, py);
      ctx.stroke();
      if (val !== 0) {
        ctx.fillStyle = "#5d6a7c";
        ctx.textAlign = "right";
        ctx.fillText(String(val), plotLeft - Math.round(4 * dpr), py);
      }
    }

    // Vertical time grid lines
    ctx.textBaseline = "top";
    ctx.textAlign = "center";
    for (let t = 0; t <= 8; t += 1) {
      const px = xMap(t);
      ctx.strokeStyle = "#e5edf5";
      ctx.lineWidth = Math.round(dpr);
      ctx.beginPath();
      ctx.moveTo(px, plotTop);
      ctx.lineTo(px, plotBottom);
      ctx.stroke();
      ctx.fillStyle = "#5d6a7c";
      ctx.fillText(String(t), px, plotBottom + Math.round(4 * dpr));
    }

    // Axes
    ctx.strokeStyle = "#172033";
    ctx.lineWidth = Math.round(2 * dpr);
    ctx.beginPath();
    // X-axis (y=0)
    ctx.moveTo(plotLeft, yMap(0));
    ctx.lineTo(plotRight, yMap(0));
    // Y-axis
    ctx.moveTo(plotLeft, plotTop);
    ctx.lineTo(plotLeft, plotBottom);
    ctx.stroke();

    // Data line
    ctx.strokeStyle = graphType === "x" ? "#2267c7" : graphType === "v" ? "#0f8c8d" : "#d94a38";
    ctx.lineWidth = Math.round(3 * dpr);
    ctx.lineJoin = "round";
    ctx.beginPath();
    samples.forEach((point, index) => {
      const px = xMap(point.t);
      const py = yMap(point.y);
      if (index === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = "#172033";
    ctx.font = `bold ${Math.round(12 * dpr)}px Tahoma`;
    ctx.textBaseline = "bottom";
    ctx.textAlign = "right";
    ctx.fillText("t (s)", plotRight, plotBottom - Math.round(2 * dpr));
    const yLabel = graphType === "x" ? "x (m)" : graphType === "v" ? "v (m/s)" : "a (m/s\u00b2)";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(yLabel, Math.round(2 * dpr), plotTop);
  }

  $$(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".tab").forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      graphType = tab.dataset.graph;
      draw();
    });
  });

  [x0Slider, uSlider, aSlider].forEach((input) => input.addEventListener("input", draw));

  // Redraw whenever the canvas display size changes (window resize, etc.)
  if (typeof ResizeObserver !== "undefined") {
    new ResizeObserver(draw).observe(canvas);
  }

  draw();
}

function setupEquations() {
  const constInputs = [$("#constX0"), $("#constV"), $("#constT")];
  const kinInputs = [$("#kinU"), $("#kinA"), $("#kinT")];

  function updateConst() {
    const [x0, v, t] = constInputs.map((input) => Number(input.value));
    $("#constOutput").textContent = `x = ${fmt(x0 + v * t)} m`;
  }

  function updateKin() {
    const [u, a, t] = kinInputs.map((input) => Number(input.value));
    const v = u + a * t;
    const dx = u * t + 0.5 * a * t * t;
    const v2 = u * u + 2 * a * dx;
    $("#kinOutput").textContent = `v = ${fmt(v)} m/s, Δx = ${fmt(dx)} m, v² = ${fmt(v2, 1)} m²/s²`;
  }

  constInputs.forEach((input) => input.addEventListener("input", updateConst));
  kinInputs.forEach((input) => input.addEventListener("input", updateKin));
  updateConst();
  updateKin();
}

function setupFreeFall() {
  const time = $("#fallTime");
  const output = $("#fallOutput");
  const canvas = $("#fallCanvas");
  const ctx = canvas.getContext("2d");

  function update() {
    const t = Number(time.value);
    const g = 9.8;
    const y = 0.5 * g * t * t;
    const v = g * t;
    output.textContent = `t = ${fmt(t, 1)} s   |   y = ½gt² = ${fmt(y)} m   |   v = gt = ${fmt(v)} m/s ↓`;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#f7fbff";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#dce5ef";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(160, 44);
    ctx.lineTo(160, h - 44);
    ctx.stroke();
    ctx.fillStyle = "#5d6a7c";
    ctx.font = "14px Tahoma";
    ctx.fillText("จุดปล่อย", 82, 52);
    ctx.fillText("พื้น", 132, h - 18);

    const ballY = clamp(54 + (y / 122.5) * (h - 120), 54, h - 54);
    ctx.strokeStyle = "#2267c7";
    ctx.lineWidth = 3;
    ctx.setLineDash([7, 7]);
    ctx.beginPath();
    ctx.moveTo(160, 54);
    ctx.lineTo(160, ballY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#2267c7";
    ctx.beginPath();
    ctx.arc(160, ballY, 20, 0, Math.PI * 2);
    ctx.fill();

    drawArrow(ctx, 230, 72, 230, ballY, "#0f8c8d");
    ctx.fillStyle = "#0f274f";
    ctx.font = "700 20px Tahoma";
    ctx.fillText("g = 9.8 m/s²", 270, 96);
    ctx.font = "16px Tahoma";
    ctx.fillText("y = \u00bdgt\u00b2", 270, 122);
    ctx.fillText("v = gt", 270, 146);
    ctx.fillStyle = "#5d6a7c";
    ctx.font = "14px Tahoma";
    ctx.fillText("(ไม่คิดแรงต้านอากาศ)", 270, 170);
  }

  time.addEventListener("input", update);
  update();
}

// ===================================================
// Quiz Data — อ้างอิงจากหนังสือเรียน สสวท. บทที่ 2
// ===================================================
const quizSets = [
  // ชุดที่ 1 — ความรู้พื้นฐาน
  [
    {
      q: "ในการระบุตำแหน่งของวัตถุในการเคลื่อนที่แนวตรง สิ่งใดจำเป็นที่สุด",
      c: ["จุดอ้างอิงและแกนพิกัดที่มีทิศกำหนด", "มวลของวัตถุ", "สีของวัตถุ", "อุณหภูมิแวดล้อม"],
      a: 0,
      e: "ต้องระบุจุดอ้างอิง (origin) และกำหนดแกนพิกัดพร้อมทิศบวก เพื่อบอกทั้งระยะห่างและทิศทางของวัตถุ (ตำแหน่งเป็นปริมาณเวกเตอร์)",
    },
    {
      q: "รถยนต์อยู่ที่ตำแหน่ง x = +4 m ต่อมาเคลื่อนที่ไปอยู่ที่ x = −8 m การกระจัดมีค่าเท่าใด",
      c: ["−12 m", "+12 m", "−4 m", "+4 m"],
      a: 0,
      e: "Δx = x_f − x_i = (−8) − (+4) = −12 m เครื่องหมายลบบอกว่าเคลื่อนที่ไปทางซ้ายของแกน x (จากตัวอย่าง 2.1 ตำรา สสวท.)",
    },
    {
      q: "เดินไปทาง +x ระยะ 6 m แล้วกลับมาทาง −x ระยะ 4 m ระยะทางรวมและขนาดการกระจัดเป็นเท่าใด",
      c: ["ระยะทาง 10 m, การกระจัด 2 m", "ระยะทาง 2 m, การกระจัด 10 m", "ระยะทาง 10 m, การกระจัด 10 m", "ระยะทาง 2 m, การกระจัด 2 m"],
      a: 0,
      e: "ระยะทาง = 6 + 4 = 10 m (ความยาวตามเส้นทางจริง), |Δx| = |6 − 4| = 2 m (การกระจัดเป็นระยะห่างจากจุดเริ่มถึงจุดสุดท้าย)",
    },
    {
      q: "ปริมาณใดต่อไปนี้เป็นปริมาณเวกเตอร์",
      c: ["ระยะทาง", "อัตราเร็ว", "การกระจัด", "มวล"],
      a: 2,
      e: "การกระจัด (displacement) เป็นปริมาณเวกเตอร์ มีทั้งขนาดและทิศทาง ส่วนระยะทาง อัตราเร็ว และมวลเป็นปริมาณสเกลาร์",
    },
    {
      q: "อัตราเร็วเฉลี่ยคำนวณจากสิ่งใด",
      c: ["การกระจัด ÷ เวลา", "ระยะทาง ÷ เวลา", "เวลา ÷ ระยะทาง", "ความเร่ง × เวลา"],
      a: 1,
      e: "อัตราเร็วเฉลี่ย = ระยะทาง/เวลา (สเกลาร์) ส่วนความเร็วเฉลี่ย = การกระจัด/เวลา (เวกเตอร์) ทั้งสองมีหน่วย m/s",
    },
    {
      q: "ความเร็วเฉลี่ยในแนวแกน x คือ v̄ = Δx/Δt เมื่อวัตถุเคลื่อนที่กลับทิศ ความสัมพันธ์ใดถูกต้อง",
      c: [
        "ขนาดความเร็วเฉลี่ย ≤ อัตราเร็วเฉลี่ย เสมอ",
        "ขนาดความเร็วเฉลี่ย > อัตราเร็วเฉลี่ย เสมอ",
        "ขนาดความเร็วเฉลี่ย = อัตราเร็วเฉลี่ย เสมอ",
        "ไม่มีความสัมพันธ์กัน",
      ],
      a: 0,
      e: "เมื่อวัตถุกลับทิศ ระยะทาง > |Δx| จึงทำให้อัตราเร็วเฉลี่ย ≥ |ความเร็วเฉลี่ย| (สมการ 2.2 และ 2.3 จากตำรา สสวท.)",
    },
    {
      q: "ความเร่งเฉลี่ย a = Δv/Δt ถ้า v เปลี่ยนจาก +5 m/s เป็น +3 m/s ใน 2 s ความเร่งเฉลี่ยมีค่าเท่าใด",
      c: ["−1 m/s²", "+1 m/s²", "+4 m/s²", "−4 m/s²"],
      a: 0,
      e: "a = (v_f − v_i)/Δt = (3 − 5)/2 = −1 m/s² ค่าลบแสดงว่าความเร่งมีทิศตรงข้ามกับความเร็ว (วัตถุช้าลง)",
    },
    {
      q: "ความชันของกราฟตำแหน่ง (x) กับเวลา (t) บอกถึงปริมาณใด",
      c: ["ความเร็ว", "ความเร่ง", "แรง", "การกระจัด"],
      a: 0,
      e: "slope ของ x-t = Δx/Δt = ความเร็วเฉลี่ย และ slope ของเส้นสัมผัส ณ จุดใด ๆ = ความเร็วขณะหนึ่ง ณ จุดนั้น",
    },
    {
      q: "พื้นที่ใต้กราฟความเร็ว (v) กับเวลา (t) บอกถึงปริมาณใด",
      c: ["การกระจัด Δx", "ความเร่ง", "ระยะทาง", "แรง"],
      a: 0,
      e: "พื้นที่ใต้กราฟ v-t = ∫v dt = Δx (การกระจัด) ซึ่งได้ทั้งขนาดและเครื่องหมาย (ทิศทาง)",
    },
    {
      q: "การตกแบบเสรีใกล้ผิวโลก (ไม่คิดแรงต้านอากาศ) มีความเร่งประมาณเท่าใด",
      c: ["1.0 m/s²", "4.9 m/s²", "9.8 m/s²", "98 m/s²"],
      a: 2,
      e: "ความเร่งโน้มถ่วง g ≈ 9.8 m/s² ลงด้านล่าง วัตถุทุกชนิดมีค่านี้เท่ากัน ไม่ขึ้นกับมวล (กาลิเลโอ)",
    },
  ],
  // ชุดที่ 2 — การคิดวิเคราะห์
  [
    {
      q: "วัตถุมีตำแหน่ง x(0) = +4 m, x(1) = +8 m, x(3) = −8 m การกระจัดในช่วง t = 0 ถึง t = 3 s คือเท่าใด",
      c: ["−12 m", "+12 m", "−4 m", "+20 m"],
      a: 0,
      e: "Δx = x_f − x_i = (−8) − (+4) = −12 m ส่วนระยะทางรวมคือ 4 + 16 = 20 m ≠ |Δx| เพราะมีการกลับทิศ (ตัวอย่าง 2.1 ข. ตำรา)",
    },
    {
      q: "วัตถุเคลื่อนที่กลับมาที่จุดเริ่มต้น การกระจัดและระยะทางเป็นอย่างไร",
      c: ["การกระจัด = 0, ระยะทาง > 0", "การกระจัด = 0, ระยะทาง = 0", "การกระจัด > 0, ระยะทาง > 0", "การกระจัด < 0, ระยะทาง > 0"],
      a: 0,
      e: "เมื่อ x_f = x_i → Δx = 0 แต่วัตถุยังเดินทางผ่านเส้นทาง ระยะทาง d > 0 เสมอ",
    },
    {
      q: "ถ้าความเร็วเฉลี่ยในช่วงเวลาหนึ่งเป็นศูนย์ หมายความว่าอะไร",
      c: [
        "วัตถุอาจเคลื่อนที่แล้วกลับมาจุดเดิมได้",
        "วัตถุหยุดนิ่งตลอด",
        "ความเร็วทุกขณะเป็นศูนย์",
        "ระยะทางรวมเป็นศูนย์",
      ],
      a: 0,
      e: "ความเร็วเฉลี่ย = Δx/Δt = 0 หมายถึง Δx = 0 คือ x_f = x_i วัตถุอาจเคลื่อนที่ไปแล้วกลับมาจุดเริ่ม (ชวนคิด 2.5 ตำรา)",
    },
    {
      q: "ความเร่งเป็น +1 m/s² และความเร็วเริ่มต้นเป็น −5 m/s วัตถุจะเป็นอย่างไร",
      c: [
        "วัตถุช้าลง (เพราะความเร่งและความเร็วทิศตรงข้าม)",
        "วัตถุเร็วขึ้น (เพราะความเร่งเป็นบวก)",
        "วัตถุหยุดทันที",
        "ความเร็วไม่เปลี่ยน",
      ],
      a: 0,
      e: "ความเร็ว −5 m/s (ทิศลบ) และความเร่ง +1 m/s² (ทิศบวก) — ทิศตรงข้ามกัน → วัตถุเคลื่อนที่ช้าลง (ข้อสังเกต 2.4 ตำรา)",
    },
    {
      q: "กราฟ v-t เป็นเส้นตรงเอียงลาดลง ความเร่งและการเคลื่อนที่เป็นอย่างไร",
      c: [
        "ความเร่งคงตัวและเป็นลบ",
        "ความเร่งคงตัวและเป็นบวก",
        "ความเร่งเป็นศูนย์",
        "ความเร่งเปลี่ยนตลอด",
      ],
      a: 0,
      e: "slope ของ v-t = Δv/Δt = ความเร่ง ถ้ากราฟเส้นตรงเอียงลง → slope < 0 → ความเร่งเป็นลบและคงตัว",
    },
    {
      q: "สมการ v_x = u_x + a_x·t ใช้ได้ในกรณีใด",
      c: [
        "ความเร่งมีค่าคงตัว",
        "ความเร็วต้องเป็นศูนย์เท่านั้น",
        "มวลคงตัวเท่านั้น",
        "ใช้ได้ทุกกรณี",
      ],
      a: 0,
      e: "สมการ 2.16 จากตำรา สสวท. ใช้ได้เฉพาะกรณีที่ a มีค่าคงตัวตลอดช่วงเวลาเท่านั้น",
    },
    {
      q: "รถยนต์ u = +30 m/s มีความเร่ง a = −5 m/s² ก่อนหยุด รถเคลื่อนที่ได้ระยะทางเท่าใดก่อนหยุด",
      c: ["90 m", "150 m", "30 m", "60 m"],
      a: 0,
      e: "v² = u² + 2aΔx → 0 = 30² + 2(−5)Δx → Δx = 900/10 = 90 m (ตัวอย่าง 2.14 ค. จากตำรา สสวท.)",
    },
    {
      q: "พื้นที่ใต้กราฟ a-t บอกถึงปริมาณใด",
      c: ["การเปลี่ยนความเร็ว Δv", "การกระจัด Δx", "ตำแหน่งเริ่มต้น", "มวล"],
      a: 0,
      e: "พื้นที่ใต้กราฟ a-t = ∫a dt = Δv (การเปลี่ยนความเร็ว) จากนั้นหาความเร็ว ณ เวลาใด ๆ ได้จาก v_f = v_i + Δv",
    },
    {
      q: "โยนวัตถุขึ้นในแนวดิ่ง ณ จุดสูงสุดข้อใดถูกต้อง",
      c: [
        "ความเร็วเป็นศูนย์ชั่วขณะ แต่ยังมีความเร่ง g ลงอยู่",
        "ทั้งความเร็วและความเร่งเป็นศูนย์",
        "ความเร็วเป็นศูนย์ และไม่มีความเร่ง",
        "ความเร็วมีค่าสูงสุด",
      ],
      a: 0,
      e: "ที่จุดสูงสุด v_y = 0 แต่ความเร่ง g = 9.8 m/s² ยังคงมีอยู่ตลอดเวลา (แรงโน้มถ่วงไม่หยุดทำงาน)",
    },
    {
      q: "สมการ v² = u² + 2aΔx มีประโยชน์อย่างไร",
      c: [
        "หาความเร็วหรือการกระจัดโดยไม่ต้องรู้เวลา t",
        "ใช้ได้เฉพาะเมื่อวัตถุหยุดนิ่ง",
        "หาแรงที่กระทำกับวัตถุ",
        "คำนวณพลังงาน",
      ],
      a: 0,
      e: "สมการ 2.19 จากตำรา สสวท. ใช้เมื่อทราบ u, a, Δx แต่ไม่ทราบ t เช่น หาระยะเบรกของรถก่อนหยุด",
    },
  ],
];

let activeQuizSet = 0;
let currentQuestion = 0;
let quizScore = 0;
let answered = false;

const LETTERS = ['ก', 'ข', 'ค', 'ง'];

function renderQuestion() {
  const questions = quizSets[activeQuizSet];
  const total = questions.length;
  const item = questions[currentQuestion];

  // Progress
  const pct = Math.round(((currentQuestion + 1) / total) * 100);
  $('#quizProgressFill').style.width = pct + '%';
  $('#quizProgressLabel').textContent = `ข้อ ${currentQuestion + 1} / ${total}`;

  // Hide result box, show card
  $('#quizResult').classList.remove('show');
  $('#quizNextBtn').classList.remove('show');

  answered = false;

  const card = document.createElement('div');
  card.className = 'question-card';
  card.innerHTML = `
    <h3>${currentQuestion + 1}. ${item.q}</h3>
    <div class="choices" id="choicesContainer">
      ${item.c.map((choice, i) => `
        <button class="choice-btn" type="button" data-index="${i}">
          <span class="choice-letter">${LETTERS[i]}</span>
          <span class="choice-text">${choice}</span>
        </button>
      `).join('')}
    </div>
    <div class="feedback" id="feedbackBox"></div>
  `;

  $('#quizCard').innerHTML = '';
  $('#quizCard').appendChild(card);

  // Attach click handlers to choices
  card.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => handleAnswer(btn, item));
  });

  // Re-typeset MathJax if available
  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise([card]).catch(() => { });
  }
}

function handleAnswer(clickedBtn, item) {
  if (answered) return;
  answered = true;

  const chosen = Number(clickedBtn.dataset.index);
  const correct = item.a;
  const isCorrect = chosen === correct;

  if (isCorrect) quizScore++;

  // Disable all buttons
  const allBtns = $$('.choice-btn');
  allBtns.forEach(btn => {
    btn.disabled = true;
    const idx = Number(btn.dataset.index);
    if (idx === correct) {
      btn.classList.add('correct-answer');
    } else if (idx === chosen && !isCorrect) {
      btn.classList.add('wrong-answer');
    }
  });

  // Show feedback
  const fb = $('#feedbackBox');
  fb.classList.remove('correct', 'wrong');
  if (isCorrect) {
    fb.classList.add('show', 'correct');
    fb.innerHTML = `<strong>✓ ถูกต้อง!</strong><br>${item.e}`;
  } else {
    fb.classList.add('show', 'wrong');
    fb.innerHTML = `<strong>✗ ไม่ถูกต้อง</strong> — คำตอบที่ถูกคือ <strong>${item.c[correct]}</strong><br><br>${item.e}`;
  }

  // Show Next button
  const questions = quizSets[activeQuizSet];
  const isLast = currentQuestion >= questions.length - 1;
  const nextBtn = $('#quizNextBtn');
  nextBtn.classList.add('show');
  nextBtn.textContent = isLast ? 'ดูผลคะแนน →' : 'ถัดไป →';
}

function showResult() {
  $('#quizCard').innerHTML = '';
  $('#quizNextBtn').classList.remove('show');

  const total = quizSets[activeQuizSet].length;
  const pct = Math.round((quizScore / total) * 100);

  let emoji = '📚';
  let label = 'ทบทวนเนื้อหาแล้วลองใหม่นะคะ';
  if (quizScore === total) { emoji = '🎉'; label = 'เยี่ยมมาก! ทำได้ถูกทุกข้อ!'; }
  else if (pct >= 80) { emoji = '👍'; label = 'ดีมาก! ผ่านเกณฑ์แล้ว'; }
  else if (pct >= 60) { emoji = '🙂'; label = 'พอใช้ได้ ทบทวนเพิ่มได้อีก'; }

  $('#resultEmoji').textContent = emoji;
  $('#resultScore').textContent = `${quizScore}/${total}`;
  $('#resultLabel').textContent = label;
  $('#quizResult').classList.add('show');

  // Update progress to 100%
  $('#quizProgressFill').style.width = '100%';
  $('#quizProgressLabel').textContent = `เสร็จสิ้น ${total}/${total} ข้อ`;
}

function startQuiz() {
  currentQuestion = 0;
  quizScore = 0;
  answered = false;
  $('#quizResult').classList.remove('show');
  renderQuestion();
}

function setupQuiz() {
  $$('.quiz-set').forEach(button => {
    button.addEventListener('click', () => {
      $$('.quiz-set').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      activeQuizSet = Number(button.dataset.set);
      startQuiz();
    });
  });

  $('#quizNextBtn').addEventListener('click', () => {
    const questions = quizSets[activeQuizSet];
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      renderQuestion();
    } else {
      showResult();
    }
  });

  $('#quizRestartBtn').addEventListener('click', startQuiz);
  $('#quizRetryBtn').addEventListener('click', startQuiz);

  startQuiz();
}

setupHero();
setupPosition();
setupWalk();
setupSpeed();
setupAcceleration();
setupGraphs();
setupEquations();
setupFreeFall();
setupQuiz();

// ===================================================
// Static Demo Graphs (from textbook figures 2.13-2.15)
// ===================================================

function drawStaticGraph(canvasId, drawFn) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  function render() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height || 340 * dpr);
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = Math.round(340 * dpr);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFn(ctx, canvas.width, canvas.height, dpr);
  }
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(render).observe(canvas);
  } else {
    render();
  }
  render();
}

function drawDemoAxes(ctx, w, h, dpr, pad, yMin, yMax, tMax, yLabel, tLabel) {
  const pL = pad, pR = w - Math.round(24 * dpr), pT = Math.round(28 * dpr), pB = h - pad;
  const yRange = yMax - yMin;

  const xMap = t => pL + (t / tMax) * (pR - pL);
  const yMap = y => pB - ((y - yMin) / yRange) * (pB - pT);

  // grid
  ctx.strokeStyle = '#e5edf5';
  ctx.lineWidth = dpr;
  const yStep = yRange / 6;
  for (let i = 0; i <= 6; i++) {
    const yv = yMin + i * yStep;
    const py = yMap(yv);
    ctx.beginPath(); ctx.moveTo(pL, py); ctx.lineTo(pR, py); ctx.stroke();
  }
  for (let t = 0; t <= tMax; t++) {
    const px = xMap(t);
    ctx.beginPath(); ctx.moveTo(px, pT); ctx.lineTo(px, pB); ctx.stroke();
  }

  // zero line
  ctx.strokeStyle = '#aabfd4';
  ctx.lineWidth = 1.5 * dpr;
  ctx.beginPath(); ctx.moveTo(pL, yMap(0)); ctx.lineTo(pR, yMap(0)); ctx.stroke();

  // axes
  ctx.strokeStyle = '#172033';
  ctx.lineWidth = 2 * dpr;
  ctx.beginPath();
  ctx.moveTo(pL, pB); ctx.lineTo(pR, pB); // t-axis
  ctx.moveTo(pL, pT); ctx.lineTo(pL, pB); // y-axis
  ctx.stroke();

  // labels
  ctx.fillStyle = '#5d6a7c';
  ctx.font = `${Math.round(11 * dpr)}px Tahoma`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let t = 0; t <= tMax; t++) {
    ctx.fillText(t, xMap(t), pB + Math.round(4 * dpr));
  }
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const steps = [yMin, yMin + yStep * 2, yMin + yStep * 4, yMax];
  steps.forEach(yv => {
    if (Math.abs(yv) > 0.01)
      ctx.fillText(Math.round(yv), pL - Math.round(4 * dpr), yMap(yv));
  });

  // axis titles
  ctx.fillStyle = '#172033';
  ctx.font = `bold ${Math.round(12 * dpr)}px Tahoma`;
  ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
  ctx.fillText(tLabel, pR, pB - Math.round(4 * dpr));
  ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.fillText(yLabel, Math.round(4 * dpr), pT);

  return { xMap, yMap, pL, pR, pT, pB };
}

// x-t graph (from textbook fig 2.13): piecewise linear
// x(0)=4, x(1)=8, x(2)=0, x(3)=-8
function drawXtDemoGraph(ctx, w, h, dpr) {
  const pad = Math.round(46 * dpr);
  const pts = [[0, 4], [1, 8], [2, 0], [3, -8]];
  const { xMap, yMap, pL } = drawDemoAxes(ctx, w, h, dpr, pad, -10, 12, 3, 'x (m)', 't (s)');

  // shaded area below curve (first segment only, positive)
  ctx.fillStyle = 'rgba(34,103,199,0.09)';
  ctx.beginPath();
  ctx.moveTo(xMap(0), yMap(0));
  ctx.lineTo(xMap(0), yMap(4));
  ctx.lineTo(xMap(1), yMap(8));
  ctx.lineTo(xMap(1), yMap(0));
  ctx.closePath();
  ctx.fill();

  // draw x-t line
  ctx.strokeStyle = '#2267c7';
  ctx.lineWidth = 3 * dpr;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  pts.forEach(([t, x], i) => {
    const px = xMap(t), py = yMap(x);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  });
  ctx.stroke();

  // tangent line at t=1 (slope changes from +4 to -8)
  ctx.strokeStyle = 'rgba(15,140,141,0.6)';
  ctx.lineWidth = 2 * dpr;
  ctx.setLineDash([6 * dpr, 4 * dpr]);
  ctx.beginPath();
  ctx.moveTo(xMap(0.5), yMap(6)); // slope ~+4 from 0 to 1
  ctx.lineTo(xMap(1.5), yMap(6));
  ctx.stroke();
  ctx.setLineDash([]);

  // dots at key points
  pts.forEach(([t, x]) => {
    ctx.fillStyle = '#2267c7';
    ctx.beginPath();
    ctx.arc(xMap(t), yMap(x), 5 * dpr, 0, Math.PI * 2);
    ctx.fill();
    // labels
    ctx.fillStyle = '#0f274f';
    ctx.font = `bold ${Math.round(10 * dpr)}px Tahoma`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`(${t},${x})`, xMap(t) + 6 * dpr, yMap(x) - 2 * dpr);
  });

  // slope annotations
  ctx.fillStyle = '#2267c7';
  ctx.font = `${Math.round(10 * dpr)}px Tahoma`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('slope = +4 m/s', xMap(0.5), yMap(7));
  ctx.fillStyle = '#d94a38';
  ctx.fillText('slope = −8 m/s', xMap(2), yMap(3));
}

// v-t graph (from textbook fig 2.14): piecewise constant
// v(0–1s)=+4, v(1–3s)=−8
function drawVtDemoGraph(ctx, w, h, dpr) {
  const pad = Math.round(46 * dpr);
  const { xMap, yMap } = drawDemoAxes(ctx, w, h, dpr, pad, -12, 8, 3, 'v (m/s)', 't (s)');

  // shaded areas
  // positive area (0-1s)
  ctx.fillStyle = 'rgba(34,103,199,0.15)';
  ctx.beginPath();
  ctx.moveTo(xMap(0), yMap(0));
  ctx.lineTo(xMap(0), yMap(4));
  ctx.lineTo(xMap(1), yMap(4));
  ctx.lineTo(xMap(1), yMap(0));
  ctx.closePath();
  ctx.fill();

  // negative area (1-3s)
  ctx.fillStyle = 'rgba(217,74,56,0.12)';
  ctx.beginPath();
  ctx.moveTo(xMap(1), yMap(0));
  ctx.lineTo(xMap(1), yMap(-8));
  ctx.lineTo(xMap(3), yMap(-8));
  ctx.lineTo(xMap(3), yMap(0));
  ctx.closePath();
  ctx.fill();

  // v-t piecewise line
  ctx.strokeStyle = '#0f8c8d';
  ctx.lineWidth = 3.5 * dpr;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(xMap(0), yMap(4));
  ctx.lineTo(xMap(1), yMap(4));
  ctx.lineTo(xMap(1), yMap(-8));
  ctx.lineTo(xMap(3), yMap(-8));
  ctx.stroke();

  // area labels
  ctx.font = `bold ${Math.round(11 * dpr)}px Tahoma`;
  ctx.textAlign = 'center';

  ctx.fillStyle = '#2267c7';
  ctx.textBaseline = 'middle';
  ctx.fillText('+4.0 m/s', xMap(0.5), yMap(2));
  ctx.fillText('พื้นที่ = +4.0 m', xMap(0.5), yMap(1));

  ctx.fillStyle = '#d94a38';
  ctx.fillText('−8.0 m/s', xMap(2), yMap(-4));
  ctx.fillText('พื้นที่ = −8.0 m', xMap(2), yMap(-6));

  // dots
  [[0, 4], [1, 4], [1, -8], [3, -8]].forEach(([t, v]) => {
    ctx.fillStyle = '#0f8c8d';
    ctx.beginPath();
    ctx.arc(xMap(t), yMap(v), 5 * dpr, 0, Math.PI * 2);
    ctx.fill();
  });
}

// a-t graph: constant acceleration (+8 m/s²)
function drawAtDemoGraph(ctx, w, h, dpr) {
  const pad = Math.round(46 * dpr);
  const { xMap, yMap } = drawDemoAxes(ctx, w, h, dpr, pad, -4, 12, 3, 'a (m/s²)', 't (s)');

  // shaded area
  ctx.fillStyle = 'rgba(217,74,56,0.13)';
  ctx.beginPath();
  ctx.moveTo(xMap(0), yMap(0));
  ctx.lineTo(xMap(0), yMap(8));
  ctx.lineTo(xMap(3), yMap(8));
  ctx.lineTo(xMap(3), yMap(0));
  ctx.closePath();
  ctx.fill();

  // a-t line (constant)
  ctx.strokeStyle = '#d94a38';
  ctx.lineWidth = 3.5 * dpr;
  ctx.beginPath();
  ctx.moveTo(xMap(0), yMap(8));
  ctx.lineTo(xMap(3), yMap(8));
  ctx.stroke();

  // area annotation
  ctx.fillStyle = '#d94a38';
  ctx.font = `bold ${Math.round(11 * dpr)}px Tahoma`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('a = +8.0 m/s²  (คงตัว)', xMap(1.5), yMap(8.5));
  ctx.fillText('พื้นที่ = Δv', xMap(1.5), yMap(4));

  ctx.font = `${Math.round(10 * dpr)}px Tahoma`;
  ctx.fillStyle = '#5d6a7c';
  ctx.fillText('ตัวอย่าง: ช่วง 0–0.8s: Δv = 8×0.8 = +6.4 m/s', xMap(1.5), yMap(2));
  ctx.fillText('ช่วง 0–2.3s: Δv = 8×2.3 = +18.4 m/s', xMap(1.5), yMap(1));

  // key time markers
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = dpr;
  ctx.setLineDash([4 * dpr, 3 * dpr]);
  [0.8, 2.3].forEach(t => {
    ctx.beginPath();
    ctx.moveTo(xMap(t), yMap(0));
    ctx.lineTo(xMap(t), yMap(8));
    ctx.stroke();
    ctx.fillStyle = '#172033';
    ctx.font = `${Math.round(10 * dpr)}px Tahoma`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(`t=${t}s`, xMap(t), yMap(0) + 4 * dpr);
  });
  ctx.setLineDash([]);
}

// Initialize static demo graphs after DOM is loaded
function initStaticDemoGraphs() {
  drawStaticGraph('graphXtDemo', drawXtDemoGraph);
  drawStaticGraph('graphVtDemo', drawVtDemoGraph);
  drawStaticGraph('graphAtDemo', drawAtDemoGraph);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStaticDemoGraphs);
} else {
  initStaticDemoGraphs();
}
