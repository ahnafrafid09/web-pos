export type Role = "ADMIN" | "CASHIER" | "OWNER";

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  username: string;
  role: Role;
  status: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface UserQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
  role?: Role;
}

export interface UserListResponse {
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
