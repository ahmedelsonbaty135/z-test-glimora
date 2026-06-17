# GLIMOKA — Luxury Jewelry E-Commerce Store (Egypt)

## Project Status: Phase 1 Complete — MVP Live & Verified ✅

**Project**: GLIMOKA — متجر مجوهرات إلكتروني فاخر (luxury personalized jewelry store for the Egyptian market)
**Tech**: Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + shadcn/ui + Prisma (SQLite) + Zustand + Framer Motion + z-ai-web-dev-sdk
**Branding**: Burgundy (#6A1B35) + Cream (#FAF6F2) + Rose Gold (#C9A87C), Cairo font (Arabic), full RTL
**Currency**: EGP (Egyptian Pounds) — الدفع عند الاستلام (COD)

---

## Task ID: 1 — Foundation (Completed by main agent)

**Work Log:**
- Configured GLIMOKA design system in `src/app/globals.css` (brand palette, luxury shadows, ornaments, animations, custom scrollbar)
- Updated `src/app/layout.tsx` with Cairo (Arabic) + Inter (Latin) fonts, RTL `dir="rtl" lang="ar"`, GLIMOKA metadata
- Wrote Prisma schema (`prisma/schema.prisma`) with 14 models: User, Address, Category, Product, ProductImage, Order, OrderItem, Coupon, CouponUsage, Review, Wishlist, Notification, Banner, Setting
- Created seed data (`prisma/seed.ts`): 4 categories, 12 products (bracelets/necklaces/rings), 6 reviews, 4 coupons (WELCOME10, GLIMOKA50, FREESHIP, VALENTINE15), 2 banners, admin user, store settings
- Built Zustand store (`src/lib/store.ts`) for view navigation, cart, wishlist, recently viewed, coupon, user auth, UI state — persisted to localStorage
- Created utility helpers (`src/lib/utils.ts`): formatEGP, discountPercent, METAL_LABELS, METAL_PRICE_ADDON, METAL_COLOR_HEX, whatsappLink, starArray, ORDER_STATUS_META

## Task ID: 2-b — API Routes (Completed by main agent)

**Work Log:**
- `GET /api/products` — list with filters (category, featured, bestSeller, newArrival, onSale, search, sort, priceRange, metal, limit)
- `GET /api/products/[slug]` — product detail with images, category, reviews, related products
- `GET /api/categories` — all categories with product counts
- `POST /api/coupons/apply` — validate coupon (date, usage, min order) and return discount
- `POST /api/orders` — create COD order with items, generate order number (GLM-YYYYMMDD-XXXX), increment coupon usage, update product stock/soldCount, compute loyalty points
- `GET /api/orders/track` — track by order number + optional phone verification
- `GET /api/orders/list` — list orders by phone/email
- `POST /api/reviews/add` — add review, update product aggregate rating
- `POST /api/ai/chat` — LLM chatbot (z-ai-web-dev-sdk) with GLIMOKA system prompt (store info, coupons, shipping, customization)
- `POST /api/ai/recommend` — semantic product recommendations via LLM
- `GET /api/admin/stats` — dashboard KPIs (revenue, orders, customers, AOV), 14-day sales chart, low-stock alerts, recent orders, top products
- `GET /api/settings` — public store settings

## Task ID: 3 — Single-Page App UI (Completed by main agent)

**Work Log:** Built as a state-driven SPA on `/` (single user-visible route per project rules) with view switching via Zustand:
- `BrandLogo` — GLIMOKA wordmark with custom Å, rose-gold/burgundy variants
- `Header` — sticky, announcement bar, nav (RTL), search, wishlist, cart badge, account; mobile drawer
- `CartDrawer` — slide-in cart with qty controls, customization summary, checkout CTA
- `Footer` — sticky-to-bottom (mt-auto), trust badges, newsletter, link columns, contact, socials
- `FloatingWidgets` — floating WhatsApp button (green, glow pulse) + AI chatbot widget (جليمي) with LLM integration, suggestion chips, typing indicator
- `ProductCard` — image, badges (discount/new/bestseller), wishlist heart, quick-add, rating, price
- **HomeView**: hero (burgundy gradient + countdown), featured categories, best sellers, personalization showcase, on-sale, testimonials, about + Instagram grid, newsletter
- **ProductsView**: grid + sidebar filters (price slider, metal, rating, on-sale), sort dropdown, load-more, mobile filter sheet, breadcrumbs, empty state
- **ProductDetailView**: image gallery + zoom + live preview name overlay, personalization form (name1/name2/font/metal/size/giftbox/giftcard), price calc with metal addons, qty, add-to-cart/buy-now/whatsapp/wishlist, tabs (description/specs/reviews/shipping), review form + rating distribution, related products
- **CartView**: line items with customization tags, qty controls, coupon apply, order summary, free-shipping progress
- **CheckoutView**: 3-step form (contact/shipping/payment), COD only, Egyptian governorates dropdown, phone validation, order summary sidebar
- **ThankYouView**: success animation, order number with copy, next-steps timeline, WhatsApp CTA
- **AccountView**: login/register tabs, orders list, wishlist grid, profile with loyalty points, settings
- **AdminView**: password gate (admin/glimoka), KPI cards, sales area chart, status pie chart, top products bar chart, orders table, low-stock alerts, coupons
- **InfoViews**: About, Contact, FAQ (accordion), Track Order (timeline), Shipping Policy (table), Return Policy

## Task ID: 4 — WhatsApp + AI Chatbot (Completed by main agent)

- Floating WhatsApp button on all pages (bottom-right, green, opens wa.me with prefilled message)
- AI chatbot "جليمي" (bottom-left) using `/api/ai/chat` (z-ai-web-dev-sdk LLM) with GLIMOKA-specific system prompt (coupons, shipping, customization, metals)
- Product page WhatsApp inquiry button with pre-filled product + customization details

## Task ID: 5 — Verification (Completed by main agent via agent-browser)

**Verified end-to-end golden path:**
1. ✅ Home page renders: hero, categories, best sellers, testimonials, footer — all RTL, GLIMOKA branding applied
2. ✅ Click product → detail view with personalization form (name inputs, 4 fonts, 4 metals with price addons, size selector, gift options)
3. ✅ Fill name "أحمد", select gold 18k (+400 EGP), add to cart → toast "تمت إضافة سوار الاسم الفضي للسلة"
4. ✅ Cart drawer shows item with customization summary
5. ✅ Checkout: fill name/phone/address, select Cairo governorate, submit → POST /api/orders 200
6. ✅ Thank You page: "شكرًا لك على طلبك! 💎" with order number GLM-20260617-XXXX
7. ✅ Track Order: order number auto-filled, timeline shows "قيد المراجعة" status with 6-step progress
8. ✅ Admin dashboard: password "admin" → KPIs, charts, orders table, low-stock, coupons tabs
9. ✅ AI Chatbot: asked "إيه أكواد الخصم المتاحة؟" → LLM responded with all 4 coupons accurately
10. ✅ Lint clean (`bun run lint` passes with 0 errors)
11. ✅ No console/runtime errors in dev.log

## Task ID: 2-a — Image Generation (In Progress)

Generating 34 jewelry images via z-ai-web-dev-sdk (hero, 4 categories, 3 brand, 24 product images). All on cream backgrounds with luxury jewelry photography style matching GLIMOKA brand. Running sequentially with retry logic in background.

---

## Stage Summary

### Current Goals / Completed
- ✅ Full GLIMOKA brand identity applied (burgundy/cream/rose-gold, Cairo font, RTL)
- ✅ Complete e-commerce flow: browse → personalize → cart → checkout (COD) → thank you → track
- ✅ Product personalization with live preview (name overlay on product image)
- ✅ Coupon system (4 working codes: WELCOME10, GLIMOKA50, FREESHIP, VALENTINE15)
- ✅ Admin dashboard with charts (recharts) and KPIs
- ✅ AI chatbot (جليمي) with LLM-powered responses
- ✅ Floating WhatsApp integration
- ✅ Responsive mobile-first design with sticky footer
- ✅ 12 seeded products across 4 categories with reviews

### Verification Results
- Lint: ✅ 0 errors
- Dev server: ✅ Running on port 3000
- Golden path: ✅ Verified via agent-browser
- AI chatbot: ✅ LLM responding accurately
- Admin dashboard: ✅ Charts rendering

### Unresolved Issues / Risks
- 🔄 Image generation in progress (34 images, sequential ~30s each) — products currently show 404 placeholders until complete
- ⚠️ Next.js dev tools portal can cover the chatbot button in agent-browser; dismissed by removing the portal element (production won't have this)
- 🔮 Future enhancements (next phases): WhatsApp Cloud API real integration, OAuth (Google/Facebook), loyalty points redemption, abandoned cart reminders, visual search, sentiment analysis on reviews

### Priority Recommendations for Next Phase
1. Complete image generation verification (all 34 images)
2. Add more interactive polish: product image zoom, recently-viewed section on home
3. Implement wishlist → cart move in account
4. Add size guide page
5. Add more admin actions (update order status, edit products)
6. Performance: add loading skeletons, image lazy-loading audit
