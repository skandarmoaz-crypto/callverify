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

import { useStats } from '@/hooks/use-queries';
import { Layout } from '@/components/layout';
import { Activity, CheckCircle, Clock, KeyRound, XCircle } from 'lucide-react';

export default function Dashboard() {
  const { data, isLoading, error } = useStats();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground animate-pulse space-y-4">
          <Activity size={32} className="opacity-50" />
          <p>جاري تحميل الإحصاءات...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg font-medium">
          حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.
        </div>
      </Layout>
    );
  }

  const stats = [
    { title: 'إجمالي الجلسات', value: data?.sessions?.total || '0', icon: Activity, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
    { title: 'تم التحقق', value: data?.sessions?.verified || '0', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
    { title: 'قيد الانتظار', value: data?.sessions?.pending || '0', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { title: 'منتهية', value: data?.sessions?.expired || '0', icon: XCircle, color: 'text-gray-500', bg: 'bg-gray-500/10 border-gray-500/20' },
    { title: 'مفاتيح API', value: data?.api_keys?.total || '0', icon: KeyRound, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
  ];

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">لوحة الإحصاءات</h1>
        <p className="text-muted-foreground mt-2">نظرة عامة على نشاط نظام التحقق اللحظي.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
            <div className={`p-3 rounded-xl w-fit border transition-colors ${stat.bg} ${stat.color} group-hover:bg-opacity-20`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-3xl font-bold text-foreground mt-1 tabular-nums tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
