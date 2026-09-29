/* Hook Track deck — engine (with auto-loop), animations, demo data, maps and charts. */
'use strict';

/* ===================== helpers ===================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const fmt = n => Math.round(n).toLocaleString('en-US');
const CUR = 'EGP'; // ponytail: one currency label for the whole deck
const rnd = (i, j = 0) => { const x = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453; return x - Math.floor(x); };
function countUp(el, to, { dur = 1100, prefix = '', suffix = '', dec = 0 } = {}) {
  if (!el) return;
  const t0 = performance.now();
  const f = now => {
    const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3), v = to * e;
    el.textContent = prefix + (dec ? v.toFixed(dec) : fmt(v)) + suffix;
    if (p < 1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}

/* ===================== demo data (replace with real exports) ===================== */
const TODAY = 29, DAYS = 30, FIRST_DOW = 2;                 // September 2026 — the 1st is a Tuesday
const dow = d => (FIRST_DOW + d - 1) % 7, isOff = d => dow(d) === 5; // Friday off
const SELL_DAYS = [...Array(DAYS)].filter((_, k) => !isOff(k + 1)).length; // 26
const SELL_ELAPSED = [...Array(TODAY)].filter((_, k) => !isOff(k + 1)).length; // 25

const REPS = [
  { id: 'AS', name: 'Ahmed S.', area: 'Nasr City', color: '#C4601A', mix: .64, today: { planned: 12, done: 9, ordersPlanned: 10, orders: 8, sales: 14250 }, week: { planned: 58, done: 49, orders: 41, sales: 69800 }, month: { planned: 240, done: 212, orders: 176, sales: 236400, target: 250000 } },
  { id: 'MK', name: 'Mona K.', area: 'Heliopolis', color: '#0E8FA0', mix: .58, today: { planned: 10, done: 10, ordersPlanned: 8, orders: 8, sales: 11800 }, week: { planned: 50, done: 47, orders: 39, sales: 61200 }, month: { planned: 210, done: 198, orders: 165, sales: 231000, target: 240000 } },
  { id: 'OH', name: 'Omar H.', area: 'Maadi', color: '#7050C0', mix: .66, today: { planned: 11, done: 6, ordersPlanned: 9, orders: 5, sales: 7900 }, week: { planned: 54, done: 40, orders: 30, sales: 48900 }, month: { planned: 225, done: 181, orders: 140, sales: 176500, target: 240000 } },
  { id: 'SA', name: 'Sara A.', area: 'Downtown', color: '#3A8F3A', mix: .60, today: { planned: 9, done: 7, ordersPlanned: 7, orders: 6, sales: 9600 }, week: { planned: 45, done: 39, orders: 33, sales: 52400 }, month: { planned: 190, done: 171, orders: 150, sales: 214300, target: 220000 } },
];
const repById = id => REPS.find(r => r.id === id);
const CUSTOMERS = {
  'Nasr City': ['Al Noor Supermarket', 'City Mart — Nasr City', 'Fresh Basket', 'Green Valley Grocery', 'Metro Corner Store', 'Al Baraka Market', 'Sunrise Minimarket', 'Golden Basket', 'Star Mart', 'Palm Minimarket', 'Oasis Market', 'Al Amal Grocery'],
  'Heliopolis': ['Roxy Grocery', 'Korba Market', 'Al Salam Supermarket', 'Merryland Minimarket', 'Cleopatra Corner', 'Family Mart Heliopolis', 'Nile Fresh', 'Al Rahma Market', 'Sheraton Grocery', 'Triumph Market', 'Al Ahram Corner', 'Baron Minimarket'],
  'Maadi': ['Degla Market', 'Maadi Corner', 'Zahraa Grocery', 'Road 9 Minimarket', 'Sakanat Supermarket', 'Al Nasr Grocery', 'Green Leaf Grocery', 'Basateen Market', 'Wadi Degla Mart', 'Corniche Minimarket', 'Hadayek Market', 'Laselky Grocery'],
  'Downtown': ['Bab El Louk Grocery', 'Talaat Harb Market', 'Tahrir Minimarket', 'Abdeen Corner', 'Ramses Market', 'Ataba Grocery', 'Garden City Mart', 'Kasr El Nil Minimarket', 'Mohandessin Basket', 'Zamalek Corner', 'Boulaq Market', 'Falaki Grocery'],
};
const PRODUCTS = [
  { n: '3-in-1 Classic · box 24', cat: '3in1', units: 1840 }, { n: 'Loose Plain · 250g', cat: 'loose', units: 1430 }, { n: '3-in-1 Rich · box 24', cat: '3in1', units: 1120 },
  { n: 'Loose Plain · 1kg', cat: 'loose', units: 760 }, { n: 'Loose Cardamom · 250g', cat: 'loose', units: 690 }, { n: 'Loose Plain · 500g', cat: 'loose', units: 540 }, { n: '3-in-1 Classic · carton 12', cat: '3in1', units: 310 },
];
const AREAS = [
  { n: 'Nasr City', c: '#C4601A', total: 150, visited: 128, poly: [[30.045, 31.315], [30.045, 31.365], [30.088, 31.365], [30.088, 31.315]] },
  { n: 'Heliopolis', c: '#0E8FA0', total: 110, visited: 96, poly: [[30.080, 31.295], [30.080, 31.340], [30.112, 31.340], [30.112, 31.295]] },
  { n: 'Maadi', c: '#7050C0', total: 120, visited: 84, poly: [[29.950, 31.240], [29.950, 31.285], [29.985, 31.285], [29.985, 31.240]] },
  { n: 'Downtown', c: '#3A8F3A', total: 100, visited: 92, poly: [[30.035, 31.225], [30.035, 31.260], [30.062, 31.260], [30.062, 31.225]] },
];
const liveStores = [
  { n: 'Al Noor Supermarket', p: [30.0561, 31.3300], order: 3498 }, { n: 'City Mart — Nasr City', p: [30.0590, 31.3440], order: 2140 },
  { n: 'Fresh Basket', p: [30.0655, 31.3520], order: 0 }, { n: 'Green Valley Grocery', p: [30.0720, 31.3400], order: 1860 }, { n: 'Metro Corner Store', p: [30.0790, 31.3290], order: 2720 },
];
const ROUTES = {
  AS: liveStores.map(s => s.p),
  MK: [[30.0870, 31.3240], [30.0910, 31.3130], [30.0985, 31.3060], [30.1050, 31.3170], [30.0980, 31.3300]],
  OH: [[29.9600, 31.2500], [29.9640, 31.2620], [29.9700, 31.2700], [29.9760, 31.2580]],
  SA: [[30.0440, 31.2350], [30.0500, 31.2400], [30.0560, 31.2450], [30.0490, 31.2500], [30.0420, 31.2440]],
};
const FLAGS = { OH: [{ i: 2, t: 'Check-in outside geofence (410 m)' }], SA: [{ i: 3, t: 'Mock location detected — visit rejected' }] };
/* HR */
const EMP = [
  { n: 'Ahmed Samir', role: 'Sales rep', dept: 'Field sales', in: '08:52', out: '17:35', st: 'present', loc: 'Nasr City depot' },
  { n: 'Mona Khaled', role: 'Sales rep', dept: 'Field sales', in: '09:24', out: '17:40', st: 'late', loc: 'Heliopolis branch' },
  { n: 'Omar Hassan', role: 'Sales rep', dept: 'Field sales', in: '—', out: '—', st: 'absent', loc: '—' },
  { n: 'Sara Adel', role: 'Sales rep', dept: 'Field sales', in: '08:58', out: '—', st: 'present', loc: 'Downtown · first customer' },
  { n: 'Hany Fouad', role: 'Warehouse keeper', dept: 'Inventory', in: '07:45', out: '16:10', st: 'present', loc: 'Main depot' },
  { n: 'Dina Mostafa', role: 'HR specialist', dept: 'HR', in: '—', out: '—', st: 'leave', loc: 'Annual leave' },
  { n: 'Karim Nabil', role: 'Driver', dept: 'Logistics', in: '07:30', out: '—', st: 'present', loc: 'Main depot' },
  { n: 'Yasmin Tarek', role: 'Accountant', dept: 'Finance', in: '09:10', out: '—', st: 'late', loc: 'Head office' },
];
/* Inventory: [product, on hand, reserved, min] */
const STOCK = {
  'Main depot': [['3-in-1 Classic · box 24', 40, 12, 120], ['3-in-1 Rich · box 24', 310, 20, 100], ['Loose Plain · 1kg', 180, 15, 80], ['Loose Cardamom · 250g', 0, 0, 60], ['Green coffee beans · 60kg sack', 26, 0, 20], ['Kraft bags 250g', 4200, 0, 3000]],
  'Nasr City branch': [['3-in-1 Classic · box 24', 95, 10, 60], ['3-in-1 Rich · box 24', 48, 6, 50], ['Loose Plain · 1kg', 62, 4, 40], ['Loose Plain · 250g', 210, 12, 120], ['Loose Cardamom · 250g', 35, 2, 40]],
  'Van AS-01': [['3-in-1 Classic · box 24', 18, 0, 10], ['3-in-1 Rich · box 24', 9, 0, 6], ['Loose Plain · 1kg', 14, 0, 8], ['Loose Plain · 250g', 40, 0, 20], ['Loose Cardamom · 250g', 6, 0, 6]],
};

function repCustomers(r) {
  const names = CUSTOMERS[r.area], t = r.today;
  return names.slice(0, t.planned).map((n, i) => {
    const mins = 9 * 60 + i * 45, h = Math.floor(mins / 60), m = mins % 60;
    const action = i % 4 === 2 ? 'Visit only' : i % 5 === 4 ? 'Collection' : 'Visit + order';
    const status = i < t.done ? 'done' : i === t.done ? 'prog' : 'pend';
    const val = status === 'done' && action === 'Visit + order' ? Math.round(900 + rnd(i + 1, r.id.charCodeAt(0)) * 2600) : 0;
    return { n, time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, action, status, val };
  });
}
function monthPlan(r) {
  const seed = r.id.charCodeAt(0);
  return Array.from({ length: DAYS }, (_, k) => {
    const d = k + 1;
    if (isOff(d)) return { d, off: true, planned: 0, done: null };
    const base = Math.round(r.today.planned - 1 + rnd(d, seed) * 3);
    const planned = dow(d) === 6 ? Math.max(4, base - 4) : base;
    let done = null;
    if (d < TODAY) done = Math.max(0, planned - (rnd(d + 7, seed) < .25 ? 1 : 0) - (rnd(d + 3, seed) < .1 ? 1 : 0));
    if (d === TODAY) done = r.today.done;
    return { d, planned, done };
  });
}
function teamCumulative() {
  const mtd = REPS.reduce((a, r) => a + r.month.sales, 0), target = REPS.reduce((a, r) => a + r.month.target, 0);
  let daily = [];
  for (let d = 1; d <= TODAY; d++) daily.push(isOff(d) ? 0 : .7 + rnd(d, 5) * .6);
  const s = daily.reduce((a, b) => a + b, 0);
  daily = daily.map(x => x / s * mtd);
  const actual = [], pace = [];
  let ca = 0, cs = 0;
  for (let d = 1; d <= DAYS; d++) {
    if (d <= TODAY) { ca += daily[d - 1]; actual.push(Math.round(ca)); } else actual.push(null);
    if (!isOff(d)) cs++;
    pace.push(Math.round(cs / SELL_DAYS * target));
  }
  return { actual, pace, mtd, target, labels: [...Array(DAYS)].map((_, k) => String(k + 1)) };
}

/* ===================== deck engine ===================== */
const slides = $$('.slide');
let cur = 0;
$('#tot').textContent = slides.length;
slides.forEach(s => { if (s.dataset.bg) s.style.backgroundImage = `url(${s.dataset.bg})`; });
const onEnter = {}, onLeave = {}, onSeg = {}, state = {};
const fragsOf = s => $$('.frag', s);

/* Timers are keyed by the current slide; maxT tracks the last scheduled moment so the
   slide can auto-replay: animation end → wait 2 s → run again (while still on the slide). */
const timers = {}, maxT = {};
const curName = () => slides[cur].dataset.name;
function later(fn, ms) { const k = curName(); (timers[k] ??= []).push(setTimeout(fn, ms)); maxT[k] = Math.max(maxT[k] || 0, ms); }
function clearTimers(k = curName()) { (timers[k] || []).forEach(clearTimeout); timers[k] = []; maxT[k] = 0; }
const reveal = (els, start = 300, gap = 140) => els.forEach((el, i) => later(() => el.classList.add('on'), start + i * gap));
const LOOP_PAUSE = 2000, TAIL = 1500; // TAIL covers CSS transitions / chart easing after the last timer
function scheduleLoop(s, d) {
  const name = s.dataset.name;
  const ms = typeof d === 'number' ? d : (maxT[name] > 0 ? maxT[name] + TAIL : (s.querySelector('.stagger') ? 1800 : null));
  if (ms != null) later(() => runSlide(s, true), ms + LOOP_PAUSE);
}
function runSlide(s, loop = false) {
  clearTimers(s.dataset.name);
  if (loop) { s.classList.remove('go'); void s.offsetWidth; } // restart CSS stagger
  s.classList.add('go');
  const d = onEnter[s.dataset.name]?.();
  scheduleLoop(s, d);
}
function show(n, { replay = false } = {}) {
  n = Math.max(0, Math.min(slides.length - 1, n));
  if (n === cur && !replay && slides[cur].classList.contains('active')) return;
  if (n !== cur) { const prev = slides[cur]; prev.classList.remove('active', 'go'); clearTimers(prev.dataset.name); onLeave[prev.dataset.name]?.(); cur = n; }
  const s = slides[cur];
  s.classList.add('active');
  fragsOf(s).forEach(f => f.classList.remove('on'));
  $('#cur').textContent = cur + 1;
  $('#progress').style.width = ((cur + 1) / slides.length * 100) + '%';
  history.replaceState(null, '', '#' + (cur + 1));
  runSlide(s);
}
function next() { const f = fragsOf(slides[cur]).find(x => !x.classList.contains('on')); if (f) { f.classList.add('on'); return; } show(cur + 1); }
function prev() { show(cur - 1); }
$('#next').onclick = next; $('#prev').onclick = prev;
document.addEventListener('keydown', e => {
  if (['ArrowRight', ' ', 'PageDown', 'Enter'].includes(e.key)) { e.preventDefault(); next(); }
  else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev(); }
  else if (e.key === 'Home') show(0); else if (e.key === 'End') show(slides.length - 1);
  else if (e.key.toLowerCase() === 'f') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }
  else if (e.key.toLowerCase() === 'r') { show(cur, { replay: true }); }
});
let tx = null;
document.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
document.addEventListener('touchend', e => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) dx < 0 ? next() : prev(); tx = null; });
$('#deck').addEventListener('click', e => { if (e.target.closest('.ui,button,a,.leaflet-container,.seg')) return; next(); });
/* segmented controls: .seg[data-group] > button[data-v] → state[slide][group] = v → onSeg[slide](state) */
document.addEventListener('click', e => {
  const b = e.target.closest('.seg button'); if (!b) return;
  const seg = b.parentElement; $$('button', seg).forEach(x => x.classList.toggle('on', x === b));
  const slide = b.closest('.slide'), st = state[slide.dataset.name] ??= {};
  st[seg.dataset.group] = b.dataset.v;
  clearTimers(slide.dataset.name);
  const d = onSeg[slide.dataset.name]?.(st);
  scheduleLoop(slide, d);
});

/* ===================== cycle diagrams (slides 4, HR, inventory) ===================== */
const CYCLE = [['Products', '& price lists', '☕'], ['Promotions', '& offers', '🏷️'], ['Customers', '& areas', '🏪'], ['Visit plans', '& routes', '🗓️'], ['Reports', '& targets', '📊']];
const HR_CYCLE = [['Employees', '& contracts', '👤'], ['Rules', 'shift · leave', '📏'], ['Attendance', 'mobile check-in', '⏰'], ['Time off', 'request · approve', '🏖️'], ['Payroll', '& payslips', '💵']];
const INV_CYCLE = [['Suppliers', '& raw materials', '🏭'], ['Purchase', 'request → order', '🧾'], ['Receive', 'into warehouse', '📥'], ['Stock', 'depot · branch · van', '🏬'], ['Sell &', 'replenish', '🔁']];
function buildCycle(hostId, nodes, title, sub) {
  const host = $('#' + hostId); if (!host) return;
  const R = 150, C = 210, rad = a => a * Math.PI / 180, P = a => [C + R * Math.cos(rad(a)), C + R * Math.sin(rad(a))], step = 360 / nodes.length;
  let s = '';
  nodes.forEach((_, i) => { const [x1, y1] = P(-90 + i * step + 18), [x2, y2] = P(-90 + (i + 1) * step - 18); s += `<path class="arc" d="M${x1.toFixed(1)} ${y1.toFixed(1)} A${R} ${R} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}"/>`; });
  nodes.forEach(([a, b, ic], i) => {
    const [x, y] = P(-90 + i * step);
    s += `<g class="node"><circle cx="${x}" cy="${y}" r="42" fill="#fff" stroke="#E5DCD2" stroke-width="2"/><text x="${x}" y="${y - 9}" text-anchor="middle" font-size="18">${ic}</text><text x="${x}" y="${y + 10}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#1F1A17" font-family="Inter,sans-serif">${a}</text><text x="${x}" y="${y + 24}" text-anchor="middle" font-size="10" fill="#6B625B" font-family="Inter,sans-serif">${b}</text><circle cx="${x - 30}" cy="${y - 30}" r="11" fill="#C4601A"/><text x="${x - 30}" y="${y - 26}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="Inter,sans-serif">${i + 1}</text></g>`;
  });
  host.innerHTML = `<svg viewBox="0 0 420 420"><defs><marker id="ah-${hostId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#C4601A"/></marker></defs><circle cx="210" cy="210" r="150" fill="none" stroke="#F0E9E1" stroke-width="1"/><text x="210" y="204" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-weight="700" font-size="17" fill="#1F1A17">${title}</text><text x="210" y="222" text-anchor="middle" font-size="11" fill="#6B625B" font-family="Inter,sans-serif">${sub}</text>${s}</svg>`;
}
buildCycle('cycle', CYCLE, 'Hook Track', 'ERP cycle');
buildCycle('hrcycle', HR_CYCLE, 'HR', 'module cycle');
buildCycle('invcycle', INV_CYCLE, 'Inventory', '& purchasing');
const cycleEnter = (hostId, listId) => () => {
  const host = $('#' + hostId), nodes = $$('.node', host), arcs = $$('.arc', host), lis = $$('#' + listId + ' li');
  nodes.forEach(x => x.classList.remove('on', 'hot')); arcs.forEach(a => { a.classList.remove('draw'); a.removeAttribute('marker-end'); }); lis.forEach(li => li.classList.remove('on'));
  nodes.forEach((_, i) => {
    later(() => { nodes.forEach(x => x.classList.remove('hot')); nodes[i].classList.add('on', 'hot'); lis.forEach((li, j) => li.classList.toggle('on', j === i)); }, 500 + i * 1100);
    later(() => { arcs[i].classList.add('draw'); arcs[i].setAttribute('marker-end', `url(#ah-${hostId})`); }, 950 + i * 1100);
  });
  later(() => { nodes.forEach(x => x.classList.remove('hot')); lis.forEach(li => li.classList.add('on')); }, 700 + nodes.length * 1100);
};
onEnter.cycle = cycleEnter('cycle', 'cyclelist');
onEnter['hr-cycle'] = cycleEnter('hrcycle', 'hrlist');
onEnter['inv-cycle'] = cycleEnter('invcycle', 'invlist');

/* ===================== slides 5/6: products, promotions ===================== */
onEnter.products = () => {
  const cards = $$('#catalog .prod'), rows = $$('#pricetbl tr.anim');
  cards.forEach(c => c.classList.remove('on')); rows.forEach(r => r.classList.remove('on'));
  reveal(cards, 400, 260); reveal(rows, 500 + cards.length * 260, 260);
};
onEnter.promos = () => {
  const lines = $$('#calc .ln'); lines.forEach(l => l.classList.remove('on')); $('#calcTotal').textContent = '0';
  reveal(lines, 500, 650);
  later(() => countUp($('#calcTotal'), 3498), 500 + (lines.length - 1) * 650);
};

/* ===================== plan renderer (slide 7 + report) ===================== */
const STATUS = { done: 'Done ✓', prog: 'In progress', pend: 'Pending' };
function renderPlan(mode, r, host, withStatus) {
  host.innerHTML = '';
  if (mode === 'month') {
    const plan = monthPlan(r);
    let h = '<div class="ttl">' + r.name + ' · September 2026 · planned visits per day' + (withStatus ? ' · done ✓' : '') + '</div><div class="cal">' + ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="hd">${d}</div>`).join('');
    for (let i = 0; i < FIRST_DOW; i++) h += '<div class="d blank"></div>';
    plan.forEach(p => {
      const heat = p.off ? 'off' : p.planned >= 12 ? 'h4' : p.planned >= 11 ? 'h3' : p.planned >= 9 ? 'h2' : 'h1';
      const body = p.off ? '<small>Off</small>' : (withStatus && p.done != null) ? `<span class="dn"><span>${p.planned} planned</span><span class="ok">${p.done} ✓</span></span>` : `<span>${p.planned} planned</span>`;
      h += `<div class="d ${heat} ${p.d === TODAY ? 'today' : ''}"><b>${p.d}</b>${body}</div>`;
    });
    host.innerHTML = h + '</div>';
    reveal($$('.d', host), 150, 26);
  } else if (mode === 'week') {
    const plan = monthPlan(r), names = CUSTOMERS[r.area];
    const days = [26, 27, 28, 29, 30, 31], lbls = ['Sat 26', 'Sun 27', 'Mon 28', 'Tue 29', 'Wed 30', 'Thu 1 Oct'];
    let h = `<div class="ttl">${r.name} · this week · ${r.area}</div><div class="wk">`;
    days.forEach((d, i) => {
      const p = d <= DAYS ? plan[d - 1] : { planned: 11, done: null };
      const showDone = withStatus && p.done != null, pct = showDone ? Math.round(p.done / p.planned * 100) : 0;
      const cust = names.slice((i * 3) % 9, (i * 3) % 9 + 3).map(n => '• ' + n).join('<br>');
      h += `<div class="col ${d === TODAY ? 'today' : ''}"><h4>${lbls[i]}</h4><div class="n">${p.planned}</div><small>planned visits</small>${showDone ? `<div class="bar"><i data-w="${pct}"></i></div><small>${p.done} done · ${p.planned - p.done} left</small>` : '<small>&nbsp;</small>'}<div class="cust">${cust}<br>…</div></div>`;
    });
    host.innerHTML = h + '</div>';
    reveal($$('.col', host), 150, 120);
    later(() => $$('.bar i', host).forEach(b => b.style.width = b.dataset.w + '%'), 600);
  } else {
    const list = repCustomers(r);
    let h = `<div class="ttl">${r.name} · today · ${list.length} stops · ${r.area}</div><div class="list">`;
    list.forEach(c => {
      h += `<div class="row"><span>${c.time}</span><span>${c.n}<small>${c.action}</small></span>` +
        (withStatus ? `<span class="num">${c.val ? fmt(c.val) : '—'}</span><span class="st ${c.status}">${STATUS[c.status]}</span>` : `<span></span><span class="st pend">Planned</span>`) + `</div>`;
    });
    host.innerHTML = h + '</div>';
    reveal($$('.row', host), 150, 100);
  }
}
onEnter.plan = () => { const st = state.plan ??= { period: 'month' }; renderPlan(st.period, repById('AS'), $('#planPanel'), false); };
onSeg.plan = st => renderPlan(st.period, repById('AS'), $('#planPanel'), false);

/* ===================== security + visit + order ===================== */
onEnter.fakegps = () => {
  const checks = $$('#gpschecks .check'), v = $('#gpsverdict');
  checks.forEach(c => { c.classList.remove('on', 'bad'); $('.st2', c).textContent = '…'; }); v.classList.remove('on');
  const results = [['FLAGGED', true], ['FOUND', true], ['MISMATCH 4.2 km', true], ['OK', false], ['SUSPICIOUS', true], ['OK', false]];
  checks.forEach((c, i) => later(() => { c.classList.add('on'); if (results[i][1]) c.classList.add('bad'); $('.st2', c).textContent = results[i][0]; }, 700 + i * 650));
  later(() => v.classList.add('on'), 900 + checks.length * 650);
};
onEnter.root = () => {
  const rows = $$('#rootlist div'), lock = $('#rootlock');
  rows.forEach(r => r.classList.remove('on')); lock.classList.remove('on');
  reveal(rows, 500, 380); later(() => lock.classList.add('on'), 700 + rows.length * 380);
};
onEnter.journey = () => {
  const steps = $$('#journey .step'), cards = $$('#jdetail .card'), fill = $('#jfill');
  steps.forEach(s => s.classList.remove('on', 'done')); cards.forEach(c => c.classList.remove('on')); fill.style.width = '0';
  steps.forEach((s, i) => later(() => {
    steps.forEach((x, j) => { x.classList.toggle('done', j < i); x.classList.toggle('on', j === i); });
    cards.forEach((c, j) => c.classList.toggle('on', j === i));
    fill.style.width = (i / (steps.length - 1) * 86) + '%';
  }, 400 + i * 2400));
  later(() => steps.forEach(s => s.classList.add('done')), 400 + steps.length * 2400);
};
onEnter.order = () => {
  const lines = $$('#orderLines .ol'), btn = $('#orderBtn');
  lines.forEach(l => l.classList.remove('on')); btn.classList.remove('sent'); btn.textContent = 'Send order'; $('#orderTotal').textContent = '0';
  reveal(lines, 600, 700);
  later(() => countUp($('#orderTotal'), 3498), 600 + 3 * 700);
  later(() => { btn.classList.add('sent'); btn.textContent = '✓ Order #10482 sent · synced to ERP'; }, 1600 + lines.length * 700);
};

/* ===================== HR module ===================== */
onEnter['hr-employees'] = () => {
  const rows = $$('#emptbl tr.anim'), chips = $$('#rulechips .chip');
  rows.forEach(r => r.classList.remove('on')); chips.forEach(c => c.classList.remove('on'));
  reveal(rows, 400, 260); reveal(chips, 500 + rows.length * 260, 220);
};
onEnter['hr-attendance'] = () => {
  const clock = $('#attClock'), btn = $('#attBtn'), msg = $('#attMsg'), card = $('#attCard');
  clock.textContent = '08:51'; btn.className = 'cin'; btn.textContent = 'CHECK IN'; msg.className = 'attmsg'; msg.textContent = 'Tap to check in at your first location';
  card.innerHTML = '<b>Today</b><small>In — · Out —</small>';
  later(() => clock.textContent = '08:52', 800);
  later(() => btn.classList.add('press'), 1300);
  later(() => { btn.classList.remove('press'); msg.textContent = 'Verifying location and device…'; }, 1700);
  later(() => { msg.textContent = '📍 Nasr City depot · 32 m ✓ · 🔒 device trusted ✓'; msg.classList.add('ok'); }, 2800);
  later(() => { btn.classList.add('ok'); btn.textContent = 'CHECKED IN 08:52'; card.innerHTML = '<b>Today</b><small>In 08:52 · Out —</small>'; }, 3800);
  later(() => { msg.classList.remove('ok'); msg.textContent = 'On time · shift 09:00–17:00 · grace 15 min'; }, 5200);
  later(() => { clock.textContent = '17:35'; btn.className = 'cin out'; btn.textContent = 'CHECK OUT'; msg.textContent = 'Shift ended · tap to check out'; }, 6600);
  later(() => btn.classList.add('press'), 7400);
  later(() => { btn.className = 'cin ok'; btn.textContent = 'CHECKED OUT 17:35'; card.innerHTML = '<b>Today</b><small>In 08:52 · Out 17:35 · 8h 43m · overtime 5 min</small>'; msg.classList.add('ok'); msg.textContent = '✓ Synced to ERP · attendance dashboard updated'; }, 7900);
};
onEnter['hr-dash'] = () => {
  const cnt = s => EMP.filter(e => e.st === s).length;
  $('#attTiles').innerHTML = `<div class="tile"><b class="green">${cnt('present')}</b><span>present</span></div><div class="tile"><b style="color:#9A5B00">${cnt('late')}</b><span>late</span></div><div class="tile"><b class="red">${cnt('absent')}</b><span>absent</span></div><div class="tile"><b style="color:#1F4E8C">${cnt('leave')}</b><span>on leave</span></div><div class="tile"><b>08:47</b><span>average check-in</span></div>`;
  const L = { present: 'Present', late: 'Late', absent: 'Absent', leave: 'On leave' };
  let h = '<div class="ttl">Tuesday 29 Sep 2026 · live from the mobile app</div><table class="tbl"><tr><th>Employee</th><th>In</th><th>Out</th><th>Location</th><th>Status</th></tr>';
  EMP.forEach(e => { h += `<tr class="anim"><td>${e.n}<small style="display:block;color:var(--muted);font-size:10px">${e.role} · ${e.dept}</small></td><td>${e.in}</td><td>${e.out}</td><td style="color:var(--muted)">${e.loc}</td><td><span class="st ${e.st}">${L[e.st]}</span></td></tr>`; });
  $('#attTable').innerHTML = h + '</table>';
  reveal($$('#attTable tr.anim'), 200, 170);
};
onEnter['hr-timeoff'] = () => {
  const steps = $$('#toflow .fstep'), chips = $$('#tochips .chip');
  steps.forEach(s => s.classList.remove('on', 'done')); chips.forEach(c => c.classList.remove('on'));
  steps.forEach((s, i) => later(() => steps.forEach((x, j) => { x.classList.toggle('done', j < i); x.classList.toggle('on', j <= i); }), 500 + i * 1300));
  reveal(chips, 600 + steps.length * 1300, 200);
};
onEnter['hr-payroll'] = () => {
  const lines = $$('#payslip .pl'); lines.forEach(l => l.classList.remove('on')); $('#netPay').textContent = '0';
  reveal(lines, 500, 520);
  later(() => countUp($('#netPay'), 11130), 500 + (lines.length - 1) * 520);
};

/* ===================== Inventory & purchasing ===================== */
function renderStock() {
  const st = state['inv-stock'] ??= { wh: 'Main depot' }, rows = STOCK[st.wh], L = { ok: 'OK', low: 'Low stock', out: 'Out of stock' };
  let h = `<table class="tbl"><tr><th>${st.wh} · product</th><th class="num">On hand</th><th class="num">Reserved</th><th class="num">Min</th><th>Status</th></tr>`;
  rows.forEach(([n, oh, res, min]) => { const s = oh === 0 ? 'out' : oh < min ? 'low' : 'ok'; h += `<tr class="anim"><td>${n}</td><td class="num">${fmt(oh)}</td><td class="num">${fmt(res)}</td><td class="num">${fmt(min)}</td><td><span class="st ${s}">${L[s]}</span></td></tr>`; });
  $('#stockTable').innerHTML = h + '</table>';
  reveal($$('#stockTable tr.anim'), 150, 160);
}
onEnter['inv-stock'] = renderStock; onSeg['inv-stock'] = renderStock;
onEnter['inv-purchase'] = () => {
  const steps = $$('#poflow .fstep'); steps.forEach(s => s.classList.remove('on', 'done')); $('#poStock').textContent = '40';
  steps.forEach((s, i) => later(() => { steps.forEach((x, j) => { x.classList.toggle('done', j < i); x.classList.toggle('on', j <= i); }); if (i === steps.length - 1) countUp($('#poStock'), 440, { dur: 900 }); }, 500 + i * 1200));
};
onEnter['inv-raw'] = () => {
  const rows = $$('#suptbl tr.anim'), nodes = $$('#chain .cn'), arrows = $$('#chain i');
  [...rows, ...nodes, ...arrows].forEach(x => x.classList.remove('on'));
  reveal(rows, 400, 240);
  const t0 = 600 + rows.length * 240;
  nodes.forEach((n, i) => { later(() => n.classList.add('on'), t0 + i * 700); if (arrows[i]) later(() => arrows[i].classList.add('on'), t0 + i * 700 + 350); });
};

/* ===================== maps (Esri light gray canvas — no API key) ===================== */
const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_{l}/MapServer/tile/{z}/{y}/{x}';
const ATTR = 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ';
function basemap(map) {
  L.tileLayer(ESRI.replace('{l}', 'Base'), { attribution: ATTR, maxZoom: 16 }).addTo(map);
  L.tileLayer(ESRI.replace('{l}', 'Reference'), { maxZoom: 16, opacity: .9 }).addTo(map);
}
const repIcon = (label, color) => L.divIcon({ className: '', html: `<div class="rep-icon" style="background:${color};color:#fff"><div class="ping" style="color:${color}"></div>${label}</div>`, iconSize: [32, 32], iconAnchor: [16, 16] });
const storeIcon = done => L.divIcon({ className: '', html: `<div class="store-icon ${done ? 'done' : ''}"></div>`, iconSize: [14, 14], iconAnchor: [7, 7] });
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const km = (a, b) => { const R = 6371, dLat = (b[0] - a[0]) * Math.PI / 180, dLon = (b[1] - a[1]) * Math.PI / 180, x = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) * Math.sin(dLon / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); };

let live = null;
onEnter.live = () => {
  if (!live) {
    const map = L.map('livemap', { zoomControl: false, scrollWheelZoom: false });
    basemap(map);
    const storeMarkers = liveStores.map(s => L.marker(s.p, { icon: storeIcon(false) }).addTo(map).bindTooltip(s.n, { direction: 'top', offset: [0, -8], className: 'tt' }));
    liveStores.forEach(s => L.circle(s.p, { radius: 120, color: '#0E8FA0', weight: 1, fillOpacity: .08, dashArray: '4 4' }).addTo(map));
    const trail = L.polyline([], { color: '#C4601A', weight: 4, opacity: .9 }).addTo(map);
    const rep = L.marker(liveStores[0].p, { icon: repIcon('AS', '#C4601A'), zIndexOffset: 1000 }).addTo(map);
    map.fitBounds(L.latLngBounds(liveStores.map(s => s.p)).pad(0.25));
    live = { map, storeMarkers, trail, rep };
  }
  const { map, storeMarkers, trail, rep } = live;
  if (live.raf) cancelAnimationFrame(live.raf);
  trail.setLatLngs([liveStores[0].p]); rep.setLatLng(liveStores[0].p);
  storeMarkers.forEach(m => m.setIcon(storeIcon(false)));
  const kv = $('#k-visits'), kd = $('#k-dist'), ki = $('#k-int'), ko = $('#k-orders');
  let ordered = liveStores[0].order;
  kv.textContent = '1 / 5'; kd.textContent = '0.0 km'; ki.textContent = 'Trusted'; ki.className = 'green'; ko.textContent = fmt(ordered);
  storeMarkers[0].setIcon(storeIcon(true));
  setTimeout(() => map.invalidateSize(), 50);
  let dist = 0, t0 = performance.now(), leg = 0, pause = 0;
  const LEG_MS = 3200, PAUSE_MS = 900;
  function frame(now) {
    if (curName() !== 'live') return;
    if (leg >= liveStores.length - 1) return;
    const a = liveStores[leg].p, b = liveStores[leg + 1].p;
    let t = (now - t0) / LEG_MS;
    if (t >= 1) {
      t = 1;
      if (!pause) {
        pause = now; storeMarkers[leg + 1].setIcon(storeIcon(true)); kv.textContent = `${leg + 2} / 5`;
        ordered += liveStores[leg + 1].order; countUp(ko, ordered, { dur: 600 });
        if (leg + 1 === 2) { ki.textContent = 'Re-verified ✓'; later(() => { ki.textContent = 'Trusted'; }, 1500); }
      }
      if (now - pause > PAUSE_MS) { leg++; t0 = now; pause = 0; if (leg >= liveStores.length - 1) return; }
    }
    const mid = lerp(a, b, .5), bend = [mid[0] + (b[1] - a[1]) * .18, mid[1] - (b[0] - a[0]) * .18];
    const q = [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * bend[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * bend[1] + t * t * b[1]];
    const pts = trail.getLatLngs(), last = pts[pts.length - 1];
    if (!last || km([last.lat, last.lng], q) > 0.01) { trail.addLatLng(q); if (last) { dist += km([last.lat, last.lng], q); kd.textContent = dist.toFixed(1) + ' km'; } }
    rep.setLatLng(q);
    live.raf = requestAnimationFrame(frame);
  }
  later(() => { t0 = performance.now(); live.raf = requestAnimationFrame(frame); }, 600);
  return 600 + 4 * (LEG_MS + PAUSE_MS); // explicit duration for the auto-loop
};
onLeave.live = () => { if (live?.raf) cancelAnimationFrame(live.raf); };

let dash = null;
onEnter.dashboard = () => {
  if (!dash) {
    const map = L.map('dashmap', { zoomControl: false, scrollWheelZoom: false });
    basemap(map);
    const layers = { areas: L.layerGroup().addTo(map), routes: L.layerGroup().addTo(map), flags: L.layerGroup().addTo(map) };
    AREAS.forEach(a => L.polygon(a.poly, { color: a.c, weight: 1.5, fillColor: a.c, fillOpacity: .10, dashArray: '6 4' }).addTo(layers.areas).bindTooltip(a.n, { permanent: true, direction: 'center', className: 'tt area-tt' }));
    REPS.forEach(r => {
      const pts = ROUTES[r.id], flags = FLAGS[r.id] || [];
      L.polyline(pts, { color: r.color, weight: 3, opacity: .9 }).addTo(layers.routes);
      pts.forEach((p, i) => {
        const flagged = flags.find(f => f.i === i);
        L.circleMarker(p, { radius: 6, color: flagged ? '#d03b3b' : r.color, weight: 2, fillColor: '#fff', fillOpacity: 1 }).addTo(layers.routes).bindTooltip(`${r.name} · visit ${i + 1}${flagged ? ' · 🚩 ' + flagged.t : ''}`, { direction: 'top', className: 'tt' });
        if (flagged) L.marker(p, { icon: L.divIcon({ className: '', html: `<div style="transform:translate(-50%,-120%);font-size:20px;filter:drop-shadow(0 0 4px #fff)">🚩</div>`, iconSize: [0, 0] }) }).addTo(layers.flags).bindTooltip(flagged.t, { direction: 'top', offset: [0, -18], className: 'tt' });
      });
      L.marker(pts[pts.length - 1], { icon: repIcon(r.id, r.color), zIndexOffset: 1000 }).addTo(layers.routes).bindTooltip(`${r.name} — ${r.area} · ${r.today.done} of ${r.today.planned} visits · ${fmt(r.today.sales)} ${CUR}`, { direction: 'top', offset: [0, -20], className: 'tt' });
    });
    map.fitBounds(L.latLngBounds(Object.values(ROUTES).flat()).pad(0.15));
    $('#dashlegend').innerHTML = REPS.map(r => `<span class="chip"><span class="dot" style="background:${r.color};box-shadow:0 0 0 3px ${r.color}33"></span>${r.name} · ${r.area} · ${r.today.done}/${r.today.planned} visits${(FLAGS[r.id] || []).length ? ' · <span class="red">🚩' + FLAGS[r.id].length + '</span>' : ''}</span>`).join('');
    $$('.dash-toggle button').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); const l = layers[b.dataset.layer]; map.hasLayer(l) ? map.removeLayer(l) : map.addLayer(l); b.classList.toggle('on'); }));
    dash = { map };
  }
  setTimeout(() => dash.map.invalidateSize(), 50);
};

/* ===================== charts (Chart.js) ===================== */
Chart.defaults.font.family = "'Inter',system-ui,sans-serif";
Chart.defaults.color = '#6B625B';
const GRID = '#EDE7E0', CHART_MS = 1600;
const legend = { position: 'bottom', labels: { boxWidth: 9, boxHeight: 9, usePointStyle: true, pointStyle: 'circle', font: { size: 11 }, padding: 14 } };
const tooltip = (label) => ({ backgroundColor: '#1F1A17', padding: 10, cornerRadius: 8, titleFont: { size: 12 }, bodyFont: { size: 12 }, callbacks: label ? { label } : {} });
const charts = {};
function ensureChart(id, cfg) { if (!charts[id]) charts[id] = new Chart($('#' + id), cfg()); return charts[id]; }
function replay(ch) { setTimeout(() => { ch.resize(); ch.reset(); ch.update(); }, 60); }
window.addEventListener('resize', () => { live?.map.invalidateSize(); dash?.map.invalidateSize(); Object.values(charts).forEach(c => c.resize()); });

/* ---- report: rep plan ---- */
function planTiles(r, period) {
  const p = r[period];
  return `<div class="tile"><b>${p.planned}</b><span>visits planned</span></div><div class="tile"><b class="green">${p.done}</b><span>done</span></div><div class="tile"><b>${p.planned - p.done}</b><span>left</span></div><div class="tile"><b>${p.orders}${period === 'today' ? ' / ' + p.ordersPlanned : ''}</b><span>orders taken${period === 'today' ? ' / planned' : ''}</span></div><div class="tile"><b>${fmt(p.sales)}</b><span>${CUR} sales</span></div><div class="tile"><b>${Math.round(p.done / p.planned * 100)}%</b><span>plan completion</span></div>`;
}
onEnter['r-plan'] = () => {
  const st = state['r-plan'] ??= { period: 'today', rep: 'AS' }, r = repById(st.rep);
  $('#rplanTiles').innerHTML = planTiles(r, st.period);
  renderPlan(st.period === 'today' ? 'day' : st.period, r, $('#rplan'), true);
};
onSeg['r-plan'] = onEnter['r-plan'];

/* ---- report: today's execution ---- */
function renderWho(r) {
  const list = repCustomers(r);
  let h = `<div class="ttl">Who ${r.name} visits today · ${r.area}</div><div class="list">`;
  list.forEach(c => { h += `<div class="row"><span>${c.time}</span><span>${c.n}<small>${c.action}</small></span><span class="num">${c.val ? fmt(c.val) : '—'}</span><span class="st ${c.status}">${STATUS[c.status]}</span></div>`; });
  $('#todayWho').innerHTML = h + '</div>';
  reveal($$('#todayWho .row'), 100, 90);
}
onEnter['r-today'] = () => {
  const st = state['r-today'] ??= { rep: 'AS' };
  const tot = REPS.reduce((a, r) => ({ planned: a.planned + r.today.planned, done: a.done + r.today.done, orders: a.orders + r.today.orders, sales: a.sales + r.today.sales }), { planned: 0, done: 0, orders: 0, sales: 0 });
  $('#todayTiles').innerHTML = `<div class="tile"><b>${tot.planned}</b><span>visits planned</span></div><div class="tile"><b class="green">${tot.done}</b><span>done</span></div><div class="tile"><b>${tot.planned - tot.done}</b><span>left</span></div><div class="tile"><b>${tot.orders}</b><span>orders taken</span></div><div class="tile"><b id="todaySales">0</b><span>${CUR} sales today</span></div>`;
  let h = `<div class="ttl">Execution by representative · click a row</div><table class="tbl"><tr><th>Representative</th><th>Planned</th><th>Done</th><th>Left</th><th>Orders</th><th class="num">Sales</th><th style="width:24%">Progress</th></tr>`;
  REPS.forEach(r => {
    const t = r.today, pct = Math.round(t.done / t.planned * 100);
    h += `<tr class="anim ${r.id === st.rep ? 'sel' : ''}" data-rep="${r.id}"><td><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${r.color};margin-right:6px"></span>${r.name}<small style="color:var(--muted);display:block;font-size:10px;padding-left:15px">${r.area}</small></td><td>${t.planned}</td><td class="green">${t.done}</td><td>${t.planned - t.done}</td><td>${t.orders} / ${t.ordersPlanned}</td><td class="num">${fmt(t.sales)}</td><td><div class="bar"><i data-w="${pct}"></i></div><small style="font-size:10px;color:var(--muted)">${pct}%</small></td></tr>`;
  });
  $('#todayTable').innerHTML = h + '</table>';
  $$('#todayTable tr[data-rep]').forEach(tr => tr.addEventListener('click', () => {
    st.rep = tr.dataset.rep; $$('#todayTable tr').forEach(x => x.classList.toggle('sel', x === tr));
    const s = slides[cur]; clearTimers(); renderWho(repById(st.rep)); scheduleLoop(s);
  }));
  reveal($$('#todayTable tr.anim'), 200, 150);
  later(() => $$('#todayTable .bar i').forEach(b => b.style.width = b.dataset.w + '%'), 500);
  countUp($('#todaySales'), tot.sales);
  renderWho(repById(st.rep));
};

/* ---- report: sales per rep ---- */
function renderSales() {
  const st = state['r-sales'] ??= { period: 'today' }, p = st.period;
  const d1 = REPS.map(r => Math.round(r[p].sales * r.mix)), d2 = REPS.map(r => Math.round(r[p].sales * (1 - r.mix)));
  const ch = ensureChart('salesChart', () => ({
    type: 'bar',
    data: { labels: REPS.map(r => r.name), datasets: [
      { label: '3-in-1 sachets', data: d1, backgroundColor: '#C4601A', barThickness: 18, borderRadius: 4 },
      { label: 'Loose coffee', data: d2, backgroundColor: '#0E8FA0', barThickness: 18, borderRadius: 4, borderColor: '#fff', borderWidth: { left: 2, right: 0, top: 0, bottom: 0 } }] },
    options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', animation: { duration: 1200, easing: 'easeOutQuart' },
      scales: { x: { stacked: true, grid: { color: GRID }, border: { display: false }, ticks: { font: { size: 11 }, callback: v => fmt(v) } }, y: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { font: { size: 12 } } } },
      plugins: { legend, tooltip: tooltip(c => ` ${c.dataset.label}: ${fmt(c.raw)} ${CUR}`) } }
  }));
  ch.data.datasets[0].data = d1; ch.data.datasets[1].data = d2; replay(ch);
  const tot = REPS.reduce((a, r) => a + r[p].sales, 0), orders = REPS.reduce((a, r) => a + r[p].orders, 0), free = { today: 18, week: 96, month: 312 }[p], lbl = { today: 'today', week: 'this week', month: 'this month' }[p];
  const s1 = d1.reduce((a, b) => a + b, 0);
  $('#salesTiles').innerHTML = `<div class="tile"><b id="s1">0</b><span>${CUR} sales ${lbl}</span></div><div class="tile"><b id="s2">0</b><span>orders ${lbl}</span></div><div class="tile"><b id="s3">0</b><span>${CUR} average order</span></div><div class="tile"><b id="s4">0</b><span>free boxes issued ${lbl}</span></div><div class="tile"><b>${Math.round(s1 / tot * 100)}% · ${100 - Math.round(s1 / tot * 100)}%</b><span>mix: 3-in-1 · loose coffee</span></div>`;
  countUp($('#s1'), tot); countUp($('#s2'), orders); countUp($('#s3'), tot / orders); countUp($('#s4'), free);
  return CHART_MS;
}
onEnter['r-sales'] = renderSales; onSeg['r-sales'] = renderSales;

/* ---- report: targets ---- */
onEnter['r-target'] = () => {
  const pace = SELL_ELAPSED / SELL_DAYS * 100;
  $('#gauges').innerHTML = REPS.map(r => {
    const pct = r.month.sales / r.month.target * 100, cls = pct >= pace - 2 ? 'ok' : pct >= pace - 12 ? 'near' : 'behind';
    return `<div class="gauge"><svg viewBox="0 0 130 130"><circle class="track" cx="65" cy="65" r="54" stroke-width="10"/><circle class="val" cx="65" cy="65" r="54" stroke-width="10" stroke="${r.color}" transform="rotate(-90 65 65)" data-p="${pct / 100}"/></svg><div><b data-pct="${pct}">0%</b><span class="nm">${r.name} · ${r.area}</span><small>${fmt(r.month.sales)} / ${fmt(r.month.target)} ${CUR}</small><span class="pace ${cls}">${cls === 'ok' ? 'On pace' : cls === 'near' ? 'Slightly behind' : 'Behind pace'} · expected ${Math.round(pace)}%</span></div></div>`;
  }).join('');
  later(() => { $$('#gauges .val').forEach(c => c.style.strokeDashoffset = 339.3 * (1 - parseFloat(c.dataset.p))); $$('#gauges b[data-pct]').forEach(b => countUp(b, parseFloat(b.dataset.pct), { suffix: '%' })); }, 250);
  const tc = teamCumulative();
  const ch = ensureChart('targetChart', () => ({
    type: 'line',
    data: { labels: tc.labels, datasets: [
      { label: 'Team sales · cumulative', data: tc.actual, borderColor: '#C4601A', backgroundColor: 'rgba(196,96,26,.10)', fill: true, tension: .3, pointRadius: 0, pointHoverRadius: 5, borderWidth: 2 },
      { label: 'Target pace', data: tc.pace, borderColor: '#9C918A', borderDash: [6, 4], pointRadius: 0, pointHoverRadius: 4, borderWidth: 2, fill: false }] },
    options: { responsive: true, maintainAspectRatio: false, animation: { duration: 1400, easing: 'easeOutQuart' }, interaction: { mode: 'index', intersect: false },
      scales: { x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 10 }, maxTicksLimit: 15 }, title: { display: true, text: 'day of month', font: { size: 10 } } }, y: { grid: { color: GRID }, border: { display: false }, ticks: { font: { size: 10 }, callback: v => fmt(v / 1000) + 'k' } } },
      plugins: { legend, tooltip: tooltip(c => ` ${c.dataset.label}: ${fmt(c.raw)} ${CUR}`) } }
  }));
  replay(ch);
  $('#targetTiles').innerHTML = `<div class="tile"><b>${fmt(tc.mtd)}</b><span>${CUR} team month-to-date</span></div><div class="tile"><b>${fmt(tc.target)}</b><span>${CUR} team target</span></div><div class="tile"><b>${Math.round(tc.mtd / tc.target * 100)}%</b><span>achieved · ${Math.round(pace)}% of selling days elapsed</span></div><div class="tile"><b>${fmt(tc.target - tc.mtd)}</b><span>${CUR} to go · 1 selling day left</span></div>`;
  return CHART_MS + 250;
};

/* ---- report: products & promotions ---- */
onEnter['r-products'] = () => {
  const ch = ensureChart('prodChart', () => ({
    type: 'bar',
    data: { labels: PRODUCTS.map(p => p.n), datasets: [{ label: 'Units sold this month', data: PRODUCTS.map(p => p.units), backgroundColor: PRODUCTS.map(p => p.cat === '3in1' ? '#C4601A' : '#0E8FA0'), barThickness: 16, borderRadius: 4 }] },
    options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', animation: { duration: 1200, easing: 'easeOutQuart' },
      scales: { x: { grid: { color: GRID }, border: { display: false }, ticks: { font: { size: 10 } }, title: { display: true, text: 'units (boxes / bags)', font: { size: 10 } } }, y: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 } } } },
      plugins: { legend: { display: false }, tooltip: tooltip(c => ` ${fmt(c.raw)} units`) } }
  }));
  replay(ch);
  $('#prodTiles').innerHTML = `<div class="tile"><b id="p1">0%</b><span>of orders used a promotion</span></div><div class="tile"><b id="p2">0</b><span>free boxes issued this month</span></div><div class="tile"><b id="p3">+0%</b><span>average order value with promo</span></div><div class="tile"><b>Buy 10 get 1</b><span>best promo · 3-in-1 Classic</span></div><div class="tile"><b>97%</b><span>price-list compliance</span></div>`;
  countUp($('#p1'), 64, { suffix: '%' }); countUp($('#p2'), 312); countUp($('#p3'), 18, { prefix: '+', suffix: '%' });
  return CHART_MS;
};

/* ---- report: coverage ---- */
onEnter['r-coverage'] = () => {
  const ch = ensureChart('covChart', () => ({
    type: 'bar',
    data: { labels: AREAS.map(a => a.n), datasets: [
      { label: 'Visited this month', data: AREAS.map(a => a.visited), backgroundColor: '#3A8F3A', barThickness: 18, borderRadius: 4 },
      { label: 'Not yet visited', data: AREAS.map(a => a.total - a.visited), backgroundColor: '#E3D9CF', barThickness: 18, borderRadius: 4, borderColor: '#fff', borderWidth: { left: 2, right: 0, top: 0, bottom: 0 } }] },
    options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', animation: { duration: 1200, easing: 'easeOutQuart' },
      scales: { x: { stacked: true, grid: { color: GRID }, border: { display: false }, ticks: { font: { size: 10 } }, title: { display: true, text: 'customers', font: { size: 10 } } }, y: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { font: { size: 12 } } } },
      plugins: { legend, tooltip: tooltip(c => ` ${c.dataset.label}: ${fmt(c.raw)} customers`) } }
  }));
  replay(ch);
  const stale = [['Sunrise Minimarket', 'Nasr City', 'Aug 21', 'Ahmed S.'], ['Baron Minimarket', 'Heliopolis', 'Aug 18', 'Mona K.'], ['Laselky Grocery', 'Maadi', 'Aug 12', 'Omar H.'], ['Hadayek Market', 'Maadi', 'Aug 9', 'Omar H.'], ['Falaki Grocery', 'Downtown', 'Aug 26', 'Sara A.'], ['Corniche Minimarket', 'Maadi', 'Aug 3', 'Omar H.']];
  const tv = AREAS.reduce((a, x) => a + x.visited, 0), tt = AREAS.reduce((a, x) => a + x.total, 0);
  let h = '<div class="ttl">Not visited in 30+ days · last visit · rep</div><div class="list">';
  stale.forEach(s => { h += `<div class="row" style="grid-template-columns:1fr auto auto"><span>${s[0]}<small>${s[1]} · ${s[3]}</small></span><span class="num" style="color:var(--muted)">${s[2]}</span><span class="st flag">Overdue</span></div>`; });
  h += `</div><div class="tiles" style="margin-top:10px"><div class="tile"><b>${tt}</b><span>customers total</span></div><div class="tile"><b class="green">${Math.round(tv / tt * 100)}%</b><span>coverage this month</span></div><div class="tile"><b>14</b><span>new customers</span></div></div>`;
  $('#covList').innerHTML = h;
  reveal($$('#covList .row'), 200, 110);
  return CHART_MS;
};

/* ===================== start ===================== */
show((parseInt(location.hash.slice(1)) || 1) - 1, { replay: true });
