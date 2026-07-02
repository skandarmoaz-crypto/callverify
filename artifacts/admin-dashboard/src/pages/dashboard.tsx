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
