export interface User {
  id: string;
  email: string;
  ad: string;
  soyad: string;
  fullName?: string;
  tenantId: number;
  rolId: string;
  rolAdi: string;
  avatar?: string;
  isActive: boolean;
  lastLoginDate?: Date;
  permissions?: string[];
}
