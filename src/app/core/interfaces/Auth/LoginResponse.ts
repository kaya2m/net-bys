export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    ad: string;
    soyad: string;
    tenantId: number;
    rolId: string;
    rolAdi: string;
  };
}
