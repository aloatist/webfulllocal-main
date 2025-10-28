import type { NavigationMenu, NavigationMenuItem } from './types';

const API_BASE = '/api/navigation';

async function handleResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => undefined);
  if (!response.ok) {
    const message = (payload as { error?: string } | undefined)?.error ?? response.statusText;
    throw new Error(message || 'Navigation request failed');
  }
  return payload as T;
}

function buildInit(method: string, body?: unknown): RequestInit {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  return {
    method,
    headers,
    cache: 'no-store',
    body: body ? JSON.stringify(body) : undefined,
  };
}

export async function fetchMenus() {
  const response = await fetch(`${API_BASE}/menus`, buildInit('GET'));
  const payload = await handleResponse<{ menus: NavigationMenu[] }>(response);
  return payload.menus;
}

export async function createMenu(payload: {
  name: string;
  description?: string;
  isDefault?: boolean;
}): Promise<NavigationMenu> {
  const response = await fetch(`${API_BASE}/menus`, buildInit('POST', payload));
  return handleResponse<NavigationMenu>(response);
}

export async function updateMenu(id: string, payload: Partial<{ name: string; description?: string | null; isDefault?: boolean }>): Promise<NavigationMenu> {
  const response = await fetch(`${API_BASE}/menus/${id}`, buildInit('PATCH', payload));
  return handleResponse<NavigationMenu>(response);
}

export async function deleteMenu(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/menus/${id}`, buildInit('DELETE'));
  await handleResponse<{ success: boolean }>(response);
}

export async function createMenuItem(payload: {
  menuId: string;
  parentId?: string | null;
  label: string;
  href: string;
  icon?: string | null;
  target?: string | null;
  order?: number;
  isActive?: boolean;
  roles?: string[];
}): Promise<NavigationMenuItem> {
  const response = await fetch(`${API_BASE}/items`, buildInit('POST', payload));
  return handleResponse<NavigationMenuItem>(response);
}

export async function updateMenuItem(id: string, payload: Partial<{ label: string; href: string; icon?: string | null; target?: string | null; order?: number; isActive?: boolean; roles?: string[]; parentId?: string | null }>): Promise<NavigationMenuItem> {
  const response = await fetch(`${API_BASE}/items/${id}`, buildInit('PATCH', payload));
  return handleResponse<NavigationMenuItem>(response);
}

export async function deleteMenuItem(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/items/${id}`, buildInit('DELETE'));
  await handleResponse<{ success: boolean }>(response);
}
