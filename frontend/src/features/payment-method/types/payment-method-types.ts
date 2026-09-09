export type UsageType = "PURCHASE" | "TRANSACTION" | "BOTH";

export interface PaymentMethod {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  usageType: UsageType;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodQuery {
  page?: number;
  limit?: number;
  search?: string;
  usageType?: UsageType;
  status?: boolean;
}

export interface PaymentMethodListResponse {
  data: PaymentMethod[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
