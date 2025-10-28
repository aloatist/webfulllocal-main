import {
  CheckinStatus,
  createAuthorizedHeaders,
  getApiBaseUrl,
  includeCredentials,
} from '@/lib/attendance/api';

export interface ParticipantsStats {
  total: number;
  checkedIn: number;
  pending: number;
}

export interface CheckinsStats {
  total: number;
  byStatus: Record<CheckinStatus, number>;
}

export interface ParticipantView {
  id: string;
  fullName: string;
  code: string;
  status: string;
  checkedInAt: string | null;
}

export interface CheckinLogView {
  id: string;
  status: CheckinStatus;
  scanCode: string;
  message?: string | null;
  scannerId?: string | null;
  deviceInfo?: string | null;
  createdAt: string;
  participant?: ParticipantView | null;
}

export interface DashboardTool {
  key: string;
  name: string;
  description: string;
  href: string;
  category: 'attendance' | 'automation' | 'reports' | 'management';
}

export interface DashboardOverview {
  participants: ParticipantsStats;
  checkins: {
    totals: CheckinsStats;
    recent: CheckinLogView[];
  };
  tools: DashboardTool[];
}

export interface ParticipantRecord extends ParticipantView {
  email?: string | null;
  phoneNumber?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface ParticipantsListResponse {
  data: ParticipantRecord[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

const API_BASE_URL = getApiBaseUrl();

function buildUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

interface ApiError extends Error {
  status?: number;
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
    throw toError(message || 'Không thể tải dữ liệu dashboard', payload, response.status);
  }

  if (!payload) {
    throw toError('Máy chủ không trả dữ liệu dashboard', undefined, response.status);
  }

  return payload as T;
}

export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  const response = await fetch(buildUrl('/dashboard/overview'), {
    method: 'GET',
    headers: createAuthorizedHeaders(),
    cache: 'no-store',
    credentials: includeCredentials ? 'include' : 'omit',
  });

  return handleResponse<DashboardOverview>(response);
}

export async function fetchParticipantsList(limit = 100): Promise<ParticipantsListResponse> {
  const searchParams = new URLSearchParams({ limit: String(limit) });

  const response = await fetch(buildUrl(`/participants?${searchParams}`), {
    method: 'GET',
    headers: createAuthorizedHeaders(),
    cache: 'no-store',
    credentials: includeCredentials ? 'include' : 'omit',
  });

  return handleResponse<ParticipantsListResponse>(response);
}

export async function resetDashboardData(): Promise<void> {
  const response = await fetch(buildUrl('/dashboard/reset'), {
    method: 'POST',
    headers: createAuthorizedHeaders(),
    cache: 'no-store',
    credentials: includeCredentials ? 'include' : 'omit',
  });

  await handleResponse<{ success: boolean }>(response);
}
