-- GLIMOKA — Supabase Schema
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/nhcrwxotomtnnardlzuq/sql/new)
-- This creates all tables matching the Prisma schema

-- ========== EXTENSIONS ==========
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========== USERS ==========
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  password_hash TEXT,
  role TEXT DEFAULT 'CUSTOMER',
  birthday TEXT,
  avatar TEXT,
  city TEXT,
  governorate TEXT,
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ========== ADDRESSES ==========
CREATE TABLE IF NOT EXISTS addresses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  details TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- ========== CATEGORIES ==========
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  icon TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========== PRODUCTS ==========
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_desc TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id),
  base_price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  metal_options TEXT NOT NULL,
  size_options TEXT NOT NULL,
  font_options TEXT NOT NULL,
  is_personalizable BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_best_seller BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  is_on_sale BOOLEAN DEFAULT false,
  stock INTEGER DEFAULT 50,
  rating DECIMAL(2,1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  sold_count INTEGER DEFAULT 0,
  material TEXT,
  color TEXT,
  gift_box_price DECIMAL(10,2) DEFAULT 50,
  gift_card_price DECIMAL(10,2) DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON products(is_best_seller);

-- ========== PRODUCT IMAGES ==========
CREATE TABLE IF NOT EXISTS product_images (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  "order" INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- ========== ORDERS ==========
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_number TEXT UNIQUE NOT NULL,
  user_id TEXT REFERENCES users(id),
  guest_name TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  guest_email TEXT,
  governorate TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  payment_method TEXT DEFAULT 'COD',
  status TEXT DEFAULT 'PENDING',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  coupon_code TEXT,
  loyalty_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- ========== ORDER ITEMS ==========
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  metal TEXT,
  size TEXT,
  font TEXT,
  name1 TEXT,
  name2 TEXT,
  gift_box BOOLEAN DEFAULT false,
  gift_card TEXT,
  customization_json TEXT
);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ========== COUPONS ==========
CREATE TABLE IF NOT EXISTS coupons (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  value DECIMAL(10,2) DEFAULT 0,
  min_order DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  per_customer_limit INTEGER,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS coupon_usages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  coupon_id TEXT NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id TEXT,
  order_id TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_coupon_usages_coupon_id ON coupon_usages(coupon_id);

-- ========== REVIEWS ==========
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id),
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  title TEXT,
  body TEXT NOT NULL,
  photos_json TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);

-- ========== WISHLIST ==========
CREATE TABLE IF NOT EXISTS wishlist (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- ========== NOTIFICATIONS ==========
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- ========== BANNERS ==========
CREATE TABLE IF NOT EXISTS banners (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT,
  cta_text TEXT,
  cta_link TEXT,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========== SETTINGS ==========
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ========== ROW LEVEL SECURITY (RLS) ==========
-- Enable RLS on all tables for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read policies (catalog is public)
DROP POLICY IF EXISTS "Public read categories" ON categories;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read product_images" ON product_images;
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read reviews_approved" ON reviews;
CREATE POLICY "Public read reviews_approved" ON reviews FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Public read banners_active" ON banners;
CREATE POLICY "Public read banners_active" ON banners FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Public read settings" ON settings;
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read coupons_active" ON coupons;
CREATE POLICY "Public read coupons_active" ON coupons FOR SELECT USING (is_active = true);

-- Allow operations via service role / anon (app uses service role on server)
DROP POLICY IF EXISTS "Allow anon insert orders" ON orders;
CREATE POLICY "Allow anon insert orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon select orders" ON orders;
CREATE POLICY "Allow anon select orders" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon update orders" ON orders;
CREATE POLICY "Allow anon update orders" ON orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon insert order_items" ON order_items;
CREATE POLICY "Allow anon insert order_items" ON order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon select order_items" ON order_items;
CREATE POLICY "Allow anon select order_items" ON order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow anon insert reviews" ON reviews;
CREATE POLICY "Allow anon insert reviews" ON reviews FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update reviews" ON reviews;
CREATE POLICY "Allow anon update reviews" ON reviews FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon delete reviews" ON reviews;
CREATE POLICY "Allow anon delete reviews" ON reviews FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow anon insert coupon_usages" ON coupon_usages;
CREATE POLICY "Allow anon insert coupon_usages" ON coupon_usages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon insert products" ON products;
CREATE POLICY "Allow anon insert products" ON products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update products" ON products;
CREATE POLICY "Allow anon update products" ON products FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon delete products" ON products;
CREATE POLICY "Allow anon delete products" ON products FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow anon insert product_images" ON product_images;
CREATE POLICY "Allow anon insert product_images" ON product_images FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon delete product_images" ON product_images;
CREATE POLICY "Allow anon delete product_images" ON product_images FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow anon insert categories" ON categories;
CREATE POLICY "Allow anon insert categories" ON categories FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update categories" ON categories;
CREATE POLICY "Allow anon update categories" ON categories FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon delete categories" ON categories;
CREATE POLICY "Allow anon delete categories" ON categories FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow anon insert coupons" ON coupons;
CREATE POLICY "Allow anon insert coupons" ON coupons FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update coupons" ON coupons;
CREATE POLICY "Allow anon update coupons" ON coupons FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon delete coupons" ON coupons;
CREATE POLICY "Allow anon delete coupons" ON coupons FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow anon insert banners" ON banners;
CREATE POLICY "Allow anon insert banners" ON banners FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update banners" ON banners;
CREATE POLICY "Allow anon update banners" ON banners FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon delete banners" ON banners;
CREATE POLICY "Allow anon delete banners" ON banners FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow anon insert settings" ON settings;
CREATE POLICY "Allow anon insert settings" ON settings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon update settings" ON settings;
CREATE POLICY "Allow anon update settings" ON settings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow anon delete settings" ON settings;
CREATE POLICY "Allow anon delete settings" ON settings FOR DELETE USING (true);

-- ========== SEED DATA ==========
-- Categories
INSERT INTO categories (id, name, slug, description, icon, "order") VALUES
  ('cat_bracelets', 'أساور', 'bracelets', 'أساور شخصية بأسماء مخصصة', 'Circle', 1),
  ('cat_necklaces', 'قلائد', 'necklaces', 'قلائد فاخرة بأسماء وتصاميم مخصصة', 'Heart', 2),
  ('cat_rings', 'خواتم', 'rings', 'خواتم شخصية بكل المقاسات', 'CircleDot', 3),
  ('cat_offers', 'عروض', 'offers', 'أقوى العروض الموسمية', 'Tag', 4)
ON CONFLICT (slug) DO NOTHING;

-- Settings
INSERT INTO settings (key, value) VALUES
  ('storeName', 'GLIMOKA'),
  ('whatsappNumber', '201000000000'),
  ('freeShippingThreshold', '1000'),
  ('codEnabled', 'true'),
  ('loyaltyRate', '10'),
  ('instagramUrl', 'https://instagram.com/glimoka'),
  ('facebookUrl', 'https://facebook.com/glimoka'),
  ('tiktokUrl', 'https://tiktok.com/@glimoka'),
  ('adminAccessCode', 'glimoka-admin-2024')
ON CONFLICT (key) DO NOTHING;

-- Admin user
INSERT INTO users (id, email, name, phone, role) VALUES
  ('user_admin', 'admin@glimoka.com', 'GLIMOKA Admin', '+201000000000', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Coupons
INSERT INTO coupons (id, code, type, value, min_order, usage_limit, starts_at, ends_at, is_active) VALUES
  ('cpn_welcome10', 'WELCOME10', 'PERCENTAGE', 10, 0, 1000, '2026-01-01', '2027-12-31', true),
  ('cpn_glimoka50', 'GLIMOKA50', 'FIXED', 50, 500, 500, '2026-01-01', '2027-12-31', true),
  ('cpn_freeship', 'FREESHIP', 'FREE_SHIPPING', 0, 0, 2000, '2026-01-01', '2027-12-31', true),
  ('cpn_valentine15', 'VALENTINE15', 'PERCENTAGE', 15, 800, 300, '2026-01-01', '2027-12-31', true)
ON CONFLICT (code) DO NOTHING;

-- Banners
INSERT INTO banners (id, title, subtitle, cta_text, cta_link, is_active, "order") VALUES
  ('bnr_1', 'تشكيلة المجوهرات المخصصة', 'أساور وقلائد وخواتم بأسماء من تحب — صُنعت خصيصًا لك', 'تسوق الآن', 'products', true, 1),
  ('bnr_2', 'عرض الحب — خصم 15%', 'على كل القلائد والأساور المزدوجة لفترة محدودة', 'اكتشف العروض', 'offers', true, 2)
ON CONFLICT DO NOTHING;
