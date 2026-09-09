export interface RawMaterialConversion {
  id: string;
  unitId: string;
  factor: number;

  unit: {
    id: string;
    name: string;
    code: string;
  };
}

export interface RawMaterial {
  id: string;
  tenantId: string;
  unitId: string;
  name: string;
  sku: string | null;
  averageCost: number;
  status: boolean;
  minimumStock: number;
  unit: {
    id: string;
    name: string;
    code: string;
  };
  stock: {
    minimumStock: number;
  };

  conversions: RawMaterialConversion[];
  createdAt: string;
  updatedAt: string;
}

export interface RawMaterialQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: boolean;
}

export interface RawMaterialListResponse {
  data: RawMaterial[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
