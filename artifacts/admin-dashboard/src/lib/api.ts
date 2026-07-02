export async function adminFetch(path: string, options: RequestInit = {}) {
  const pwd = localStorage.getItem('callverify_admin_password');
  
  const headers = new Headers(options.headers);
  if (pwd) {
    headers.set('X-Admin-Password', pwd);
  }
  
  if (options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(path, {
    ...options,
    headers
  });

  if (response.status === 401) {
    localStorage.removeItem('callverify_admin_password');
    window.location.href = '/';
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
