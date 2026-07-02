import { useState } from 'react';
import { useSessions } from '@/hooks/use-queries';
import { Layout } from '@/components/layout';
import { formatDate } from '@/lib/format';
import { ChevronLeft, ChevronRight, RefreshCcw } from 'lucide-react';

export default function Sessions() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, refetch } = useSessions(page);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20 shadow-sm">تم التحقق</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-sm">قيد الانتظار</span>;
      case 'expired':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-500 border border-gray-500/20 shadow-sm">منتهية</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border shadow-sm">{status}</span>;
    }
  };

  return (
    <Layout>
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">سجل الجلسات</h1>
          <p className="text-muted-foreground mt-2">تتبع جميع محاولات التحقق وحالاتها بالتفصيل.</p>
        </div>
        <button 
          onClick={() => refetch()} 
          className="flex items-center gap-2 px-4 py-2 border border-border bg-card hover:bg-muted text-foreground rounded-lg transition-colors w-fit"
          disabled={isFetching}
        >
          <RefreshCcw size={16} className={isFetching ? "animate-spin opacity-50" : ""} />
          <span className="text-sm font-medium">تحديث البيانات</span>
        </button>
      </header>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden relative">
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <RefreshCcw size={24} className="animate-spin text-primary" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">الرقم التعريفي</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">رقم الهاتف</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">الحالة</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">مفتاح API</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">تاريخ الإنشاء</th>
                <th className="px-6 py-4 font-semibold whitespace-nowrap">وقت التحقق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCcw size={24} className="animate-spin text-primary/50" />
                      <span>جاري تحميل الجلسات...</span>
                    </div>
                  </td>
                </tr>
              ) : data?.sessions?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                    لا توجد جلسات حتى الآن.
                  </td>
                </tr>
              ) : (
                data?.sessions?.map((session: any) => (
                  <tr key={session.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground whitespace-nowrap">{session.id?.slice(0, 8)}...</td>
                    <td className="px-6 py-4 font-mono whitespace-nowrap" dir="ltr">{session.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(session.status)}</td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{session.api_key_name || '—'}</td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{formatDate(session.created_at)}</td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{session.verified_at ? formatDate(session.verified_at) : '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              صفحة {data.page} من {data.pages} — إجمالي {data.total} جلسة
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
