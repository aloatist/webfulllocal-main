'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import {
  AdminPermission,
  AdminRole,
  AdminToken,
  AdminUser,
  CreatePermissionPayload,
  CreateRolePayload,
  CreateUserPayload,
  UpdatePermissionPayload,
  UpdateRolePayload,
  UpdateUserPayload,
  UserStatus,
  createPermission,
  createRole,
  createUser,
  deletePermission,
  deleteRole,
  deleteUser,
  fetchPermissions,
  fetchRoles,
  fetchTokens,
  fetchUsers,
  revokeToken,
  updatePermission,
  updateRole,
  updateUser,
} from '@/lib/admin/api';
import { fetchCurrentUser, type CurrentUser } from '@/lib/auth/current-user';
import { clearAuthTokens } from '@/lib/auth/token-storage';
import { Loader2, Plus, RefreshCcw, Shield, Trash2 } from 'lucide-react';

interface UserFormState {
  id?: string;
  email: string;
  fullName: string;
  password: string;
  status: UserStatus;
  roleCodes: string[];
}

interface RoleFormState {
  id?: string;
  code: string;
  name: string;
  description: string;
  permissionCodes: string[];
}

interface PermissionFormState {
  id?: string;
  code: string;
  name: string;
  description: string;
}

const STATUS_OPTIONS: {
  value: UserStatus;
  label: string;
  variant: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive';
}[] = [
  { value: 'active', label: 'Đang hoạt động', variant: 'success' },
  { value: 'pending', label: 'Chờ duyệt', variant: 'secondary' },
  { value: 'suspended', label: 'Tạm khóa', variant: 'destructive' },
];

function createEmptyUserForm(): UserFormState {
  return {
    email: '',
    fullName: '',
    password: '',
    status: 'active',
    roleCodes: [],
  };
}

function createEmptyRoleForm(): RoleFormState {
  return {
    code: '',
    name: '',
    description: '',
    permissionCodes: [],
  };
}

function createEmptyPermissionForm(): PermissionFormState {
  return {
    code: '',
    name: '',
    description: '',
  };
}

function formatDateTime(value: string | null): string {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString('vi-VN');
}

function statusBadgeVariant(status: UserStatus) {
  return STATUS_OPTIONS.find((option) => option.value === status)?.variant ?? 'outline';
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [tokens, setTokens] = useState<AdminToken[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);

  const [userForm, setUserForm] = useState<UserFormState>(createEmptyUserForm);
  const [roleForm, setRoleForm] = useState<RoleFormState>(createEmptyRoleForm);
  const [permissionForm, setPermissionForm] = useState<PermissionFormState>(
    createEmptyPermissionForm,
  );

  const [filters, setFilters] = useState<{ search: string; status: UserStatus | 'all' }>(
    () => ({ search: '', status: 'all' }),
  );

  const [savingUser, setSavingUser] = useState(false);
  const [savingRole, setSavingRole] = useState(false);
  const [savingPermission, setSavingPermission] = useState(false);
  const [refreshingTokens, setRefreshingTokens] = useState(false);

  const permissionSet = useMemo(() => {
    const set = new Set<string>();
    currentUser?.roles?.forEach((role) => {
      role.permissions?.forEach((permission) => set.add(permission.code));
    });
    return set;
  }, [currentUser]);

  const canViewUsers = permissionSet.has('user.read');
  const canManageUsers = permissionSet.has('user.write');
  const canViewRoles = permissionSet.has('role.read');
  const canManageRoles = permissionSet.has('role.write');
  const canViewPermissions = permissionSet.has('permission.read');
  const canManagePermissions = permissionSet.has('permission.write');
  const canViewTokens = permissionSet.has('token.read');
  const canManageTokens = permissionSet.has('token.write');

  const loadAll = async (opts?: { skipTokens?: boolean }) => {
    try {
      setLoading(true);
      setError(null);

      const query = {
        limit: 100,
        search: filters.search || undefined,
        status: filters.status === 'all' ? undefined : filters.status,
      };

      const [usersResponse, rolesResponse, permissionsResponse, tokensResponse] = await Promise.all([
        canViewUsers ? fetchUsers(query) : Promise.resolve({ data: [], meta: { total: 0 } }),
        canViewRoles ? fetchRoles({ limit: 100 }) : Promise.resolve({ data: [], total: 0 }),
        canViewPermissions ? fetchPermissions() : Promise.resolve([]),
        opts?.skipTokens || !canViewTokens ? Promise.resolve([]) : fetchTokens(),
      ]);

      if (canViewUsers) {
        setUsers(usersResponse.data);
        setUsersTotal(usersResponse.meta.total);
      }
      if (canViewRoles) {
        setRoles(rolesResponse.data);
      }
      if (canViewPermissions) {
        setPermissions(permissionsResponse);
      }
      if (!opts?.skipTokens && canViewTokens) {
        setTokens(tokensResponse as AdminToken[]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải dữ liệu quản lý';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const user = await fetchCurrentUser();
        if (!cancelled) {
          setCurrentUser(user);
        }
      } catch (err) {
        if (cancelled) {
          return;
        }
        const message = err instanceof Error ? err.message : 'Phiên đăng nhập đã hết hạn.';
        const status = err instanceof Error && 'status' in err ? (err as { status?: number }).status : undefined;
        setError(message);
        if (status === 401) {
          clearAuthTokens();
          setAuthError(true);
          router.replace('/login');
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, filters.search, filters.status]);

  const handleUserFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManageUsers) {
      return;
    }

    setSavingUser(true);
    try {
      const payload: CreateUserPayload | UpdateUserPayload = {
        email: userForm.email,
        fullName: userForm.fullName,
        status: userForm.status,
        roleCodes: userForm.roleCodes,
      };

      if (!userForm.id) {
        (payload as CreateUserPayload).password = userForm.password;
        await createUser(payload as CreateUserPayload);
      } else {
        if (userForm.password) {
          payload.password = userForm.password;
        }
        await updateUser(userForm.id, payload as UpdateUserPayload);
      }

      setUserForm(createEmptyUserForm());
      await loadAll({ skipTokens: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể lưu người dùng';
      setError(message);
    } finally {
      setSavingUser(false);
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setUserForm({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      password: '',
      status: user.status,
      roleCodes: user.roles?.map((role) => role.code) ?? [],
    });
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (!canManageUsers) {
      return;
    }
    const confirmed = window.confirm(`Xóa người dùng ${user.fullName}?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(user.id);
      if (userForm.id === user.id) {
        setUserForm(createEmptyUserForm());
      }
      await loadAll({ skipTokens: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể xóa người dùng';
      setError(message);
    }
  };

  const handleRoleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManageRoles) {
      return;
    }

    setSavingRole(true);
    try {
      const payload: CreateRolePayload | UpdateRolePayload = {
        code: roleForm.code,
        name: roleForm.name,
        description: roleForm.description || undefined,
        permissionCodes: roleForm.permissionCodes,
      };

      if (!roleForm.id) {
        await createRole(payload as CreateRolePayload);
      } else {
        await updateRole(roleForm.id, payload as UpdateRolePayload);
      }

      setRoleForm(createEmptyRoleForm());
      await loadAll();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể lưu vai trò';
      setError(message);
    } finally {
      setSavingRole(false);
    }
  };

  const handleEditRole = (role: AdminRole) => {
    setRoleForm({
      id: role.id,
      code: role.code,
      name: role.name,
      description: role.description ?? '',
      permissionCodes: role.permissions?.map((permission) => permission.code) ?? [],
    });
  };

  const handleDeleteRole = async (role: AdminRole) => {
    if (!canManageRoles) {
      return;
    }

    const confirmed = window.confirm(`Xóa vai trò ${role.name}?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteRole(role.id);
      if (roleForm.id === role.id) {
        setRoleForm(createEmptyRoleForm());
      }
      await loadAll();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể xóa vai trò';
      setError(message);
    }
  };

  const handlePermissionFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManagePermissions) {
      return;
    }

    setSavingPermission(true);
    try {
      const payload: CreatePermissionPayload | UpdatePermissionPayload = {
        code: permissionForm.code,
        name: permissionForm.name,
        description: permissionForm.description || undefined,
      };

      if (!permissionForm.id) {
        await createPermission(payload as CreatePermissionPayload);
      } else {
        await updatePermission(permissionForm.id, payload as UpdatePermissionPayload);
      }

      setPermissionForm(createEmptyPermissionForm());
      await loadAll();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể lưu quyền hạn';
      setError(message);
    } finally {
      setSavingPermission(false);
    }
  };

  const handleEditPermission = (permission: AdminPermission) => {
    setPermissionForm({
      id: permission.id,
      code: permission.code,
      name: permission.name,
      description: permission.description ?? '',
    });
  };

  const handleDeletePermission = async (permission: AdminPermission) => {
    if (!canManagePermissions) {
      return;
    }

    const confirmed = window.confirm(`Xóa quyền ${permission.code}?`);
    if (!confirmed) {
      return;
    }

    try {
      await deletePermission(permission.id);
      if (permissionForm.id === permission.id) {
        setPermissionForm(createEmptyPermissionForm());
      }
      await loadAll();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể xóa quyền hạn';
      setError(message);
    }
  };

  const handleRevokeToken = async (token: AdminToken) => {
    if (!canManageTokens) {
      return;
    }

    const confirmed = window.confirm(
      `Thu hồi token đang sử dụng bởi ${token.user.fullName}?`,
    );
    if (!confirmed) {
      return;
    }

    try {
      await revokeToken(token.id);
      await loadTokens();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể thu hồi token';
      setError(message);
    }
  };

  const loadTokens = async () => {
    if (!canViewTokens) {
      return;
    }
    setRefreshingTokens(true);
    try {
      const tokensResponse = await fetchTokens();
      setTokens(tokensResponse);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải danh sách token';
      setError(message);
    } finally {
      setRefreshingTokens(false);
    }
  };

  const resetUserForm = () => setUserForm(createEmptyUserForm());
  const resetRoleForm = () => setRoleForm(createEmptyRoleForm());
  const resetPermissionForm = () => setPermissionForm(createEmptyPermissionForm());

  const activeUsers = useMemo(
    () => users.filter((user) => user.status === 'active').length,
    [users],
  );
  const pendingUsers = useMemo(
    () => users.filter((user) => user.status === 'pending').length,
    [users],
  );

  if (authError) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 py-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Admin</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Quản lý người dùng & phân quyền</h1>
          <p className="text-sm text-muted-foreground">
            Tạo mới tài khoản, gán vai trò, cập nhật quyền hạn và kiểm soát phiên đăng nhập API.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            variant="outline"
            onClick={() => void loadAll()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="mr-2 h-4 w-4" />
            )}
            Tải lại dữ liệu
          </Button>
        </div>
      </header>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-border/80 bg-background/70 py-16">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Đang tải dữ liệu quản trị...</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {canViewUsers && (
            <section className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-2 border-b border-border/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Tài khoản người dùng</h2>
                  <p className="text-sm text-muted-foreground">
                    Tổng cộng {usersTotal.toLocaleString('vi-VN')} người dùng. Bộ lọc áp dụng trên 100 kết quả đầu tiên.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <form
                    className="flex flex-col gap-2 sm:flex-row"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void loadAll({ skipTokens: true });
                    }}
                  >
                    <input
                      type="search"
                      value={filters.search}
                      onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                      placeholder="Tìm theo tên hoặc email..."
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                    <select
                      value={filters.status}
                      onChange={(event) =>
                        setFilters((prev) => ({
                          ...prev,
                          status: event.target.value as UserStatus | 'all',
                        }))
                      }
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Button type="submit" variant="secondary">
                      Áp dụng
                    </Button>
                  </form>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border/60 bg-background/80 p-4">
                  <p className="text-sm text-muted-foreground">Người dùng hoạt động</p>
                  <p className="text-2xl font-semibold">{activeUsers}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background/80 p-4">
                  <p className="text-sm text-muted-foreground">Đang chờ duyệt</p>
                  <p className="text-2xl font-semibold">{pendingUsers}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background/80 p-4">
                  <p className="text-sm text-muted-foreground">Tổng đang hiển thị</p>
                  <p className="text-2xl font-semibold">{users.length}</p>
                </div>
              </div>

              <div className="mt-6 overflow-auto">
                <table className="min-w-full divide-y divide-border/40 text-sm">
                  <thead className="bg-muted/60 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left">Tên</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Trạng thái</th>
                      <th className="px-4 py-3 text-left">Vai trò</th>
                      <th className="px-4 py-3 text-left">Đăng nhập cuối</th>
                      {canManageUsers && <th className="px-4 py-3 text-right">Thao tác</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {users.map((user) => (
                      <tr key={user.id} className="transition hover:bg-muted/40">
                        <td className="px-4 py-3 font-medium">{user.fullName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                        <td className="px-4 py-3">
                          <Badge variant={statusBadgeVariant(user.status)}>
                            {STATUS_OPTIONS.find((option) => option.value === user.status)?.label ?? user.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {user.roles?.length ? (
                              user.roles.map((role) => (
                                <Badge key={role.id} variant="outline">
                                  {role.name}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">Chưa gán</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDateTime(user.lastLoginAt)}
                        </td>
                        {canManageUsers && (
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                                Chỉnh sửa
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => void handleDeleteUser(user)}
                              >
                                <Trash2 className="mr-1 h-3.5 w-3.5" />
                                Xóa
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                    {!users.length && (
                      <tr>
                        <td
                          colSpan={canManageUsers ? 6 : 5}
                          className="px-4 py-6 text-center text-sm text-muted-foreground"
                        >
                          Không có người dùng nào khớp với bộ lọc hiện tại.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {canManageUsers && (
                <div className="mt-6 rounded-lg border border-border/60 bg-background/80 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-semibold">
                      {userForm.id ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
                    </h3>
                    {userForm.id && (
                      <Button variant="ghost" size="sm" onClick={resetUserForm}>
                        Hủy
                      </Button>
                    )}
                  </div>
                  <form className="grid gap-4 md:grid-cols-2" onSubmit={handleUserFormSubmit}>
                    <label className="grid gap-2 text-sm">
                      <span>Email</span>
                      <input
                        type="email"
                        required
                        value={userForm.email}
                        onChange={(event) =>
                          setUserForm((prev) => ({ ...prev, email: event.target.value }))
                        }
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      />
                    </label>
                    <label className="grid gap-2 text-sm">
                      <span>Họ tên</span>
                      <input
                        type="text"
                        required
                        value={userForm.fullName}
                        onChange={(event) =>
                          setUserForm((prev) => ({ ...prev, fullName: event.target.value }))
                        }
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      />
                    </label>
                    <label className="grid gap-2 text-sm">
                      <span>{userForm.id ? 'Đổi mật khẩu (để trống nếu giữ nguyên)' : 'Mật khẩu'}</span>
                      <input
                        type="password"
                        value={userForm.password}
                        onChange={(event) =>
                          setUserForm((prev) => ({ ...prev, password: event.target.value }))
                        }
                        placeholder={userForm.id ? '••••••••' : ''}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        required={!userForm.id}
                      />
                    </label>
                    <label className="grid gap-2 text-sm">
                      <span>Trạng thái</span>
                      <select
                        value={userForm.status}
                        onChange={(event) =>
                          setUserForm((prev) => ({
                            ...prev,
                            status: event.target.value as UserStatus,
                          }))
                        }
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium">Vai trò</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {roles.map((role) => {
                          const selected = userForm.roleCodes.includes(role.code);
                          return (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() =>
                                setUserForm((prev) => ({
                                  ...prev,
                                  roleCodes: selected
                                    ? prev.roleCodes.filter((code) => code !== role.code)
                                    : [...prev.roleCodes, role.code],
                                }))
                              }
                              className={`rounded-full border px-3 py-1 text-xs transition ${
                                selected
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border text-muted-foreground hover:border-primary/60'
                              }`}
                            >
                              {role.name}
                            </button>
                          );
                        })}
                        {!roles.length && (
                          <span className="text-xs text-muted-foreground">
                            Chưa có vai trò nào. Hãy tạo ở mục bên dưới.
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button type="submit" disabled={savingUser}>
                        {savingUser ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="mr-2 h-4 w-4" />
                        )}
                        {userForm.id ? 'Cập nhật người dùng' : 'Thêm người dùng'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </section>
          )}

          {canViewRoles && (
            <section className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-2 border-b border-border/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Vai trò & nhóm quyền</h2>
                  <p className="text-sm text-muted-foreground">
                    Quản lý tập quyền và mô tả vai trò để tái sử dụng cho nhiều người dùng.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {roles.map((role) => (
                  <div key={role.id} className="rounded-lg border border-border/60 bg-background/80 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{role.name}</h3>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {role.code}
                        </p>
                      </div>
                      {canManageRoles && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditRole(role)}>
                            Chỉnh sửa
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => void handleDeleteRole(role)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {role.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{role.description}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {role.permissions?.length ? (
                        role.permissions.map((permission) => (
                          <Badge key={permission.id} variant="secondary">
                            {permission.code}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">Chưa gán quyền</span>
                      )}
                    </div>
                  </div>
                ))}
                {!roles.length && (
                  <div className="rounded-lg border border-dashed border-border/60 bg-background/60 p-6 text-sm text-muted-foreground">
                    Chưa có vai trò nào. Hãy tạo mới bằng biểu mẫu bên dưới.
                  </div>
                )}
              </div>

              {canManageRoles && (
                <div className="mt-6 rounded-lg border border-border/60 bg-background/80 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-semibold">
                      {roleForm.id ? 'Cập nhật vai trò' : 'Thêm vai trò mới'}
                    </h3>
                    {roleForm.id && (
                      <Button variant="ghost" size="sm" onClick={resetRoleForm}>
                        Hủy
                      </Button>
                    )}
                  </div>
                  <form className="grid gap-4 md:grid-cols-2" onSubmit={handleRoleFormSubmit}>
                    <label className="grid gap-2 text-sm">
                      <span>Mã vai trò</span>
                      <input
                        type="text"
                        required
                        value={roleForm.code}
                        onChange={(event) =>
                          setRoleForm((prev) => ({ ...prev, code: event.target.value }))
                        }
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        placeholder="ví dụ: admin"
                      />
                    </label>
                    <label className="grid gap-2 text-sm">
                      <span>Tên hiển thị</span>
                      <input
                        type="text"
                        required
                        value={roleForm.name}
                        onChange={(event) =>
                          setRoleForm((prev) => ({ ...prev, name: event.target.value }))
                        }
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        placeholder="Administrator"
                      />
                    </label>
                    <label className="md:col-span-2 grid gap-2 text-sm">
                      <span>Mô tả</span>
                      <textarea
                        value={roleForm.description}
                        onChange={(event) =>
                          setRoleForm((prev) => ({ ...prev, description: event.target.value }))
                        }
                        rows={3}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        placeholder="Mô tả ngắn về quyền hạn..."
                      />
                    </label>
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium">Quyền được gán</span>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {permissions.map((permission) => {
                          const selected = roleForm.permissionCodes.includes(permission.code);
                          return (
                            <label
                              key={permission.id}
                              className={`flex cursor-pointer items-start gap-2 rounded-md border px-3 py-2 text-sm transition ${
                                selected
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/40'
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="mt-1"
                                checked={selected}
                                onChange={() =>
                                  setRoleForm((prev) => ({
                                    ...prev,
                                    permissionCodes: selected
                                      ? prev.permissionCodes.filter(
                                          (code) => code !== permission.code,
                                        )
                                      : [...prev.permissionCodes, permission.code],
                                  }))
                                }
                              />
                              <div>
                                <p className="font-medium">{permission.code}</p>
                                <p className="text-xs text-muted-foreground">
                                  {permission.name}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                        {!permissions.length && (
                          <div className="rounded-md border border-dashed border-border/60 bg-background/60 p-4 text-xs text-muted-foreground">
                            Chưa có quyền nào. Hãy tạo ở mục bên dưới.
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button type="submit" disabled={savingRole}>
                        {savingRole ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="mr-2 h-4 w-4" />
                        )}
                        {roleForm.id ? 'Cập nhật vai trò' : 'Thêm vai trò'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </section>
          )}

          {canViewPermissions && (
            <section className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-2 border-b border-border/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Danh sách quyền</h2>
                  <p className="text-sm text-muted-foreground">
                    Quản lý từng quyền chi tiết để gán cho vai trò phù hợp.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {permissions.map((permission) => (
                  <div key={permission.id} className="rounded-lg border border-border/60 bg-background/80 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{permission.name}</p>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {permission.code}
                        </p>
                      </div>
                      {canManagePermissions && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPermission(permission)}
                          >
                            Chỉnh sửa
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => void handleDeletePermission(permission)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {permission.description && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {permission.description}
                      </p>
                    )}
                    <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-3.5 w-3.5" />
                      Tạo lúc {formatDateTime(permission.createdAt)}
                    </p>
                  </div>
                ))}
                {!permissions.length && (
                  <div className="rounded-lg border border-dashed border-border/60 bg-background/60 p-6 text-sm text-muted-foreground">
                    Chưa có quyền nào trong hệ thống.
                  </div>
                )}
              </div>

              {canManagePermissions && (
                <div className="mt-6 rounded-lg border border-border/60 bg-background/80 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-base font-semibold">
                      {permissionForm.id ? 'Cập nhật quyền' : 'Thêm quyền mới'}
                    </h3>
                    {permissionForm.id && (
                      <Button variant="ghost" size="sm" onClick={resetPermissionForm}>
                        Hủy
                      </Button>
                    )}
                  </div>
                  <form className="grid gap-4 md:grid-cols-2" onSubmit={handlePermissionFormSubmit}>
                    <label className="grid gap-2 text-sm">
                      <span>Mã quyền</span>
                      <input
                        type="text"
                        required
                        value={permissionForm.code}
                        onChange={(event) =>
                          setPermissionForm((prev) => ({ ...prev, code: event.target.value }))
                        }
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        placeholder="attendance.checkin.scan"
                      />
                    </label>
                    <label className="grid gap-2 text-sm">
                      <span>Tên hiển thị</span>
                      <input
                        type="text"
                        required
                        value={permissionForm.name}
                        onChange={(event) =>
                          setPermissionForm((prev) => ({ ...prev, name: event.target.value }))
                        }
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      />
                    </label>
                    <label className="md:col-span-2 grid gap-2 text-sm">
                      <span>Mô tả</span>
                      <textarea
                        value={permissionForm.description}
                        onChange={(event) =>
                          setPermissionForm((prev) => ({ ...prev, description: event.target.value }))
                        }
                        rows={3}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        placeholder="Mô tả ngắn về quyền hạn..."
                      />
                    </label>
                    <div className="md:col-span-2 flex justify-end">
                      <Button type="submit" disabled={savingPermission}>
                        {savingPermission ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="mr-2 h-4 w-4" />
                        )}
                        {permissionForm.id ? 'Cập nhật quyền' : 'Thêm quyền'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </section>
          )}

          {canViewTokens && (
            <section className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-2 border-b border-border/50 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Quản lý API tokens / Refresh tokens</h2>
                  <p className="text-sm text-muted-foreground">
                    Theo dõi và thu hồi các phiên đăng nhập đang hoạt động trong hệ thống.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => void loadTokens()} disabled={refreshingTokens}>
                  {refreshingTokens ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCcw className="mr-2 h-4 w-4" />
                  )}
                  Làm mới
                </Button>
              </div>

              <div className="mt-4 overflow-auto">
                <table className="min-w-full divide-y divide-border/40 text-sm">
                  <thead className="bg-muted/60 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left">Người dùng</th>
                      <th className="px-4 py-3 text-left">Thiết bị</th>
                      <th className="px-4 py-3 text-left">IP</th>
                      <th className="px-4 py-3 text-left">Tạo lúc</th>
                      <th className="px-4 py-3 text-left">Hết hạn</th>
                      <th className="px-4 py-3 text-left">Trạng thái</th>
                      {canManageTokens && <th className="px-4 py-3 text-right">Thao tác</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {tokens.map((token) => (
                      <tr key={token.id} className="transition hover:bg-muted/40">
                        <td className="px-4 py-3">
                          <div className="font-medium">{token.user.fullName}</div>
                          <div className="text-xs text-muted-foreground">{token.user.email}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {token.userAgent || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {token.ip || '—'}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {formatDateTime(token.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {formatDateTime(token.expiresAt)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={token.expired ? 'destructive' : 'success'}>
                            {token.expired ? 'Hết hạn' : 'Đang hoạt động'}
                          </Badge>
                        </td>
                        {canManageTokens && (
                          <td className="px-4 py-3">
                            <div className="flex justify-end">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => void handleRevokeToken(token)}
                                disabled={token.expired}
                              >
                                Thu hồi
                              </Button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                    {!tokens.length && (
                      <tr>
                        <td
                          colSpan={canManageTokens ? 7 : 6}
                          className="px-4 py-6 text-center text-sm text-muted-foreground"
                        >
                          Không có phiên đăng nhập nào đang hoạt động.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
