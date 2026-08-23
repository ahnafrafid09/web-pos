export type ProductType = "MENU" | "MERCHANDISE";

export interface Product {
  id: string;
  tenantId: string;
  categoryId: string;

  name: string;
  type: ProductType;

  sku: string | null;
  unit: string;

  sellingPrice: number;
  status: boolean;

  category?: {
    id: string;
    name: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  categoryId?: string;
  status?: boolean;
}

export interface ProductListResponse {
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
