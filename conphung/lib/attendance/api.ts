import { getAccessToken } from '@/lib/auth/token-storage';

const RAW_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, '');
export const includeCredentials = process.env.NEXT_PUBLIC_API_WITH_CREDENTIALS === 'true';

function resolveAuthToken(): string | null {
  return getAccessToken() ?? process.env.NEXT_PUBLIC_API_TOKEN ?? null;
}

export function createAuthorizedHeaders(extra?: HeadersInit, includeAuth = true): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (extra instanceof Headers) {
    extra.forEach((value, key) => {
      headers[key] = value;
    });
  } else if (Array.isArray(extra)) {
    for (const [key, value] of extra) {
      headers[key] = value;
    }
  } else if (extra) {
    Object.assign(headers, extra);
  }

  if (includeAuth) {
    const token = resolveAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

function buildUrl(path: string): string {
  if (!path) {
    return API_BASE_URL;
  }
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

async function parseJson<T>(response: Response): Promise<T | undefined> {
  const text = await response.text();
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.warn('Failed to parse API response JSON', error);
    return undefined;
  }
}

function toError(message: string, cause?: unknown): Error {
  const error = new Error(message);
  (error as Error & { cause?: unknown }).cause = cause;
  return error;
}

export type CheckinStatus = 'success' | 'duplicate' | 'invalid';

export interface ParticipantSummary {
  id: string;
  fullName: string;
  code: string;
  status: string;
  checkedInAt: string | null;
}

export interface CheckinResponse {
  status: CheckinStatus;
  message?: string;
  participant?: ParticipantSummary;
  scannedAt: string;
}

export interface CheckinLogEntry {
  id: string;
  status: CheckinStatus;
  scanCode: string;
  message?: string | null;
  scannerId?: string | null;
  deviceInfo?: string | null;
  createdAt: string;
  participant?: ParticipantSummary | null;
}

export interface AttendanceSummary {
  total: number;
  checkedIn: number;
  pending: number;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const payload = await parseJson<T | { message?: string }>(response);

  if (!response.ok) {
    const errorMessage =
      (payload as { message?: string } | undefined)?.message ??
      response.statusText ??
      'Yêu cầu tới máy chủ thất bại';
    throw toError(errorMessage, payload);
  }

  if (payload === undefined) {
    throw toError('Máy chủ không trả dữ liệu');
  }

  return payload as T;
}

export async function postCheckin(payload: {
  code: string;
  scannerId?: string;
  deviceInfo?: string;
}): Promise<CheckinResponse> {
  if (!payload.code?.trim()) {
    throw toError('Mã điểm danh không hợp lệ');
  }

  const response = await fetch(buildUrl('/checkins'), {
    method: 'POST',
    headers: createAuthorizedHeaders(),
    body: JSON.stringify(payload),
    cache: 'no-store',
    credentials: includeCredentials ? 'include' : 'omit',
  });

  return handleResponse<CheckinResponse>(response);
}

export async function fetchAttendanceSummary(): Promise<AttendanceSummary> {
  const response = await fetch(buildUrl('/participants/stats/summary'), {
    method: 'GET',
    headers: createAuthorizedHeaders(),
    cache: 'no-store',
    credentials: includeCredentials ? 'include' : 'omit',
  });

  return handleResponse<AttendanceSummary>(response);
}

export async function fetchRecentCheckins(limit = 20): Promise<CheckinLogEntry[]> {
  const searchParams = new URLSearchParams({ limit: String(limit) });
  const response = await fetch(buildUrl(`/checkins/recent?${searchParams}`), {
    method: 'GET',
    headers: createAuthorizedHeaders(),
    cache: 'no-store',
    credentials: includeCredentials ? 'include' : 'omit',
  });

  return handleResponse<CheckinLogEntry[]>(response);
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

export interface AttendanceRolePermission {
  id: string;
  code: string;
  name: string;
}

export interface AttendanceRole {
  id: string;
  code: string;
  name: string;
  permissions: AttendanceRolePermission[];
}

export interface AttendanceUser {
  id: string;
  email: string;
  fullName: string;
  status: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  roles: AttendanceRole[];
}

export interface AttendanceLoginResponse {
  user: AttendanceUser;
  tokens: {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
  };
}

export async function loginToAttendance(params: {
  email: string;
  password: string;
  userAgent?: string;
  ip?: string;
}): Promise<AttendanceLoginResponse> {
  const response = await fetch(buildUrl('/auth/login'), {
    method: 'POST',
    headers: createAuthorizedHeaders(undefined, false),
    body: JSON.stringify({
      email: params.email,
      password: params.password,
      userAgent: params.userAgent,
      ip: params.ip,
    }),
    cache: 'no-store',
    credentials: includeCredentials ? 'include' : 'omit',
  });

  return handleResponse<AttendanceLoginResponse>(response);
}
