'use client';

import { Children, useCallback, useEffect, useRef, useState } from 'react';

/*
 * Wraps a scroll-snap row (.caro / .vrow / .rrow) and makes it feel alive on
 * every input: arrow buttons + drag-to-scroll for mouse users, native swipe
 * on touch, and dots that track the real scroll position.
 */
export default function Carousel({ className, children, withDots = false, label }) {
  const ref = useRef(null);
  const drag = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [active, setActive] = useState(0);
  const count = Children.count(children);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
    if (count > 1 && max > 0) {
      setActive(Math.min(count - 1, Math.round((el.scrollLeft / max) * (count - 1))));
    }
  }, [count]);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [update]);

  const page = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.85, 200), behavior: 'smooth' });
  };

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return; // touch scrolls natively
    const el = ref.current;
    drag.current = { x: e.clientX, left: el.scrollLeft };
    el.style.scrollSnapType = 'none'; // snap fights manual scrollLeft
    el.dataset.dragging = 'true';
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    ref.current.scrollLeft = d.left - (e.clientX - d.x);
  };
  const endDrag = () => {
    const el = ref.current;
    if (!el || !drag.current) return;
    drag.current = null;
    el.style.scrollSnapType = '';
    delete el.dataset.dragging;
  };

  return (
    <>
      <div className="carowrap">
        <button
          type="button"
          className="cbtn prev"
          aria-label={`Previous ${label || 'slide'}`}
          disabled={!canPrev}
          onClick={() => page(-1)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div
          ref={ref}
          className={className}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
        >
          {children}
        </div>
        <button
          type="button"
          className="cbtn next"
          aria-label={`Next ${label || 'slide'}`}
          disabled={!canNext}
          onClick={() => page(1)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
      {withDots && count > 1 && (
        <div className="dots">
          {Array.from({ length: count }).map((_, i) => (
            <span key={i} className={i === active ? 'on' : ''} />
          ))}
        </div>
      )}
    </>
  );
}
