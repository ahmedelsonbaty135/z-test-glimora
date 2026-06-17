# GLIMOKA — Supabase Setup Guide

## الخطوة 1: تشغيل SQL Schema

1. افتح Supabase Dashboard: https://supabase.com/dashboard/project/nhcrwxotomtnnardlzuq/sql/new
2. انسخ محتوى ملف `supabase/schema.sql` بالكامل
3. الصقه في SQL Editor واضغط **Run**

هذا سينشئ كل الجداول + بيانات أولية (فئات، كوبونات، بانرات، إعدادات، مستخدم أدمن)

## الخطوة 2: تشغيل Seed Script (لإضافة المنتجات)

```bash
cd /home/z/my-project
bun run supabase/seed.ts
```

هذا سيضيف:
- 12 منتج (أساور، قلائد، خواتم)
- 27 صورة منتج
- 6 مراجعات

## الخطوة 3: الوصول للوحة الأدمن

### طرق الدخول للوحة الأدمن (سرية — غير مرئطة للعامة):

1. **URL Hash**: أضف `#admin` للرابط — مثال: `https://yoursite.com/#admin`
2. **Keyboard Shortcut**: اضغط `Ctrl+Shift+A` في أي وقت
3. الرابط يُمسح تلقائيًا بعد الدخول للأمان

### كود الأدمن السري:
- الافتراضي: `glimoka-admin-2024`
- يمكن تغييره من: لوحة الأدمن → تبويب الإعدادات → كود الأدمن السري
- الكود يُحفظ في `sessionStorage` (يُمسح عند إغلاق المتصفح)

## الخطوة 4: صلاحيات الأدمن الكاملة

لوحة الأدمن تتيح لك التحكم الكامل في:

| التبويب | الصلاحيات |
|---------|-----------|
| **الطلبات** | عرض، تصفية، تحديث حالة الطلب (8 حالات) |
| **المنتجات** | إضافة، تعديل، حذف منتجات |
| **الفئات** | إضافة، تعديل، حذف فئات |
| **المخزون** | تنبيهات المخزون المنخفض |
| **الكوبونات** | إضافة، تعديل، حذف كوبونات |
| **المراجعات** | موافقة، رفض، حذف مراجعات |
| **البانرات** | إضافة، تعديل، حذف بانرات |
| **التقارير** | تحليلات المبيعات (4 أنواع) |
| **الإعدادات** | تغيير كل إعدادات المتجر + كود الأدمن |

## الأمان

### تأمين الموقع المُطبّق:

1. **Row Level Security (RLS)** — مُفعّل على كل الجداول في Supabase
2. **Admin Authentication** — كل API للأدمن يتطلب كود سري في الهيدر
3. **Rate Limiting** — منع spam:
   - 5 طلبات في الدقيقة لإنشاء الطلبات
   - 3 مراجعات في الدقيقة
   - 10 محاولات كوبون في الدقيقة
   - 20 رسالة AI في الدقيقة
4. **XSS Protection** — كل المدخلات تُنظّف من HTML/JS
5. **Input Validation** — تحقق من الهاتف المصري، البريد الإلكتروني، حدود الأرقام
6. **CSP Headers** — Content Security Policy صارم
7. **Security Headers**:
   - `X-Frame-Options: DENY` (منع clickjacking)
   - `X-Content-Type-Options: nosniff`
   - `Strict-Transport-Security` (HSTS)
   - `Referrer-Policy`
   - `Permissions-Policy`
8. **Hidden Admin** — صفحة الأدمن غير مرئطة في القوائم العامة

## متغيرات البيئة

```env
NEXT_PUBLIC_SUPABASE_URL=https://nhcrwxotomtnnardlzuq.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_9QYyvhQWC-w1xOeR_ymnBA_nOxnOLvL
```

## استكشاف الأخطاء

### "Could not find the table" 
→ لم يتم تشغيل `schema.sql` — اذهب لـ Supabase SQL Editor وشغّله

### "كود الأدمن غير صحيح"
→ الكود الافتراضي: `glimoka-admin-2024` — يمكن تغييره من الإعدادات

### المنتجات فارغة
→ شغّل `bun run supabase/seed.ts` لإضافة المنتجات
