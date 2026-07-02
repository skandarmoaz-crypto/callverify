import { useState, useEffect } from 'react';
import { useSettings, useUpdateSettings } from '@/hooks/use-queries';
import { Layout } from '@/components/layout';
import { useToast } from '@/hooks/use-toast';
import { Phone, Save, Settings2, RefreshCcw } from 'lucide-react';

export default function Settings() {
  const { data, isLoading, error } = useSettings();
  const updateMutation = useUpdateSettings();
  const { toast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (data?.receiving_phone_number) {
      setPhoneNumber(data.receiving_phone_number);
      setDirty(false);
    }
  }, [data]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    try {
      await updateMutation.mutateAsync({ receiving_phone_number: phoneNumber.trim() });
      setDirty(false);
      toast({ title: 'تم الحفظ', description: 'تم تحديث الإعدادات بنجاح.' });
    } catch {
      toast({ variant: 'destructive', title: 'خطأ', description: 'تعذر حفظ الإعدادات.' });
    }
  };

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">الإعدادات</h1>
        <p className="text-muted-foreground mt-2">إدارة إعدادات نظام CallVerify الأساسية.</p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground gap-3">
          <RefreshCcw size={20} className="animate-spin" />
          <span>جاري تحميل الإعدادات...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl">
          حدث خطأ أثناء تحميل الإعدادات.
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border bg-muted/30 flex items-center gap-3">
              <div className="p-2 bg-primary/10 text-primary rounded-lg"><Phone size={20} /></div>
              <div>
                <h2 className="font-semibold text-foreground">رقم الهاتف المستقبِل</h2>
                <p className="text-sm text-muted-foreground">الرقم الذي يتصل به المستخدمون لإتمام التحقق من هويتهم.</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">رقم الهاتف (بصيغة دولية)</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => { setPhoneNumber(e.target.value); setDirty(true); }}
                  placeholder="+249XXXXXXXXX"
                  dir="ltr"
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary transition"
                  data-testid="input-phone-number"
                />
                <p className="text-xs text-muted-foreground">مثال: +249912345678 — يجب أن يبدأ بـ + ورمز البلد.</p>
              </div>
              <div className="bg-muted/40 border border-border rounded-lg p-4 text-sm space-y-2">
                <p className="font-semibold text-foreground flex items-center gap-2"><Settings2 size={14} className="text-primary" />كيف يعمل هذا الرقم؟</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground leading-relaxed">
                  <li>يطلب موقعك من المستخدم التحقق عبر API.</li>
                  <li>يظهر للمستخدم هذا الرقم مع تعليمات الاتصال.</li>
                  <li>يتصل المستخدم من رقم هاتفه بهذا الرقم.</li>
                  <li>يستقبل تطبيق Android المكالمة ويرسلها للـ API تلقائياً.</li>
                  <li>تُعلَّم الجلسة بـ "تم التحقق" فوراً.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={updateMutation.isPending || !dirty} data-testid="button-save-settings" className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all shadow-md shadow-primary/20 active:scale-95">
              {updateMutation.isPending ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</span>
            </button>
          </div>
        </form>
      )}
    </Layout>
  );
}
