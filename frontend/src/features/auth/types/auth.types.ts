export type UserRole = "SUPER_ADMIN" | "OWNER" | "ADMIN" | "CASHIER";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status?: boolean;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  tenantId: string | null;
  status?: boolean;
  tenant?: Tenant | null;
}

export interface RegisterDto {
  tenantName: string;
  tenantSlug: string;

  ownerName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: User;
}
export interface MeResponse {
  tenant: Tenant | null;
  user: User;
}
