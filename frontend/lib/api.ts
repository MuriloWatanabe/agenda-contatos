const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export interface Contact {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, options);
  if (res.status === 204) return undefined as T;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const api = {
  getContacts: (page = 1, pageSize = 10) =>
    request<PagedResult<Contact>>(`/api/contacts?page=${page}&pageSize=${pageSize}`),

  createContact: (name: string, phone: string) =>
    request<Contact>('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone }),
    }),

  updateContact: (id: string, name: string, phone: string) =>
    request<Contact>(`/api/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone }),
    }),

  deleteContact: (id: string) =>
    request<void>(`/api/contacts/${id}`, { method: 'DELETE' }),
};
