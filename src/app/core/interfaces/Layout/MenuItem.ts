export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  badge?: string;
  badgeClass?: string;
  children?: MenuItem[];
  roles?: string[];
  permissions?: string[];
  isActive?: boolean;
  isExpanded?: boolean;
}
