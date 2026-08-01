# The Inside Addition — Campaign Landing Page

A mobile-first, responsive Next.js (App Router) prototype of the Stripes
"The Inside Addition" campaign landing page, built for cold Meta traffic.

This is a high-fidelity concept for a Product Manager case study — not a
production e-commerce build. There is no cart, checkout, backend, or API.

## Run locally

```bash
npm install
npm run dev
```

## Deploy (Vercel)

Import the repo and set **Root Directory** to `landing`. Framework is
auto-detected as Next.js. No environment variables are required.

## Interactions

- Every "Build Your Daily Ritual" CTA smooth-scrolls to the Purchase section.
- Ingredient, TikTok, and review carousels are swipeable (CSS scroll-snap).
- FAQ is a standard accordion.
- The purchase plan selector switches Subscribe & Save ↔ One-Time Purchase
  and updates the price shown in the Add to Cart button.
