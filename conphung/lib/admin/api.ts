import {
  createAuthorizedHeaders,
  getApiBaseUrl,
  includeCredentials,
} from '@/lib/attendance/api';

const API_BASE_URL = getApiBaseUrl();

function buildUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

interface ApiError extends Error {
  status?: number;
  cause?: unknown;
}

function toError(message: string, cause?: unknown, status?: number): ApiError {
  const error = new Error(message) as ApiError & { cause?: unknown };
  error.status = status;
  error.cause = cause;
  return error;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => undefined);

  if (!response.ok) {
    const message = (payload as { message?: string } | undefined)?.message ?? response.statusText;
    throw toError(message || 'Yêu cầu API thất bại', payload, response.status);
  }

  if (payload === undefined) {
    throw toError('Máy chủ không trả dữ liệu', undefined, response.status);
  }

  return payload as T;
}

function createRequestInit(body?: unknown, method = 'GET'): RequestInit {
  const init: RequestInit = {
    method,
    headers: createAuthorizedHeaders(
      method === 'GET' ? undefined : { 'Content-Type': 'application/json' },
    ),
    cache: 'no-store',
    credentials: includeCredentials ? 'include' : 'omit',
  };

  if (body !== undefined && method !== 'GET') {
    init.body = JSON.stringify(body);
  }

  return init;
}

export type UserStatus = 'active' | 'pending' | 'suspended';

export interface AdminPermission {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminRole {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  permissions: AdminPermission[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  roles: AdminRole[];
}

export interface AdminToken {
  id: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    status: string;
  };
  createdAt: string;
  expiresAt: string;
  userAgent: string | null;
  ip: string | null;
  expired: boolean;
}

export interface PaginatedUsersResponse {
  data: AdminUser[];
  meta: {
    total: number;
  };
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  fullName: string;
  status?: UserStatus;
  roleCodes?: string[];
}

export type UpdateUserPayload = Partial<CreateUserPayload>;

export interface CreateRolePayload {
  code: string;
  name: string;
  description?: string;
  permissionCodes?: string[];
}

export type UpdateRolePayload = Partial<CreateRolePayload>;

export interface RolesListResponse {
  data: AdminRole[];
  total: number;
}

export interface CreatePermissionPayload {
  code: string;
  name: string;
  description?: string;
}

export type UpdatePermissionPayload = Partial<CreatePermissionPayload>;

export async function fetchUsers(query?: UserQueryParams): Promise<PaginatedUsersResponse> {
  const searchParams = new URLSearchParams();

  if (query?.page) {
    searchParams.set('page', String(query.page));
  }
  if (query?.limit) {
    searchParams.set('limit', String(query.limit));
  }
  if (query?.search) {
    searchParams.set('search', query.search);
  }
  if (query?.status) {
    searchParams.set('status', query.status);
  }

  const suffix = searchParams.toString();
  const url = suffix ? buildUrl(`/users?${suffix}`) : buildUrl('/users');
  const response = await fetch(url, createRequestInit());
  return handleResponse<PaginatedUsersResponse>(response);
}

export async function createUser(payload: CreateUserPayload): Promise<AdminUser> {
  const response = await fetch(buildUrl('/users'), createRequestInit(payload, 'POST'));
  return handleResponse<AdminUser>(response);
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<AdminUser> {
  const response = await fetch(
    buildUrl(`/users/${id}`),
    createRequestInit(payload, 'PATCH'),
  );
  return handleResponse<AdminUser>(response);
}

export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(buildUrl(`/users/${id}`), createRequestInit(undefined, 'DELETE'));
  await handleResponse<{ success: boolean }>(response);
}

export async function fetchRoles(params?: { search?: string; limit?: number; page?: number }): Promise<RolesListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.search) {
    searchParams.set('search', params.search);
  }
  if (params?.limit) {
    searchParams.set('limit', String(params.limit));
  }
  if (params?.page) {
    searchParams.set('page', String(params.page));
  }

  const querySuffix = searchParams.toString();
  const url = querySuffix ? buildUrl(`/roles?${querySuffix}`) : buildUrl('/roles');
  const response = await fetch(url, createRequestInit());
  const payload = await handleResponse<RolesListResponse>(response);
  return payload;
}

export async function createRole(payload: CreateRolePayload): Promise<AdminRole> {
  const response = await fetch(buildUrl('/roles'), createRequestInit(payload, 'POST'));
  return handleResponse<AdminRole>(response);
}

export async function updateRole(id: string, payload: UpdateRolePayload): Promise<AdminRole> {
  const response = await fetch(buildUrl(`/roles/${id}`), createRequestInit(payload, 'PATCH'));
  return handleResponse<AdminRole>(response);
}

export async function deleteRole(id: string): Promise<void> {
  const response = await fetch(buildUrl(`/roles/${id}`), createRequestInit(undefined, 'DELETE'));
  await handleResponse<{ success: boolean }>(response);
}

export async function fetchPermissions(): Promise<AdminPermission[]> {
  const response = await fetch(buildUrl('/permissions'), createRequestInit());
  return handleResponse<AdminPermission[]>(response);
}

export async function createPermission(
  payload: CreatePermissionPayload,
): Promise<AdminPermission> {
  const response = await fetch(
    buildUrl('/permissions'),
    createRequestInit(payload, 'POST'),
  );
  return handleResponse<AdminPermission>(response);
}

export async function updatePermission(
  id: string,
  payload: UpdatePermissionPayload,
): Promise<AdminPermission> {
  const response = await fetch(
    buildUrl(`/permissions/${id}`),
    createRequestInit(payload, 'PATCH'),
  );
  return handleResponse<AdminPermission>(response);
}

export async function deletePermission(id: string): Promise<void> {
  const response = await fetch(
    buildUrl(`/permissions/${id}`),
    createRequestInit(undefined, 'DELETE'),
  );
  await handleResponse<{ success: boolean }>(response);
}

export async function fetchTokens(userId?: string): Promise<AdminToken[]> {
  const url = userId
    ? buildUrl(`/tokens/user/${userId}`)
    : buildUrl('/tokens');
  const response = await fetch(url, createRequestInit());
  return handleResponse<AdminToken[]>(response);
}

export async function revokeToken(id: string): Promise<void> {
  const response = await fetch(buildUrl(`/tokens/${id}`), createRequestInit(undefined, 'DELETE'));
  await handleResponse<{ success: boolean }>(response);
}
