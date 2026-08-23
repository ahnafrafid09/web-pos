import { api } from "@/lib/api";
import type { ProductListResponse, ProductQuery } from "../types/product-types";
import { ProductFormValues } from "../schemas/product-schema";

export const productService = {
  async findAll(query: ProductQuery = {}): Promise<ProductListResponse> {
    const response = await api.get<ProductListResponse>("/product", {
      params: query,
    });

    return response.data;
  },

  async createProduct(data: ProductFormValues) {
    // console.log(data);
    const response = await api.post("/product", data);

    return response.data;
  },

  async updateProduct(id: string, data: ProductFormValues) {
    const response = await api.patch(`/product/${id}`, data);

    return response.data;
  },

  async updateStatus(id: string, data: { status: boolean }) {
    const response = await api.patch(`/product/${id}/status`, data);

    return response.data;
  },
};
