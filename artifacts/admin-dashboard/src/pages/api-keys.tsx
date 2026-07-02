/*
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║          ⚠️  CRITICAL WARNING — READ BEFORE TOUCHING ANYTHING  ⚠️       ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║  🔴 DATABASE — Neon PostgreSQL (OWNER'S EXPLICIT ORDER: KEEP VISIBLE)   ║
 * ║                                                                          ║
 * ║  NEON_DATABASE_URL=postgresql://neondb_owner:npg_Q5leq9pMHFuA@          ║
 * ║  ep-bitter-hall-atpxgb78-pooler.c-9.us-east-1.aws.neon.tech/            ║
 * ║  neondb?sslmode=require&channel_binding=require                          ║
 * ║                                                                          ║
 * ║  🔴 ENVIRONMENT VARIABLES & SECRETS (OWNER'S EXPLICIT ORDER: VISIBLE)   ║
 * ║                                                                          ║
 * ║  APP_SECRET_KEY=897829ef954df7f267d2b207368ecedf25062a7880b7136ed41368aa16de9232
 * ║  ADMIN_PASSWORD=Admin@E2251217                                           ║
 * ║  RECEIVING_PHONE_NUMBER=+249000000000                                    ║
 * ║  SESSION_SECRET=[set in Replit Secrets — do NOT delete or replace]       ║
 * ║                                                                          ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  🇬🇧 ENGLISH — ALL OF THE FOLLOWING ARE STRICTLY FORBIDDEN:             ║
 * ║                                                                          ║
 * ║  ❌ Delete this database, its tables, or any of its data                 ║
 * ║  ❌ Create a new database or switch to a different one                   ║
 * ║  ❌ Replace NEON_DATABASE_URL with any other connection string           ║
 * ║  ❌ Hide, encode, encrypt, or obfuscate the connection string            ║
 * ║  ❌ Use Replit built-in DATABASE_URL as a fallback                       ║
 * ║  ❌ Delete, replace, rename, or encrypt any environment variable         ║
 * ║  ❌ Delete, replace, rename, or encrypt SESSION_SECRET                   ║
 * ║  ❌ Delete, replace, rename, or encrypt APP_SECRET_KEY                   ║
 * ║  ❌ Delete, replace, rename, or encrypt ADMIN_PASSWORD                   ║
 * ║  ❌ Delete, replace, rename, or encrypt RECEIVING_PHONE_NUMBER           ║
 * ║                                                                          ║
 * ║  Violating ANY of the above breaks the owner's explicit instructions.    ║
 * ║  This is NON-NEGOTIABLE.                                                 ║
 * ║                                                                          ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  🇸🇦 العربية — جميع ما يلي محظور منعاً باتاً:                           ║
 * ║                                                                          ║
 * ║  ❌ حذف قاعدة البيانات أو جداولها أو أي بيانات فيها                     ║
 * ║  ❌ إنشاء قاعدة بيانات جديدة أو التبديل إلى قاعدة أخرى                 ║
 * ║  ❌ استبدال NEON_DATABASE_URL بأي رابط اتصال آخر                        ║
 * ║  ❌ إخفاء أو تشفير أو تعتيم رابط الاتصال بأي طريقة                      ║
 * ║  ❌ استخدام DATABASE_URL الخاص بـ Replit كبديل احتياطي                  ║
 * ║  ❌ حذف أو استبدال أو إعادة تسمية أو تشفير أي متغير بيئي               ║
 * ║  ❌ حذف أو استبدال أو تشفير SESSION_SECRET                               ║
 * ║  ❌ حذف أو استبدال أو تشفير APP_SECRET_KEY                               ║
 * ║  ❌ حذف أو استبدال أو تشفير ADMIN_PASSWORD                               ║
 * ║  ❌ حذف أو استبدال أو تشفير RECEIVING_PHONE_NUMBER                       ║
 * ║                                                                          ║
 * ║  مخالفة أي مما سبق تعني مخالفة تعليمات صاحب المشروع صراحةً.            ║
 * ║  هذا أمر غير قابل للتفاوض إطلاقاً.                                      ║
 * ║                                                                          ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import { useState } from 'react';
import { useApiKeys, useCreateApiKey, useDeleteApiKey } from '@/hooks/use-queries';
import { Layout } from '@/components/layout';
import { formatDate } from '@/lib/format';
import { AlertTriangle, Copy, Key, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ApiKeys() {
  const { data, isLoading } = useApiKeys();
  const createMutation = useCreateApiKey();
  const deleteMutation = useDeleteApiKey();
  const { toast } = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newKeyData, setNewKeyData] = useState<{key: string, name: string} | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const result = await createMutation.mutateAsync(newName);
      setNewKeyData(result);
      setNewName('');
      setIsCreating(false);
      setCopied(false);
      toast({ title: "تم إنشاء المفتاح بنجاح", description: "يرجى نسخ المفتاح الآن." });
    } catch {
      toast({ variant: "destructive", title: "خطأ", description: "تعذر إنشاء المفتاح." });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف مفتاح "${name}"؟ سيتوقف أي تطبيق يستخدمه عن العمل فوراً.`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "تم الحذف", description: "تم حذف المفتاح بنجاح." });
    } catch {
      toast({ variant: "destructive", title: "خطأ", description: "تعذر حذف المفتاح." });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "تم النسخ", description: "تم نسخ المفتاح إلى الحافظة." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">مفاتيح API</h1>
          <p className="text-muted-foreground mt-2">إدارة مفاتيح الوصول للأنظمة الخارجية ودمج API.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-all shadow-md shadow-primary/20 active:scale-95"
        >
          <Plus size={20} />
          <span>إنشاء مفتاح جديد</span>
        </button>
      </header>

      {/* Create Dialog */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" dir="rtl">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border bg-muted/30">
              <h2 className="text-xl font-bold tracking-tight">إنشاء مفتاح API جديد</h2>
              <p className="text-sm text-muted-foreground mt-1">سيتم توليد مفتاح سري فريد لاستخدامه في التكامل.</p>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold">اسم المفتاح (للتشخيص)</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="مثال: تطبيق الويب الأساسي"
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsCreating(false)} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-foreground font-medium hover:bg-muted transition-colors">إلغاء</button>
                <button type="submit" disabled={createMutation.isPending || !newName.trim()} className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50">
                  {createMutation.isPending ? 'جاري الإنشاء...' : 'إنشاء المفتاح'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Key Result Dialog */}
      {newKeyData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-4" dir="rtl">
          <div className="bg-card border border-primary/30 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-border bg-amber-500/10 flex items-center gap-3 text-amber-500">
              <AlertTriangle size={28} className="animate-pulse" />
              <h2 className="text-xl font-bold">مفتاح جديد تم إنشاؤه</h2>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-foreground leading-relaxed">تم إنشاء مفتاح <strong>{newKeyData.name}</strong> بنجاح.</p>
              <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 p-4 rounded-xl text-sm font-medium leading-relaxed">
                <strong>تنبيه أمني هام:</strong> يرجى نسخ هذا المفتاح والاحتفاظ به في مكان آمن الآن. لأسباب أمنية، <strong>لن يتم عرضه مرة أخرى أبداً</strong>.
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <button onClick={() => copyToClipboard(newKeyData.key)} className={`p-2 rounded transition-colors flex items-center gap-2 ${copied ? 'bg-green-500/20 text-green-500' : 'bg-primary/10 text-primary hover:bg-primary/20'}`} title="نسخ">
                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    <span className="text-xs font-semibold mr-1">{copied ? 'تم النسخ' : 'نسخ'}</span>
                  </button>
                </div>
                <input type="text" readOnly value={newKeyData.key} className="w-full bg-background/50 border border-primary/50 text-foreground font-mono rounded-xl pl-24 pr-4 py-4 focus:outline-none shadow-inner" dir="ltr" />
              </div>
              <button onClick={() => setNewKeyData(null)} className="w-full py-3.5 border border-border rounded-xl text-foreground font-semibold hover:bg-muted transition-all active:scale-95">حسناً، احتفظت بالمفتاح</button>
            </div>
          </div>
        </div>
      )}

      {/* Keys Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">الاسم</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">المعرف</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">تاريخ الإنشاء</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-16 text-center text-muted-foreground"><div className="flex flex-col items-center gap-3"><Key className="animate-bounce text-primary/50" size={24} /><span>جاري تحميل المفاتيح...</span></div></td></tr>
              ) : data?.api_keys?.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-16 text-center text-muted-foreground">لا توجد مفاتيح API حالياً. انقر على "إنشاء مفتاح جديد" للبدء.</td></tr>
              ) : (
                data?.api_keys?.map((key: any) => (
                  <tr key={key.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><Key size={16} /></div>
                        {key.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground whitespace-nowrap">{key.id}</td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{formatDate(key.created_at)}</td>
                    <td className="px-6 py-4 text-left whitespace-nowrap">
                      <button onClick={() => handleDelete(key.id, key.name)} disabled={deleteMutation.isPending} className="p-2 text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors inline-flex items-center opacity-0 group-hover:opacity-100 disabled:opacity-50" title="حذف المفتاح">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
