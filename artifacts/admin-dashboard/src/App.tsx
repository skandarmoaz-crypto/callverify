import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { useEffect } from 'react';
import { AuthContext, useAuth, useAuthState } from '@/hooks/use-auth';

import Login     from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import Sessions  from '@/pages/sessions';
import ApiKeys   from '@/pages/api-keys';
import Settings  from '@/pages/settings';
import Developer from '@/pages/developer';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

function RedirectTo({ to }: { to: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => { setLocation(to); }, [setLocation, to]);
  return null;
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <RedirectTo to="/" />;
  return <Component />;
}

function Router() {
  const { isAuthenticated } = useAuth();
  return (
    <Switch>
      <Route path="/">
        {isAuthenticated ? <RedirectTo to="/dashboard" /> : <Login />}
      </Route>
      <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
      <Route path="/sessions"><ProtectedRoute component={Sessions} /></Route>
      <Route path="/api-keys"><ProtectedRoute component={ApiKeys} /></Route>
      <Route path="/settings"><ProtectedRoute component={Settings} /></Route>
      <Route path="/developer"><ProtectedRoute component={Developer} /></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const authValue = useAuthState();
  return (
    <AuthContext.Provider value={authValue}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}

export default App;
