export interface NavigationMenuItem {
  id: string;
  label: string;
  href: string;
  icon?: string | null;
  target?: string | null;
  order: number;
  isActive: boolean;
  roles: string[];
  parentId?: string | null;
  children?: NavigationMenuItem[];
}

export interface NavigationMenu {
  id: string;
  name: string;
  description?: string | null;
  isDefault: boolean;
  items: NavigationMenuItem[];
  createdAt: string;
  updatedAt: string;
}
