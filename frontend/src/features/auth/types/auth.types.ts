export type UserRole = "SUPER_ADMIN" | "OWNER" | "ADMIN" | "CASHIER";

export type ModuleCode =
  | "SALES"
  | "INVENTORY"
  | "PURCHASE"
  | "RECIPE"
  | "REPORTING";

export type TenantModuleStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "EXPIRED"
  | "SUSPENDED";

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

export interface MeModule {
  code: ModuleCode;
  status: TenantModuleStatus;
  startedAt: string | null;
  expiredAt: string | null;
}

export interface MeResponse {
  tenant: Tenant | null;
  user: User;
  modules: MeModule[];
}
