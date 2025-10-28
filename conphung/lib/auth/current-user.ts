import {
  createAuthorizedHeaders,
  getApiBaseUrl,
  includeCredentials,
} from '@/lib/attendance/api';

export interface UserRolePermission {
  id: string;
  code: string;
  name: string;
}

export interface CurrentUserRole {
  id: string;
  code: string;
  name: string;
  permissions: UserRolePermission[];
}

export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  status: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  roles: CurrentUserRole[];
}

interface ApiError extends Error {
  status?: number;
  cause?: unknown;
}

function toError(message: string, cause: unknown, status?: number): ApiError {
  const error = new Error(message) as ApiError & { cause?: unknown };
  error.status = status;
  error.cause = cause;
  return error;
}

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
    method: 'GET',
    headers: createAuthorizedHeaders(),
    cache: 'no-store',
    credentials: includeCredentials ? 'include' : 'omit',
  });

  const payload = await response.json().catch(() => undefined);

  if (!response.ok) {
    const message = (payload as { message?: string } | undefined)?.message ?? response.statusText;
    throw toError(message || 'Không thể tải thông tin người dùng', payload, response.status);
  }

  if (!payload) {
    throw toError('Máy chủ không trả thông tin người dùng', undefined, response.status);
  }

  return payload as CurrentUser;
}
