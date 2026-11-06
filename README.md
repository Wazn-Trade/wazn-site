# wazn-site

موقع **wazn.trade**: صفحة Wazn Screen بالعربي (`/`) وبالإنجليزي (`/en/`). الموقع static بالكامل، من غير build step ولا JavaScript غير سطر واحد بيختار الثيم الفاتح أو الغامق حسب إعدادات جهاز الزائر.

## التشغيل محليًا

```bash
python3 -m http.server 8080   # http://localhost:8080
```

## النشر على Cloudflare Pages

1. ارفع الفولدر ده كـ repo اسمه `wazn-site` على `github.com/Wazn-Trade`.
2. في Cloudflare: Workers & Pages → Create → Pages → Connect to Git → اختار `Wazn-Trade/wazn-site`.
3. الإعدادات: Framework preset = **None**، وBuild command = (فاضي)، وBuild output directory = `/`.
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
| `assets/css/tokens.css`، `components.css` | منسوخين من `wazn-brand`. لو اتغيروا هناك، انسخهم هنا تاني |
| `assets/css/site.css` | تخطيط الصفحة |
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
