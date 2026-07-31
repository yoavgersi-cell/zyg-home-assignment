// Part 1 deck - native editable PPTX matching the HTML slide design system
const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE"; // 13.333 x 7.5

// ---- design tokens ----
const NAVY = "0A2540", INK = "1B2B3A", BLUE = "3E63DD", BLUESOFT = "EEF1FE";
const MUTED = "667085", FAINT = "8A97A8", LINE = "E7EBF1", LINE2 = "EDF0F5";
const BG = "FAFBFC", CARD = "FFFFFF", NUMFAINT = "E4EAF6", ICEBLUE = "9FC0FF";
const F = "Arial", FS = "Cambria"; // sans / serif accent

const shadow = () => ({ type: "outer", color: "102A4D", opacity: 0.10, blur: 9, offset: 2, angle: 90 });

function card(s, x, y, w, h, opts = {}) {
  s.addShape("roundRect", {
    x, y, w, h, rectRadius: 0.09,
    fill: { color: opts.fill || CARD },
    line: { color: opts.line || LINE, width: 0.75 },
    shadow: opts.noShadow ? undefined : shadow(),
  });
}
function pill(s, x, y, w, h, text, fg, bg, size = 8, opts = {}) {
  s.addShape("roundRect", { x, y, w, h, rectRadius: h / 2, fill: { color: bg }, line: opts.line ? { color: opts.line, width: 0.75 } : { type: "none" } });
  s.addText(text, { x, y, w, h, align: "center", valign: "middle", fontFace: F, fontSize: size, bold: opts.bold !== false, color: fg, charSpacing: opts.charSpacing || 0, margin: 0 });
}
function kicker(s, text, x = 0.8, y = 0.55) {
  s.addText(text.toUpperCase(), { x, y, w: 8, h: 0.3, fontFace: F, fontSize: 10.5, bold: true, color: BLUE, charSpacing: 2.4, margin: 0 });
}
function h1(s, text, y = 0.88, size = 25) {
  s.addText(text, { x: 0.8, y, w: 11.7, h: 0.55, fontFace: F, fontSize: size, bold: true, color: NAVY, margin: 0 });
}
function lead(s, text, y = 1.42, size = 11.5) {
  s.addText(text, { x: 0.8, y, w: 11.4, h: 0.35, fontFace: F, fontSize: size, color: MUTED, margin: 0 });
}
function foot(s) {
  s.addText("ZyG", { x: 0.35, y: 7.02, w: 1, h: 0.35, fontFace: F, fontSize: 12.5, bold: true, color: "FF4A00", transparency: 40, margin: 0 });
  s.addText([
    { text: "Stripes\n", options: { fontFace: FS, fontSize: 11, bold: true, color: "111111" } },
    { text: "BEAUTY", options: { fontFace: F, fontSize: 5, bold: true, color: "111111", charSpacing: 3.2 } },
  ], { x: 11.85, y: 6.95, w: 1.15, h: 0.5, align: "right", transparency: 45, margin: 0, lineSpacingMultiple: 0.95 });
}
function bullet(s, x, y, w, text, opts = {}) {
  // text: array of runs or string; leading blue dot run
  const runs = Array.isArray(text) ? text : [{ text }];
  s.addText(
    [{ text: "●  ", options: { color: BLUE, fontSize: (opts.size || 10.5) - 3 } },
     ...runs.map(r => ({ text: r.text, options: { color: r.bold ? NAVY : (opts.color || INK), bold: !!r.bold, fontSize: opts.size || 10.5 } }))],
    { x, y, w, h: opts.h || 0.32, fontFace: F, fontSize: opts.size || 10.5, valign: "top", margin: 0, lineSpacingMultiple: 1.12 }
  );
}
function bg(s) { s.background = { color: BG }; }

// ================= SLIDE 1 - COVER =================
{
  const s = p.addSlide(); bg(s);
  s.addText("E-commerce Product & CRO Manager", { x: 0.7, y: 2.35, w: 11.93, h: 0.8, align: "center", fontFace: F, fontSize: 33, bold: true, color: NAVY, margin: 0 });
  s.addText("Home Assignment", { x: 0.7, y: 3.25, w: 11.93, h: 0.4, align: "center", fontFace: F, fontSize: 14.5, color: MUTED, margin: 0 });
  s.addText("Stripes Growth Case Study", { x: 0.7, y: 3.85, w: 11.93, h: 0.4, align: "center", fontFace: F, fontSize: 15.5, bold: true, color: BLUE, margin: 0 });
  s.addShape("line", { x: 6.47, y: 4.55, w: 0.4, h: 0, line: { color: "DCE2EC", width: 1.5 } });
  s.addText("PREPARED BY", { x: 0.7, y: 4.85, w: 11.93, h: 0.3, align: "center", fontFace: F, fontSize: 9, bold: true, color: FAINT, charSpacing: 2.2, margin: 0 });
  s.addText("Yoav Gersi", { x: 0.7, y: 5.15, w: 11.93, h: 0.4, align: "center", fontFace: F, fontSize: 14, bold: true, color: NAVY, margin: 0 });
  foot(s);
}

// ================= SLIDE 2 - PART 1 DIVIDER =================
{
  const s = p.addSlide(); bg(s);
  s.addText("01", { x: 0.95, y: 2.55, w: 2.9, h: 2.1, fontFace: F, fontSize: 105, bold: true, color: NUMFAINT, margin: 0, align: "left" });
  s.addShape("line", { x: 4.05, y: 2.7, w: 0, h: 1.9, line: { color: NUMFAINT, width: 1.5 } });
  s.addText("PART 1", { x: 4.45, y: 2.72, w: 6, h: 0.3, fontFace: F, fontSize: 11, bold: true, color: BLUE, charSpacing: 2.4, margin: 0 });
  s.addText("Competitive Landscape & Market Overview", { x: 4.45, y: 3.06, w: 8.2, h: 1.0, fontFace: F, fontSize: 30, bold: true, color: NAVY, margin: 0 });
  s.addText("Understanding the category, the competitive set, and the paid acquisition landscape.", { x: 4.45, y: 4.12, w: 7.0, h: 0.6, fontFace: F, fontSize: 13, color: MUTED, margin: 0 });
  foot(s);
}

// ================= SLIDE 3 - MARKET =================
{
  const s = p.addSlide(); bg(s);
  kicker(s, "Market Overview");
  h1(s, "Category and target customer");
  lead(s, "How Stripes is positioned, and the customer definition used throughout this analysis.");

  // positioning strip
  card(s, 0.8, 1.85, 11.73, 0.78);
  const py = 1.97, ly = 1.94, vy = 2.18;
  s.addText("VERTICAL", { x: 1.05, y: ly, w: 1.6, h: 0.22, fontFace: F, fontSize: 7.5, bold: true, color: FAINT, charSpacing: 1.2, margin: 0 });
  s.addText("Women's Health", { x: 1.05, y: vy, w: 1.75, h: 0.3, fontFace: F, fontSize: 12, bold: true, color: NAVY, margin: 0 });
  s.addText("›", { x: 2.72, y: 2.05, w: 0.3, h: 0.4, fontFace: F, fontSize: 14, bold: true, color: "C2CBD8", margin: 0 });
  s.addText("CATEGORY", { x: 3.05, y: ly, w: 2.2, h: 0.22, fontFace: F, fontSize: 7.5, bold: true, color: FAINT, charSpacing: 1.2, margin: 0 });
  s.addText("Menopause Wellness", { x: 3.05, y: vy, w: 2.25, h: 0.3, fontFace: F, fontSize: 12, bold: true, color: NAVY, margin: 0 });
  s.addText("›", { x: 5.22, y: 2.05, w: 0.3, h: 0.4, fontFace: F, fontSize: 14, bold: true, color: "C2CBD8", margin: 0 });
  s.addText("STRIPES", { x: 5.55, y: ly, w: 2, h: 0.22, fontFace: F, fontSize: 7.5, bold: true, color: FAINT, charSpacing: 1.2, margin: 0 });
  s.addText("Supporting women throughout the menopause journey", { x: 5.55, y: vy, w: 4.55, h: 0.3, fontFace: F, fontSize: 12, bold: true, color: BLUE, margin: 0 });
  s.addText("- from perimenopause through post-menopause.", { x: 10.05, y: vy + 0.01, w: 2.45, h: 0.3, fontFace: F, fontSize: 9, color: MUTED, margin: 0 });

  // left card
  card(s, 0.8, 2.95, 5.75, 3.35);
  s.addText("CATEGORY & POSITIONING", { x: 1.08, y: 3.2, w: 5, h: 0.24, fontFace: F, fontSize: 8, bold: true, color: FAINT, charSpacing: 1.4, margin: 0 });
  s.addText("Menopause Wellness, within Women's Health", { x: 1.08, y: 3.5, w: 5.2, h: 0.32, fontFace: F, fontSize: 14.5, bold: true, color: NAVY, margin: 0 });
  bullet(s, 1.08, 3.95, 5.2, [{ text: "Multi-year life stage", bold: true }, { text: " spanning perimenopause through post-menopause." }], { h: 0.42 });
  bullet(s, 1.08, 4.38, 5.2, [{ text: "Multiple symptoms often occur " }, { text: "simultaneously", bold: true }, { text: "." }]);
  bullet(s, 1.08, 4.72, 5.2, [{ text: "Stripes positions itself around the " }, { text: "overall menopause journey", bold: true }, { text: " rather than a single symptom." }], { h: 0.5 });
  s.addText("COMMONLY ASSOCIATED SYMPTOMS", { x: 1.08, y: 5.32, w: 5, h: 0.22, fontFace: F, fontSize: 7.5, bold: true, color: FAINT, charSpacing: 1.2, margin: 0 });
  const tags = ["Hot flashes", "Poor sleep", "Brain fog", "Mood", "Dry skin", "Intimacy"];
  const tw = [1.05, 1.0, 0.95, 0.72, 0.85, 0.85];
  let tx = 1.08;
  tags.forEach((t, i) => { pill(s, tx, 5.62, tw[i], 0.34, t, "4E6178", "F2F5F9", 8.5, { bold: false, line: LINE2 }); tx += tw[i] + 0.1; });

  // right card
  card(s, 6.78, 2.95, 5.75, 3.35);
  s.addText("TARGET CUSTOMER (FOR THIS ANALYSIS)", { x: 7.06, y: 3.2, w: 5, h: 0.24, fontFace: F, fontSize: 8, bold: true, color: FAINT, charSpacing: 1.4, margin: 0 });
  s.addText("Women 42–62", { x: 7.06, y: 3.5, w: 5, h: 0.55, fontFace: F, fontSize: 26, bold: true, color: NAVY, margin: 0 });
  bullet(s, 7.06, 4.28, 5.2, [{ text: "Experiencing " }, { text: "peri- or post-menopause", bold: true }, { text: "." }]);
  bullet(s, 7.06, 4.66, 5.2, [{ text: "Looking for " }, { text: "non-hormonal", bold: true }, { text: " wellness solutions." }]);
  bullet(s, 7.06, 5.04, 5.2, [{ text: "Looking for products that fit into " }, { text: "everyday routines", bold: true }, { text: "." }]);
  foot(s);
}

// ================= SLIDE 4 - FRAMEWORK =================
{
  const s = p.addSlide(); bg(s);
  kicker(s, "Competitive Framework");
  h1(s, "How competitors were selected");

  // question cards
  const qy = 1.75, qh = 1.15;
  card(s, 0.8, qy, 4.55, qh);
  s.addShape("ellipse", { x: 1.1, y: qy + 0.38, w: 0.38, h: 0.38, fill: { color: NAVY }, line: { type: "none" } });
  s.addText("1", { x: 1.1, y: qy + 0.38, w: 0.38, h: 0.38, align: "center", valign: "middle", fontFace: F, fontSize: 11, bold: true, color: "FFFFFF", margin: 0 });
  s.addText("Same customer?", { x: 1.65, y: qy + 0.22, w: 3.5, h: 0.32, fontFace: F, fontSize: 14.5, bold: true, color: NAVY, margin: 0 });
  s.addText("Targets women experiencing peri- or menopause.", { x: 1.65, y: qy + 0.56, w: 3.55, h: 0.4, fontFace: F, fontSize: 10, color: MUTED, margin: 0 });
  card(s, 5.55, qy, 4.55, qh);
  s.addShape("ellipse", { x: 5.85, y: qy + 0.38, w: 0.38, h: 0.38, fill: { color: NAVY }, line: { type: "none" } });
  s.addText("2", { x: 5.85, y: qy + 0.38, w: 0.38, h: 0.38, align: "center", valign: "middle", fontFace: F, fontSize: 11, bold: true, color: "FFFFFF", margin: 0 });
  s.addText("Solving the same customer need?", { x: 6.4, y: qy + 0.22, w: 3.6, h: 0.32, fontFace: F, fontSize: 14.5, bold: true, color: NAVY, margin: 0 });
  s.addText("Offers products intended to address menopause-related symptoms.", { x: 6.4, y: qy + 0.56, w: 3.6, h: 0.45, fontFace: F, fontSize: 10, color: MUTED, margin: 0 });
  s.addText("→", { x: 10.18, y: qy + 0.32, w: 0.45, h: 0.5, fontFace: F, fontSize: 20, bold: true, color: "B7C2D3", margin: 0, align: "center" });
  // result box
  s.addShape("roundRect", { x: 10.7, y: qy, w: 1.85, h: qh, rectRadius: 0.09, fill: { color: NAVY }, line: { type: "none" }, shadow: shadow() });
  s.addText("BOTH YES", { x: 10.95, y: qy + 0.2, w: 1.5, h: 0.24, fontFace: F, fontSize: 8, bold: true, color: ICEBLUE, charSpacing: 1.4, margin: 0 });
  s.addText("Included in\nthe analysis", { x: 10.95, y: qy + 0.44, w: 1.5, h: 0.6, fontFace: F, fontSize: 13, bold: true, color: "FFFFFF", margin: 0, lineSpacingMultiple: 1.05 });

  // definition cards
  const dy = 3.3, dh = 1.75;
  card(s, 0.8, dy, 5.75, dh);
  pill(s, 1.08, dy + 0.28, 0.85, 0.32, "DIRECT", BLUE, BLUESOFT, 8, { charSpacing: 1.2 });
  s.addText("Direct competitors", { x: 1.08, y: dy + 0.72, w: 5, h: 0.34, fontFace: F, fontSize: 14.5, bold: true, color: NAVY, margin: 0 });
  s.addText("Brands positioned primarily around menopause wellness.", { x: 1.08, y: dy + 1.1, w: 5.2, h: 0.4, fontFace: F, fontSize: 11, color: MUTED, margin: 0 });
  card(s, 6.78, dy, 5.75, dh);
  pill(s, 7.06, dy + 0.28, 1.05, 0.32, "ADJACENT", "5A6B7E", "EEF2F6", 8, { charSpacing: 1.2 });
  s.addText("Adjacent competitors", { x: 7.06, y: dy + 0.72, w: 5, h: 0.34, fontFace: F, fontSize: 14.5, bold: true, color: NAVY, margin: 0 });
  s.addText("Brands solving related symptoms or competing for the same audience.", { x: 7.06, y: dy + 1.1, w: 5.2, h: 0.4, fontFace: F, fontSize: 11, color: MUTED, margin: 0 });
  foot(s);
}

// ================= SLIDE 5 - LANDSCAPE =================
{
  const s = p.addSlide(); bg(s);
  kicker(s, "Competitive Landscape");
  h1(s, "Competitive set and paid acquisition");
  lead(s, "Paid share represents paid search, paid social and display as a percentage of each brand's traffic.");

  // left: competitive set
  card(s, 0.8, 1.85, 3.0, 4.15);
  s.addText("THE COMPETITIVE SET", { x: 1.02, y: 2.05, w: 2.6, h: 0.24, fontFace: F, fontSize: 8, bold: true, color: FAINT, charSpacing: 1.4, margin: 0 });
  pill(s, 1.02, 2.38, 0.75, 0.28, "DIRECT", BLUE, BLUESOFT, 7.5, { charSpacing: 1 });
  s.addText("7 brands", { x: 1.85, y: 2.38, w: 1.2, h: 0.28, fontFace: F, fontSize: 9, bold: true, color: FAINT, margin: 0, valign: "middle" });
  const direct = ["Womaness", "Kindra", "Bonafide", "Estroven", "Wile", "Pause Well-Aging", "Valerie"];
  direct.forEach((b, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const w = 1.27, x = 1.02 + col * 1.37, y = 2.74 + row * 0.37;
    s.addShape("roundRect", { x, y, w, h: 0.3, rectRadius: 0.05, fill: { color: "F7F9FC" }, line: { color: LINE2, width: 0.75 } });
    s.addText(b, { x, y, w, h: 0.3, align: "center", valign: "middle", fontFace: F, fontSize: b.length > 12 ? 6.5 : 7.5, bold: true, color: NAVY, margin: 0 });
  });
  pill(s, 1.02, 4.3, 1.0, 0.28, "ADJACENT", "5A6B7E", "EEF2F6", 7.5, { charSpacing: 1 });
  s.addText("10 brands", { x: 2.1, y: 4.3, w: 1.2, h: 0.28, fontFace: F, fontSize: 9, bold: true, color: FAINT, margin: 0, valign: "middle" });
  const adjacent = ["Happy Mammoth", "Alloy", "Midi", "Evernow", "O Positiv", "Nutrafol", "Ritual", "Foria", "Good Clean Love", "Joylux"];
  adjacent.forEach((b, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const w = 1.27, x = 1.02 + col * 1.37, y = 4.66 + row * 0.37;
    s.addShape("roundRect", { x, y, w, h: 0.3, rectRadius: 0.05, fill: { color: "F7F9FC" }, line: { color: LINE2, width: 0.75 } });
    s.addText(b, { x, y, w, h: 0.3, align: "center", valign: "middle", fontFace: F, fontSize: b.length > 12 ? 6.5 : 7.5, bold: true, color: NAVY, margin: 0 });
  });

  // right: paid table
  card(s, 4.0, 1.85, 8.53, 4.15);
  s.addText("PAID ACQUISITION, BY BRAND", { x: 4.28, y: 2.05, w: 5, h: 0.24, fontFace: F, fontSize: 8, bold: true, color: FAINT, charSpacing: 1.4, margin: 0 });
  const cols = { brand: 4.28, type: 6.0, traffic: 7.35, bar: 8.3, pct: 9.7, chan: 11.1 };
  const hy = 2.36;
  const th = (t, x, w, align) => s.addText(t, { x, y: hy, w, h: 0.24, fontFace: F, fontSize: 7.5, bold: true, color: FAINT, charSpacing: 0.8, align: align || "left", margin: 0 });
  th("BRAND", cols.brand, 1.6); th("TYPE", cols.type, 1.2); th("EST. TRAFFIC", cols.traffic, 0.95, "right"); th("PAID SHARE", cols.bar, 1.75, "center"); th("TOP PAID CHANNEL", cols.chan, 1.2, "right");
  s.addShape("line", { x: 4.28, y: 2.64, w: 7.97, h: 0, line: { color: LINE, width: 1 } });
  const rows = [
    ["O Positiv", "adj", "5.8M", 75, "Display"],
    ["Midi", "adj", "3.6M", 26, "Search"],
    ["Happy Mammoth", "adj", "2.5M", 53, "Social"],
    ["Alloy", "adj", "1.7M", 39, "Search"],
    ["Bonafide", "dir", "1.1M", 42, "Search"],
    ["Estroven", "dir", "253K", 59, "Search"],
    ["Kindra", "dir", "42K", 5, "Display"],
    ["Womaness", "dir", "41K", 17, "Display"],
  ];
  rows.forEach((r, i) => {
    const y = 2.72 + i * 0.375;
    s.addText(r[0], { x: cols.brand, y, w: 1.7, h: 0.3, fontFace: F, fontSize: 10, bold: true, color: NAVY, valign: "middle", margin: 0 });
    const isAdj = r[1] === "adj";
    pill(s, cols.type, y + 0.035, isAdj ? 0.85 : 0.65, 0.23, isAdj ? "ADJACENT" : "DIRECT", isAdj ? "5A6B7E" : BLUE, isAdj ? "EEF2F6" : BLUESOFT, 6.5, { charSpacing: 0.6 });
    s.addText(r[2], { x: cols.traffic, y, w: 0.95, h: 0.3, fontFace: F, fontSize: 10, color: INK, align: "right", valign: "middle", margin: 0 });
    // paid-share bar
    const trackW = 1.05, fillW = Math.max(0.03, trackW * r[3] / 100);
    s.addShape("roundRect", { x: cols.bar, y: y + 0.1, w: trackW, h: 0.11, rectRadius: 0.05, fill: { color: "EDF1F6" }, line: { type: "none" } });
    s.addShape("roundRect", { x: cols.bar, y: y + 0.1, w: fillW, h: 0.11, rectRadius: 0.05, fill: { color: isAdj ? NAVY : BLUE }, line: { type: "none" } });
    s.addText(r[3] + "%", { x: cols.pct - 0.25, y, w: 0.62, h: 0.3, fontFace: F, fontSize: 10, bold: true, color: NAVY, align: "right", valign: "middle", margin: 0 });
    s.addText(r[4], { x: cols.chan, y, w: 1.2, h: 0.3, fontFace: F, fontSize: 9.5, color: MUTED, align: "right", valign: "middle", margin: 0 });
    if (i < rows.length - 1) s.addShape("line", { x: 4.28, y: y + 0.36, w: 7.97, h: 0, line: { color: LINE2, width: 0.5 } });
  });
  s.addText("Sorted by estimated traffic (high to low).", { x: 4.28, y: 5.72, w: 3.5, h: 0.22, fontFace: F, fontSize: 7.5, color: FAINT, margin: 0 });
  s.addText("Similarweb + Semrush, Apr–Jun 2026 · estimates, directional", { x: 8.3, y: 5.72, w: 3.95, h: 0.22, fontFace: F, fontSize: 7.5, color: FAINT, align: "right", margin: 0 });

  // observations strip
  card(s, 0.8, 6.2, 11.73, 0.72, { fill: "F7F9FC", line: LINE2, noShadow: true });
  s.addText("OBSERVATION 1", { x: 1.05, y: 6.3, w: 2, h: 0.2, fontFace: F, fontSize: 7.5, bold: true, color: BLUE, charSpacing: 1, margin: 0 });
  s.addText([{ text: "The four largest brands by estimated traffic are all " }, { text: "adjacent competitors", options: { bold: true, color: NAVY } }, { text: ". Largest direct competitor: " }, { text: "Bonafide (1.1M)", options: { bold: true, color: NAVY } }, { text: "." }],
    { x: 1.05, y: 6.5, w: 5.4, h: 0.35, fontFace: F, fontSize: 9.5, color: INK, margin: 0 });
  s.addShape("line", { x: 6.75, y: 6.32, w: 0, h: 0.48, line: { color: LINE, width: 0.75 } });
  s.addText("OBSERVATION 2", { x: 7.0, y: 6.3, w: 2, h: 0.2, fontFace: F, fontSize: 7.5, bold: true, color: BLUE, charSpacing: 1, margin: 0 });
  s.addText([{ text: "Paid share ranges from " }, { text: "5% to 75%", options: { bold: true, color: NAVY } }, { text: " across the measured brands. Highest values: " }, { text: "O Positiv (75%), Estroven (59%), Happy Mammoth (53%)", options: { bold: true, color: NAVY } }, { text: "." }],
    { x: 7.0, y: 6.5, w: 5.35, h: 0.35, fontFace: F, fontSize: 9.5, color: INK, margin: 0 });
  foot(s);
}

// ================= SLIDE 6 - OBSERVATIONS =================
{
  const s = p.addSlide(); bg(s);
  kicker(s, "Key Observations");
  h1(s, "What the data shows");
  const data = [
    ["01", "The four highest-traffic brands are adjacent competitors", "Bonafide, the largest direct competitor, ranks fifth.",
     "O Positiv 5.8M · Midi 3.6M · Happy Mammoth 2.5M · Alloy 1.7M vs. Bonafide 1.1M"],
    ["02", "Paid acquisition strategies differ by brand", "Different brands rely on different primary paid channels.",
     "Search: Estroven, Bonafide, Alloy, Midi · Display: O Positiv, Womaness, Kindra · Social: Happy Mammoth"],
    ["03", "Paid investment varies across direct competitors", "Some invest heavily in paid channels, while others have minimal paid presence.",
     "High: Estroven 59%, Bonafide 42% · Low: Womaness 17%, Kindra 5%"],
  ];
  data.forEach((d, i) => {
    const x = 0.8 + i * 4.0;
    card(s, x, 1.75, 3.73, 3.1);
    s.addText(d[0], { x: x + 0.28, y: 2.0, w: 1, h: 0.45, fontFace: F, fontSize: 24, bold: true, color: NUMFAINT, margin: 0 });
    s.addText(d[1], { x: x + 0.28, y: 2.52, w: 3.2, h: 0.75, fontFace: F, fontSize: 13.5, bold: true, color: NAVY, margin: 0, lineSpacingMultiple: 1.08 });
    s.addText(d[2], { x: x + 0.28, y: 3.3, w: 3.2, h: 0.62, fontFace: F, fontSize: 10.5, color: MUTED, margin: 0, lineSpacingMultiple: 1.15 });
    s.addShape("line", { x: x + 0.28, y: 4.02, w: 3.17, h: 0, line: { color: LINE2, width: 0.75 } });
    s.addText(d[3], { x: x + 0.28, y: 4.12, w: 3.2, h: 0.6, fontFace: F, fontSize: 8.5, bold: true, color: FAINT, margin: 0, lineSpacingMultiple: 1.2 });
  });
  card(s, 0.8, 5.15, 11.73, 0.6, { fill: "F7F9FC", line: LINE2, noShadow: true });
  s.addText("Stripes' estimated traffic (~11K/month) is below the reporting threshold for Similarweb. Paid social activity is visible through Meta Ad Library.",
    { x: 1.05, y: 5.15, w: 11.2, h: 0.6, fontFace: F, fontSize: 10.5, color: MUTED, valign: "middle", margin: 0 });
  foot(s);
}

// ================= SLIDE 7 - IMPLICATIONS =================
{
  const s = p.addSlide(); bg(s);
  kicker(s, "Implications");
  h1(s, "Implications for Stripes");
  lead(s, "Observations are stated separately from implications. Each implication is an inference from the data shown.");
  const data = [
    [[{ text: "Stripes' estimated traffic (" }, { text: "~11K/month", bold: true }, { text: ") is below every measured competitor included in this analysis." }],
     [{ text: "Relative traffic suggests " }, { text: "limited top-of-funnel reach today", bold: true }, { text: "." }]],
    [[{ text: "Across competitors, the leading paid channel varies between " }, { text: "search, display and social", bold: true }, { text: "." }],
     [{ text: "Channel strategy should be " }, { text: "validated through experimentation", bold: true }, { text: " rather than assumed." }]],
    [[{ text: "Paid investment " }, { text: "varies across direct competitors", bold: true }, { text: "." }],
     [{ text: "Direct competitors do " }, { text: "not appear uniformly aggressive", bold: true }, { text: " in paid acquisition." }]],
  ];
  data.forEach((d, i) => {
    const x = 0.8 + i * 4.0;
    card(s, x, 1.9, 3.73, 2.7);
    s.addText("OBSERVED", { x: x + 0.28, y: 2.12, w: 2, h: 0.22, fontFace: F, fontSize: 8, bold: true, color: FAINT, charSpacing: 1.2, margin: 0 });
    s.addText(d[0].map(r => ({ text: r.text, options: { bold: !!r.bold } })), { x: x + 0.28, y: 2.38, w: 3.2, h: 0.9, fontFace: F, fontSize: 11.5, color: NAVY, bold: false, margin: 0, lineSpacingMultiple: 1.15 });
    s.addShape("line", { x: x + 0.28, y: 3.4, w: 3.17, h: 0, line: { color: LINE2, width: 0.75 } });
    s.addText("IMPLICATION", { x: x + 0.28, y: 3.52, w: 2, h: 0.22, fontFace: F, fontSize: 8, bold: true, color: BLUE, charSpacing: 1.2, margin: 0 });
    s.addText(d[1].map(r => ({ text: r.text, options: { bold: !!r.bold, color: r.bold ? NAVY : MUTED } })), { x: x + 0.28, y: 3.78, w: 3.2, h: 0.7, fontFace: F, fontSize: 10.5, margin: 0, lineSpacingMultiple: 1.15 });
  });
  // next bar
  s.addShape("roundRect", { x: 0.8, y: 5.0, w: 11.73, h: 0.75, rectRadius: 0.09, fill: { color: NAVY }, line: { type: "none" }, shadow: shadow() });
  s.addText("NEXT", { x: 1.1, y: 5.0, w: 0.7, h: 0.75, fontFace: F, fontSize: 9, bold: true, color: ICEBLUE, charSpacing: 1.8, valign: "middle", margin: 0 });
  s.addText([{ text: "Part 2 focuses on the " }, { text: "proposed acquisition strategy", options: { bold: true, color: "FFFFFF" } }, { text: " built around Stripes' hero product." }],
    { x: 1.85, y: 5.0, w: 9.5, h: 0.75, fontFace: F, fontSize: 12.5, color: "EAF1FF", valign: "middle", margin: 0 });
  s.addText("→", { x: 11.7, y: 5.0, w: 0.6, h: 0.75, fontFace: F, fontSize: 16, bold: true, color: ICEBLUE, valign: "middle", align: "right", margin: 0 });
  foot(s);
}

p.writeFile({ fileName: "/home/user/zyg-home-assignment/deck/Stripes-CRO-Part1.pptx" }).then(() => console.log("written"));
