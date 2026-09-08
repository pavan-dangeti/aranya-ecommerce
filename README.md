<div align="center">

# 🌿 ARANYA

**Ancient Wisdom. Naturally Reimagined.**

*A Premium 3D Herbal Wellness E-Commerce Platform*

[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)
[![Demo](https://img.shields.io/badge/📹_Demo-Google_Drive-blue?style=for-the-badge)](https://drive.google.com/drive/folders/1xwFmgx-OR8Zz4ChvHGvLr5EbTIM3jJYP?usp=drive_link)

![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-State_Management-orange?style=flat-square)
![WebGL](https://img.shields.io/badge/WebGL-990000?style=flat-square&logo=webgl&logoColor=white)

> A production-quality frontend prototype for a premium herbal wellness brand. Features cinematic 3D storytelling, full shopping flows, a complete operations console, role-based auth, and ⌘K command-palette search — all built as a frontend-only demo with mock/in-memory data. No real payments, emails, or databases.

</div>

---

## 🎬 Demo

👉 **[Watch Full Demo on Google Drive](https://drive.google.com/drive/folders/1xwFmgx-OR8Zz4ChvHGvLr5EbTIM3jJYP?usp=drive_link)**

> Demo storefront — no real payments, no medical claims, no certification claims. Products, reviews, people and orders are illustrative.

---

## ✨ What's Inside

### 🏠 Home — 10 Cinematic Sections
- 3D hero with botanical orb, orbiting leaves, and particles
- Ingredient origin cards with tilt physics
- Featured products with interactive 3D product viewer
- Journal preview and scroll-driven wellness journey
- Sustainability section, testimonials, newsletter

### 🛍️ Shop
- 22 products across 6 categories
- URL-synced search, category, price, and rating filters
- 5 sort modes with load-more pagination

### 📦 Product Pages
- 3D vessel viewer with drag/zoom interaction
- Review tabs with distribution chart + local review writing
- Related products and sticky mobile CTA

### 🛒 Cart & Checkout
- Persistent cart (localStorage)
- Animated drawer with free-shipping progress
- Validated checkout — UPI / simulated card / COD
- Order confirmation with ETA

### 🔐 Auth & Profile
- Login / Register / Forgot-password / Profile with order history
- Session-only by design — no credentials stored or bundled
- Demo role-split experience (Customer / Admin)

### 🖥️ Admin Console
- Revenue chart, orders management
- Inventory with low-stock flags
- Customers and reviews on illustrative data

### 📖 Content Pages
- Journal, Story, Ingredients, Support — 5 full essays
- Every footer route implemented

### ⌘K Command-Palette Search
- Search across product names, categories, ingredients, and tags

---

## 🏗️ Architecture

```
src/
├── components/    3d/ · cart/ · checkout-adjacent · layout/ · products/
│                  search/ · sections/ · ui/
├── data/          mock catalog, articles, ingredients, reviews, admin fixtures
├── hooks/         media queries, WebGL detection, scroll lock, meta, escape
├── pages/         one file per route (+ auth/, admin/)
├── services/      api.ts — the ONLY data access layer
├── store/         zustand: cart, wishlist, UI, auth (persisted where safe)
├── types/         Product, Category, Review, Order, User...
└── utils/         cn, format, validate, color, motion presets, storage
```

---

## 🧠 Key Design Decisions

**3D is procedural** — zero model downloads. Three.js/R3F chunks are lazy, canvases mount only near the viewport, pause off-screen/hidden tabs, and degrade to designed 2D fallbacks when WebGL is unavailable.

**Product art is generated SVG** — crisp at any size, no image assets, shared palette with the 3D materials.

**Imagery/claims policy** — "traditionally used in Ayurveda" phrasing only; nothing claims certifications or outcomes.

---

## ♿ Accessibility & Performance

- Semantic landmarks, skip-link, labelled controls, focus-visible rings
- `prefers-reduced-motion` honoured globally (MotionConfig + CSS + 3D gates)
- Route-level code splitting — Three.js isolated in lazy chunks
- Canvases pause when off-screen (`frameloop="never"`)

---

## 🔐 Authentication (Prototype Scope)

| Route | Purpose |
|---|---|
| `/login` | Account-type chooser (Customer / Admin) |
| `/login/customer`, `/register/customer` | Customer auth — in-memory only |
| `/login/admin` | Operations console sign-in |
| `/admin` | Dashboard, products, orders, customers, inventory, reviews |

Demo accounts live in `src/data/demo-accounts.ts` and are never rendered in the UI. No passwords are persisted anywhere — sessions store only the public profile.

---

## 📋 Before Production

| Item | Why |
|---|---|
| Replace mock auth with a real identity provider | Identity, sessions, password handling |
| Enforce admin role server-side | Client role checks are UX, not authorization |
| Add rate limiting on auth endpoints | Brute-force protection |
| Move catalog/orders/inventory to a real database | Prototype state is local-only |
| Integrate a real payment gateway and transactional email | Checkout is simulated |

All backend integration (database, real auth, payments, email, RLS, server-side authorization) is intentionally deferred. The service layer (`src/services/api.ts`) is the single seam where those calls land later.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React + TypeScript | Core framework |
| Vite | Build tooling |
| Three.js / R3F | 3D rendering and WebGL |
| Tailwind CSS | Styling |
| Zustand | State management |
| React Router | Navigation |
| Framer Motion | Animations |
| Lucide React | Icons |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# http://localhost:5173
```

**Other scripts:**
```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint src
npm run build       # typecheck + production build → dist/
npm run preview     # serve the production build (port 4173)
```

---

## 🗺️ Roadmap

- [ ] Real backend integration (database, auth, payments)
- [ ] Server-side rendering (Next.js migration)
- [ ] Real payment gateway (Razorpay / Stripe)
- [ ] Transactional email system
- [ ] CI/CD pipeline
- [ ] Cloud deployment

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

🌿 **ARANYA — Where ancient wisdom meets modern craft.**

*A frontend showcase of cinematic 3D e-commerce experience.*

</div>
