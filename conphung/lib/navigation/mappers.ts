import type { NavigationMenu, NavigationMenuItem } from './types';

type MenuItemRecord = {
  id: string;
  label: string;
  href: string;
  icon: string | null;
  target: string | null;
  order: number;
  isActive: boolean;
  roles: string[];
  parentId: string | null;
  other_MenuItem?: MenuItemRecord[];
};

type MenuRecord = {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  MenuItem?: MenuItemRecord[];
};

export function mapMenuItems(records: MenuItemRecord[] = []): NavigationMenuItem[] {
  return records
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((record) => ({
      id: record.id,
      label: record.label,
      href: record.href,
      icon: record.icon ?? null,
      target: record.target ?? null,
      order: record.order,
      isActive: record.isActive,
      roles: record.roles ?? [],
      parentId: record.parentId ?? null,
      children: record.other_MenuItem ? mapMenuItems(record.other_MenuItem) : [],
    }));
}

export function mapMenuRecord(record: MenuRecord): NavigationMenu {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    isDefault: record.isDefault,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    items: mapMenuItems(record.MenuItem ?? []),
  };
}
