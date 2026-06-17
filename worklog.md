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

---

## Task ID: 7 — Cron Round 1: QA + Bug Fixes + New Features (Completed by review agent)

**Trigger:** Recurring cron job (webDevReview, every 15 min)

**Work Log:**

### QA Findings & Bugs Fixed
1. **CRITICAL BUG: Mobile menu drawer was missing** — The hamburger button called `setMobileMenuOpen(true)` but no Sheet/drawer was rendered. Completely rewrote `Header.tsx` to add a full mobile nav drawer with:
   - Two sections: "تسوق" (Shop) and "خدمة العملاء" (Customer Service) with icons
   - All navigation items including new size-guide, track-order, FAQ, policies
   - Account/admin login footer with role-based buttons (logout, admin dashboard)
   - Active state highlighting on current view
   - Smooth close-on-navigate behavior
2. **Build error: duplicate `setView` in HomeView** — Fixed by merging two `useShopStore()` destructuring calls into one
3. **Recently Viewed section not rendering** — Fixed Zustand persist hydration timing issue by separating the recently-viewed fetch into its own `useEffect` with `[recentIds]` dependency instead of `[]`

### New Features Added
1. **Size Guide page** (`SizeGuideView`) — Full page with:
   - Bracelet size table (16-20cm with wrist measurements)
   - Ring size table (10-25 with EU equivalents)
   - 3-step "How to measure" guide
   - Contact/WhatsApp CTAs for help
   - Added to Footer links, mobile menu, and page title map
2. **Quick View modal** (`QuickViewModal` + `QuickViewManager`) — Key PRD feature:
   - Opens on product card hover/click "عرض سريع" button
   - Shows image gallery with thumbnails
   - Full personalization form (name, metal, size, gift box)
   - Quantity selector
   - Add to cart / Buy now / View full details / Wishlist buttons
   - Price calculation with metal addons
   - Managed via new `quickViewSlug` state in Zustand store
3. **Admin order status management** — New API + UI:
   - `PATCH /api/admin/orders/[id]/status` — updates order status with validation
   - Admin orders table now has a "تحديث" column with a Select dropdown for all 8 order statuses
   - Toast feedback on success/failure, auto-refresh of stats
4. **Recently Viewed section on home** — Shows last 4 viewed products with proper hydration-safe fetching

### Styling Improvements
- Mobile menu drawer with burgundy gradient header, rose-gold section dividers, icon-led nav items
- Product card quick view overlay upgraded from passive text to active clickable button with shadow
- Admin orders table enhanced with inline status Select dropdowns
- Size guide page with luxury card layout, step indicators, and brand-consistent styling
- Quick view modal with split-layout (image + info), scrollable info panel, thumbnail strip

### Files Modified/Created
- `src/components/glimoka/Header.tsx` — Complete rewrite with mobile menu drawer
- `src/components/glimoka/views/HomeView.tsx` — Recently viewed section + hydration fix
- `src/components/glimoka/views/InfoViews.tsx` — Added `SizeGuideView`
- `src/components/glimoka/ProductCard.tsx` — Quick view button integration
- `src/components/glimoka/QuickViewModal.tsx` — NEW: Quick view modal component
- `src/components/glimoka/QuickViewManager.tsx` — NEW: Quick view state manager
- `src/components/glimoka/views/AdminView.tsx` — Order status update UI
- `src/app/api/admin/orders/[id]/status/route.ts` — NEW: Order status PATCH API
- `src/lib/store.ts` — Added `quickViewSlug`, `openQuickView`, `closeQuickView`, `size-guide` view type
- `src/app/page.tsx` — Added SizeGuideView + QuickViewManager
- `src/components/glimoka/Footer.tsx` — Added size-guide link

### Verification Results
- ✅ Lint clean (0 errors, 0 warnings)
- ✅ No runtime/console errors
- ✅ Mobile menu opens and navigates correctly (tested on 390x844 viewport)
- ✅ Size Guide page renders with all sections
- ✅ Quick View modal opens from product card with full personalization form
- ✅ Admin order status update works (PENDING → CONFIRMED, toast "تم تحديث حالة الطلب")
- ✅ Recently Viewed section shows on home after browsing products
- ✅ All 8 order statuses available in admin dropdown

### Image Generation Status
- Hero, 4 categories, 3 brand images: ✅ Complete (7/7)
- Product images: 5/24 complete — auto-restart wrapper continues in background
- All images use luxury jewelry photography on cream backgrounds matching GLIMOKA brand

### Next Phase Recommendations
1. Complete remaining product images (19/24)
2. Add loyalty points redemption at checkout
3. Add product search with AI semantic recommendations
4. Add abandoned cart recovery flow
5. Add admin product CRUD (add/edit/delete products)
6. Add customer order history with re-order functionality
7. Add email notification templates (order confirmation, shipping)

---

## Task ID: 8 — Cron Round 2: Loyalty System + Admin CRUD + Semantic Search + Re-order (Completed by review agent)

**Trigger:** Recurring cron job (webDevReview, every 15 min)

**Work Log:**

### QA Findings
- ✅ Lint clean (0 errors, 0 warnings)
- ✅ No runtime/console errors after fresh reload
- ✅ All views render correctly (home, products, cart, checkout, admin)
- ✅ Mobile menu, quick view, size guide all functional from Round 1
- 🔄 Image generation continues (6/24 product images complete)

### New Features Added

#### 1. Loyalty Points System (Full lifecycle)
- **Store additions**: `loyaltyBalance`, `useLoyaltyPoints`, `setLoyaltyBalance`, `addLoyalty`, `setUseLoyaltyPoints` — persisted to localStorage
- **Utility helpers** (`src/lib/utils.ts`): `calcLoyaltyEarn()` (1 point per 10 EGP), `calcLoyaltyDiscount()` (1 point = 1 EGP, max 30% of subtotal)
- **Cart view**: Loyalty redemption checkbox showing balance, max discount, and live discount application. Separate display of coupon discount vs loyalty discount. "Will earn X points" indicator near total.
- **Checkout view**: Loyalty discount shown in order summary. On order completion, used points are deducted and newly earned points are added to balance.
- **Account view**: Loyalty balance displayed from store (not recalculated from orders)
- **Verified**: 150 points → enabled → 135 EGP discount (30% of 450) → total 345 EGP ✓

#### 2. Admin Product CRUD
- **New API**: `GET/POST/PATCH/DELETE /api/admin/products` — full CRUD with validation
  - POST creates product with image, validates slug uniqueness
  - PATCH updates allowed fields with type coercion
  - DELETE removes product and its images
- **New component**: `AdminProducts.tsx` — product management interface
  - Product list with thumbnails, badges, stock indicators (color-coded)
  - Search/filter by name or slug
  - "New Product" button opens form dialog
  - Edit (pencil) and Delete (trash) actions per product
  - Full form dialog with: name, slug, shortDesc, description, price, comparePrice, stock, category, material, image URL, and 4 flag checkboxes (featured/bestseller/new/sale)
- **Admin integration**: New "المنتجات" tab in admin dashboard
- **Verified**: Created test product "سوار اختبار" → saved to DB → toast "تم إضافة المنتج" → cleaned up ✓

#### 3. AI Semantic Search
- **New API**: `GET /api/search/semantic?q=` — LLM-powered product matching
  - First tries fast keyword matching
  - If <3 keyword matches, uses z-ai-web-dev-sdk LLM to semantically match products (e.g., "هدية خطوبة" → engagement ring, heart necklace, dual-name bracelet)
  - Merges keyword + semantic results, dedupes
  - Graceful fallback to keyword-only on API errors
- **ProductsView integration**: When searching without a category filter, uses semantic search endpoint instead of keyword-only `/api/products`
- **Verified**: Searched "هدية خطوبة" → returned 6 relevant products (engagement ring, heart necklace, dual-name bracelet, gold pieces) ✓

#### 4. Re-order from Order History
- **AccountView**: Each order card now has a "إعادة الطلب" (Re-order) button
  - Adds all items from the past order back to cart with their original customizations
  - Shows toast confirmation and navigates to cart
- **Verified**: Re-order button appears on order cards, uses original metal/size/name customizations

### Styling Improvements
- Loyalty redemption card with rose-gold accent border, gift icon, live discount badge
- Cart summary separates coupon vs loyalty discounts with distinct colors (emerald vs burgundy)
- "Will earn" loyalty indicator with sparkles icon in rose-gold tinted box
- Admin products list with color-coded stock badges (red ≤10, amber ≤20, green >20)
- Admin product form dialog with organized grid layout, flag checkboxes in 4-column grid
- Re-order button with rotate icon in burgundy outline style

### Files Modified/Created
- `src/lib/store.ts` — Added loyalty state (loyaltyBalance, useLoyaltyPoints) + actions, persisted
- `src/lib/utils.ts` — Added LOYALTY_EARN_RATE, LOYALTY_REDEEM_RATE, calcLoyaltyEarn, calcLoyaltyDiscount
- `src/components/glimoka/views/CartView.tsx` — Loyalty redemption UI + summary breakdown + earn indicator
- `src/components/glimoka/views/CheckoutView.tsx` — Loyalty discount in summary + points deduction/earning on order
- `src/components/glimoka/views/AccountView.tsx` — Loyalty balance from store + re-order button
- `src/components/glimoka/views/ProductsView.tsx` — Semantic search integration
- `src/components/glimoka/views/AdminView.tsx` — Added Products tab
- `src/components/glimoka/AdminProducts.tsx` — NEW: Admin product CRUD component with form dialog
- `src/app/api/admin/products/route.ts` — NEW: Product CRUD API (GET/POST/PATCH/DELETE)
- `src/app/api/search/semantic/route.ts` — NEW: AI semantic search API

### Verification Results
- ✅ Lint clean (0 errors, 0 warnings)
- ✅ No runtime errors
- ✅ Loyalty redemption: 150 pts → 135 EGP discount → total 345 EGP (verified via agent-browser)
- ✅ Admin product creation: "سوار اختبار" saved to DB, toast confirmed, cleaned up
- ✅ Semantic search: "هدية خطوبة" → 6 relevant products returned
- ✅ Re-order button appears on order history cards
- ✅ All existing features still working (mobile menu, quick view, size guide, admin orders)

### Image Generation Status
- Hero, 4 categories, 3 brand images: ✅ Complete (7/7)
- Product images: 6/24 complete — auto-restart wrapper continues in background

### Next Phase Recommendations
1. Complete remaining product images (18/24)
2. Add abandoned cart recovery (WhatsApp reminder after 1h/24h)
3. Add admin coupon CRUD (create/edit/delete coupons)
4. Add customer address book management
5. Add product reviews moderation in admin
6. Add wishlist → cart move functionality
7. Add email notification templates
8. Add sales analytics reports (by period, category, customer)

---

## Task ID: 9 — Cron Round 3: Admin Coupon CRUD + Reviews Moderation + Sales Reports + Wishlist→Cart (Completed by review agent)

**Trigger:** Recurring cron job (webDevReview, every 15 min)

**Work Log:**

### QA Findings
- ✅ Lint clean (0 errors, 0 warnings)
- ✅ No runtime/console errors
- ✅ All Round 1 & 2 features verified working (mobile menu, quick view, size guide, loyalty, admin products, semantic search, re-order)
- 🔄 Image generation continues (6/24 product images complete)

### New Features Added

#### 1. Admin Coupon CRUD (Full management)
- **New API**: `GET/POST/PATCH/DELETE /api/admin/coupons` — full CRUD with validation
  - POST creates coupon with code uniqueness check, type/value/minOrder/maxDiscount/usageLimit/perCustomerLimit/dateRange
  - PATCH updates allowed fields (cannot change code)
  - DELETE removes coupon and its usages
- **New component**: `AdminCoupons.tsx` — coupon management interface
  - Grid of coupon cards with dashed rose-gold borders, showing code, type, value, min order, usage progress bar, end date with expiry indicator
  - Toggle active/inactive with a single click
  - "New Coupon" button opens form dialog
  - Edit/delete actions per coupon
  - Full form dialog: code, type (4 types), value, minOrder, maxDiscount, usageLimit, perCustomerLimit, start/end dates, active switch
- **Replaced** the static read-only coupons tab with the new interactive AdminCoupons component
- **Verified**: Created "SUMMER25" coupon → toast "تم إنشاء الكوبون" → appeared in list → cleaned up ✓

#### 2. Admin Reviews Moderation
- **New API**: `GET/PATCH/DELETE /api/admin/reviews` — moderation with product rating recalculation
  - GET supports status filter (pending/approved/all), includes product info
  - PATCH approves/rejects review, recalculates product aggregate rating
  - DELETE removes review and recalculates product rating
- **New component**: `AdminReviews.tsx` — reviews moderation interface
  - Three filter tabs: قيد الانتظار (pending) / مُوافق عليها (approved) / الكل (all)
  - Review cards with product thumbnail, author, star rating, title, body, date
  - Approve/un-approve/delete actions per review
  - Color-coded status badges (amber for pending, emerald for approved)
- **Added** new "المراجعات" tab to admin dashboard
- **Verified**: Approved reviews show with "إلغاء الموافقة" button, pending shows "موافقة" button ✓

#### 3. Sales Analytics Reports
- **New API**: `GET /api/admin/reports?type=sales-by-category|sales-by-day|top-customers|top-products&days=N`
  - sales-by-category: aggregates order items by product category (revenue + count)
  - sales-by-day: daily revenue and order count over N days
  - top-customers: top 10 by total spend
  - top-products: top 10 by revenue
- **New component**: `AdminReports.tsx` — analytics dashboard
  - 4 report type cards (category pie, daily line, top products bars, top customers table)
  - Period selector: 7/30/90 days
  - Sales-by-category: Pie chart + legend with revenue and count
  - Sales-by-day: Line chart with revenue + orders (dual lines)
  - Top products: Ranked list with progress bars
  - Top customers: Table with rank, name, phone, order count, total spent
- **Added** new "التقارير" tab to admin dashboard
- **Verified**: 90-day report shows 880 EGP bracelet sales, top products list renders ✓

#### 4. Wishlist → Cart Move
- **New component**: `WishlistCard.tsx` — dedicated wishlist item card
  - Product image, name, rating, price with discount badge
  - "نقل للسلة" (Move to cart) button — adds to cart with default customization and removes from wishlist
  - Remove (X) button to remove from wishlist without adding to cart
  - Animated entry/exit with framer-motion
- **AccountView wishlist tab enhanced**:
  - "نقل الكل للسلة" (Move all to cart) bulk action button
  - Item count indicator
  - Uses WishlistCard instead of ProductCard for wishlist-specific actions
- **Verified**: Added 2 products to wishlist → clicked "نقل للسلة" → toast "تم نقل 'خاتم التوقيع الروديوم' للسلة" → cart has 1 item, wishlist has 1 remaining ✓

### Styling Improvements
- Admin tabs now wrap on smaller screens (flex-wrap h-auto) to accommodate 6 tabs
- Coupon cards with dashed borders, usage progress bars (red >80%), expiry indicators
- Reviews with color-coded status (amber pending, emerald approved), product thumbnails
- Reports with 4-card type selector, period toggle, pie/line/bar chart visualizations
- Wishlist cards with remove (X) button, move-to-cart CTA, heart icon indicator
- Loading spinner in reports (border-3 rotating)

### Files Modified/Created
- `src/app/api/admin/coupons/route.ts` — NEW: Coupon CRUD API
- `src/app/api/admin/reviews/route.ts` — NEW: Reviews moderation API with rating recalc
- `src/app/api/admin/reports/route.ts` — NEW: Sales analytics reports API (4 report types)
- `src/components/glimoka/AdminCoupons.tsx` — NEW: Coupon management UI with form dialog
- `src/components/glimoka/AdminReviews.tsx` — NEW: Reviews moderation UI
- `src/components/glimoka/AdminReports.tsx` — NEW: Analytics dashboard with charts
- `src/components/glimoka/WishlistCard.tsx` — NEW: Wishlist item card with move-to-cart
- `src/components/glimoka/views/AdminView.tsx` — Added 3 new tabs (coupons replaced, reviews, reports), Star import
- `src/components/glimoka/views/AccountView.tsx` — Wishlist tab uses WishlistCard + "move all" bulk action

### Verification Results
- ✅ Lint clean (0 errors, 0 warnings)
- ✅ No runtime errors
- ✅ Coupon CRUD: Created SUMMER25 → toast confirmed → cleaned up
- ✅ Reviews moderation: Approved reviews show with un-approve/delete actions
- ✅ Sales reports: 90-day category report shows 880 EGP, top products renders
- ✅ Wishlist → cart: Moved item, cart increased, wishlist decreased, toast confirmed
- ✅ All 6 admin tabs functional (Orders, Products, Inventory, Coupons, Reviews, Reports)
- ✅ All existing features still working

### Admin Dashboard Now Has 6 Tabs
1. الطلبات (Orders) — order list with status update dropdowns
2. المنتجات (Products) — full CRUD with form dialog
3. المخزون (Inventory) — low-stock alerts
4. الكوبونات (Coupons) — full CRUD with form dialog
5. المراجعات (Reviews) — moderation (approve/reject/delete)
6. التقارير (Reports) — 4 analytics report types with charts

### Image Generation Status
- Hero, 4 categories, 3 brand images: ✅ Complete (7/7)
- Product images: 6/24 complete — auto-restart wrapper continues in background

### Next Phase Recommendations
1. Complete remaining product images (18/24)
2. Add customer address book management (CRUD multiple addresses)
3. Add abandoned cart recovery (WhatsApp reminder after 1h/24h)
4. Add email notification templates (order confirmation, shipping, review request)
5. Add product comparison feature
6. Add gift card purchase flow
7. Add advanced product filtering (by metal, size, color with URL params)
8. Add customer reviews on product page with photo upload



