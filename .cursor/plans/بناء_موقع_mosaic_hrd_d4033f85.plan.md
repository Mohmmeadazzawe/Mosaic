---
name: بناء موقع Mosaic HRD
overview: بناء موقع Mosaic HRD من الصفر باستخدام Next.js مع App Router، بدءاً ببناء الصفحات ببيانات وهمية وروابط صور من الموقع الأصلي، ثم ربط APIs لاحقاً.
todos:
  - id: setup-nextjs
    content: إعداد مشروع Next.js جديد مع TypeScript و App Router
    status: completed
  - id: setup-config
    content: إعداد next.config.js للسماح بتحميل الصور من mosaic-hrd.org وإنشاء ملف constants.ts لروابط الصور
    status: completed
    dependencies:
      - setup-nextjs
  - id: setup-i18n
    content: إعداد نظام اللغات (i18n) مع دعم العربية والإنجليزية وإنشاء ملفات الترجمات
    status: completed
    dependencies:
      - setup-nextjs
  - id: create-layout
    content: بناء Layout الأساسي (Header, Footer, Navigation, LanguageSwitcher) مع دعم اللغتين
    status: completed
    dependencies:
      - setup-nextjs
      - setup-i18n
  - id: create-mock-data
    content: إنشاء ملف mockData.ts يحتوي على بيانات وهمية لجميع الصفحات
    status: completed
    dependencies:
      - setup-config
  - id: build-homepage
    content: بناء الصفحة الرئيسية مع جميع الأقسام (Hero, Services, Projects, Statistics, Partners)
    status: completed
    dependencies:
      - create-layout
      - create-mock-data
  - id: build-about
    content: بناء صفحة من نحن
    status: completed
    dependencies:
      - create-layout
      - create-mock-data
  - id: build-projects
    content: بناء صفحة قائمة المشاريع وصفحة تفاصيل المشروع
    status: completed
    dependencies:
      - create-layout
      - create-mock-data
  - id: build-activities
    content: بناء صفحة قائمة الأنشطة وصفحة تفاصيل النشاط
    status: completed
    dependencies:
      - create-layout
      - create-mock-data
  - id: build-success-stories
    content: بناء صفحة قصص النجاح وصفحة تفاصيل القصة
    status: completed
    dependencies:
      - create-layout
      - create-mock-data
  - id: build-statistics
    content: بناء صفحة الإحصائيات
    status: completed
    dependencies:
      - create-layout
      - create-mock-data
  - id: build-contact
    content: بناء صفحة التواصل مع النموذج (https://mosaic-hrd.org/contact)
    status: completed
    dependencies:
      - create-layout
      - create-mock-data
  - id: build-reports
    content: بناء صفحة التقارير (https://mosaic-hrd.org/Reports)
    status: completed
    dependencies:
      - create-layout
      - create-mock-data
  - id: build-donations
    content: بناء صفحة التبرعات مع 3 أقسام (عيني، نقدي، وقت) (https://mosaic-hrd.org/Donations)
    status: completed
    dependencies:
      - create-layout
      - create-mock-data
  - id: build-joinus
    content: بناء صفحة انضم إلينا مع نموذج رفع السيرة الذاتية (https://mosaic-hrd.org/Joinus)
    status: completed
    dependencies:
      - create-layout
      - create-mock-data
  - id: add-styling
    content: إضافة الأنماط والتأكد من التصميم المتجاوب مع دعم RTL/LTR
    status: completed
    dependencies:
      - build-homepage
      - build-about
      - build-projects
      - build-activities
      - build-success-stories
      - build-statistics
      - build-contact
      - build-reports
      - build-donations
      - build-joinus
---

# خطة بناء موقع Mosaic HRD من الصفر

## نظرة عامة

إعادة بناء موقع https://mosaic-hrd.org/ باستخدام Next.js 14+ مع App Router. البناء سيكون على مرحلتين: أولاً بناء الواجهات ببيانات وهمية وروابط صور من الموقع الأصلي، ثم ربط APIs لاحقاً.

**المميزات الرئيسية:**

- دعم اللغتين العربية والإنجليزية (i18n)
- جميع الصفحات المطلوبة من الموقع الأصلي
- استخدام روابط الصور مباشرة من الموقع الأصلي

## هيكل المشروع

```
Mozaic/
├── app/
│   ├── [locale]/               # دعم اللغات (ar, en)
│   │   ├── layout.tsx          # Layout الرئيسي
│   │   ├── page.tsx            # الصفحة الرئيسية
│   │   ├── about/
│   │   │   └── page.tsx        # صفحة من نحن
│   │   ├── projects/
│   │   │   ├── page.tsx        # قائمة المشاريع
│   │   │   └── [id]/
│   │   │       └── page.tsx    # تفاصيل المشروع
│   │   ├── activities/
│   │   │   ├── page.tsx        # قائمة الأنشطة
│   │   │   └── [id]/
│   │   │       └── page.tsx    # تفاصيل النشاط
│   │   ├── success-stories/
│   │   │   ├── page.tsx        # قصص النجاح
│   │   │   └── [id]/
│   │   │       └── page.tsx    # تفاصيل قصة النجاح
│   │   ├── statistics/
│   │   │   └── page.tsx        # صفحة الإحصائيات
│   │   ├── reports/
│   │   │   └── page.tsx        # صفحة التقارير
│   │   ├── donations/
│   │   │   └── page.tsx        # صفحة التبرعات
│   │   ├── joinus/
│   │   │   └── page.tsx        # صفحة انضم إلينا
│   │   └── contact/
│   │       └── page.tsx        # صفحة التواصل
│   ├── api/                    # API routes (لاحقاً)
│   └── middleware.ts           # Middleware للتعامل مع اللغات
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # رأس الصفحة
│   │   ├── Footer.tsx          # تذييل الصفحة
│   │   ├── Navigation.tsx      # قائمة التنقل
│   │   └── LanguageSwitcher.tsx # مبدل اللغة
│   ├── sections/
│   │   ├── Hero.tsx            # قسم Hero
│   │   ├── Services.tsx        # قسم الخدمات
│   │   ├── Projects.tsx         # قسم المشاريع
│   │   ├── Statistics.tsx      # قسم الإحصائيات
│   │   ├── Partners.tsx        # قسم الشركاء
│   │   ├── ContactForm.tsx     # نموذج التواصل
│   │   ├── DonationForm.tsx    # نموذج التبرع
│   │   └── JoinUsForm.tsx      # نموذج انضم إلينا
│   └── ui/
│       ├── Button.tsx          # زر قابل لإعادة الاستخدام
│       ├── Card.tsx            # بطاقة
│       └── Image.tsx           # مكون صورة محسّن
├── lib/
│   ├── mockData.ts             # بيانات وهمية مؤقتة
│   ├── constants.ts            # ثوابت (روابط الصور من الموقع الأصلي)
│   └── i18n/
│       ├── config.ts           # إعدادات i18n
│       ├── messages/
│       │   ├── ar.json         # الترجمات العربية
│       │   └── en.json         # الترجمات الإنجليزية
│       └── dictionary.ts       # دالة الحصول على الترجمات
├── public/
│   └── images/                 # صور محلية (إن لزم)
├── styles/
│   └── globals.css             # الأنماط العامة
└── next.config.js              # إعدادات Next.js
```

## الصفحات المطلوبة

### 1. الصفحة الرئيسية (`app/page.tsx`)

- **Hero Section**: صورة رئيسية مع نص ترحيبي
- **قسم الخدمات**: عرض الخدمات الرئيسية
- **قسم المشاريع**: عرض آخر المشاريع (3-6 مشاريع)
- **قسم الإحصائيات**: أرقام وإحصائيات
- **قسم الشركاء**: شعارات الشركاء
- **قسم الأخبار/الأنشطة**: آخر الأنشطة

### 2. صفحة من نحن (`app/about/page.tsx`)

- نبذة عن المؤسسة
- الرؤية والرسالة
- الأهداف
- الفريق (إن وجد)

### 3. صفحة المشاريع (`app/projects/page.tsx`)

- قائمة بجميع المشاريع
- فلترة حسب التصنيف
- بحث
- عرض الشبكة (Grid) أو القائمة

### 4. صفحة تفاصيل المشروع (`app/projects/[id]/page.tsx`)

- معلومات المشروع الكاملة
- صور المشروع
- تفاصيل التنفيذ
- النتائج

### 5. صفحة الأنشطة (`app/activities/page.tsx`)

- قائمة الأنشطة
- فلترة حسب التاريخ/النوع
- عرض تقويمي أو قائمة

### 6. صفحة تفاصيل النشاط (`app/activities/[id]/page.tsx`)

- تفاصيل النشاط الكاملة
- صور/فيديوهات
- الموقع والتاريخ

### 7. صفحة قصص النجاح (`app/success-stories/page.tsx`)

- قائمة قصص النجاح
- فلترة
- عرض بطاقات

### 8. صفحة تفاصيل قصة النجاح (`app/success-stories/[id]/page.tsx`)

- القصة الكاملة
- صور/فيديوهات
- شهادات

### 9. صفحة الإحصائيات (`app/statistics/page.tsx`)

- إحصائيات تفاعلية
- رسوم بيانية
- أرقام رئيسية

### 10. صفحة التواصل (`app/[locale]/contact/page.tsx`)

- نموذج التواصل
- معلومات الاتصال (عنوان، هاتف، بريد)
- خريطة (إن وجدت)
- رابط: https://mosaic-hrd.org/contact

### 11. صفحة التقارير (`app/[locale]/reports/page.tsx`)

- عرض التقارير المتاحة
- فلترة حسب التاريخ/النوع
- إمكانية التحميل أو العرض
- رابط: https://mosaic-hrd.org/Reports

### 12. صفحة التبرعات (`app/[locale]/donations/page.tsx`)

- **قسم التبرع العيني**: معلومات عن التبرع العيني (ملابس، إلكترونيات، أثاث)
- **قسم التبرع النقدي**: معلومات الحسابات البنكية (بنك البركة، بنك سورية الدولي الإسلامي)
- **قسم التبرع بالوقت**: معلومات التسجيل للتبرع بالوقت (خدمات، تدريب، دعم نفسي، دعم تعليمي)
- نموذج التسجيل للتبرع بالوقت
- رابط: https://mosaic-hrd.org/Donations

### 13. صفحة انضم إلينا (`app/[locale]/joinus/page.tsx`)

- نموذج التسجيل مع الحقول التالية:
  - الاسم
  - رقم الهاتف
  - البريد الإلكتروني
  - مجال الدراسة أو الخبرة
  - معلومات إضافية
  - رفع السيرة الذاتية
- رابط: https://mosaic-hrd.org/Joinus

## المكونات المشتركة

### Layout Components

- **Header**: يحتوي على الشعار وقائمة التنقل
- **Footer**: روابط سريعة ومعلومات الاتصال
- **Navigation**: قائمة تنقل متجاوبة
- **LanguageSwitcher**: مبدل اللغة (عربي/إنجليزي)

### Section Components

- **Hero**: قسم رئيسي مع صورة خلفية
- **Services**: عرض الخدمات
- **Projects**: عرض المشاريع
- **Statistics**: عرض الإحصائيات
- **Partners**: عرض الشركاء
- **ContactForm**: نموذج التواصل
- **DonationForm**: نموذج التبرع (للتبرع بالوقت)
- **JoinUsForm**: نموذج انضم إلينا مع رفع الملفات

## إدارة الصور

### استخدام روابط الصور من الموقع الأصلي

- إنشاء ملف `lib/constants.ts` يحتوي على روابط جميع الصور من `https://mosaic-hrd.org/`
- استخدام `next/image` لتحسين الأداء
- إضافة `next.config.js` للسماح بتحميل الصور من النطاق الأصلي
```typescript
// lib/constants.ts
export const IMAGE_BASE_URL = 'https://mosaic-hrd.org';
export const IMAGES = {
  hero: `${IMAGE_BASE_URL}/images/hero.jpg`,
  logo: `${IMAGE_BASE_URL}/images/logo.png`,
  // ... المزيد من الصور
};
```


## البيانات الوهمية (Mock Data)

### ملف `lib/mockData.ts`

- بيانات وهمية لجميع الصفحات
- هيكل البيانات مطابق لهيكل API المتوقع
- يسهل استبدالها لاحقاً بطلبات API
```typescript
// lib/mockData.ts
export const mockProjects = [
  {
    id: 1,
    title: 'اسم المشروع',
    description: '...',
    image: 'https://mosaic-hrd.org/images/project1.jpg',
    // ...
  },
  // ...
];
```


## المرحلة الأولى: البناء بدون APIs

1. **إعداد Next.js**

   - إنشاء مشروع Next.js جديد
   - تثبيت التبعيات الأساسية
   - إعداد TypeScript (إن لزم)

2. **بناء Layout الأساسي**

   - Header و Footer
   - Navigation
   - Layout الرئيسي

3. **بناء الصفحات واحدة تلو الأخرى**

   - كل صفحة ببيانات وهمية
   - استخدام روابط الصور من الموقع الأصلي
   - التركيز على التصميم والواجهة

4. **بناء المكونات المشتركة**

   - مكونات UI قابلة لإعادة الاستخدام
   - مكونات الأقسام

5. **إضافة الأنماط**

   - CSS Modules أو Tailwind CSS
   - تصميم متجاوب (Responsive)

## المرحلة الثانية: ربط APIs (لاحقاً)

1. **إنشاء API Routes** (إن لزم)
2. **استبدال البيانات الوهمية**

   - استبدال `mockData` بطلبات `fetch()`
   - استخدام Server Components

3. **إضافة حالات التحميل والأخطاء**
4. **إضافة التحديث الديناميكي**

## دعم اللغات (i18n)

### إعداد نظام اللغات

- استخدام Next.js Internationalization (i18n)
- دعم اللغتين: العربية (ar) والإنجليزية (en)
- هيكل المجلدات: `app/[locale]/` لكل صفحة
- ملفات الترجمات: `lib/i18n/messages/ar.json` و `en.json`
- Middleware للتعامل مع اختيار اللغة الافتراضية
- مبدل اللغة في Header

### هيكل ملفات الترجمات

```typescript
// lib/i18n/messages/ar.json
{
  "nav": {
    "home": "الرئيسية",
    "projects": "المشاريع",
    "about": "من نحن",
    // ...
  }
}
```

## التقنيات والأدوات

- **Next.js 14+** مع App Router
- **TypeScript** (موصى به)
- **CSS Modules** أو **Tailwind CSS**
- **next/image** لتحسين الصور
- **React Server Components**
- **next-intl** أو **next-i18next** لدعم اللغات

## ملاحظات مهمة

1. **الصور**: جميع الصور ستستخدم روابط مباشرة من `mosaic-hrd.org`
2. **البيانات**: بيانات وهمية في المرحلة الأولى، سيتم استبدالها لاحقاً
3. **التصميم**: يجب أن يكون متجاوباً ويعمل على جميع الأجهزة
4. **الأداء**: استخدام Next.js Image Optimization
5. **SEO**: إضافة Metadata لكل صفحة
6. **اللغات**: دعم كامل للغتين العربية والإنجليزية مع RTL/LTR
7. **الصفحات الإضافية**: 

   - صفحة التقارير: https://mosaic-hrd.org/Reports
   - صفحة التبرعات: https://mosaic-hrd.org/Donations (3 أقسام: عيني، نقدي، وقت)
   - صفحة انضم إلينا: https://mosaic-hrd.org/Joinus (نموذج مع رفع ملفات)
   - صفحة التواصل: https://mosaic-hrd.org/contact

## الخطوات التالية بعد الموافقة

1. إنشاء مشروع Next.js
2. بناء الهيكل الأساسي
3. بناء الصفحات واحدة تلو الأخرى
4. اختبار جميع الصفحات
5. التحضير لربط APIs