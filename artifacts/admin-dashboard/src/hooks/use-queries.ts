import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminFetch } from '@/lib/api';

/* ── Stats ── */
export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => adminFetch('/api/admin/stats'),
    refetchInterval: 10_000,
  });
}

/* ── Sessions ── */
export function useSessions(page = 1) {
  return useQuery({
    queryKey: ['sessions', page],
    queryFn: () => adminFetch(`/api/admin/sessions?page=${page}`),
    refetchInterval: 10_000,
  });
}

/* ── API Keys ── */
export function useApiKeys() {
  return useQuery({
    queryKey: ['api-keys'],
    queryFn: () => adminFetch('/api/admin/api-keys'),
  });
}

export function useCreateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      adminFetch('/api/admin/api-keys', {
        method: 'POST',
        body: JSON.stringify({ name }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['api-keys'] }),
  });
}

export function useDeleteApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/api/admin/api-keys/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['api-keys'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });
}

/* ── Settings ── */
export function useSettings() {
  return useQuery<Record<string, string>>({
    queryKey: ['settings'],
    queryFn: () => adminFetch('/api/admin/settings'),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: Record<string, string>) =>
      adminFetch('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(values),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
}
