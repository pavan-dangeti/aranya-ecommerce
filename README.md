# ARANYA — Ancient Wisdom. Naturally Reimagined.

A premium 3D herbal wellness e-commerce concept. Original brand, original identity —
built to demonstrate a production-quality storefront: cinematic 3D storytelling,
full shopping flows, and a complete operations console. This is a **frontend
prototype**; all data is mock/in-memory and no real payments, emails or
databases are involved.

> Demo storefront. No real payments, no medical claims, no certification claims.
> Products, reviews, people and orders are illustrative.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run typecheck  # tsc --noEmit
npm run lint       # eslint src
npm run build      # typecheck + production build → dist/
npm run preview    # serve the production build (port 4173)
```

## Authentication (prototype scope)

This build ships a **demo role-split experience** for presentation purposes:

- `/login` — account-type chooser (Customer / Admin)
- `/login/customer`, `/register/customer` — customer auth; accounts are created
  in-memory and live only for the browser session
- `/login/admin` — operations-console sign-in
- `/admin` — dashboard, products, orders, customers, inventory, reviews

Demo accounts for the prototype live in `src/data/demo-accounts.ts` and are
**never rendered in the UI**. No passwords are persisted anywhere; sessions
store only the public profile ("Remember me" → localStorage, otherwise
sessionStorage).

| Before production | Why |
| --- | --- |
| Replace mock auth with a real identity provider | identity, sessions, password handling |
| Enforce admin server-side | client role checks are UX, not authorization |
| Add rate limiting on auth endpoints | brute-force protection |
| Move catalog/orders/inventory to a real database | prototype state is local-only |
| Integrate a real payment gateway and transactional email | checkout is simulated |
| Set sitemap domain in `public/robots.txt` | deployment configuration |

All backend integration (database, real auth, payments, email, RLS,
server-side authorization) is **intentionally deferred**. The service layer
(`src/services/api.ts`) is the single seam where those calls land later —
see `src/services/README.md` for the deferred integration notes.

## What's inside

- **Home** — 10 cinematic sections: 3D hero (botanical orb, orbiting leaves,
  particles), ingredient origin cards with tilt physics, featured products,
  interactive 3D product viewer, journal preview, scroll-driven wellness
  journey, sustainability, testimonials, newsletter.
- **Shop** — 22 products, 6 categories; URL-synced search / category / price /
  rating filters, 5 sort modes, load-more pagination.
- **Product pages** — 3D vessel viewer (drag/zoom), tabs, reviews with
  distribution + local review writing, related products, sticky mobile CTA.
- **Cart & checkout** — persistent cart (localStorage), animated drawer,
  free-shipping progress, validated checkout (UPI / simulated card / COD),
  order confirmation with ETA.
- **Auth & profile** — login / register / forgot-password / profile with order
  history. Session-only by design; no credentials are ever stored or bundled.
- **Admin** — revenue chart, orders, inventory (low-stock flags), customers,
  reviews on illustrative data.
- **Journal / Story / Ingredients / Support pages** — five full essays and
  every footer route implemented.
- **⌘K command-palette search** across names, categories, ingredients, tags.

## Architecture

```
src/
├── components/   3d/ · cart/ · checkout-adjacent · layout/ · products/ ·
│                 search/ · sections/ · ui/
├── data/         mock catalog, articles, ingredients, reviews, admin fixtures
├── hooks/        media queries, WebGL detection, scroll lock, meta, escape
├── pages/        one file per route (+ auth/, admin/)
├── services/     api.ts — the ONLY data access layer (see services/README.md
│                 for the deferred backend swap map + intended schema)
├── store/        zustand: cart, wishlist, ui, auth (persisted where safe)
├── types/        Product, Category, Review, Order, User, …
└── utils/        cn, format, validate, color, motion presets, storage
```

Key decisions:

- **3D is procedural** — zero model downloads. Three/R3F chunks are lazy,
  canvases mount only near the viewport, pause off-screen/hidden tabs, and
  degrade to designed 2D fallbacks when WebGL is unavailable.
- **Product art is generated SVG** (`ProductVisual`) — crisp at any size, no
  image assets, shared palette with the 3D materials.
- **All product imagery/claims policy**: "traditionally used in Ayurveda"
  phrasing only; nothing claims certifications or outcomes.

## Accessibility & performance notes

- Semantic landmarks, skip-link, labelled controls, focus-visible rings,
  `prefers-reduced-motion` honoured globally (`MotionConfig` + CSS + 3D gates).
- Route-level code splitting; three.js isolated in lazy chunks; canvases pause
  when off-screen (`frameloop="never"`).
