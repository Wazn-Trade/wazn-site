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
- كود الـ API والـ MCP اللي في الصفحة **Preview** ومكتوب عليه كده: `api.wazn.trade` والـ package `wazn-screen-mcp` لسه مش موجودين.
- السهم `ACME` في الأمثلة وهمي. ما تحطش سهم حقيقي بحالة شرعية إلا لو جاية من الـ engine فعلًا.
