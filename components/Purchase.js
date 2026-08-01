'use client';

import { useState } from 'react';

const PLANS = {
  sub: { price: '$34.00' },
  once: { price: '$40.00' },
};

export default function Purchase() {
  const [plan, setPlan] = useState('sub');

  return (
    <section className="buy" id="purchase">
      <div className="buyshot">
        <img src="/assets/product-bottle.png" alt="The Inside Addition supplement bottle" />
      </div>
      <h2>Build Your Daily Ritual</h2>
      <div className="subred">The Inside Addition · Daily menopause support · 60 capsules</div>
      <div className="rate">
        <span className="st">★★★★★</span>
        <span className="rc">4.8/5</span>
      </div>
      <div className="plan">
        Select Plan: <span className="it">Subscribe to feel the difference with consistent use.</span>
      </div>

      <button
        type="button"
        className={'opt' + (plan === 'sub' ? ' sel' : '')}
        onClick={() => setPlan('sub')}
        aria-pressed={plan === 'sub'}
      >
        <span className="save">SAVE 15%</span>
        <span className="orow">
          <span className="radio" />
          <span className="oname">Subscribe &amp; Save</span>
          <span className="oprice">
            $34.00<span className="old">$40.00</span>
          </span>
        </span>
        <span className="obul">
          <span className="ob"><span className="d" />Delivery every 1 month</span>
          <span className="ob"><span className="d" />Free shipping on all orders</span>
          <span className="ob"><span className="d" />Easy cancel or modify</span>
          <span className="ob"><span className="d" />90-day money-back guarantee</span>
        </span>
      </button>

      <button
        type="button"
        className={'opt' + (plan === 'once' ? ' sel' : '')}
        onClick={() => setPlan('once')}
        aria-pressed={plan === 'once'}
      >
        <span className="orow">
          <span className="radio" />
          <span className="oname">One-Time Purchase</span>
          <span className="oprice">$40.00</span>
        </span>
        <span className="obul">
          <span className="ob"><span className="d" />90-day money-back guarantee</span>
          <span className="ob"><span className="d" />Free shipping above $69.9</span>
        </span>
      </button>

      <button type="button" className="cta burg" style={{ marginTop: 20 }}>
        ADD TO CART&nbsp;&nbsp;|&nbsp;&nbsp;{PLANS[plan].price}
      </button>

      <div className="tiles">
        <div className="tile">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 8h13v9H1zM14 11h4l3 3v3h-7z" /><circle cx="6" cy="19" r="1.8" /><circle cx="17" cy="19" r="1.8" /></svg>
          <div className="t">Free Shipping<small>on all subscription orders</small></div>
        </div>
        <div className="tile">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h18v12H3zM3 8l2-4h14l2 4M12 8v12" /></svg>
          <div className="t">90-day Money-back<small>Guarantee</small></div>
        </div>
      </div>

      <Accordion />
    </section>
  );
}

const DETAILS = [
  {
    q: 'DETAILS',
    a: 'A daily supplement built for the menopause journey — ashwagandha, probiotics and vitamins B, D & E to help with stress, brain fog and hot flashes. Hormone-free, 60 capsules (one month).',
  },
  {
    q: 'BENEFITS',
    a: 'Daily menopause symptom support, help with stress and brain fog, support through hot flashes, and everyday nutrients for energy and mood — in one simple daily habit.',
  },
  {
    q: 'HOW TO USE',
    a: 'Take two capsules daily with water, ideally with a meal. Make it part of your morning routine and use consistently for best results.',
  },
  {
    q: 'INGREDIENTS',
    a: 'Ashwagandha, a probiotic blend, and Vitamins D, B & E, rounded out with a supporting botanical blend. Hormone-free and free from artificial fillers.',
  },
];

function Accordion() {
  const [open, setOpen] = useState(0);
  return (
    <div className="acc">
      {DETAILS.map((row, i) => (
        <div key={row.q} className={'arow' + (open === i ? ' open' : '')}>
          <button type="button" className="h" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            {row.q}
            <span className="chev">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            </span>
          </button>
          <div className="panel"><div className="inner">{row.a}</div></div>
        </div>
      ))}
    </div>
  );
}
