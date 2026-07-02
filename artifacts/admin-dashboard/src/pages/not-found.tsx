import { Link } from 'wouter';
import { ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-4 text-center" dir="rtl">
      <div className="bg-primary/10 p-4 rounded-2xl text-primary mb-6">
        <ShieldAlert size={48} />
      </div>
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground mt-2 mb-6">الصفحة التي تبحث عنها غير موجودة.</p>
      <Link href="/" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all">
        العودة للرئيسية
      </Link>
    </div>
  );
}
