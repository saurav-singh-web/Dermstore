// src/utils/auth.ts
export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('seller_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}