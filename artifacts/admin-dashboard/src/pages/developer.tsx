import { useState } from 'react';
import { Layout } from '@/components/layout';
import { useSettings } from '@/hooks/use-queries';
import { useApiKeys } from '@/hooks/use-queries';
import { Copy, CheckCircle2, Code2, Globe, Phone, ShieldCheck, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function CodeBlock({ code, language = 'javascript' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({ title: 'تم النسخ', description: 'تم نسخ الكود.' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-border shadow-inner">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/60 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded transition-colors ${
            copied ? 'bg-green-500/20 text-green-500' : 'bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          {copied ? <CheckCircle2 size={13} /> : <Copy size={13} />}
          {copied ? 'تم النسخ' : 'نسخ'}
        </button>
      </div>
      <pre className="p-4 text-sm font-mono leading-relaxed overflow-x-auto bg-background/80 text-foreground whitespace-pre" dir="ltr">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const JS_EXAMPLE = (apiKey: string, phone: string) => `// 1. افتح جلسة تحقق
const res = await fetch('https://your-domain.com/api/sessions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ phone: '${phone}' })
});
const session = await res.json();
console.log('اطلب من المستخدم الاتصال بـ:', session.call_number);

// 2. تحقق من الحالة (polling كل 3 ثواني)
const check = setInterval(async () => {
  const r = await fetch(\`https://your-domain.com/api/sessions/\${session.id}\`, {
    headers: { 'Authorization': 'Bearer ${apiKey}' }
  });
  const s = await r.json();
  if (s.status === 'verified') { clearInterval(check); console.log('تم التحقق!'); }
  if (s.status === 'expired')  { clearInterval(check); console.log('انتهت المدة.'); }
}, 3000);`;

const PYTHON_EXAMPLE = (apiKey: string, phone: string) => `import requests, time

API_KEY = "${apiKey}"
BASE_URL = "https://your-domain.com"

res = requests.post(
    f"{BASE_URL}/api/sessions",
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={"phone": "${phone}"}
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
        break`;

const CURL_EXAMPLE = (apiKey: string) => `# 1. إنشاء جلسة تحقق
curl -X POST https://your-domain.com/api/sessions \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"phone": "+249912345678"}'

# 2. التحقق من حالة الجلسة
curl https://your-domain.com/api/sessions/{SESSION_ID} \\
  -H "Authorization: Bearer ${apiKey}"`;

const ANDROID_EXAMPLE = `// في BroadcastReceiver الخاص بك
val phone = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER)
val appSecret = "YOUR_APP_SECRET_KEY"

lifecycleScope.launch {
    val response = api.reportIncomingCall(
        xAppSecret = appSecret,
        phone = phone
    )
    // response.success == true → تم التحقق
}`;

export default function Developer() {
  const { data: settings } = useSettings();
  const { data: keysData } = useApiKeys();
  const [activeTab, setActiveTab] = useState<'js' | 'python' | 'curl'>('js');

  const receivingPhone = settings?.receiving_phone_number ?? '+249XXXXXXXXX';
  const firstKey = keysData?.api_keys?.[0];
  const exampleApiKey = firstKey ? `${firstKey.name.slice(0, 4)}...` : 'YOUR_API_KEY';
  const examplePhone = '+249912345678';

  const steps = [
    { icon: Globe,       title: 'موقعك يطلب التحقق',         desc: 'يرسل موقعك POST /api/sessions مع رقم هاتف المستخدم.' },
    { icon: Phone,       title: 'المستخدم يتصل',              desc: `يظهر للمستخدم رقم ${receivingPhone} ويتصل منه.` },
    { icon: Zap,         title: 'Android يلتقط المكالمة',     desc: 'تطبيق Android يرصد المكالمة ويرسلها للـ API تلقائياً.' },
    { icon: ShieldCheck, title: 'الجلسة تُعلَّم بـ verified', desc: 'موقعك يتحقق من الحالة ويكمل تسجيل الدخول.' },
  ];

  const endpoints = [
    {
      method: 'POST', path: '/api/sessions',
      auth: 'Bearer API Key', desc: 'إنشاء جلسة تحقق جديدة',
      body: '{ "phone": "+249912345678" }',
      response: '{ "id": "...", "status": "pending", "call_number": "...", "expires_at": "..." }',
    },
    {
      method: 'GET', path: '/api/sessions/:id',
      auth: 'Bearer API Key', desc: 'الاستعلام عن حالة الجلسة',
      body: null,
      response: '{ "id": "...", "status": "verified|pending|expired", "verified_at": "..." }',
    },
    {
      method: 'POST', path: '/api/incoming-call',
      auth: 'X-App-Secret', desc: 'إرسال مكالمة واردة (من Android فقط)',
      body: '{ "phone": "+249912345678" }',
      response: '{ "success": true, "session_id": "..." }',
    },
  ];

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">دليل المطوّر</h1>
        <p className="text-muted-foreground mt-2">كل ما تحتاجه لدمج CallVerify في موقعك أو تطبيقك.</p>
      </header>

      <div className="space-y-8">
        {/* How it works */}
        <section className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-border bg-muted/30">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Zap size={18} className="text-primary" />كيف يعمل النظام؟
            </h2>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col gap-3 p-4 rounded-xl bg-muted/30 border border-border relative">
                <div className="absolute top-4 right-4 text-xs font-bold text-primary/40">{i + 1}</div>
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary w-fit"><step.icon size={20} /></div>
                <p className="font-semibold text-foreground text-sm pr-6">{step.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Code Examples */}
        <section className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-border bg-muted/30">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Code2 size={18} className="text-primary" />أمثلة تطبيقية
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex gap-2 border-b border-border pb-4">
              {(['js', 'python', 'curl'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}>
                  {tab === 'js' ? 'JavaScript' : tab === 'python' ? 'Python' : 'cURL'}
                </button>
              ))}
            </div>
            {activeTab === 'js'     && <CodeBlock language="javascript" code={JS_EXAMPLE(exampleApiKey, examplePhone)} />}
            {activeTab === 'python' && <CodeBlock language="python"     code={PYTHON_EXAMPLE(exampleApiKey, examplePhone)} />}
            {activeTab === 'curl'   && <CodeBlock language="bash"       code={CURL_EXAMPLE(exampleApiKey)} />}
          </div>
        </section>

        {/* API Endpoints */}
        <section className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-border bg-muted/30">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Code2 size={18} className="text-primary" />نقاط النهاية (Endpoints)
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {endpoints.map((ep, i) => (
              <div key={i} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                    ep.method === 'GET'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-green-500/10 text-green-400 border border-green-500/20'
                  }`}>{ep.method}</span>
                  <span className="font-mono text-foreground text-sm" dir="ltr">{ep.path}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{ep.auth}</span>
                </div>
                <p className="text-sm text-muted-foreground">{ep.desc}</p>
                {ep.body && (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">الطلب (Body):</p>
                    <pre className="text-xs font-mono bg-muted/40 border border-border rounded-lg p-3 overflow-x-auto" dir="ltr">{ep.body}</pre>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">الاستجابة:</p>
                  <pre className="text-xs font-mono bg-muted/40 border border-border rounded-lg p-3 overflow-x-auto" dir="ltr">{ep.response}</pre>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Android Integration */}
        <section className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-border bg-muted/30">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Phone size={18} className="text-primary" />تكامل تطبيق Android
            </h2>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              تطبيق Android يستمع للمكالمات الواردة ويرسلها للـ API باستخدام <span className="font-mono text-foreground">X-App-Secret</span>:
            </p>
            <CodeBlock language="kotlin" code={ANDROID_EXAMPLE} />
            <div className="bg-muted/40 border border-border rounded-lg p-4 text-sm space-y-1">
              <p className="font-semibold text-foreground">المتطلبات في AndroidManifest.xml:</p>
              <pre className="text-xs font-mono text-muted-foreground mt-2" dir="ltr">{`<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.READ_CALL_LOG" />`}</pre>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
