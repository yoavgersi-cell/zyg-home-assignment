'use client';

import { useState } from 'react';

const FAQS = [
  {
    q: 'Is it hormone-free?',
    a: 'Yes. The Inside Addition is completely hormone-free. It uses ashwagandha, probiotics, vitamins and botanicals to support you through menopause — no hormones involved.',
  },
  {
    q: 'When will I notice a difference?',
    a: 'Everyone is different, but most women feel a difference within a few weeks of consistent daily use. Like any daily habit, it works best when you stick with it.',
  },
  {
    q: 'How do I take it?',
    a: 'Two capsules a day with water, ideally with a meal. Add it to your morning routine so it becomes an easy, automatic habit.',
  },
  {
    q: 'Is this only for menopause?',
    a: 'It is formulated for perimenopause and menopause, but the ingredients support everyday stress, energy and gut health more broadly. It fits naturally into a daily wellness routine.',
  },
  {
    q: 'Can I take it with other supplements?',
    a: 'Generally yes. If you take prescription medication or have a medical condition, we recommend checking with your doctor before adding any new supplement.',
  },
  {
    q: "What if it doesn't work for me?",
    a: 'Every order is backed by our 90-day money-back guarantee. If it is not right for you, reach out and we will make it right.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState(-1);
  return (
    <section className="faq">
      <h2>Frequently asked questions</h2>
      {FAQS.map((row, i) => (
        <div key={row.q} className={'frow' + (open === i ? ' open' : '')}>
          <button type="button" className="fq" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            {row.q}
            <span className="chev">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            </span>
          </button>
          <div className="fpanel"><div className="inner">{row.a}</div></div>
        </div>
      ))}
      <a href="#purchase" className="cta">BUILD YOUR DAILY RITUAL</a>
    </section>
  );
}
