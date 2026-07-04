import { Router, type IRouter } from "express";

const router: IRouter = Router();

const DOCS_HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>CallVerify API — توثيق</title>
<style>
  body { font-family: -apple-system, "Segoe UI", Tahoma, Arial, sans-serif; max-width: 860px; margin: 0 auto; padding: 32px 20px 80px; line-height: 1.7; color: #1a1a1a; background: #fafafa; }
  h1 { font-size: 26px; margin-bottom: 4px; }
  h2 { font-size: 19px; margin-top: 40px; border-bottom: 2px solid #22c55e; padding-bottom: 6px; }
  p.sub { color: #666; margin-top: 0; }
  .card { background: #fff; border: 1px solid #e5e5e5; border-radius: 10px; padding: 18px 20px; margin: 14px 0; }
  .method { display: inline-block; font-weight: 700; font-size: 12px; padding: 3px 10px; border-radius: 6px; margin-inline-end: 8px; }
  .get { background: #dbeafe; color: #1d4ed8; }
  .post { background: #dcfce7; color: #15803d; }
  code, pre { direction: ltr; text-align: left; font-family: "SF Mono", Menlo, Consolas, monospace; }
  pre { background: #0f172a; color: #e2e8f0; padding: 14px 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
  code.inline { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
  th, td { text-align: right; border-bottom: 1px solid #eee; padding: 6px 8px; }
  .tabs { display: flex; gap: 6px; margin-bottom: 10px; }
  .tabs button { border: none; background: #eee; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; }
  .tabs button.active { background: #22c55e; color: #fff; }
  .lang-block { display: none; }
  .lang-block.active { display: block; }
</style>
</head>
<body>

<h1>CallVerify API</h1>
<p class="sub">توثيق مباشر للربط الخارجي (Verification via missed/incoming call) — نسخة عربي / English</p>

<div class="card">
  <strong>كيف يعمل النظام؟ / How it works</strong>
  <ol>
    <li>موقعك يطلب جلسة تحقق برقم هاتف المستخدم عبر <code class="inline">POST /api/sessions</code>.</li>
    <li>الخادم يرجع رقماً يجب على المستخدم الاتصال به (<code class="inline">call_number</code>).</li>
    <li>تطبيق CallVerify على هاتف صاحب رقم الاستقبال يرصد المكالمة الواردة تلقائياً ويبلغ الخادم.</li>
    <li>موقعك يستعلم عن حالة الجلسة عبر <code class="inline">GET /api/sessions/:id</code> حتى تصبح <code class="inline">verified</code>.</li>
  </ol>
</div>

<h2>المصادقة / Authentication</h2>
<div class="card">
  أرسل رأس <code class="inline">Authorization: Bearer &lt;API_KEY&gt;</code> مع كل طلب. يمكن الحصول على مفتاح API من لوحة التحكم (صفحة المطوّرين).
</div>

<h2>POST /api/sessions</h2>
<div class="card">
  <div><span class="method post">POST</span><code class="inline">/api/sessions</code></div>
  <p>إنشاء جلسة تحقق جديدة لرقم هاتف.</p>
  <table>
    <tr><th>الحقل</th><th>النوع</th><th>الوصف</th></tr>
    <tr><td><code class="inline">phone</code></td><td>string (required)</td><td>رقم الهاتف المراد التحقق منه، مثال: <code class="inline">+249912345678</code></td></tr>
  </table>
  <p><strong>مثال الطلب:</strong></p>
  <pre>{
  "phone": "+249912345678"
}</pre>
  <p><strong>مثال الاستجابة (201):</strong></p>
  <pre>{
  "id": "d7a7b471-...",
  "phone": "+249912345678",
  "status": "pending",
  "expires_in_seconds": 900,
  "call_number": "+249XXXXXXXXX",
  "instructions": { "ar": "...", "en": "..." }
}</pre>
</div>

<h2>GET /api/sessions/:id</h2>
<div class="card">
  <div><span class="method get">GET</span><code class="inline">/api/sessions/:id</code></div>
  <p>الاستعلام عن حالة جلسة تحقق موجودة.</p>
  <p><strong>مثال الاستجابة (200):</strong></p>
  <pre>{
  "id": "d7a7b471-...",
  "phone": "+249912345678",
  "status": "verified",
  "verified_at": "2026-07-04T22:35:10.000Z",
  "expires_at": "2026-07-04T22:45:10.000Z"
}</pre>
  <p>قيمة <code class="inline">status</code> تكون واحدة من: <code class="inline">pending</code> | <code class="inline">verified</code> | <code class="inline">expired</code></p>
</div>

<h2>أمثلة تكامل / Integration examples</h2>
<div class="card">
  <div class="tabs">
    <button class="active" onclick="showTab('curl', this)">curl</button>
    <button onclick="showTab('js', this)">JavaScript</button>
    <button onclick="showTab('py', this)">Python</button>
  </div>

  <div id="tab-curl" class="lang-block active">
<pre># 1. إنشاء جلسة تحقق
curl -X POST https://YOUR-DOMAIN/api/sessions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"phone": "+249912345678"}'

# 2. الاستعلام عن الحالة
curl https://YOUR-DOMAIN/api/sessions/SESSION_ID \\
  -H "Authorization: Bearer YOUR_API_KEY"</pre>
  </div>

  <div id="tab-js" class="lang-block">
<pre>const res = await fetch('https://YOUR-DOMAIN/api/sessions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ phone: '+249912345678' })
});
const session = await res.json();
console.log('اطلب من المستخدم الاتصال بـ:', session.call_number);

const poll = setInterval(async () => {
  const r = await fetch(\`https://YOUR-DOMAIN/api/sessions/\${session.id}\`, {
    headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
  });
  const s = await r.json();
  if (s.status === 'verified') { clearInterval(poll); console.log('تم التحقق!'); }
  if (s.status === 'expired')  { clearInterval(poll); console.log('انتهت المدة.'); }
}, 3000);</pre>
  </div>

  <div id="tab-py" class="lang-block">
<pre>import requests, time

API_KEY = "YOUR_API_KEY"
BASE_URL = "https://YOUR-DOMAIN"

res = requests.post(
    f"{BASE_URL}/api/sessions",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={"phone": "+249912345678"}
)
session = res.json()
print("اطلب من المستخدم الاتصال بـ:", session["call_number"])

while True:
    time.sleep(3)
    r = requests.get(
        f"{BASE_URL}/api/sessions/{session['id']}",
        headers={"Authorization": f"Bearer {API_KEY}"}
    )
    s = r.json()
    if s["status"] == "verified":
        print("تم التحقق بنجاح!")
        break
    if s["status"] == "expired":
        print("انتهت مدة الجلسة.")
        break</pre>
  </div>
</div>

<h2>أخطاء شائعة / Common errors</h2>
<div class="card">
  <table>
    <tr><th>Status</th><th>السبب</th></tr>
    <tr><td>401</td><td>مفتاح API مفقود أو غير صحيح</td></tr>
    <tr><td>400</td><td>حقل <code class="inline">phone</code> مفقود من الطلب</td></tr>
    <tr><td>404</td><td>الجلسة غير موجودة، أو تخص مفتاح API آخر</td></tr>
  </table>
</div>

<script>
function showTab(name, btn) {
  document.querySelectorAll('.lang-block').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tabs button').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
}
</script>

</body>
</html>`;

const DOCS_JSON = {
  name: "CallVerify API",
  description: {
    ar: "نظام تحقق من هوية المستخدم عبر مكالمة هاتفية واردة",
    en: "Phone-call-based identity verification system",
  },
  authentication: "Authorization: Bearer <API_KEY>",
  endpoints: [
    {
      method: "POST",
      path: "/api/sessions",
      auth: "Bearer API Key",
      description: { ar: "إنشاء جلسة تحقق جديدة", en: "Create a new verification session" },
      request_body: { phone: "+249912345678" },
      response_example: {
        id: "uuid",
        phone: "+249912345678",
        status: "pending",
        expires_in_seconds: 900,
        call_number: "+249XXXXXXXXX",
        instructions: { ar: "...", en: "..." },
      },
    },
    {
      method: "GET",
      path: "/api/sessions/:id",
      auth: "Bearer API Key",
      description: { ar: "الاستعلام عن حالة الجلسة", en: "Check verification session status" },
      response_example: {
        id: "uuid",
        phone: "+249912345678",
        status: "pending | verified | expired",
        verified_at: "timestamp | null",
        expires_at: "timestamp",
      },
    },
  ],
};

router.get("/docs", (req, res) => {
  if (req.headers.accept?.includes("application/json") || req.query.format === "json") {
    res.json(DOCS_JSON);
    return;
  }
  res.set("Content-Type", "text/html; charset=utf-8").send(DOCS_HTML);
});

export default router;
