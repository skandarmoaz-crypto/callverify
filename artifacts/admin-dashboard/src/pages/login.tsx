import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { ShieldAlert } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Test the password by fetching stats
      const res = await fetch('/api/admin/stats', {
        headers: { 'X-Admin-Password': password }
      });
      
      if (res.ok) {
        login(password);
        setLocation('/dashboard');
      } else {
        setError('كلمة المرور غير صحيحة');
      }
    } catch (err) {
      setError('تعذر الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Decorative background blur */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-card/80 backdrop-blur-xl border border-border rounded-xl shadow-2xl overflow-hidden z-10 relative">
        <div className="p-8 text-center border-b border-border bg-muted/20">
          <div className="inline-flex items-center justify-center bg-primary/10 border border-primary/20 p-4 rounded-2xl text-primary mb-4 shadow-inner shadow-primary/20">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">CallVerify</h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">لوحة التحكم الإدارية</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm text-center font-medium animate-in fade-in zoom-in-95">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">كلمة المرور الإدارية</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background/50 border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
              placeholder="••••••••"
              dir="ltr"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'جاري التحقق...' : 'دخول الغرفة الآمنة'}
          </button>
        </form>
      </div>
    </div>
  );
}
