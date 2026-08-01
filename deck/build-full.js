// Full Stripes CRO deck - single editable PPTX.
// Native editable slides for text/card layouts (translated from the HTML at 120px/in);
// full-bleed PNG embeds for the widget/mockup-dense slides (guaranteed no overlap).
const pptxgen = require("pptxgenjs");
const path = require("path");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
p.author = "Yoav Gersi";
p.title = "Stripes - E-commerce Product & CRO Manager - Home Assignment";

const SL = path.join(__dirname, "..", "diagrams", "slides"); // asset/render dir
const img = f => path.join(SL, f);

// ---- design tokens (match style.css) ----
const NAVY = "0A2540", INK = "1B2B3A", BLUE = "3E63DD", BLUESOFT = "EEF1FE";
const MUTED = "667085", FAINT = "8A97A8", LINE = "E7EBF1", LINE2 = "EDF0F5";
const BG = "FAFBFC", CARD = "FFFFFF", NUMFAINT = "E4EAF6", ICEBLUE = "9FC0FF";
const F = "Arial", FS = "Cambria"; // sans body / serif accent

const shadow = () => ({ type: "outer", color: "102A4D", opacity: 0.10, blur: 9, offset: 2, angle: 90 });

function bg(s) { s.background = { color: BG }; }
function card(s, x, y, w, h, o = {}) {
  s.addShape("roundRect", { x, y, w, h, rectRadius: 0.11,
    fill: { color: o.fill || CARD }, line: { color: o.line || LINE, width: 0.75 },
    shadow: o.noShadow ? undefined : shadow() });
}
function pill(s, x, y, w, h, text, fg, bgc, size = 8, o = {}) {
  s.addShape("roundRect", { x, y, w, h, rectRadius: h / 2, fill: { color: bgc },
    line: o.line ? { color: o.line, width: 0.75 } : { type: "none" } });
  s.addText(text, { x, y, w, h, align: "center", valign: "middle", fontFace: F, fontSize: size,
    bold: o.bold !== false, color: fg, charSpacing: o.charSpacing || 0, margin: 0 });
}
function dot(s, x, y, d, color) { s.addShape("ellipse", { x, y, w: d, h: d, fill: { color }, line: { type: "none" } }); }
function numSq(s, x, y, sz, txt, o = {}) {
  const rad = o.circle ? sz / 2 : 0.09;
  s.addShape("roundRect", { x, y, w: sz, h: sz, rectRadius: rad, fill: { color: o.fill || NAVY }, line: { type: "none" } });
  s.addText(txt, { x, y, w: sz, h: sz, align: "center", valign: "middle", fontFace: F,
    fontSize: o.size || 12, bold: true, color: o.fg || "FFFFFF", margin: 0 });
}
function kicker(s, text, x = 0.8, y = 0.56) {
  s.addText(text.toUpperCase(), { x, y, w: 11.7, h: 0.3, fontFace: F, fontSize: 10.5, bold: true, color: BLUE, charSpacing: 2.2, margin: 0 });
}
function h1(s, text, y = 0.9, size = 26) {
  s.addText(text, { x: 0.8, y, w: 11.7, h: 0.6, fontFace: F, fontSize: size, bold: true, color: NAVY, margin: 0 });
}
function lead(s, text, y = 1.46, size = 12, w = 11.4) {
  s.addText(text, { x: 0.8, y, w, h: 0.4, fontFace: F, fontSize: size, color: MUTED, margin: 0, lineSpacingMultiple: 1.2 });
}
function foot(s) {
  s.addText("ZyG", { x: 0.36, y: 7.0, w: 1, h: 0.35, fontFace: F, fontSize: 12.5, bold: true, color: "FF4A00", transparency: 45, margin: 0 });
  s.addText([
    { text: "Stripes\n", options: { fontFace: FS, fontSize: 11, bold: true, color: "111111" } },
    { text: "BEAUTY", options: { fontFace: F, fontSize: 5, bold: true, color: "111111", charSpacing: 3.0 } },
  ], { x: 11.85, y: 6.93, w: 1.15, h: 0.5, align: "right", transparency: 50, margin: 0, lineSpacingMultiple: 0.95 });
}
// rich text runs helper: [{t,b?,c?}]
const runs = arr => arr.map(r => ({ text: r.t, options: { bold: !!r.b, color: r.c || (r.b ? NAVY : INK), italic: !!r.i, strike: !!r.s } }));

function divider(num, label, title, leadTxt, titleSize = 31) {
  const s = p.addSlide(); bg(s);
  s.addText(num, { x: 0.9, y: 2.28, w: 3.0, h: 2.2, fontFace: F, fontSize: 112, bold: true, color: NUMFAINT, margin: 0, align: "left" });
  s.addShape("line", { x: 4.12, y: 2.55, w: 0, h: 2.45, line: { color: NUMFAINT, width: 1.5 } });
  s.addText(label, { x: 4.55, y: 2.62, w: 7, h: 0.3, fontFace: F, fontSize: 11, bold: true, color: BLUE, charSpacing: 2.4, margin: 0 });
  s.addText(title, { x: 4.55, y: 2.98, w: 8.1, h: 0.72, fontFace: F, fontSize: titleSize, bold: true, color: NAVY, margin: 0 });
  s.addText(leadTxt, { x: 4.55, y: 3.82, w: 7.4, h: 1.1, fontFace: F, fontSize: 13.5, color: MUTED, margin: 0, lineSpacingMultiple: 1.28 });
  foot(s);
}
function imageSlide(png) {
  const s = p.addSlide(); bg(s);
  s.addImage({ path: img(png), x: 0, y: 0, w: 13.333, h: 7.5 });
}
// navy call-to bar
function navyBar(s, x, y, w, h, label, textRuns, o = {}) {
  s.addShape("roundRect", { x, y, w, h, rectRadius: 0.13, fill: { color: NAVY }, line: { type: "none" }, shadow: shadow() });
  if (o.center) {
    s.addText(textRuns, { x: x + 0.4, y, w: w - 0.8, h, align: "center", valign: "middle", fontFace: F, fontSize: o.size || 15, color: "EAF1FF", margin: 0, lineSpacingMultiple: 1.3 });
    return;
  }
  s.addText(label.toUpperCase(), { x: x + 0.32, y, w: o.lw || 1.5, h, fontFace: F, fontSize: 10.5, bold: true, color: ICEBLUE, charSpacing: 1.6, valign: "middle", margin: 0 });
  s.addText(textRuns, { x: x + (o.tx || 1.95), y, w: w - (o.tx || 1.95) - 0.4, h, fontFace: F, fontSize: o.size || 13.5, color: "EAF1FF", valign: "middle", margin: 0, lineSpacingMultiple: 1.25 });
}

// ===================================================================
// 1 - COVER
// ===================================================================
{
  const s = p.addSlide(); bg(s);
  s.addText("PART 1 · HOME ASSIGNMENT", { x: 0.7, y: 2.15, w: 11.93, h: 0.3, align: "center", fontFace: F, fontSize: 11, bold: true, color: BLUE, charSpacing: 3, margin: 0 });
  s.addText("E-commerce Product & CRO Manager", { x: 0.7, y: 2.55, w: 11.93, h: 0.7, align: "center", fontFace: F, fontSize: 34, bold: true, color: NAVY, margin: 0 });
  s.addText("Home Assignment", { x: 0.7, y: 3.34, w: 11.93, h: 0.4, align: "center", fontFace: F, fontSize: 15, color: MUTED, margin: 0 });
  s.addText("Product thinking, CRO strategy and launch execution for Stripes Beauty.", { x: 0.7, y: 3.82, w: 11.93, h: 0.35, align: "center", fontFace: F, fontSize: 12.5, color: FAINT, margin: 0 });
  s.addShape("line", { x: 6.47, y: 4.5, w: 0.4, h: 0, line: { color: "DCE2EC", width: 1.5 } });
  s.addText("PREPARED BY", { x: 0.7, y: 4.78, w: 11.93, h: 0.3, align: "center", fontFace: F, fontSize: 9, bold: true, color: MUTED, charSpacing: 2.2, margin: 0 });
  s.addText("Yoav Gersi", { x: 0.7, y: 5.08, w: 11.93, h: 0.4, align: "center", fontFace: F, fontSize: 15, bold: true, color: NAVY, margin: 0 });
  s.addText("August 2026", { x: 0.7, y: 5.5, w: 11.93, h: 0.3, align: "center", fontFace: F, fontSize: 10.5, color: FAINT, charSpacing: 0.3, margin: 0 });
  foot(s);
}

// ===================================================================
// 2 - OVERVIEW  (What's inside)
// ===================================================================
{
  const s = p.addSlide(); bg(s);
  kicker(s, "Stripes Growth Case Study");
  h1(s, "What's inside");
  lead(s, "Four parts - from understanding the market to launching the hero product, optimizing the funnel, and scaling the work with AI.", 1.46, 12, 11.2);
  const items = [
    ["01", "Part 1", "Market & Competitive Landscape", "Who Stripes competes with, and how brands in the category acquire customers."],
    ["02", "Part 2", "Hero Product Launch", "The creative angle, campaign landing page, funnel and KPIs for The Inside Addition."],
    ["03", "Part 3", "Funnel Optimization", "The first A/B experiments I'd prioritize on stripesbeauty.us."],
    ["04", "Part 4", "Agentic Approach", "One AI capability I'd build to help the growth team decide what to build next."],
  ];
  items.forEach((it, i) => {
    const x = 0.8 + (i % 2) * 6.0, y = 2.15 + Math.floor(i / 2) * 2.18;
    card(s, x, y, 5.73, 1.95);
    s.addText(it[0], { x: x + 0.32, y: y + 0.34, w: 1.0, h: 0.6, fontFace: F, fontSize: 38, bold: true, color: NUMFAINT, margin: 0 });
    s.addText(it[1].toUpperCase(), { x: x + 1.25, y: y + 0.36, w: 4.2, h: 0.24, fontFace: F, fontSize: 9, bold: true, color: BLUE, charSpacing: 1.8, margin: 0 });
    s.addText(it[2], { x: x + 1.25, y: y + 0.62, w: 4.25, h: 0.5, fontFace: F, fontSize: 16, bold: true, color: NAVY, margin: 0, lineSpacingMultiple: 1.05 });
    s.addText(it[3], { x: x + 1.25, y: y + 1.16, w: 4.3, h: 0.65, fontFace: F, fontSize: 11, color: MUTED, margin: 0, lineSpacingMultiple: 1.25 });
  });
  foot(s);
}

// ===================================================================
// 3 - PART 1 DIVIDER
// ===================================================================
divider("01", "Part 1", "Understanding the market",
  "Before thinking about growth opportunities, I wanted to understand who Stripes competes with, who it's built for, and how brands in this space acquire customers.");

// ===================================================================
// 4 - MARKET  (Who is Stripes really competing with?)
// ===================================================================
{
  const s = p.addSlide(); bg(s);
  kicker(s, "Market Overview");
  h1(s, "Who is Stripes really competing with?");
  // two cards
  card(s, 0.8, 1.95, 5.75, 3.35);
  s.addText("THE CATEGORY", { x: 1.12, y: 2.22, w: 5, h: 0.24, fontFace: F, fontSize: 9, bold: true, color: FAINT, charSpacing: 1.4, margin: 0 });
  s.addText("Women's Health", { x: 1.12, y: 2.58, w: 5, h: 0.4, fontFace: F, fontSize: 19, bold: true, color: NAVY, margin: 0 });
  s.addText("↓", { x: 1.12, y: 3.02, w: 1, h: 0.32, fontFace: F, fontSize: 16, bold: true, color: "B7C2D3", margin: 0 });
  s.addText("Menopause Wellness", { x: 1.12, y: 3.36, w: 5, h: 0.4, fontFace: F, fontSize: 19, bold: true, color: BLUE, margin: 0 });
  s.addText(runs([{ t: "Stripes isn't built around solving one symptom. It's built around " }, { t: "supporting women throughout menopause", b: true }, { t: "." }]),
    { x: 1.12, y: 4.0, w: 5.15, h: 1.0, fontFace: F, fontSize: 13, color: MUTED, margin: 0, lineSpacingMultiple: 1.4 });
  card(s, 6.78, 1.95, 5.75, 3.35);
  s.addText("THE CUSTOMER", { x: 7.1, y: 2.22, w: 5, h: 0.24, fontFace: F, fontSize: 9, bold: true, color: FAINT, charSpacing: 1.4, margin: 0 });
  s.addText("Women experiencing peri- or post-menopause looking for:", { x: 7.1, y: 2.56, w: 5.15, h: 0.6, fontFace: F, fontSize: 13.5, color: INK, margin: 0, lineSpacingMultiple: 1.3 });
  ["Everyday wellness support", "Non-hormonal solutions", "Products that fit naturally into their routine"].forEach((t, i) => {
    const y = 3.4 + i * 0.5;
    dot(s, 7.12, y + 0.07, 0.1, BLUE);
    s.addText(t, { x: 7.36, y, w: 4.9, h: 0.35, fontFace: F, fontSize: 13.5, bold: true, color: NAVY, margin: 0, valign: "top" });
  });
  navyBar(s, 0.8, 5.55, 11.73, 0.92, "The framework",
    [{ text: "This became the framework I used to decide which brands belonged in the competitive analysis.", options: { color: "EAF1FF" } }],
    { lw: 1.55, tx: 1.95, size: 13.5 });
  foot(s);
}

// ===================================================================
// 5 - FRAMEWORK  (How I selected competitors)
// ===================================================================
{
  const s = p.addSlide(); bg(s);
  kicker(s, "Approach");
  h1(s, "How I selected competitors");
  // criterion cards
  [["Criterion 1", "Same customer", "Women experiencing menopause."],
   ["Criterion 2", "Same job to be done", "Helping women manage menopause-related symptoms."]].forEach((q, i) => {
    const x = 0.8 + i * 6.0;
    card(s, x, 1.78, 5.73, 1.15);
    s.addText(q[0].toUpperCase(), { x: x + 0.3, y: 2.0, w: 5, h: 0.24, fontFace: F, fontSize: 9, bold: true, color: BLUE, charSpacing: 1.3, margin: 0 });
    s.addText(q[1], { x: x + 0.3, y: 2.26, w: 5.1, h: 0.34, fontFace: F, fontSize: 16, bold: true, color: NAVY, margin: 0 });
    s.addText(q[2], { x: x + 0.3, y: 2.62, w: 5.1, h: 0.3, fontFace: F, fontSize: 11, color: MUTED, margin: 0 });
  });
  // result strip
  card(s, 0.8, 3.12, 11.73, 0.72, { fill: "F7F9FC", line: LINE2, noShadow: true });
  numSq(s, 1.08, 3.34, 0.3, "✓", { circle: true, size: 12 });
  s.addText("If a brand met both conditions, it was included.", { x: 1.55, y: 3.12, w: 10, h: 0.72, fontFace: F, fontSize: 14, bold: true, color: NAVY, valign: "middle", margin: 0 });
  // definition cards
  [["DIRECT", BLUE, BLUESOFT, "Direct competitors", "Brands focused primarily on menopause wellness."],
   ["ADJACENT", "5A6B7E", "EEF2F6", "Adjacent competitors", "Broader wellness brands competing for the same customer."]].forEach((d, i) => {
    const x = 0.8 + i * 6.0;
    card(s, x, 4.08, 5.73, 1.75);
    pill(s, x + 0.3, 4.34, d[0] === "DIRECT" ? 0.85 : 1.05, 0.32, d[0], d[1], d[2], 8, { charSpacing: 1.2 });
    s.addText(d[3], { x: x + 0.3, y: 4.8, w: 5.1, h: 0.36, fontFace: F, fontSize: 16, bold: true, color: NAVY, margin: 0 });
    s.addText(d[4], { x: x + 0.3, y: 5.2, w: 5.1, h: 0.5, fontFace: F, fontSize: 12.5, color: MUTED, margin: 0, lineSpacingMultiple: 1.3 });
  });
  foot(s);
}

// ===================================================================
// 6 - FINDINGS  (What I found)
// ===================================================================
{
  const s = p.addSlide(); bg(s);
  kicker(s, "What stood out");
  h1(s, "What I found");
  // left: 3 insight cards
  const ins = [
    ["INSIGHT 1", "The biggest brands weren't always the closest competitors",
     [{ t: "Several high-traffic brands came from " }, { t: "adjacent wellness categories", b: true }, { t: " rather than menopause-focused brands." }]],
    ["INSIGHT 2", "Paid acquisition looks very different across brands",
     [{ t: "Some rely heavily on Search. Others invest more in Display or Social. " }, { t: "There isn't a single winning channel.", b: true }]],
    ["INSIGHT 3", "Even direct competitors don't follow the same playbook",
     [{ t: "Some invest aggressively in paid acquisition. Others appear to rely much more on " }, { t: "organic growth", b: true }, { t: "." }]],
  ];
  ins.forEach((it, i) => {
    const y = 1.72 + i * 1.63;
    card(s, 0.8, y, 4.15, 1.55);
    s.addText(it[0], { x: 1.06, y: y + 0.16, w: 3.7, h: 0.22, fontFace: F, fontSize: 9, bold: true, color: BLUE, charSpacing: 0.6, margin: 0 });
    s.addText(it[1], { x: 1.06, y: y + 0.4, w: 3.7, h: 0.5, fontFace: F, fontSize: 12, bold: true, color: NAVY, margin: 0, lineSpacingMultiple: 1.05 });
    s.addText(runs(it[2]).map(r => ({ ...r, options: { ...r.options, color: r.options.bold ? NAVY : MUTED } })),
      { x: 1.06, y: y + 0.94, w: 3.8, h: 0.55, fontFace: F, fontSize: 10, color: MUTED, margin: 0, lineSpacingMultiple: 1.18 });
  });
  // right: table card
  const cx = 5.15, cw = 7.38;
  card(s, cx, 1.72, cw, 4.85);
  s.addText("THE EVIDENCE · PAID ACQUISITION BY BRAND", { x: cx + 0.28, y: 1.95, w: 6.8, h: 0.24, fontFace: F, fontSize: 8.5, bold: true, color: FAINT, charSpacing: 1.2, margin: 0 });
  const col = { brand: cx + 0.28, type: cx + 1.75, traffic: cx + 2.95, bar: cx + 4.05, pct: cx + 5.35, chan: cx + 6.05 };
  const hy = 2.42;
  const th = (t, x, w, a) => s.addText(t, { x, y: hy, w, h: 0.22, fontFace: F, fontSize: 8, bold: true, color: FAINT, charSpacing: 0.5, align: a || "left", margin: 0 });
  th("BRAND", col.brand, 1.5); th("TYPE", col.type, 1.1); th("TRAFFIC", col.traffic, 1.0, "right"); th("PAID SHARE", col.bar, 1.7, "center"); th("TOP CHANNEL", col.chan, 1.1, "right");
  s.addShape("line", { x: cx + 0.28, y: 2.68, w: cw - 0.56, h: 0, line: { color: LINE, width: 1 } });
  const rows = [
    ["O Positiv", "a", "5.8M", 75, "Display"], ["Midi", "a", "3.6M", 26, "Search"],
    ["Happy Mammoth", "a", "2.5M", 53, "Social"], ["Alloy", "a", "1.7M", 39, "Search"],
    ["Bonafide", "d", "1.1M", 42, "Search"], ["Estroven", "d", "253K", 59, "Search"],
    ["Kindra", "d", "42K", 5, "Display"], ["Womaness", "d", "41K", 17, "Display"],
  ];
  rows.forEach((r, i) => {
    const y = 2.78 + i * 0.4, adj = r[1] === "a";
    s.addText(r[0], { x: col.brand, y, w: 1.5, h: 0.32, fontFace: F, fontSize: 10, bold: true, color: NAVY, valign: "middle", margin: 0 });
    pill(s, col.type, y + 0.05, adj ? 0.82 : 0.62, 0.22, adj ? "ADJACENT" : "DIRECT", adj ? "5A6B7E" : BLUE, adj ? "EEF2F6" : BLUESOFT, 6.5, { charSpacing: 0.5 });
    s.addText(r[2], { x: col.traffic, y, w: 1.0, h: 0.32, fontFace: F, fontSize: 10, color: INK, align: "right", valign: "middle", margin: 0 });
    const trackW = 1.0, fillW = Math.max(0.03, trackW * r[3] / 100);
    s.addShape("roundRect", { x: col.bar, y: y + 0.11, w: trackW, h: 0.1, rectRadius: 0.05, fill: { color: "EDF1F6" }, line: { type: "none" } });
    s.addShape("roundRect", { x: col.bar, y: y + 0.11, w: fillW, h: 0.1, rectRadius: 0.05, fill: { color: adj ? NAVY : BLUE }, line: { type: "none" } });
    s.addText(r[3] + "%", { x: col.pct - 0.15, y, w: 0.55, h: 0.32, fontFace: F, fontSize: 10, bold: true, color: NAVY, align: "right", valign: "middle", margin: 0 });
    s.addText(r[4], { x: col.chan, y, w: 1.1, h: 0.32, fontFace: F, fontSize: 9.5, color: MUTED, align: "right", valign: "middle", margin: 0 });
    if (i < rows.length - 1) s.addShape("line", { x: cx + 0.28, y: y + 0.38, w: cw - 0.56, h: 0, line: { color: LINE2, width: 0.5 } });
  });
  s.addText("Paid share = paid search + social + display, as % of traffic. Similarweb + Semrush, Apr–Jun 2026 · estimates, directional.",
    { x: cx + 0.28, y: 6.18, w: cw - 0.56, h: 0.3, fontFace: F, fontSize: 8, color: FAINT, margin: 0, lineSpacingMultiple: 1.15 });
  foot(s);
}

// ===================================================================
// 7 - LEARNED  (Three takeaways)
// ===================================================================
{
  const s = p.addSlide(); bg(s);
  kicker(s, "What I learned");
  h1(s, "Three takeaways from the research");
  const c = [
    ["01", "Customer fit matters more than category fit", "The closest competitors aren't always menopause brands. They're the brands solving similar problems for the same customer."],
    ["02", "There isn't one winning acquisition strategy", "Successful brands grow through different channel mixes. There isn't a formula to copy."],
    ["03", "Stripes already has a clear positioning advantage", "Most brands focus on individual symptoms. Stripes can build acquisition around supporting the entire menopause journey."],
  ];
  c.forEach((it, i) => {
    const x = 0.8 + i * 4.0;
    card(s, x, 1.9, 3.73, 2.95);
    s.addText(it[0], { x: x + 0.3, y: 2.12, w: 1.2, h: 0.5, fontFace: F, fontSize: 26, bold: true, color: NUMFAINT, margin: 0 });
    s.addText(it[1], { x: x + 0.3, y: 2.72, w: 3.15, h: 0.7, fontFace: F, fontSize: 16, bold: true, color: NAVY, margin: 0, lineSpacingMultiple: 1.12 });
    s.addText(it[2], { x: x + 0.3, y: 3.5, w: 3.2, h: 1.2, fontFace: F, fontSize: 12, color: MUTED, margin: 0, lineSpacingMultiple: 1.35 });
  });
  navyBar(s, 0.8, 5.15, 11.73, 1.1, "Where I'd focus",
    runs([{ t: "Instead of copying competitors, I'd build a growth strategy around Stripes' strongest differentiator: ", c: "EAF1FF" }, { t: "supporting the full menopause journey", b: true, c: "FFFFFF" }, { t: ".", c: "EAF1FF" }]),
    { lw: 1.7, tx: 2.05, size: 14 });
  foot(s);
}

// ===================================================================
// 8 - PART 2 DIVIDER
// ===================================================================
divider("02", "Part 2", "Launching the hero product",
  "How I'd bring The Inside Addition to market - the creative angle, the campaign landing page, the funnel, and how I'd measure success.");

// ===================================================================
// 9 - CREATIVE ANGLE
// ===================================================================
{
  const s = p.addSlide(); bg(s);
  kicker(s, "Part 2 · Launch Strategy");
  h1(s, "Creative angle");
  // left: angle
  s.addText(runs([{ t: "\"Your daily addition. ", b: true, c: NAVY }, { t: "Feel like yourself again", b: true, c: BLUE }, { t: ".\"", b: true, c: NAVY }]),
    { x: 0.8, y: 1.9, w: 4.35, h: 1.5, fontFace: F, fontSize: 23, bold: true, color: NAVY, margin: 0, lineSpacingMultiple: 1.3 });
  s.addText(runs([{ t: "Instead of being just another menopause supplement, The Inside Addition becomes a ", c: MUTED }, { t: "simple daily habit", b: true }, { t: " that naturally fits into a woman's routine and supports her from the inside out.", c: MUTED }]),
    { x: 0.8, y: 3.55, w: 4.3, h: 1.6, fontFace: F, fontSize: 13, color: MUTED, margin: 0, lineSpacingMultiple: 1.5 });
  // right: why this angle
  s.addText("WHY THIS ANGLE?", { x: 5.55, y: 1.85, w: 7, h: 0.26, fontFace: F, fontSize: 10.5, bold: true, color: FAINT, charSpacing: 1.6, margin: 0 });
  const pts = [
    ["1", "Builds on the product name", "\"The Inside Addition\" becomes part of the story, not just the label.", null, 2.2],
    ["2", "Fits the brand", "Positive and supportive, not clinical or fear-based.", null, 2.92],
    ["3", "Matches the product", null, ["Daily menopause symptom support", "Hormone-free", "Supports daily function", "Eases stress, brain fog & hot flashes"], 3.64],
    ["4", "Stands apart from competitors", null, null, 4.78],
  ];
  pts.forEach(pt => {
    numSq(s, 5.55, pt[4], 0.34, pt[0], { fill: NAVY, size: 13 });
    s.addText(pt[1], { x: 6.05, y: pt[4] - 0.02, w: 6.4, h: 0.3, fontFace: F, fontSize: 15.5, bold: true, color: NAVY, margin: 0 });
    if (pt[2]) s.addText(pt[2], { x: 6.05, y: pt[4] + 0.3, w: 6.4, h: 0.35, fontFace: F, fontSize: 12.5, color: MUTED, margin: 0, lineSpacingMultiple: 1.2 });
    if (pt[3]) {
      pt[3].forEach((sub, j) => {
        const sx = 6.05 + (j % 2) * 3.35, sy = pt[4] + 0.34 + Math.floor(j / 2) * 0.32;
        dot(s, sx, sy + 0.06, 0.07, BLUE);
        s.addText(sub, { x: sx + 0.2, y: sy, w: 3.1, h: 0.28, fontFace: F, fontSize: 11.5, color: INK, margin: 0 });
      });
    }
  });
  s.addText("Most menopause brands focus on a single symptom. The Inside Addition becomes everyday support through every stage of menopause.",
    { x: 6.05, y: 5.08, w: 6.4, h: 0.55, fontFace: F, fontSize: 12.5, color: MUTED, margin: 0, lineSpacingMultiple: 1.2 });
  // proof strip
  s.addShape("line", { x: 0.8, y: 5.95, w: 11.73, h: 0, line: { color: LINE2, width: 1 } });
  s.addText("BUILDING ON THE EXISTING BRAND MESSAGE", { x: 0.8, y: 6.12, w: 5.5, h: 0.3, fontFace: F, fontSize: 10, bold: true, color: FAINT, charSpacing: 1.2, valign: "middle", margin: 0 });
  s.addText("\"Show yourself love from the inside, out.\"", { x: 6.2, y: 6.12, w: 6.3, h: 0.3, fontFace: F, fontSize: 14, italic: true, color: MUTED, valign: "middle", margin: 0 });
  foot(s);
}

// ===================================================================
// 10-12 IMAGE slides: landing, funnel, metrics
// ===================================================================
imageSlide("p2-03-landing.png");
imageSlide("p2-04-funnel.png");
imageSlide("p2-05-metrics.png");

// ===================================================================
// 13 - PART 3 CONTEXT (Optimization strategy)
// ===================================================================
{
  const s = p.addSlide(); bg(s);
  kicker(s, "Part 3 · Funnel Optimization");
  h1(s, "Optimization strategy");
  // two stat cards
  [["Key Funnel", "Homepage → Product Detail Page"], ["Traffic Source", "Paid Social (Meta)"]].forEach((st, i) => {
    const x = 0.8 + i * 6.0;
    card(s, x, 1.95, 5.73, 1.25);
    s.addShape("roundRect", { x: x + 0.32, y: 2.28, w: 0.58, h: 0.58, rectRadius: 0.1, fill: { color: BLUESOFT }, line: { type: "none" } });
    s.addText(i === 0 ? "◇" : "◎", { x: x + 0.32, y: 2.28, w: 0.58, h: 0.58, align: "center", valign: "middle", fontFace: F, fontSize: 18, color: BLUE, margin: 0 });
    s.addText(st[0].toUpperCase(), { x: x + 1.1, y: 2.32, w: 4.4, h: 0.24, fontFace: F, fontSize: 9.5, bold: true, color: FAINT, charSpacing: 1.4, margin: 0 });
    s.addText(st[1], { x: x + 1.1, y: 2.58, w: 4.5, h: 0.4, fontFace: F, fontSize: 16, bold: true, color: NAVY, margin: 0 });
  });
  // approach card
  card(s, 0.8, 3.42, 11.73, 3.1);
  s.addShape("roundRect", { x: 1.1, y: 3.72, w: 0.5, h: 0.5, rectRadius: 0.1, fill: { color: BLUESOFT }, line: { type: "none" } });
  s.addText("✓", { x: 1.1, y: 3.72, w: 0.5, h: 0.5, align: "center", valign: "middle", fontFace: F, fontSize: 16, bold: true, color: BLUE, margin: 0 });
  s.addText("APPROACH", { x: 1.75, y: 3.8, w: 6, h: 0.3, fontFace: F, fontSize: 10.5, bold: true, color: FAINT, charSpacing: 1.4, valign: "middle", margin: 0 });
  const ar = [
    [{ t: "Prioritize " }, { t: "high-impact opportunities", b: true }, { t: " before micro-optimizations." }],
    [{ t: "With relatively limited traffic, prioritize experiments that " }, { t: "maximize learning while targeting meaningful business impact", b: true }, { t: "." }],
    [{ t: "Build " }, { t: "data-driven hypotheses", b: true }, { t: " and validate them through A/B testing." }],
  ];
  ar.forEach((row, i) => {
    const y = 4.5 + i * 0.62;
    numSq(s, 1.1, y, 0.34, String(i + 1), { fill: NAVY, size: 13 });
    s.addText(runs(row), { x: 1.65, y: y - 0.02, w: 10.5, h: 0.55, fontFace: F, fontSize: 15, color: INK, margin: 0, valign: "top", lineSpacingMultiple: 1.2 });
  });
  foot(s);
}

// ===================================================================
// 14-16 IMAGE slides: experiments 1-3
// ===================================================================
imageSlide("p3-02-exp1.png");
imageSlide("p3-03-exp2.png");
imageSlide("p3-04-exp3.png");

// ===================================================================
// 17 - PART 4 DIVIDER
// ===================================================================
divider("04", "Part 4", "AI for Growth Teams",
  "If I could build one AI capability for ZyG's growth team, this is where I'd start.");

// ===================================================================
// 18 - IMPACT (AI changed the bottleneck)
// ===================================================================
{
  const s = p.addSlide(); bg(s);
  kicker(s, "The Opportunity");
  h1(s, "AI changed the bottleneck");
  // left box
  card(s, 0.8, 1.95, 5.75, 3.05);
  s.addText("AI ALREADY HELPS TEAMS CREATE", { x: 1.12, y: 2.25, w: 5.2, h: 0.24, fontFace: F, fontSize: 9.5, bold: true, color: FAINT, charSpacing: 1.4, margin: 0 });
  const chips = ["Landing pages", "Ad creatives", "Copy variations", "A/B test variants"];
  let chx = 1.12, chy = 2.62;
  const chw = [1.55, 1.4, 1.55, 1.65];
  chips.forEach((c, i) => {
    if (chx + chw[i] > 6.4) { chx = 1.12; chy += 0.5; }
    pill(s, chx, chy, chw[i], 0.4, c, NAVY, "F7F9FC", 11, { bold: true, line: LINE2 });
    chx += chw[i] + 0.12;
  });
  s.addText("Creating assets is becoming easier than ever. The harder question is deciding what to build.",
    { x: 1.12, y: 3.9, w: 5.2, h: 0.8, fontFace: F, fontSize: 13, color: MUTED, margin: 0, lineSpacingMultiple: 1.35 });
  // right shift box
  s.addShape("roundRect", { x: 6.8, y: 1.95, w: 5.73, h: 3.05, rectRadius: 0.13, fill: { color: BLUESOFT }, line: { color: "DCE3FB", width: 1 } });
  s.addText("\"How do we build this?\"", { x: 7.15, y: 2.35, w: 5, h: 0.4, fontFace: F, fontSize: 16, bold: true, color: FAINT, strike: true, margin: 0 });
  s.addText("↓", { x: 7.15, y: 2.85, w: 1, h: 0.35, fontFace: F, fontSize: 18, bold: true, color: BLUE, margin: 0 });
  s.addText(runs([{ t: "\"What should we build next?\"", b: true, c: BLUE }]), { x: 7.15, y: 3.25, w: 5.1, h: 0.9, fontFace: F, fontSize: 25, bold: true, color: NAVY, margin: 0, lineSpacingMultiple: 1.15 });
  s.addText("That's where product teams still spend most of their time.", { x: 7.15, y: 4.35, w: 5.1, h: 0.5, fontFace: F, fontSize: 12.5, color: MUTED, margin: 0, lineSpacingMultiple: 1.25 });
  navyBar(s, 0.8, 5.3, 11.73, 1.0, "My focus",
    runs([{ t: "My focus isn't making creation faster. It's making ", c: "EAF1FF" }, { t: "product decisions smarter", b: true, c: "FFFFFF" }, { t: ".", c: "EAF1FF" }]),
    { lw: 1.3, tx: 1.75, size: 15 });
  foot(s);
}

// ===================================================================
// 19 - IMAGE slide: AI build (Growth Intelligence Agent)
// ===================================================================
imageSlide("p4-03-build.png");

// ===================================================================
// 20 - HUMAN IN THE LOOP
// ===================================================================
{
  const s = p.addSlide(); bg(s);
  kicker(s, "Human in the Loop");
  h1(s, "Keep humans in the decision loop");
  const cols = [
    ["AI is good at", FAINT, "B7C2D3", NAVY, ["Finding market changes", "Detecting patterns", "Drafting experiment ideas", "Preparing experiment briefs"], false],
    ["Product teams still decide", BLUE, BLUE, NAVY, ["Does this fit our strategy?", "Does this fit our brand?", "Is this worth building?", "Should this be our next priority?"], true],
  ];
  cols.forEach((c, i) => {
    const x = 0.8 + i * 6.0;
    card(s, x, 1.95, 5.75, 3.0);
    s.addText(c[0].toUpperCase(), { x: x + 0.32, y: 2.24, w: 5, h: 0.24, fontFace: F, fontSize: 9.5, bold: true, color: c[1], charSpacing: 1.4, margin: 0 });
    c[4].forEach((q, j) => {
      const y = 2.72 + j * 0.5;
      dot(s, x + 0.34, y + 0.06, 0.1, c[2]);
      s.addText(q, { x: x + 0.6, y, w: 5.0, h: 0.35, fontFace: F, fontSize: 15, bold: c[5], color: c[5] ? NAVY : INK, margin: 0 });
    });
  });
  navyBar(s, 0.8, 5.25, 11.73, 1.1, "",
    runs([{ t: "The agent makes sure the team ", c: "EAF1FF" }, { t: "never misses an opportunity", b: true, c: "FFFFFF" }, { t: ". The product team decides ", c: "EAF1FF" }, { t: "which opportunities are worth pursuing", b: true, c: "FFFFFF" }, { t: ".", c: "EAF1FF" }]),
    { center: true, size: 15 });
  foot(s);
}

p.writeFile({ fileName: path.join(__dirname, "Stripes-CRO-Home-Assignment.pptx") }).then(f => console.log("written:", f));
