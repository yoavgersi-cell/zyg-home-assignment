/* Stripes — The Inside Addition: Paid Launch & CRO Plan
 * ZyG E-commerce Product & CRO Manager — Home Assignment deck
 */
const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";
p.author = "CRO & Product";
p.company = "ZyG";
p.title = "Stripes — The Inside Addition: Paid Launch & CRO Plan";

/* ---------- Palette ---------- */
const INK   = "2E1622"; // near-black berry (dark bg)
const BERRY = "8A3B5A"; // primary
const BERRY_D = "5E2740";
const CORAL = "F0705A"; // accent / CTA
const GOLD  = "E0A458"; // secondary data
const SAGE  = "8FA98A"; // tertiary data
const CREAM = "FBF3EE"; // card tint
const WHITE = "FFFFFF";
const TEXT  = "3A2530"; // body on light
const MUTE  = "8A7A82"; // muted
const LINE  = "E7DBD3";

const HF = "Cambria";     // header serif
const BF = "Calibri";     // body sans

const W = 13.333, H = 7.5, M = 0.7;

/* ---------- Helpers ---------- */
function slide(bg) {
  const s = p.addSlide();
  s.background = { color: bg || WHITE };
  return s;
}
// kicker + title block for content slides
function head(s, kicker, title, opts) {
  opts = opts || {};
  s.addText(kicker.toUpperCase(), {
    x: M, y: 0.5, w: W - 2 * M, h: 0.3, fontFace: BF, fontSize: 12, bold: true,
    color: opts.kColor || CORAL, charSpacing: 2, margin: 0,
  });
  s.addText(title, {
    x: M, y: 0.82, w: W - 2 * M, h: opts.th || 0.85, fontFace: HF, fontSize: opts.ts || 30,
    bold: true, color: opts.tColor || INK, margin: 0, lineSpacing: opts.ls || 32,
  });
}
function pageNum(s, n) {
  s.addText(String(n), { x: W - 0.9, y: H - 0.5, w: 0.5, h: 0.3, align: "right",
    fontFace: BF, fontSize: 10, color: MUTE, margin: 0 });
  s.addText("STRIPES × ZyG", { x: M, y: H - 0.5, w: 3, h: 0.3, fontFace: BF,
    fontSize: 9, color: MUTE, charSpacing: 1, margin: 0 });
}
// filled rounded card
function card(s, x, y, w, h, fill, opts) {
  opts = opts || {};
  s.addShape(p.ShapeType.roundRect, {
    x, y, w, h, rectRadius: opts.r || 0.09, fill: { color: fill },
    line: opts.line ? { color: opts.line, width: 1 } : { type: "none" },
    shadow: opts.shadow ? { type: "outer", color: "8A6B57", opacity: 0.18, blur: 7, offset: 3, angle: 90 } : undefined,
  });
}
// small numbered/coral chip
function chip(s, x, y, label, opts) {
  opts = opts || {};
  const d = opts.d || 0.42;
  s.addShape(p.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: opts.fill || CORAL }, line: { type: "none" } });
  s.addText(label, { x: x, y: y, w: d, h: d, align: "center", valign: "middle",
    fontFace: HF, fontSize: opts.fs || 15, bold: true, color: opts.color || WHITE, margin: 0 });
}

/* ============================================================
 * 1 — TITLE
 * ============================================================ */
(() => {
  const s = slide(INK);
  // motif: coral arc dots (stripes nod) top-right
  for (let i = 0; i < 5; i++) {
    s.addShape(p.ShapeType.roundRect, { x: 10.4 + i * 0.5, y: 0.7, w: 0.16, h: 1.5,
      rectRadius: 0.08, fill: { color: [CORAL, GOLD, BERRY, SAGE, CREAM][i] }, line: { type: "none" } });
  }
  s.addText("STRIPES  ×  ZyG  ·  CRO & GROWTH", { x: M, y: 1.5, w: 9, h: 0.3,
    fontFace: BF, fontSize: 13, bold: true, color: CORAL, charSpacing: 3, margin: 0 });
  s.addText("The Inside Addition", { x: M, y: 2.05, w: 11.5, h: 1.0, fontFace: HF,
    fontSize: 54, bold: true, color: WHITE, margin: 0 });
  s.addText("A paid-social launch, landing page & funnel plan — built to turn cold\nmenopause-market traffic into subscribers, retention and repeat revenue.", {
    x: M, y: 3.15, w: 10.8, h: 1.0, fontFace: HF, fontSize: 21, italic: true,
    color: "E7D6DC", margin: 0, lineSpacing: 30 });
  // meta row
  const metas = [["Market & competitive map","Part 1"],["Angle · LP · funnel · KPIs","Part 2"],["First A/B tests","Part 3"],["Agentic scale-up","Part 4"]];
  metas.forEach((m, i) => {
    const x = M + i * 3.0;
    s.addText(m[1].toUpperCase(), { x, y: 5.5, w: 2.8, h: 0.3, fontFace: BF, fontSize: 11, bold: true, color: GOLD, charSpacing: 1, margin: 0 });
    s.addText(m[0], { x, y: 5.82, w: 2.8, h: 0.6, fontFace: BF, fontSize: 13, color: "E7D6DC", margin: 0 });
  });
  s.addShape(p.ShapeType.line, { x: M, y: 5.35, w: W - 2 * M, h: 0, line: { color: BERRY, width: 1 } });
  s.addText("E-commerce Product & CRO Manager — home assignment  ·  Prepared for ZyG", {
    x: M, y: 6.7, w: 11, h: 0.3, fontFace: BF, fontSize: 12, color: MUTE, margin: 0 });
})();

/* ============================================================
 * 2 — APPROACH / HOW TO READ THIS
 * ============================================================ */
(() => {
  const s = slide(WHITE);
  head(s, "How to read this", "The through-line: one angle, engineered end-to-end");
  s.addText("Every section feeds the next — the competitive gap defines the angle, the angle builds the page, the page anchors the funnel, and the funnel defines what we measure and test.",
    { x: M, y: 1.75, w: 11.4, h: 0.6, fontFace: BF, fontSize: 15, color: TEXT, margin: 0, lineSpacing: 21 });

  const steps = [
    ["1","Map the field","Category, vertical & who's actually winning in paid — direct and adjacent."],
    ["2","Pick the wedge","One creative angle Stripes can own that competitors structurally can't copy."],
    ["3","Build the page","A cold-traffic landing page: layout, real copy, look & feel — CRO-first."],
    ["4","Wire the funnel","Landing page → checkout → retention. Every step earns revenue or trust."],
    ["5","Measure & test","The KPI tree, what 'good' looks like, and the first three A/B tests."],
    ["6","Scale with agents","What ZyG agents automate, what stays human, and one tool built concretely."],
  ];
  const cw = 3.72, ch = 1.55, gx = 0.22, gy = 0.28, x0 = M, y0 = 3.05;
  steps.forEach((st, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = x0 + col * (cw + gx), y = y0 + row * (ch + gy);
    card(s, x, y, cw, ch, CREAM, { shadow: true });
    chip(s, x + 0.22, y + 0.24, st[0], { fill: BERRY });
    s.addText(st[1], { x: x + 0.78, y: y + 0.22, w: cw - 0.95, h: 0.45, fontFace: HF, fontSize: 16, bold: true, color: INK, margin: 0 });
    s.addText(st[2], { x: x + 0.24, y: y + 0.78, w: cw - 0.45, h: 0.65, fontFace: BF, fontSize: 12, color: TEXT, margin: 0, lineSpacing: 16 });
  });
  s.addText("Assumptions are flagged in coral throughout. Exact SKU price / formula details should be reconciled against the live PDP before launch.",
    { x: M, y: 6.75, w: 11.6, h: 0.4, fontFace: BF, fontSize: 11, italic: true, color: MUTE, margin: 0 });
  pageNum(s, 2);
})();

/* ============================================================
 * 3 — PART 1 DIVIDER
 * ============================================================ */
function divider(num, title, sub, n) {
  const s = slide(INK);
  s.addText("PART " + num, { x: M, y: 2.6, w: 6, h: 0.5, fontFace: BF, fontSize: 16, bold: true, color: CORAL, charSpacing: 4, margin: 0 });
  s.addText(title, { x: M, y: 3.1, w: 11.5, h: 1.2, fontFace: HF, fontSize: 46, bold: true, color: WHITE, margin: 0, lineSpacing: 48 });
  s.addText(sub, { x: M, y: 4.5, w: 10.5, h: 0.7, fontFace: HF, fontSize: 19, italic: true, color: "E7D6DC", margin: 0, lineSpacing: 26 });
  // stripe motif bottom
  for (let i = 0; i < 5; i++)
    s.addShape(p.ShapeType.roundRect, { x: M + i * 0.5, y: 5.6, w: 0.16, h: 0.7, rectRadius: 0.08, fill: { color: [CORAL, GOLD, BERRY, SAGE, CREAM][i] }, line: { type: "none" } });
  pageNum(s, n);
  return s;
}
divider("1", "Market &\nCompetitive Landscape", "Where Stripes plays — and who is really winning the paid-acquisition war.", 3);

/* ============================================================
 * 4 — CATEGORY & THE MENOPAUSE ECONOMY
 * ============================================================ */
(() => {
  const s = slide(WHITE);
  head(s, "Part 1 · Category & vertical", "A premium wellness brand in the fast-waking menopause economy");
  // left: definition
  s.addText([
    { text: "Category:  ", options: { bold: true, color: BERRY } },
    { text: "Menopause & perimenopause wellness — a lifestage vertical inside women's health / DTC beauty & supplements.\n\n", options: {} },
    { text: "Where Stripes sits:  ", options: { bold: true, color: BERRY } },
    { text: "A hormone-free, clinically-backed, celebrity-founded brand spanning “scalp to vag” — skincare, body, vaginal wellness and supplements. Premium, destigmatizing, lifestyle-led.\n\n", options: {} },
    { text: "The Inside Addition’s lane:  ", options: { bold: true, color: BERRY } },
    { text: "The ingestible / daily-symptom-support segment — the most competitive, most paid-social-driven corner of the category.", options: {} },
  ], { x: M, y: 2.0, w: 6.5, h: 3.6, fontFace: BF, fontSize: 14.5, color: TEXT, margin: 0, lineSpacing: 20, valign: "top" });

  // right: stat stack
  const stats = [
    ["~1.1B", "women in menopause globally by 2025 — a structurally growing buyer base", CORAL],
    ["~6,000", "U.S. women enter menopause every day; avg. 7+ years of symptoms", BERRY],
    ["$600B+", "cited menopause-economy opportunity — yet historically under-served", GOLD],
  ];
  let y = 2.0;
  stats.forEach((st) => {
    card(s, 7.5, y, 5.1, 1.12, CREAM, { shadow: true });
    s.addText(st[0], { x: 7.7, y: y + 0.12, w: 1.9, h: 0.9, fontFace: HF, fontSize: 34, bold: true, color: st[2], margin: 0, valign: "middle" });
    s.addText(st[1], { x: 9.65, y: y + 0.14, w: 2.8, h: 0.85, fontFace: BF, fontSize: 11.5, color: TEXT, margin: 0, valign: "middle", lineSpacing: 14 });
    y += 1.2;
  });
  s.addText("ASSUMPTION / SIZING: figures are directional category context (industry press & analyst estimates), used to frame demand — not Stripes' own numbers.",
    { x: 7.5, y: y + 0.04, w: 5.1, h: 0.55, fontFace: BF, fontSize: 10.5, italic: true, color: CORAL, margin: 0, lineSpacing: 13 });

  s.addText("Why it matters for paid:  a large, always-refreshing audience with high emotional intent and low satisfaction with existing options = cheap attention, but a crowded, claims-sensitive feed.",
    { x: M, y: 6.35, w: 11.9, h: 0.55, fontFace: BF, fontSize: 13, italic: true, color: BERRY_D, margin: 0, lineSpacing: 18 });
  pageNum(s, 4);
})();

/* ============================================================
 * 5 — COMPETITIVE MAP
 * ============================================================ */
(() => {
  const s = slide(WHITE);
  head(s, "Part 1 · The competitive map", "Two rings of competition — and the one outspending everyone");
  s.addText("Cold-traffic buyers aren't comparing Stripes to a tidy set of rivals. They're being served ads by three different kinds of player at once.",
    { x: M, y: 1.75, w: 11.6, h: 0.5, fontFace: BF, fontSize: 13.5, color: TEXT, margin: 0, lineSpacing: 18 });

  const cols = [
    ["DIRECT — menopause DTC", BERRY, [
      "Womaness — broad menopause line, mass retail (Target)",
      "Kindra — Bayer-backed, supplements + skincare",
      "Bonafide — Relizen / Ristela, hormone-free",
      "State Of Menopause, Pause Well-Aging, Wile",
    ]],
    ["Rx / TELEHEALTH — the HRT lane", GOLD, [
      "Midi Health — clinician-led menopause care",
      "Alloy · Evernow · Winona — Rx HRT, fast intake funnels",
      "Compete on “treat it medically,” heavy on quiz funnels",
      "Frame the “hormone-free vs. HRT” decision for buyers",
    ]],
    ["ADJACENT — paid-social machines", CORAL, [
      "Happy Mammoth (Hormone Harmony) — category's #1 spender",
      "O Positiv (MENO / URO) — playful, UGC-heavy",
      "Nutrafol — menopause hair-thinning, huge spend",
      "Ritual · Perelel · Arrae — women's supplement playbooks",
    ]],
  ];
  const cw = 3.9, gx = 0.19, x0 = M, y0 = 2.45, chh = 3.35;
  cols.forEach((c, i) => {
    const x = x0 + i * (cw + gx);
    card(s, x, y0, cw, chh, i === 2 ? "FCEDE9" : CREAM, { shadow: true, line: i === 2 ? CORAL : null });
    s.addShape(p.ShapeType.roundRect, { x: x, y: y0, w: cw, h: 0.62, rectRadius: 0.09, fill: { color: c[1] }, line: { type: "none" } });
    s.addText(c[0], { x: x + 0.22, y: y0, w: cw - 0.4, h: 0.62, fontFace: BF, fontSize: 12.5, bold: true, color: WHITE, margin: 0, valign: "middle" });
    c[2].forEach((it, j) => {
      s.addText(it, { x: x + 0.24, y: y0 + 0.82 + j * 0.62, w: cw - 0.46, h: 0.58, fontFace: BF, fontSize: 11.5, color: TEXT, margin: 0, valign: "top", lineSpacing: 14, bullet: { code: "2022", indent: 12 } });
    });
  });
  s.addText([
    { text: "The one to beat:  ", options: { bold: true, color: CORAL } },
    { text: "Happy Mammoth / Hormone Harmony has scaled on relentless symptom-led, quasi-clinical UGC and advertorials — but carries a credibility/trust tax. That gap is Stripes' opening.", options: {} },
  ], { x: M, y: 6.05, w: 11.9, h: 0.8, fontFace: BF, fontSize: 13, italic: true, color: BERRY_D, margin: 0, lineSpacing: 18 });
  pageNum(s, 5);
})();

/* ============================================================
 * 6 — WHAT'S WINNING IN PAID + THE GAP
 * ============================================================ */
(() => {
  const s = slide(WHITE);
  head(s, "Part 1 · What's winning in the feed", "Five angles dominate the category — Stripes can own the sixth");
  // left: whats running
  s.addText("WHAT'S ALREADY RUNNING", { x: M, y: 1.85, w: 5.8, h: 0.3, fontFace: BF, fontSize: 12, bold: true, color: MUTE, charSpacing: 1.5, margin: 0 });
  const running = [
    ["Symptom shock-hook", "“Waking at 3am drenched?” — visceral, high CTR, race-to-the-bottom."],
    ["Fear / hormone-panic", "“Your hormones are sabotaging you.” Works, but claims-risky & anxious."],
    ["Doctor / clinical authority", "“OB-GYN formulated.” Trust-building but generic and ownerless."],
    ["Raw UGC testimonial", "Selfie-video “this changed my life.” Cheap, fatigues fast."],
    ["Advertorial listicle", "“5 signs of perimenopause.” Great pre-sell, feels off-brand for premium."],
  ];
  running.forEach((r, i) => {
    const y = 2.25 + i * 0.82;
    s.addText([{ text: r[0] + " — ", options: { bold: true, color: INK } }, { text: r[1], options: { color: TEXT } }],
      { x: M, y, w: 5.9, h: 0.78, fontFace: BF, fontSize: 12.5, margin: 0, valign: "top", lineSpacing: 15, bullet: { code: "2022", indent: 12 } });
  });

  // right: the gap card
  card(s, 6.95, 1.9, 5.65, 4.55, INK, { shadow: true });
  s.addText("THE OPEN LANE", { x: 7.25, y: 2.15, w: 5, h: 0.3, fontFace: BF, fontSize: 12, bold: true, color: CORAL, charSpacing: 2, margin: 0 });
  s.addText("Credible, empowered symptom-relief", { x: 7.25, y: 2.5, w: 5.1, h: 0.9, fontFace: HF, fontSize: 24, bold: true, color: WHITE, margin: 0, lineSpacing: 27 });
  s.addText([
    { text: "The feed is split between fear-based hustle brands and faceless clinical supplements. Nobody credibly owns ", options: { color: "E7D6DC" } },
    { text: "“a real face you trust + real science + zero hormone anxiety.”", options: { color: CORAL, bold: true } },
  ], { x: 7.25, y: 3.55, w: 5.1, h: 1.1, fontFace: BF, fontSize: 14, margin: 0, lineSpacing: 19 });
  s.addText("Stripes' unfair advantages to fill it:", { x: 7.25, y: 4.75, w: 5.1, h: 0.3, fontFace: BF, fontSize: 12, bold: true, color: GOLD, margin: 0 });
  ["Naomi Watts — a face no competitor can copy", "Hormone-free — de-risks the #1 objection", "Clinically-backed + premium brand equity"].forEach((t, i) => {
    s.addText(t, { x: 7.45, y: 5.05 + i * 0.42, w: 4.9, h: 0.4, fontFace: BF, fontSize: 12.5, color: WHITE, margin: 0, bullet: { code: "2022", indent: 12 } });
  });
  pageNum(s, 6);
})();

/* ============================================================
 * 7 — PART 2 DIVIDER
 * ============================================================ */
divider("2", "Hero Product Launch", "The Inside Addition — angle, landing page, funnel and how we'll know it's working.", 7);

/* ============================================================
 * 8 — CREATIVE ANGLE
 * ============================================================ */
(() => {
  const s = slide(WHITE);
  head(s, "Part 2.1 · Creative angle", "The angle: “The daily that meets menopause where it actually hits”");
  // big statement card
  card(s, M, 1.85, 11.9, 1.5, CREAM, { shadow: true, line: CORAL });
  s.addText([
    { text: "Lead line we'd launch:  ", options: { bold: true, color: CORAL } },
    { text: "“You were told to just push through the 2 a.m. wake-ups, the fog, the mood swings. From Naomi Watts — one hormone-free daily, made to give you your nights, your focus and your calm back.”", options: { italic: true, color: INK } },
  ], { x: M + 0.3, y: 2.0, w: 11.3, h: 1.2, fontFace: HF, fontSize: 17, margin: 0, lineSpacing: 24, valign: "middle" });

  const cols = [
    ["WHY THIS ANGLE", BERRY, [
      "Symptom-specific (sleep→mood→focus cascade) stops the scroll where category education can't.",
      "Leads with Naomi Watts + hormone-free + clinical — trust the fear-brands can't match.",
      "Empowered, permission-giving tone vs. the shame/panic flooding the feed.",
    ]],
    ["FOR WHOM", GOLD, [
      "Women 45–60 in peri/menopause, symptomatic and tired of “just deal with it.”",
      "HRT-hesitant or HRT-excluded — actively seeking a non-hormonal option.",
      "Has tried a generic supplement that did nothing; skeptical but hopeful.",
    ]],
    ["WHY IT WINS", CORAL, [
      "Beats Happy Mammoth on credibility, not on spend — a defensible moat.",
      "Beats clinical brands on emotional resonance + a face to trust.",
      "Hormone-free neutralizes the category's single biggest purchase objection.",
    ]],
  ];
  const cw = 3.9, gx = 0.19, y0 = 3.65, chh = 2.85;
  cols.forEach((c, i) => {
    const x = M + i * (cw + gx);
    card(s, x, y0, cw, chh, WHITE, { shadow: true, line: LINE });
    s.addText(c[0], { x: x + 0.24, y: y0 + 0.2, w: cw - 0.4, h: 0.3, fontFace: BF, fontSize: 12.5, bold: true, color: c[1], charSpacing: 1, margin: 0 });
    s.addShape(p.ShapeType.line, { x: x + 0.24, y: y0 + 0.56, w: cw - 0.48, h: 0, line: { color: LINE, width: 1 } });
    c[2].forEach((t, j) => {
      s.addText(t, { x: x + 0.24, y: y0 + 0.68 + j * 0.7, w: cw - 0.46, h: 0.66, fontFace: BF, fontSize: 11.5, color: TEXT, margin: 0, lineSpacing: 14, valign: "top", bullet: { code: "2022", indent: 12 } });
    });
  });
  pageNum(s, 8);
})();

/* ============================================================
 * 9 — LANDING PAGE: PAGE TYPE CHOICE
 * ============================================================ */
(() => {
  const s = slide(WHITE);
  head(s, "Part 2.2 · Landing page — the choice", "A dedicated long-form landing page, not the catalog PDP");
  s.addText("Cold paid-social traffic has zero brand context and one hesitant question: “will this actually help me, and is it safe?” The standard Shopify PDP answers neither well.",
    { x: M, y: 1.75, w: 11.7, h: 0.55, fontFace: BF, fontSize: 14, color: TEXT, margin: 0, lineSpacing: 19 });

  const opts = [
    ["Standard PDP", "8A7A82", ["Fast to ship, on-brand", "But: assumes intent, thin on education & objection-handling", "Weak for cold traffic"], false],
    ["Advertorial → PDP", "8A7A82", ["Strong pre-sell, high CVR", "But: 2-step, can read “spammy” — off-brand for a celebrity premium name", "Adds build + tracking complexity"], false],
    ["Dedicated long-form LP", CORAL, ["Full control of narrative, offer & objections in one branded scroll", "Pre-sells within the page — keeps premium feel", "One URL to test & iterate fast"], true],
  ];
  const cw = 3.9, gx = 0.19, y0 = 2.5, chh = 3.05;
  opts.forEach((o, i) => {
    const x = M + i * (cw + gx);
    card(s, x, y0, cw, chh, o[3] ? "FCEDE9" : CREAM, { shadow: true, line: o[3] ? CORAL : null });
    if (o[3]) s.addText("OUR PICK", { x: x + cw - 1.5, y: y0 + 0.18, w: 1.3, h: 0.3, align: "right", fontFace: BF, fontSize: 10, bold: true, color: CORAL, charSpacing: 1, margin: 0 });
    s.addText(o[0], { x: x + 0.24, y: y0 + 0.22, w: cw - 1.4, h: 0.5, fontFace: HF, fontSize: 17, bold: true, color: INK, margin: 0 });
    o[2].forEach((t, j) => {
      s.addText(t, { x: x + 0.24, y: y0 + 0.85 + j * 0.7, w: cw - 0.46, h: 0.66, fontFace: BF, fontSize: 11.5, color: TEXT, margin: 0, lineSpacing: 14, valign: "top", bullet: { code: "2022", indent: 12 } });
    });
  });
  s.addText([
    { text: "Tradeoff we're accepting:  ", options: { bold: true, color: CORAL } },
    { text: "a bespoke LP costs more to build and maintain than a PDP tweak — justified because it's the single highest-leverage surface for cold CVR, and becomes the reusable template for every future angle test.", options: {} },
  ], { x: M, y: 5.8, w: 11.9, h: 0.8, fontFace: BF, fontSize: 12.5, italic: true, color: BERRY_D, margin: 0, lineSpacing: 17 });
  pageNum(s, 9);
})();

/* ============================================================
 * 10 — LP WIREFRAME: LAYOUT & WHY
 * ============================================================ */
(() => {
  const s = slide(WHITE);
  head(s, "Part 2.2 · Landing page — layout", "The scroll: 10 sections, each earning its place");
  const rows = [
    ["1", "Hero — above the fold", "Headline + subhead + hero shot + primary CTA + trust bar. Sells the promise & offer in one screen."],
    ["2", "Problem agitation", "“Does this sound like you?” symptom checklist — mirror the visitor, create resonance."],
    ["3", "Founder turn — Naomi", "The credibility pivot & origin story. The moat competitors can't copy."],
    ["4", "How it works / the science", "Hormone-free mechanism + clinical backing. De-risks the #1 objection."],
    ["5", "What's inside", "Ingredient → benefit map. Converts skeptics; substantiates the claim."],
  ];
  const rows2 = [
    ["6", "Social proof", "Ratings, reviews, before/after-in-words, press. Borrowed trust at the decision point."],
    ["7", "Why Stripes vs. alternatives", "Comparison vs. HRT & generic supplements. Wins the mental shortlist."],
    ["8", "The offer", "Subscribe-&-save default, bundle, guarantee. Where AOV & LTV are set."],
    ["9", "FAQ", "Objection-handling: safety, timing, cancel-anytime. Removes final friction."],
    ["10", "Final CTA + risk reversal", "Restate promise + money-back guarantee. Convert the ready; reassure the rest."],
  ];
  function colList(list, x) {
    list.forEach((r, i) => {
      const y = 1.95 + i * 0.92;
      card(s, x, y, 5.75, 0.8, i % 2 ? WHITE : CREAM, { line: LINE });
      chip(s, x + 0.16, y + 0.19, r[0], { d: 0.42, fill: BERRY, fs: 14 });
      s.addText(r[1], { x: x + 0.72, y: y + 0.08, w: 4.9, h: 0.32, fontFace: BF, fontSize: 12.5, bold: true, color: INK, margin: 0 });
      s.addText(r[2], { x: x + 0.72, y: y + 0.39, w: 4.9, h: 0.4, fontFace: BF, fontSize: 10.5, color: TEXT, margin: 0, lineSpacing: 12.5 });
    });
  }
  colList(rows, M);
  colList(rows2, 6.85);
  s.addText("A sticky Add-to-Cart bar follows the scroll on mobile — the CTA is never more than a thumb away.",
    { x: M, y: 6.72, w: 11.9, h: 0.35, fontFace: BF, fontSize: 11.5, italic: true, color: CORAL, margin: 0 });
  pageNum(s, 10);
})();

/* ============================================================
 * 11 — LP FULL COPY (A)
 * ============================================================ */
(() => {
  const s = slide(WHITE);
  head(s, "Part 2.2 · Full copy — top of page", "Real copy: hero → problem → founder");
  // Hero block
  card(s, M, 1.85, 5.75, 2.35, INK, { shadow: true });
  s.addText("① HERO", { x: M + 0.24, y: 2.0, w: 3, h: 0.3, fontFace: BF, fontSize: 11, bold: true, color: CORAL, charSpacing: 1.5, margin: 0 });
  s.addText("Menopause kept you up.\nThis is how you take the night back.", { x: M + 0.24, y: 2.3, w: 5.25, h: 1.0, fontFace: HF, fontSize: 20, bold: true, color: WHITE, margin: 0, lineSpacing: 23 });
  s.addText("A hormone-free daily from Naomi Watts — clinically-backed support for sleep, mood and mental clarity. Feel the difference or your money back.",
    { x: M + 0.24, y: 3.28, w: 5.25, h: 0.5, fontFace: BF, fontSize: 11, color: "E7D6DC", margin: 0, lineSpacing: 14 });
  s.addShape(p.ShapeType.roundRect, { x: M + 0.24, y: 3.8, w: 2.7, h: 0.34, rectRadius: 0.17, fill: { color: CORAL }, line: { type: "none" } });
  s.addText("START MY DAILY →", { x: M + 0.24, y: 3.8, w: 2.7, h: 0.34, align: "center", valign: "middle", fontFace: BF, fontSize: 11, bold: true, color: WHITE, margin: 0 });
  s.addText("★★★★★  Trusted by thousands  ·  Hormone-free", { x: M + 3.05, y: 3.8, w: 2.5, h: 0.34, valign: "middle", fontFace: BF, fontSize: 9.5, color: GOLD, margin: 0 });

  // Problem block
  card(s, 6.85, 1.85, 5.75, 2.35, CREAM, { shadow: true, line: LINE });
  s.addText("② PROBLEM AGITATION", { x: 7.09, y: 2.0, w: 4, h: 0.3, fontFace: BF, fontSize: 11, bold: true, color: BERRY, charSpacing: 1, margin: 0 });
  s.addText("Does this sound like your last six months?", { x: 7.09, y: 2.3, w: 5.3, h: 0.4, fontFace: HF, fontSize: 15, bold: true, color: INK, margin: 0 });
  ["Wide awake at 2 a.m. — then wrecked all day", "Words vanishing mid-sentence (“is it just me?”)", "Mood that swings before you can catch it", "Told to “just push through” — by everyone"].forEach((t, i) => {
    s.addText(t, { x: 7.15, y: 2.78 + i * 0.33, w: 5.3, h: 0.32, fontFace: BF, fontSize: 12, color: TEXT, margin: 0, bullet: { code: "2713", indent: 13 } });
  });

  // Founder block full width
  card(s, M, 4.35, 11.75, 2.15, WHITE, { shadow: true, line: CORAL });
  s.addText("③ FOUNDER TURN — NAOMI WATTS", { x: M + 0.28, y: 4.52, w: 6, h: 0.3, fontFace: BF, fontSize: 11, bold: true, color: CORAL, charSpacing: 1, margin: 0 });
  s.addText("“I went into menopause early, and blindsided. I built Stripes so no woman feels as unprepared as I did.”",
    { x: M + 0.28, y: 4.82, w: 11.2, h: 0.7, fontFace: HF, fontSize: 19, italic: true, bold: true, color: INK, margin: 0, lineSpacing: 24 });
  s.addText([
    { text: "Body:  ", options: { bold: true, color: BERRY } },
    { text: "“The Inside Addition is the daily I wanted and couldn't find — hormone-free, backed by real science, and made to work on the symptoms that actually derail your day. No panic, no pretending. Just support you can feel.”  ", options: { color: TEXT } },
    { text: "— Naomi Watts, Founder", options: { italic: true, color: MUTE } },
  ], { x: M + 0.28, y: 5.55, w: 11.2, h: 0.85, fontFace: BF, fontSize: 13, margin: 0, lineSpacing: 18, valign: "top" });
  pageNum(s, 11);
})();

/* ============================================================
 * 12 — LP FULL COPY (B)
 * ============================================================ */
(() => {
  const s = slide(WHITE);
  head(s, "Part 2.2 · Full copy — proof & offer", "Real copy: science → proof → offer → final CTA");
  // science + ingredients (left)
  card(s, M, 1.85, 5.75, 2.15, CREAM, { line: LINE, shadow: true });
  s.addText("④ ⑤  THE SCIENCE + WHAT'S INSIDE", { x: M + 0.24, y: 2.0, w: 5, h: 0.3, fontFace: BF, fontSize: 11, bold: true, color: BERRY, charSpacing: 0.5, margin: 0 });
  s.addText("Hormone-free — because relief shouldn't mean a trade-off.", { x: M + 0.24, y: 2.3, w: 5.3, h: 0.55, fontFace: HF, fontSize: 15, bold: true, color: INK, margin: 0, lineSpacing: 18 });
  s.addText([
    { text: "Clinically-studied botanicals and micronutrients chosen for the peri/menopause symptom cascade — no estrogen, no progestin, no guesswork. One daily dose.\n", options: { color: TEXT } },
    { text: "Ingredient → benefit:  sleep · mood · clarity · daily calm.", options: { bold: true, color: BERRY } },
  ], { x: M + 0.24, y: 2.85, w: 5.3, h: 1.0, fontFace: BF, fontSize: 12, margin: 0, lineSpacing: 16 });
  s.addText("ASSUMPTION: exact ingredient names / doses to be locked from the live PDP + reviewed for ad-claim compliance.",
    { x: M + 0.24, y: 3.68, w: 5.3, h: 0.3, fontFace: BF, fontSize: 9, italic: true, color: CORAL, margin: 0, lineSpacing: 11 });

  // proof (right)
  card(s, 6.85, 1.85, 5.75, 2.15, WHITE, { line: LINE, shadow: true });
  s.addText("⑥  SOCIAL PROOF", { x: 7.09, y: 2.0, w: 5, h: 0.3, fontFace: BF, fontSize: 11, bold: true, color: BERRY, charSpacing: 1, margin: 0 });
  s.addText("★★★★★   “I slept through the night for the first time in a year.”", { x: 7.09, y: 2.32, w: 5.3, h: 0.5, fontFace: HF, fontSize: 14, bold: true, italic: true, color: INK, margin: 0, lineSpacing: 17 });
  s.addText("“Three weeks in and the fog lifted. I feel like me again.”  ·  “Finally something hormone-free that actually did something.”",
    { x: 7.09, y: 2.9, w: 5.35, h: 0.6, fontFace: BF, fontSize: 11.5, italic: true, color: TEXT, margin: 0, lineSpacing: 15 });
  s.addText([{ text: "4.8★ avg  ·  ", options: { bold: true, color: GOLD } }, { text: "As seen in press  ·  Thousands of women", options: { color: MUTE } }],
    { x: 7.09, y: 3.55, w: 5.3, h: 0.35, fontFace: BF, fontSize: 11, margin: 0 });

  // offer (full width, dark)
  card(s, M, 4.2, 11.75, 1.2, INK, { shadow: true });
  s.addText("⑧  THE OFFER", { x: M + 0.28, y: 4.34, w: 3, h: 0.3, fontFace: BF, fontSize: 11, bold: true, color: CORAL, charSpacing: 1.5, margin: 0 });
  s.addText([
    { text: "Subscribe & Save 20% — ", options: { bold: true, color: WHITE } },
    { text: "first month ships today, then a fresh supply monthly. ", options: { color: "E7D6DC" } },
    { text: "Free shipping · Cancel anytime · 60-day feel-it-or-refund guarantee.", options: { bold: true, color: GOLD } },
  ], { x: M + 0.28, y: 4.62, w: 8.35, h: 0.65, fontFace: BF, fontSize: 13.5, margin: 0, lineSpacing: 18, valign: "middle" });
  s.addShape(p.ShapeType.roundRect, { x: 9.95, y: 4.6, w: 2.5, h: 0.5, rectRadius: 0.25, fill: { color: CORAL }, line: { type: "none" } });
  s.addText("START — SAVE 20% →", { x: 9.95, y: 4.6, w: 2.5, h: 0.5, align: "center", valign: "middle", fontFace: BF, fontSize: 12, bold: true, color: WHITE, margin: 0 });

  // final CTA + FAQ
  s.addText([
    { text: "⑨ FAQ  ", options: { bold: true, color: BERRY } },
    { text: "“Is it safe with my meds?” · “When will I feel it?” · “Can I cancel?” — answered plainly.    ", options: { color: TEXT } },
    { text: "⑩ FINAL CTA  ", options: { bold: true, color: CORAL } },
    { text: "“Give your body the daily it's been asking for. Try it risk-free for 60 days.”", options: { color: TEXT, italic: true } },
  ], { x: M, y: 5.62, w: 11.9, h: 0.9, fontFace: BF, fontSize: 12.5, margin: 0, lineSpacing: 17, valign: "top" });
  s.addText("Offer mechanics (20% sub-save, 60-day guarantee) are recommended — align to actual margin & policy before launch.",
    { x: M, y: 6.55, w: 11.9, h: 0.3, fontFace: BF, fontSize: 9.5, italic: true, color: CORAL, margin: 0 });
  pageNum(s, 12);
})();

/* ============================================================
 * 13 — VISUAL GUIDELINES
 * ============================================================ */
(() => {
  const s = slide(WHITE);
  head(s, "Part 2.2 · Visual guidelines", "Look & feel: warm, credible, unmistakably Stripes");
  // swatches
  s.addText("PALETTE", { x: M, y: 1.85, w: 4, h: 0.3, fontFace: BF, fontSize: 12, bold: true, color: MUTE, charSpacing: 1.5, margin: 0 });
  const sw = [["Berry", BERRY], ["Coral (CTA)", CORAL], ["Warm gold", GOLD], ["Cream", CREAM], ["Ink", INK]];
  sw.forEach((c, i) => {
    const x = M + i * 1.05;
    s.addShape(p.ShapeType.roundRect, { x, y: 2.2, w: 0.9, h: 0.9, rectRadius: 0.1, fill: { color: c[1] }, line: { color: LINE, width: 1 } });
    s.addText(c[0], { x: x - 0.05, y: 3.12, w: 1.0, h: 0.3, align: "center", fontFace: BF, fontSize: 9.5, color: TEXT, margin: 0 });
  });

  const cols = [
    ["IMAGERY", CORAL, [
      "Real women 45–60 — natural light, unretouched skin, genuine ease.",
      "Aspirational-but-real: rested mornings, not clinical or clinical-cold.",
      "Product shown in real life (bedside, bag) — not floating on white.",
      "Founder presence used sparingly for the credibility beat.",
    ]],
    ["TONE & VOICE", BERRY, [
      "Warm, direct, in-on-it. Talks with her, never down to her.",
      "Confident, never fear-mongering. Permission, not panic.",
      "Plain-spoken about symptoms — destigmatizing, a little witty.",
      "Claims are careful and substantiated — premium & credible.",
    ]],
    ["LAYOUT & FEEL", GOLD, [
      "Editorial whitespace; large serif heads + clean sans body.",
      "Mobile-first — 80%+ of paid-social traffic; thumb-reachable CTAs.",
      "One coral CTA color, used only for actions. Fast-loading.",
      "Warm creams over sterile white; soft rounded cards.",
    ]],
  ];
  const cw = 3.9, gx = 0.19, y0 = 3.65, chh = 2.85;
  cols.forEach((c, i) => {
    const x = M + i * (cw + gx);
    card(s, x, y0, cw, chh, CREAM, { shadow: true });
    s.addText(c[0], { x: x + 0.24, y: y0 + 0.2, w: cw - 0.4, h: 0.3, fontFace: BF, fontSize: 12.5, bold: true, color: c[1], charSpacing: 1, margin: 0 });
    s.addShape(p.ShapeType.line, { x: x + 0.24, y: y0 + 0.56, w: cw - 0.48, h: 0, line: { color: LINE, width: 1 } });
    c[2].forEach((t, j) => {
      s.addText(t, { x: x + 0.24, y: y0 + 0.66 + j * 0.54, w: cw - 0.46, h: 0.5, fontFace: BF, fontSize: 11, color: TEXT, margin: 0, lineSpacing: 13, valign: "top", bullet: { code: "2022", indent: 12 } });
    });
  });
  pageNum(s, 13);
})();

/* ============================================================
 * 14 — FUNNEL WIREFRAME
 * ============================================================ */
(() => {
  const s = slide(WHITE);
  head(s, "Part 2.3 · Funnel wireframe", "From ad to advocate — every step earns revenue or trust");
  const steps = [
    ["01", "Paid-social ad", "Angle-led hook stops scroll", "Acquire attention", BERRY],
    ["02", "Landing page", "Educate, prove, present offer", "Convert cold → buyer", CORAL],
    ["03", "Cart + checkout", "Frictionless, trust badges, express pay", "Reduce abandonment", GOLD],
    ["04", "One-click upsell", "Add a topical / 2nd bottle post-purchase", "Lift AOV", SAGE],
    ["05", "Thank-you page", "Set expectations + invite to community", "Build trust early", BERRY],
    ["06", "Onboarding flow", "Email/SMS: how-to-use, what to expect", "Reduce early churn", CORAL],
    ["07", "Replenish & retain", "Subscription nudges, day-30 check-in", "Protect LTV", GOLD],
    ["08", "Advocate & cross-sell", "Reviews/UGC ask → “scalp to vag” range", "Compound revenue", SAGE],
  ];
  const cw = 2.83, gx = 0.19, chh = 2.05;
  steps.forEach((st, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = M + col * (cw + gx), y = 2.05 + row * (chh + 0.35);
    card(s, x, y, cw, chh, i < 3 ? "FCEDE9" : CREAM, { shadow: true, line: i < 3 ? null : LINE });
    chip(s, x + 0.22, y + 0.22, st[0], { d: 0.5, fill: st[4], fs: 13 });
    s.addText(st[1], { x: x + 0.85, y: y + 0.24, w: cw - 1.0, h: 0.45, fontFace: HF, fontSize: 14, bold: true, color: INK, margin: 0, lineSpacing: 16 });
    s.addText(st[2], { x: x + 0.24, y: y + 0.8, w: cw - 0.46, h: 0.7, fontFace: BF, fontSize: 11, color: TEXT, margin: 0, lineSpacing: 14, valign: "top" });
    s.addText(st[3].toUpperCase(), { x: x + 0.24, y: y + 1.58, w: cw - 0.46, h: 0.35, fontFace: BF, fontSize: 9.5, bold: true, color: st[4], charSpacing: 0.5, margin: 0 });
  });
  // arrows between top row
  for (let i = 0; i < 3; i++) s.addText("→", { x: M + (i + 1) * cw + i * gx - 0.05, y: 2.85, w: 0.25, h: 0.4, align: "center", fontFace: BF, fontSize: 16, bold: true, color: MUTE, margin: 0 });
  s.addText("Post-purchase (steps 4–8) is where the model actually makes money: the first order buys the customer; subscription, retention and cross-sell across the “scalp to vag” range pay it back.",
    { x: M, y: 6.75, w: 11.9, h: 0.5, fontFace: BF, fontSize: 12, italic: true, color: BERRY_D, margin: 0, lineSpacing: 16 });
  pageNum(s, 14);
})();

/* ============================================================
 * 15 — MEASURING SUCCESS / KPI TREE
 * ============================================================ */
(() => {
  const s = slide(WHITE);
  head(s, "Part 2.4 · Measuring success", "One north star, a connected KPI tree, clear targets");
  // north star
  card(s, M, 1.85, 3.5, 4.55, INK, { shadow: true });
  s.addText("NORTH STAR", { x: M + 0.26, y: 2.05, w: 3, h: 0.3, fontFace: BF, fontSize: 11, bold: true, color: CORAL, charSpacing: 1.5, margin: 0 });
  s.addText("LTV : CAC", { x: M + 0.26, y: 2.4, w: 3, h: 0.6, fontFace: HF, fontSize: 30, bold: true, color: WHITE, margin: 0 });
  s.addText("Profitable, repeatable acquisition — the only metric that says “scale it.”", { x: M + 0.26, y: 3.05, w: 3.0, h: 0.7, fontFace: BF, fontSize: 12, color: "E7D6DC", margin: 0, lineSpacing: 16 });
  s.addText("TARGET", { x: M + 0.26, y: 3.95, w: 3, h: 0.3, fontFace: BF, fontSize: 10, bold: true, color: GOLD, charSpacing: 1, margin: 0 });
  s.addText("≥ 3:1", { x: M + 0.26, y: 4.22, w: 3, h: 0.6, fontFace: HF, fontSize: 26, bold: true, color: GOLD, margin: 0 });
  s.addText("with CAC payback < 3 months", { x: M + 0.26, y: 4.85, w: 3, h: 0.4, fontFace: BF, fontSize: 11.5, color: "E7D6DC", margin: 0 });
  s.addText("Guardrail: new-customer contribution margin ≥ 0 after the upsell.", { x: M + 0.26, y: 5.45, w: 3.0, h: 0.7, fontFace: BF, fontSize: 11, italic: true, color: "C9A7B0", margin: 0, lineSpacing: 14 });

  // driver columns
  const groups = [
    ["ACQUISITION", BERRY, [["Ad CTR", "≥ 1.5%"], ["CPC / CPM", "efficient vs. category"], ["Cost per LP visit", "trending down"]]],
    ["CONVERSION", CORAL, [["LP CVR (cold)", "3–5%"], ["AOV", "↑ via upsell"], ["Subscribe take-rate", "≥ 30%"], ["Upsell take-rate", "10–15%"]]],
    ["RETENTION / LTV", GOLD, [["Sub retention m3", "≥ 60%"], ["60/90-day repeat", "grow MoM"], ["Refund rate", "< 8%"], ["90-day LTV", "> CAC × 1.5"]]],
  ];
  const cw = 2.62, gx = 0.16, x0 = 4.55, y0 = 1.85, chh = 4.55;
  groups.forEach((g, i) => {
    const x = x0 + i * (cw + gx);
    card(s, x, y0, cw, chh, CREAM, { shadow: true });
    s.addShape(p.ShapeType.roundRect, { x, y: y0, w: cw, h: 0.5, rectRadius: 0.09, fill: { color: g[1] }, line: { type: "none" } });
    s.addText(g[0], { x: x + 0.18, y: y0, w: cw - 0.3, h: 0.5, valign: "middle", fontFace: BF, fontSize: 11.5, bold: true, color: WHITE, charSpacing: 0.5, margin: 0 });
    g[2].forEach((m, j) => {
      const yy = y0 + 0.72 + j * 0.92;
      s.addText(m[0], { x: x + 0.18, y: yy, w: cw - 0.34, h: 0.35, fontFace: BF, fontSize: 12.5, bold: true, color: INK, margin: 0 });
      s.addText(m[1], { x: x + 0.18, y: yy + 0.32, w: cw - 0.34, h: 0.35, fontFace: BF, fontSize: 11.5, color: g[1], margin: 0 });
      if (j < g[2].length - 1) s.addShape(p.ShapeType.line, { x: x + 0.18, y: yy + 0.72, w: cw - 0.36, h: 0, line: { color: LINE, width: 1 } });
    });
  });
  s.addText("How they connect:  CTR feeds LP visits → LP CVR × AOV sets first-order revenue → subscribe & upsell rates set day-1 LTV → retention compounds it → LTV vs. CAC decides whether we pour fuel on the fire.  Targets are launch hypotheses to beat, not guarantees.",
    { x: M, y: 6.6, w: 11.9, h: 0.65, fontFace: BF, fontSize: 11.5, italic: true, color: BERRY_D, margin: 0, lineSpacing: 15 });
  pageNum(s, 15);
})();

/* ============================================================
 * 16 — PART 3 DIVIDER
 * ============================================================ */
divider("3", "Funnel Optimization", "The first three A/B tests on the live Stripes site — highest leverage first.", 16);

/* ============================================================
 * 17 — A/B TESTS
 * ============================================================ */
(() => {
  const s = slide(WHITE);
  head(s, "Part 3 · First tests to run", "Three tests, ranked by leverage over the KPI tree");
  const tests = [
    ["01", "PDP hero: symptom-led value prop + proof above the fold", BERRY,
      ["HYPOTHESIS", "The live PDP opens on product, not problem. Leading with a symptom-led promise + star rating + hormone-free badge above the fold will lift add-to-cart from cold traffic."],
      ["CHANGE", "Rewrite H1 to the symptom→relief promise; surface reviews & guarantee above the fold; single clear CTA."],
      ["WHERE / WHY FIRST", "Top of funnel, highest-traffic surface. Biggest CVR lever and it validates the launch angle on owned traffic before we spend big."]],
    ["02", "Subscription-first offer presentation", CORAL,
      ["HYPOTHESIS", "Defaulting to Subscribe-&-Save (vs. one-time) with a clear savings + cancel-anytime message will raise subscription take-rate without hurting overall CVR."],
      ["CHANGE", "Pre-select subscribe option, restate the 20% + free shipping + cancel-anytime, add a subscription value reminder."],
      ["WHERE / WHY FIRST", "Offer step. Directly moves subscribe take-rate, AOV and LTV — the retention half of the north star. Cheap to ship."]],
    ["03", "Post-purchase one-click upsell", GOLD,
      ["HYPOTHESIS", "Adding a one-click upsell (topical or 2nd bottle) on the thank-you step will lift AOV with zero added CAC and no checkout friction."],
      ["CHANGE", "Insert a post-purchase upsell offer between checkout and confirmation with a one-tap accept."],
      ["WHERE / WHY FIRST", "Post-purchase. Pure-margin AOV with no CVR risk to the core funnel — the safest revenue we can add while tests 1–2 run."]],
  ];
  const cw = 3.9, gx = 0.19, y0 = 1.9, chh = 4.75;
  tests.forEach((t, i) => {
    const x = M + i * (cw + gx);
    card(s, x, y0, cw, chh, CREAM, { shadow: true });
    chip(s, x + 0.24, y0 + 0.24, t[0], { d: 0.5, fill: t[2], fs: 13 });
    s.addText(t[1], { x: x + 0.24, y: y0 + 0.82, w: cw - 0.46, h: 0.95, fontFace: HF, fontSize: 15, bold: true, color: INK, margin: 0, lineSpacing: 18 });
    let yy = y0 + 1.85;
    [t[3], t[4], t[5]].forEach((blk) => {
      s.addText(blk[0], { x: x + 0.24, y: yy, w: cw - 0.46, h: 0.25, fontFace: BF, fontSize: 9.5, bold: true, color: t[2], charSpacing: 1, margin: 0 });
      s.addText(blk[1], { x: x + 0.24, y: yy + 0.24, w: cw - 0.46, h: 0.66, fontFace: BF, fontSize: 10.5, color: TEXT, margin: 0, lineSpacing: 12.5, valign: "top" });
      yy += 0.96;
    });
  });
  pageNum(s, 17);
})();

/* ============================================================
 * 18 — PART 4 DIVIDER
 * ============================================================ */
divider("4", "Agentic Approach\n& Product", "What ZyG agents can own, what stays human — and one tool, built concretely.", 18);

/* ============================================================
 * 19 — AUTOMATE VS HUMAN
 * ============================================================ */
(() => {
  const s = slide(WHITE);
  head(s, "Part 4 · Automate vs. human-in-the-loop", "Agents draft and monitor at scale; humans own taste, trust & claims");
  const rows = [
    ["Competitive research", "AGENT-LED", "Continuously scrape ad libraries, mine angles, cluster creative, track spend signals.", SAGE, 0.9],
    ["Creative angle generation", "AGENT + HUMAN", "Agent proposes angles from data; human picks the on-brand, defensible wedge.", GOLD, 0.62],
    ["Landing page build", "AGENT + HUMAN", "Agent assembles copy + layout variants from a template; human edits voice & founder story.", GOLD, 0.62],
    ["Funnel & offer logic", "AGENT + HUMAN", "Agent wires steps & flags leaks; human sets offer economics & brand experience.", GOLD, 0.55],
    ["A/B testing & readout", "AGENT-LED", "Auto-generate variants, allocate traffic, call significance, pause losers, report.", SAGE, 0.9],
    ["Medical / ad-claim compliance", "HUMAN-LED", "Every health claim reviewed by a human/regulatory gate. Non-negotiable.", CORAL, 0.25],
    ["Brand voice & founder authenticity", "HUMAN-LED", "Naomi's voice and the brand's soul can't be delegated to a model.", CORAL, 0.25],
  ];
  s.addText("PROCESS STEP", { x: M, y: 1.85, w: 3.5, h: 0.3, fontFace: BF, fontSize: 10, bold: true, color: MUTE, charSpacing: 1, margin: 0 });
  s.addText("OWNERSHIP", { x: 4.3, y: 1.85, w: 2.1, h: 0.3, fontFace: BF, fontSize: 10, bold: true, color: MUTE, charSpacing: 1, margin: 0 });
  s.addText("WHAT THE AGENT ACTUALLY DOES", { x: 6.5, y: 1.85, w: 6, h: 0.3, fontFace: BF, fontSize: 10, bold: true, color: MUTE, charSpacing: 1, margin: 0 });
  rows.forEach((r, i) => {
    const y = 2.2 + i * 0.63;
    card(s, M, y, 11.9, 0.55, i % 2 ? WHITE : CREAM, { line: LINE });
    s.addText(r[0], { x: M + 0.2, y, w: 3.4, h: 0.55, valign: "middle", fontFace: BF, fontSize: 12.5, bold: true, color: INK, margin: 0 });
    s.addShape(p.ShapeType.roundRect, { x: 4.3, y: y + 0.11, w: 1.85, h: 0.33, rectRadius: 0.16, fill: { color: r[3] }, line: { type: "none" } });
    s.addText(r[1], { x: 4.3, y: y + 0.11, w: 1.85, h: 0.33, align: "center", valign: "middle", fontFace: BF, fontSize: 9.5, bold: true, color: WHITE, margin: 0 });
    s.addText(r[2], { x: 6.4, y, w: 6.3, h: 0.55, valign: "middle", fontFace: BF, fontSize: 11, color: TEXT, margin: 0, lineSpacing: 13 });
  });
  s.addText("The rule: agents compress the 80% that's pattern-work (research, drafting, monitoring, math). Humans keep the 20% that carries brand and legal risk.",
    { x: M, y: 6.75, w: 11.9, h: 0.4, fontFace: BF, fontSize: 12, italic: true, color: BERRY_D, margin: 0, lineSpacing: 16 });
  pageNum(s, 19);
})();

/* ============================================================
 * 20 — THE BUILD (deep dive on one agent)
 * ============================================================ */
(() => {
  const s = slide(INK);
  s.addText("PART 4 · THE ONE I'D BUILD", { x: M, y: 0.5, w: 9, h: 0.3, fontFace: BF, fontSize: 12, bold: true, color: CORAL, charSpacing: 2, margin: 0 });
  s.addText("The Angle-to-Test Loop: a creative-intelligence & LP testing agent", { x: M, y: 0.82, w: 11.9, h: 0.85, fontFace: HF, fontSize: 27, bold: true, color: WHITE, margin: 0, lineSpacing: 30 });
  s.addText("The highest-leverage thing to automate is the loop from “what's working in the market” → “new landing-page variant live and being tested.” It's data-rich, repetitive, and today takes a team days. Here's the concrete build.",
    { x: M, y: 1.75, w: 11.9, h: 0.6, fontFace: BF, fontSize: 13.5, italic: true, color: "E7D6DC", margin: 0, lineSpacing: 18 });

  const cols = [
    ["MONITORS", GOLD, [
      "Meta/TikTok ad libraries for the category — new creative, angles, longevity (proxy for spend).",
      "Our own ad + LP analytics: CTR, CVR, AOV, scroll & drop-off, subscribe rate.",
      "Voice-of-customer: new reviews, support tickets, on-site search & survey answers.",
    ]],
    ["DECIDES", CORAL, [
      "Which running angles are fatiguing (CTR/CVR decay) and should be refreshed.",
      "Which fresh angle or LP section is worth testing next, ranked by expected lift.",
      "When a live test has hit significance — call the winner or kill the loser.",
    ]],
    ["TRIGGERS", SAGE, [
      "Generates a new LP variant from the modular template (hero, proof, offer blocks).",
      "Routes every health claim to a human/regulatory approval gate before publish.",
      "Launches the A/B test, reallocates budget to winners, and posts a plain-language readout.",
    ]],
  ];
  const cw = 3.9, gx = 0.19, y0 = 2.5, chh = 3.35;
  cols.forEach((c, i) => {
    const x = M + i * (cw + gx);
    card(s, x, y0, cw, chh, "3A1E2D", { });
    s.addText(c[0], { x: x + 0.24, y: y0 + 0.2, w: cw - 0.4, h: 0.35, fontFace: BF, fontSize: 13, bold: true, color: c[1], charSpacing: 1.5, margin: 0 });
    s.addShape(p.ShapeType.line, { x: x + 0.24, y: y0 + 0.6, w: cw - 0.48, h: 0, line: { color: BERRY, width: 1 } });
    c[2].forEach((t, j) => {
      s.addText(t, { x: x + 0.24, y: y0 + 0.72 + j * 0.85, w: cw - 0.46, h: 0.8, fontFace: BF, fontSize: 11.5, color: "F0E4E9", margin: 0, lineSpacing: 14.5, valign: "top", bullet: { code: "2022", indent: 12 } });
    });
  });
  s.addText([
    { text: "How it does it:  ", options: { bold: true, color: GOLD } },
    { text: "data pipeline (ad-library + analytics + reviews) → LLM clusters angles & drafts copy against a modular LP template → guardrails (brand voice checks + hard human gate on claims) → experimentation API launches & reads the test → human approves anything customer-facing. The human moves from doing the work to editing and approving it.", options: { color: "E7D6DC" } },
  ], { x: M, y: 6.05, w: 11.9, h: 0.9, fontFace: BF, fontSize: 12, margin: 0, lineSpacing: 16.5, valign: "top" });
  pageNum(s, 20);
})();

/* ============================================================
 * 21 — CLOSING
 * ============================================================ */
(() => {
  const s = slide(INK);
  for (let i = 0; i < 5; i++)
    s.addShape(p.ShapeType.roundRect, { x: M + i * 0.5, y: 1.2, w: 0.16, h: 0.9, rectRadius: 0.08, fill: { color: [CORAL, GOLD, BERRY, SAGE, CREAM][i] }, line: { type: "none" } });
  s.addText("The through-line", { x: M, y: 2.35, w: 11, h: 0.7, fontFace: HF, fontSize: 38, bold: true, color: WHITE, margin: 0 });
  s.addText("One defensible angle — credible, empowered symptom relief only Stripes can claim — engineered into a cold-traffic landing page, a full-funnel retention model, a connected KPI tree, and the first tests to prove it. Then handed to agents to run at scale, with humans holding brand and claims.",
    { x: M, y: 3.2, w: 11.4, h: 1.5, fontFace: HF, fontSize: 19, italic: true, color: "E7D6DC", margin: 0, lineSpacing: 27 });
  // assumptions
  s.addText("KEY ASSUMPTIONS", { x: M, y: 4.85, w: 6, h: 0.3, fontFace: BF, fontSize: 11, bold: true, color: CORAL, charSpacing: 2, margin: 0 });
  ["Exact price, formula & offer mechanics to be locked from the live PDP + margin model.",
   "Market-sizing figures are directional category context, not Stripes' own data.",
   "All health claims pass a human/regulatory review before any ad or page goes live."].forEach((t, i) => {
    s.addText(t, { x: M, y: 5.2 + i * 0.36, w: 11.4, h: 0.35, fontFace: BF, fontSize: 12.5, color: WHITE, margin: 0, bullet: { code: "2022", indent: 12 } });
  });
  s.addText("Thank you  ·  Stripes × ZyG  ·  Prepared for the E-commerce Product & CRO Manager assignment", { x: M, y: 6.75, w: 11.9, h: 0.3, fontFace: BF, fontSize: 12, color: MUTE, margin: 0 });
})();

/* ---------- write ---------- */
p.writeFile({ fileName: "Stripes_Inside_Addition_CRO_Plan.pptx" }).then((f) => console.log("WROTE", f));
