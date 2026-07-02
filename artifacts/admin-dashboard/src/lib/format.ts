export function formatDate(isoString: string) {
  if (!isoString) return '—';
  try {
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(isoString));
  } catch (e) {
    return isoString;
  }
}
