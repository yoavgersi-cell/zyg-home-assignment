import Purchase from '../components/Purchase';
import Faq from '../components/Faq';
import Carousel from '../components/Carousel';

export default function Home() {
  return (
    <main className="app">
      {/* header */}
      <header className="hdr">
        <div className="burger"><span /><span /><span /></div>
        <div className="logo"><div className="w">Stripes</div><div className="b">BEAUTY</div></div>
        <div className="hicons">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 7h12l1 14H5z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
        </div>
      </header>

      {/* 1 hero */}
      <div className="heroimg">
        <img className="ph" src="/assets/hero-kitchen.png" alt="Naomi Watts with a coffee and The Inside Addition on the counter" />
      </div>
      <section className="hero">
        <h1>Your daily addition.<br /><span className="it">Feel like yourself again.</span></h1>
        <div className="sub">Instead of being just another menopause supplement, The Inside Addition becomes a simple daily habit that naturally fits into your routine and supports you from the inside out.</div>
        <div className="divx" />
        <div className="bullets">
          <div className="bl"><span className="pc">+</span><span className="t">Hormone-Free</span></div>
          <div className="bl"><span className="pc">+</span><span className="t">Daily Menopause Support</span></div>
          <div className="bl"><span className="pc">+</span><span className="t">Helps relieve stress, brain fog &amp; hot flashes</span></div>
        </div>
        <a href="#purchase" className="cta">BUILD YOUR DAILY RITUAL</a>
        <div className="ctanote">Choose your plan below</div>
        <div className="assure">
          <span className="asx"><span className="st">★★★★★</span> <b>4.8/5</b> Customer Rating</span>
          <span className="asx">Free Shipping</span>
          <span className="asx">90-Day Money-Back Guarantee</span>
        </div>
      </section>

      {/* 2 empathy */}
      <section className="sect emp">
        <h2>Does any of this <span className="it">sound familiar?</span></h2>
        <div className="egrid">
          <div className="ec"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18a6 6 0 1 1 6 0M9 18h6M10 22h4" /></svg></div><div className="t">Brain fog</div></div>
          <div className="ec"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M8 15s1.5-2 4-2 4 2 4 2M9 9h.01M15 9h.01" /></svg></div><div className="t">Mood changes</div></div>
          <div className="ec"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1.5.7-2.8 1.3-3.7" /><path d="M12 22a6 6 0 0 0 6-6c0-2-1-3.5-2-5" /></svg></div><div className="t">Hot flashes</div></div>
          <div className="ec"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h7l-1 8 10-12h-7z" /></svg></div><div className="t">Low energy</div></div>
          <div className="ec"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M5.6 5.6l2.2 2.2M3 12h3M18 12h3M16.2 7.8l2.2-2.2M8 20a4 4 0 0 1 8 0z" /></svg></div><div className="t">Stress</div></div>
          <div className="ec"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></svg></div><div className="t">Not feeling like yourself</div></div>
        </div>
      </section>

      {/* 3 solution */}
      <section className="sect sol">
        <h2>That&apos;s why we created<br /><span className="it">The Inside Addition.</span></h2>
        <div className="lead">One simple daily habit that supports women through perimenopause and menopause.</div>
        <div className="prodshot">
          <img src="/assets/product-editorial.png" alt="The Inside Addition supplement" />
          <span className="pl">THE INSIDE ADDITION</span>
        </div>
        <div className="bgrid">
          <div className="bc"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" /></svg></div><div className="h">Hormone-free</div></div>
          <div className="bc"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18a6 6 0 1 1 6 0M9 18h6M10 22h4" /></svg></div><div className="h">Helps support brain fog &amp; stress</div></div>
          <div className="bc"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2s4 4 4 8a4 4 0 0 1-8 0c0-1.5.7-2.8 1.3-3.7" /><path d="M12 22a6 6 0 0 0 6-6c0-2-1-3.5-2-5" /></svg></div><div className="h">Supports hot flashes</div></div>
          <div className="bc"><div className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg></div><div className="h">Fits naturally into your daily routine</div></div>
        </div>
      </section>

      {/* 4 what's inside */}
      <section className="sect inside">
        <h2>What&apos;s inside <span className="it">matters.</span></h2>
        <Carousel className="caro" withDots label="ingredient">
          <div className="icard"><div className="im"><img src="/assets/ing-ashwagandha.png" alt="Ashwagandha" /></div><div className="d">An adaptogen traditionally used to help the body manage everyday stress.</div></div>
          <div className="icard"><div className="im"><img src="/assets/ing-probiotics.png" alt="Probiotics" /></div><div className="d">Supports gut balance — where a lot of daily wellbeing starts.</div></div>
          <div className="icard"><div className="im"><img src="/assets/ing-vitamins.png" alt="Vitamins D, B, E" /></div><div className="d">Everyday nutrients that support energy, mood and immune health.</div></div>
        </Carousel>
      </section>

      {/* 5 results */}
      <section className="res">
        <h2>Results women<br /><span style={{ fontStyle: 'italic' }}>actually noticed.</span></h2>
        <div className="big"><div className="n">100%</div><div className="l">said it fit easily into their daily routine</div></div>
        <div className="rgrid">
          <div className="rs"><div className="n">91%</div><div className="l">felt more like themselves within 8 weeks</div></div>
          <div className="rs"><div className="n">88%</div><div className="l">noticed clearer, more focused days</div></div>
          <div className="rs"><div className="n">82%</div><div className="l">felt calmer under everyday stress</div></div>
          <div className="rs"><div className="n">79%</div><div className="l">reported fewer disruptive hot flashes</div></div>
        </div>
        <div className="note">Concept mockup — figures follow the existing Stripes results format and would be replaced with validated study data.</div>
      </section>

      {/* 6 social proof */}
      <section className="sect ugc">
        <h2>Real women.<br /><span className="it">Real routines.</span></h2>
        <Carousel className="vrow" withDots label="customer video">
          <div className="vc"><img src="/assets/ugc-1.png" alt="Customer TikTok" /></div>
          <div className="vc"><img src="/assets/ugc-2.png" alt="Customer TikTok" /></div>
          <div className="vc"><img src="/assets/ugc-3.png" alt="Customer TikTok" /></div>
        </Carousel>
        <Carousel className="rrow" label="customer review">
          <div className="rev"><img src="/assets/review-1.png" alt="Customer review" /></div>
          <div className="rev"><img src="/assets/review-2.png" alt="Customer review" /></div>
        </Carousel>
      </section>

      {/* 7 founder */}
      <section className="founder">
        <div className="fimg"><img src="/assets/founder-naomi.png" alt="Naomi Watts, founder of Stripes" /></div>
        <h2>Why I created <span className="it">Stripes.</span></h2>
        <h3>Midlife is a lot more than just menopause.</h3>
        <p>My symptoms started at 36, and nobody had prepared me. When I learned it was perimenopause, I was angry — why didn&apos;t I know it could start so early?</p>
        <p>I created Stripes because we deserve support, solutions, and the space to figure it all out.</p>
        <div className="sig">Naomi</div>
        <a href="#purchase" className="cta">BUILD YOUR DAILY RITUAL</a>
      </section>

      {/* 8 purchase */}
      <Purchase />

      {/* 9 faq */}
      <Faq />

      <footer className="foot">
        <div className="w">Stripes</div>
        <div className="b">BEAUTY</div>
        <div className="c">Campaign landing page concept · The Inside Addition</div>
      </footer>
    </main>
  );
}
