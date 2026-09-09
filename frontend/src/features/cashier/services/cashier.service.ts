import { api } from "@/lib/api";
import type {
  CashierCheckoutPayload,
  CashierResponse,
  ProductListResponse,
  ProductQuery,
} from "../types/cashier-types";

export const cashierService = {
  async checkout(payload: CashierCheckoutPayload) {
    const response = await api.post<CashierResponse>("/cashier", payload);
    return response.data;
  },

  async listProduct(query: ProductQuery = {}): Promise<ProductListResponse> {
    const response = await api.get<ProductListResponse>(
      "/cashier/list-products",
      {
        params: query,
      },
    );

    return response.data;
  },
};
