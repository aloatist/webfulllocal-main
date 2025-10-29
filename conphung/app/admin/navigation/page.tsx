'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Trash2, Edit3, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  createMenu,
  updateMenu,
  deleteMenu,
  fetchMenus,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '@/lib/navigation/api';
import { fetchRoles } from '@/lib/admin/api';
import type { NavigationMenu, NavigationMenuItem } from '@/lib/navigation/types';
import { clearAuthTokens } from '@/lib/auth/token-storage';

interface MenuFormState {
  id?: string;
  name: string;
  description: string;
  isDefault: boolean;
}

interface MenuItemFormState {
  id?: string;
  label: string;
  href: string;
  icon: string;
  target: string;
  order: number;
  isActive: boolean;
  roles: string;
  parentId: string;
}

interface PostOption {
  id: string;
  title: string;
  slug: string;
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

type PostResponseItem = {
  id: string;
  title: string;
  slug?: string | null;
};

const TARGET_OPTION_PRESETS = [
  { value: '', label: 'Mặc định (cùng tab)' },
  { value: '_blank', label: 'Mở tab mới (_blank)' },
  { value: '_self', label: 'Tải lại tab hiện tại (_self)' },
];

const ICON_PRESET_SUGGESTIONS = [
  'lucide-home',
  'lucide-compass',
  'lucide-book-open',
  'lucide-navigate',
  'lucide-star',
  'lucide-info',
  'lucide-phone',
  'lucide-map-pin',
  'lucide-mail',
  'lucide-calendar',
];

const createEmptyMenuForm = (): MenuFormState => ({
  name: '',
  description: '',
  isDefault: false,
});

const createEmptyItemForm = (): MenuItemFormState => ({
  label: '',
  href: '',
  icon: '',
  target: '',
  order: 0,
  isActive: true,
  roles: '',
  parentId: '',
});

function flattenItems(items: NavigationMenuItem[] | undefined, depth = 0): Array<{ item: NavigationMenuItem; depth: number }> {
  if (!items || !Array.isArray(items)) return [];
  return items.flatMap((item) => {
    const current = [{ item, depth }];
    if (item.children && Array.isArray(item.children) && item.children.length > 0) {
      return current.concat(flattenItems(item.children, depth + 1));
    }
    return current;
  });
}

export default function NavigationAdminPage() {
  const router = useRouter();
  const [menus, setMenus] = useState<NavigationMenu[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const [menuForm, setMenuForm] = useState<MenuFormState>(createEmptyMenuForm);
  const [itemForm, setItemForm] = useState<MenuItemFormState>(createEmptyItemForm());
  const [loading, setLoading] = useState(true);
  const [savingMenu, setSavingMenu] = useState(false);
  const [savingItem, setSavingItem] = useState(false);
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const [postOptions, setPostOptions] = useState<PostOption[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [roleOptions, setRoleOptions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedMenu = menus.find((menu) => menu.id === selectedMenuId) ?? menus[0] ?? null;

  const flattenedItems = useMemo(() => {
    if (!selectedMenu) return [];
    return flattenItems(selectedMenu.items ?? []);
  }, [selectedMenu]);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMenus();
        setMenus(data);
        if (!selectedMenuId && data.length > 0) {
          setSelectedMenuId(data[0].id);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Không thể tải danh sách menu';
        setError(message);
        if (message.toLowerCase().includes('unauthorized')) {
          clearAuthTokens();
          router.replace('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    void loadMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setLoadingMetadata(true);
        const [postsRes, categoriesRes, rolesRes] = await Promise.all([
          fetch('/api/posts?limit=100').then(async (res) => (res.ok ? res.json() : null)),
          fetch('/api/categories?limit=100').then(async (res) => (res.ok ? res.json() : null)),
          fetchRoles({ limit: 100 }).catch(() => null),
        ]);

        if (postsRes?.posts) {
          const normalizedPosts: PostOption[] = (postsRes.posts as PostResponseItem[]).map((post) => ({
            id: post.id,
            title: post.title,
            slug:
              typeof post.slug === 'string' && post.slug.length > 0 ? post.slug : post.title,
          }));

          setPostOptions(normalizedPosts);
        }

        if (categoriesRes?.categories) {
          setCategoryOptions(
            (categoriesRes.categories as CategoryOption[]).map((category) => ({
              id: category.id,
              name: category.name,
              slug: category.slug,
            })),
          );
        }

        if (rolesRes?.data) {
          setRoleOptions(rolesRes.data.map((role) => role.code));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Không thể tải dữ liệu hỗ trợ menu';
        console.error(message);
      } finally {
        setLoadingMetadata(false);
      }
    };

    void loadMetadata();
  }, []);

  useEffect(() => {
    if (selectedMenu) {
      setMenuForm({
        id: selectedMenu.id,
        name: selectedMenu.name,
        description: selectedMenu.description ?? '',
        isDefault: selectedMenu.isDefault,
      });
      setItemForm(createEmptyItemForm());
    } else {
      setMenuForm(createEmptyMenuForm());
      setItemForm(createEmptyItemForm());
    }
  }, [selectedMenu]);

  const handleCreateMenu = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingMenu(true);
    try {
      const created = await createMenu({
        name: menuForm.name,
        description: menuForm.description,
        isDefault: menuForm.isDefault,
      });
      const data = await fetchMenus();
      setMenus(data);
      setSelectedMenuId(created.id);
      setMenuForm({
        id: created.id,
        name: created.name,
        description: created.description ?? '',
        isDefault: created.isDefault,
      });
      setSuccessMessage('Đã tạo menu mới');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tạo menu';
      setError(message);
    } finally {
      setSavingMenu(false);
    }
  };

  const handleUpdateMenu = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!menuForm.id) return;
    setSavingMenu(true);
    try {
      const updated = await updateMenu(menuForm.id, {
        name: menuForm.name,
        description: menuForm.description,
        isDefault: menuForm.isDefault,
      });
      const data = await fetchMenus();
      setMenus(data);
      setSelectedMenuId(updated.id);
      setSuccessMessage('Đã cập nhật menu');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể cập nhật menu';
      setError(message);
    } finally {
      setSavingMenu(false);
    }
  };

  const handleDeleteMenu = async (menuId: string) => {
    const confirmed = window.confirm('Xóa menu này sẽ xóa tất cả mục con. Bạn chắc chắn?');
    if (!confirmed) return;
    try {
      await deleteMenu(menuId);
      setMenus((prev) => prev.filter((menu) => menu.id !== menuId));
      if (selectedMenuId === menuId) {
        setSelectedMenuId(null);
      }
      setSuccessMessage('Đã xóa menu');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể xóa menu';
      setError(message);
    }
  };

  const handleMenuSelect = (menu: NavigationMenu) => {
    setSelectedMenuId(menu.id);
    setMenuForm({
      id: menu.id,
      name: menu.name,
      description: menu.description ?? '',
      isDefault: menu.isDefault,
    });
    setItemForm(createEmptyItemForm());
  };

  const handleItemSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedMenu) return;
    setSavingItem(true);
    try {
      if (!itemForm.id) {
        await createMenuItem({
          menuId: selectedMenu.id,
          parentId: itemForm.parentId || undefined,
          label: itemForm.label,
          href: itemForm.href,
          icon: itemForm.icon || undefined,
          target: itemForm.target || undefined,
          order: Number(itemForm.order) || 0,
          isActive: itemForm.isActive,
          roles: itemForm.roles
            ? itemForm.roles.split(',').map((role) => role.trim()).filter(Boolean)
            : [],
        });
        setSuccessMessage('Đã thêm mục menu');
      } else {
        await updateMenuItem(itemForm.id, {
          label: itemForm.label,
          href: itemForm.href,
          icon: itemForm.icon || null,
          target: itemForm.target || null,
          order: Number(itemForm.order) || 0,
          isActive: itemForm.isActive,
          roles: itemForm.roles
            ? itemForm.roles.split(',').map((role) => role.trim()).filter(Boolean)
            : [],
          parentId: itemForm.parentId || null,
        });
        setSuccessMessage('Đã cập nhật mục menu');
      }

      const data = await fetchMenus();
      setMenus(data);
      setSelectedMenuId(selectedMenu.id);
      setItemForm(createEmptyItemForm());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể lưu mục menu';
      setError(message);
    } finally {
      setSavingItem(false);
    }
  };

  const handleItemEdit = (item: NavigationMenuItem) => {
    setItemForm({
      id: item.id,
      label: item.label,
      href: item.href,
      icon: item.icon ?? '',
      target: item.target ?? '',
      order: item.order,
      isActive: item.isActive,
      roles: item.roles.join(', '),
      parentId: item.parentId ?? '',
    });
  };

  const handleItemDelete = async (item: NavigationMenuItem) => {
    const confirmed = window.confirm(`Xóa mục “${item.label}”?`);
    if (!confirmed) return;
    try {
      await deleteMenuItem(item.id);
      const data = await fetchMenus();
      setMenus(data);
      setSuccessMessage('Đã xóa mục menu');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể xóa mục menu';
      setError(message);
    }
  };

  const parentOptions = useMemo(() => {
    if (!selectedMenu) return [];
    return flattenItems(selectedMenu.items).map(({ item, depth }) => ({
      id: item.id,
      label: `${'— '.repeat(depth)}${item.label}`,
    }));
  }, [selectedMenu]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Quản lý điều hướng</h1>
          <p className="text-sm text-muted-foreground">
            Tạo, chỉnh sửa và sắp xếp các menu điều hướng cho trang web.
          </p>
        </div>
        {successMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMessage}</span>
          </div>
        )}
      </header>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
        <aside className="rounded-xl border border-border/80 bg-background/70 p-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Danh sách menu
          </h2>
          <div className="mt-4 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải menu...
              </div>
            ) : menus.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">Chưa có menu nào.</p>
            ) : (
              menus.map((menu) => (
                <button
                  key={menu.id}
                  type="button"
                  onClick={() => handleMenuSelect(menu)}
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition ${
                    selectedMenu?.id === menu.id
                      ? 'border-primary/60 bg-primary/10 text-primary'
                      : 'border-transparent hover:bg-muted/60'
                  }`}
                >
                  <span>{menu.name}</span>
                  {menu.isDefault && (
                    <Badge variant="outline" className="text-xs">
                      Mặc định
                    </Badge>
                  )}
                </button>
              ))
            )}
          </div>

          <Separator className="my-4" />

          <form className="space-y-3" onSubmit={selectedMenu ? handleUpdateMenu : handleCreateMenu}>
            <h3 className="text-sm font-semibold">{selectedMenu ? 'Chỉnh sửa menu' : 'Tạo menu mới'}</h3>
            <div className="space-y-2">
              <Label htmlFor="menu-name">Tên menu</Label>
              <Input
                id="menu-name"
                value={menuForm.name}
                onChange={(event) => setMenuForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="menu-description">Mô tả</Label>
              <Textarea
                id="menu-description"
                value={menuForm.description}
                onChange={(event) => setMenuForm((prev) => ({ ...prev, description: event.target.value }))}
                rows={3}
              />
            </div>
            <label className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-sm">
              <div>
                <p className="font-medium">Đặt làm menu mặc định</p>
                <p className="text-xs text-muted-foreground">
                  Menu mặc định được sử dụng cho điều hướng chính của trang web.
                </p>
              </div>
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={menuForm.isDefault}
                onChange={(event) =>
                  setMenuForm((prev) => ({ ...prev, isDefault: event.target.checked }))
                }
              />
            </label>
            <div className="flex items-center justify-between gap-2">
              {selectedMenu && (
                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDeleteMenu(selectedMenu.id)}
                  disabled={savingMenu}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </Button>
              )}
              <Button type="submit" className="flex-1" disabled={savingMenu}>
                {savingMenu ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                {selectedMenu ? 'Cập nhật' : 'Tạo menu'}
              </Button>
            </div>
          </form>
        </aside>

        <main className="space-y-6">
          {selectedMenu ? (
            <>
              <section className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Mục trong “{selectedMenu.name}”</h2>
                    <p className="text-sm text-muted-foreground">
                      Quản lý các liên kết và submenu của menu.
                    </p>
                  </div>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-muted/60 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 text-left">Tiêu đề</th>
                        <th className="px-4 py-3 text-left">Đường dẫn</th>
                        <th className="px-4 py-3 text-left">Thứ tự</th>
                        <th className="px-4 py-3 text-left">Trạng thái</th>
                        <th className="px-4 py-3 text-left">Quyền hạn</th>
                        <th className="px-4 py-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {flattenedItems.map(({ item, depth }) => (
                        <tr key={item.id} className="transition hover:bg-muted/40">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground">{'— '.repeat(depth)}</span>
                              <span className="font-medium">{item.label}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{item.href}</td>
                          <td className="px-4 py-3 text-muted-foreground">{item.order}</td>
                          <td className="px-4 py-3">
                            <Badge variant={item.isActive ? 'success' : 'destructive'}>
                              {item.isActive ? 'Hiển thị' : 'Ẩn'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            {item.roles.length ? (
                              <div className="flex flex-wrap gap-1">
                                {item.roles.map((role) => (
                                  <Badge key={role} variant="outline" className="text-xs">
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">Mặc định</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleItemEdit(item)}>
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleItemDelete(item)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {flattenedItems.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center text-sm text-muted-foreground">
                            Chưa có mục nào trong menu này.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-xl border border-border/80 bg-background/70 p-6 shadow-sm">
                <h2 className="text-lg font-semibold">
                  {itemForm.id ? 'Chỉnh sửa mục menu' : 'Thêm mục menu mới'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Thêm liên kết hoặc submenu mới cho menu.
                </p>

                <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={handleItemSubmit}>
                  <label className="grid gap-2 text-sm">
                    <span>Tiêu đề</span>
                    <Input
                      value={itemForm.label}
                      onChange={(event) => setItemForm((prev) => ({ ...prev, label: event.target.value }))}
                      required
                    />
                  </label>
                  <label className="grid gap-2 text-sm">
                    <span>Đường dẫn</span>
                    <Input
                      value={itemForm.href}
                      onChange={(event) => setItemForm((prev) => ({ ...prev, href: event.target.value }))}
                      required
                      list="navigation-href-suggestions"
                    />
                    <datalist id="navigation-href-suggestions">
                      {postOptions.map((post) => (
                        <option
                          key={`post-${post.id}`}
                          value={`/posts/${post.slug}`}
                          label={`Bài viết: ${post.title}`}
                        />
                      ))}
                      {categoryOptions.map((category) => (
                        <option
                          key={`category-${category.id}`}
                          value={`/danh-muc/${category.slug}`}
                          label={`Danh mục: ${category.name}`}
                        />
                      ))}
                    </datalist>
                    {loadingMetadata && (
                      <span className="text-xs text-muted-foreground">Đang tải gợi ý...</span>
                    )}
                  </label>
                  <label className="grid gap-2 text-sm">
                    <span>Biểu tượng</span>
                    <Input
                      value={itemForm.icon}
                      onChange={(event) => setItemForm((prev) => ({ ...prev, icon: event.target.value }))}
                      placeholder="vd: lucide-home"
                      list="navigation-icon-presets"
                    />
                    <datalist id="navigation-icon-presets">
                      {ICON_PRESET_SUGGESTIONS.map((icon) => (
                        <option key={icon} value={icon} />
                      ))}
                    </datalist>
                  </label>
                  <label className="grid gap-2 text-sm">
                    <span>Thuộc tính target</span>
                    <Input
                      value={itemForm.target}
                      onChange={(event) => setItemForm((prev) => ({ ...prev, target: event.target.value }))}
                      placeholder="vd: _blank"
                      list="navigation-target-options"
                    />
                    <datalist id="navigation-target-options">
                      {TARGET_OPTION_PRESETS.map((option) => (
                        <option key={option.value || 'default-target'} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </datalist>
                  </label>
                  <label className="grid gap-2 text-sm">
                    <span>Thứ tự</span>
                    <Input
                      type="number"
                      value={itemForm.order}
                      onChange={(event) => setItemForm((prev) => ({ ...prev, order: Number(event.target.value) }))}
                    />
                  </label>
                  <label className="grid gap-2 text-sm">
                    <span>Thuộc submenu</span>
                    <select
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      value={itemForm.parentId}
                      onChange={(event) => setItemForm((prev) => ({ ...prev, parentId: event.target.value }))}
                    >
                      <option value="">(Mục cấp 1)</option>
                      {parentOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm">
                    <span>Quyền hạn (cách nhau bởi dấu phẩy)</span>
                    <Input
                      value={itemForm.roles}
                      onChange={(event) => setItemForm((prev) => ({ ...prev, roles: event.target.value }))}
                      placeholder="vd: ADMIN, EDITOR"
                      list="navigation-role-options"
                    />
                    <datalist id="navigation-role-options">
                      {roleOptions.map((role) => (
                        <option key={role} value={role} />
                      ))}
                    </datalist>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={itemForm.isActive}
                      onChange={(event) =>
                        setItemForm((prev) => ({ ...prev, isActive: event.target.checked }))
                      }
                    />
                    <span>Hiển thị trên menu</span>
                  </label>
                  <div className="md:col-span-2 flex justify-end gap-2">
                    {itemForm.id && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setItemForm(createEmptyItemForm())}
                      >
                        Hủy chỉnh sửa
                      </Button>
                    )}
                    <Button type="submit" disabled={savingItem}>
                      {savingItem ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      {itemForm.id ? 'Cập nhật mục menu' : 'Thêm mục menu'}
                    </Button>
                  </div>
                </form>
              </section>
            </>
          ) : loading ? (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải dữ liệu...
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-border/80 bg-background/70 text-center text-sm text-muted-foreground">
              <p>Chưa có menu nào. Tạo menu mới để bắt đầu.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
