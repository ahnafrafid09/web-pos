export interface Supplier {
  id: string;
  tenantId: string;
  name: string;
  status: boolean;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
}

export interface SupplierListResponse {
  data: Supplier[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
