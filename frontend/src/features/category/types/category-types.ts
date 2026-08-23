export interface Category {
  id: string;
  tenantId: string;
  name: string;
  status: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CategoryQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
}

export interface CategoryListResponse {
  data: Category[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
