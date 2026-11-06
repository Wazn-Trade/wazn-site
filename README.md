# wazn-site

موقع **wazn.trade**: صفحة Wazn Screen بالعربي (`/`) وبالإنجليزي (`/en/`). الموقع static بالكامل، والـ build step الوحيد بيجيب الـ brand tokens من `@wazn-trade/brand` وبيعمل bundle لملف واحد minified.

## التشغيل محليًا

```bash
# Authenticate npm against GH Packages (one-off; needs read:packages).
export GITHUB_TOKEN=ghp_…
export NODE_AUTH_TOKEN="$GITHUB_TOKEN"

npm ci                        # يجيب @wazn-trade/brand
npm run build                 # sync-brand + bundle-css
python3 -m http.server 8080   # http://localhost:8080
```

خلال التطوير، `npm run sync-brand` بينسخ `tokens.css` و`components.css` من `node_modules/@wazn-trade/brand/`. `npm run bundle-css` بيدمج `tokens + site` في `bundle.css` واحد minified (بـ lightningcss). الـ `components.css` بيفضل منفصل عشان أي منتج Wazn تاني يقدر يستخدمه من غير ما يجر layout الموقع معاه.

لو مش شايف الـ `@wazn-trade/brand` publish ده وعايز تشتغل محلي، استخدم:

```bash
npm install file:../wazn-brand
```

## النشر على Cloudflare Pages

1. ارفع الفولدر ده كـ repo اسمه `wazn-site` على `github.com/Wazn-Trade`.
2. في Cloudflare: Workers & Pages → Create → Pages → Connect to Git → اختار `Wazn-Trade/wazn-site`.
3. الإعدادات:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `/`
   - Environment variables: `NODE_AUTH_TOKEN` = PAT with `read:packages` scope on `Wazn-Trade` (ضروري عشان يقدر يجيب `@wazn-trade/brand` من GH Packages)
4. بعد أول deploy: Custom domains → ضيف `wazn.trade` و`www.wazn.trade`. الدومين على Cloudflare Registrar، فالـ DNS بيتظبط تلقائيًا.

الخطوات بالتفصيل، ومعاها إعداد الإيميل `hello@wazn.trade`، في `../setup/CLOUDFLARE.md`.

## الملفات

| المسار | الدور |
| --- | --- |
| `index.html` | الصفحة العربي (RTL)، وهي الافتراضية |
| `en/index.html` | الصفحة الإنجليزي |
| `404.html` | Cloudflare Pages بيعرضها تلقائيًا لأي صفحة مش موجودة |
| `_headers` | Security headers وcache لملفات الـ assets |
| `robots.txt`، `sitemap.xml` | للـ SEO (بالروابط البديلة للغتين) |
| `assets/css/tokens.css`، `components.css` | منسوخين تلقائيًا من `@wazn-trade/brand` عن طريق `npm run sync-brand`. ما تعدلهمش هنا |
| `assets/css/site.css` | تخطيط الصفحة (source of truth) |
| `assets/css/bundle.css` | منتج `npm run bundle-css` — `tokens + site` مدموجين وmin — بيترفع مع Pages، مش مع git |
| `assets/img/og.png` | الصورة اللي بتظهر لما اللينك يتشارك (1200×630) |

## ملاحظات

- **قائمة الانتظار** حاليًا لينك `mailto:hello@wazn.trade`، فلازم تفعّل Cloudflare Email Routing الأول (الخطوات في `setup/CLOUDFLARE.md`). ولما تحب تجمع الإيميلات في form، أبسط طريقة Cloudflare Pages Function مع D1.
- كود الـ API والـ MCP اللي في الصفحة **Preview**: `api.wazn.trade` لسه مش عايش، لكن المكتبة `wazn-screen` اتبنت تحت `wazn-screen/` ولسه مش منشورة على PyPI — snippet الـ `uvx` بيفترض النشر.
- السهم `ACME` في الأمثلة وهمي. ما تحطش سهم حقيقي بحالة شرعية إلا لو جاية من الـ engine فعلًا.

## Accessibility

- **Contrast audit (2026-11):** all text pairs in use meet WCAG AA (most AAA) on both themes. Full measured table in `wazn-brand/BRAND_BOOK.md` §4. Key site-level results:
  - Body text (`ink` on `surface-0`): 18.88:1 light, 17.47:1 dark — AAA.
  - Links / accents (`brass-text`): 7.50:1 light, 10.49:1 dark — AAA.
  - Raw `brass` (3.11:1 light, 8.31:1 dark) is used only for fills, borders and 24px+ type, never body text. Verified in `assets/css/site.css`.
- **Skip link:** `<a class="skip-link" href="#main">` on both `index.html` files, targeted to `<main id="main">`.
- **Reduced motion:** `prefers-reduced-motion: reduce` zeros the motion-token durations (`--anim-*`) in `tokens.css`.
