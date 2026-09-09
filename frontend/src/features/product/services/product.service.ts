import { api } from "@/lib/api";
import type {
  Product,
  ProductListResponse,
  ProductQuery,
} from "../types/product-types";
import { ProductFormValues } from "../schemas/product-schema";
import { Console } from "console";

export const productService = {
  async findAll(query: ProductQuery = {}): Promise<ProductListResponse> {
    const response = await api.get<ProductListResponse>("/product", {
      params: query,
    });

    return response.data;
  },

  async findOne(id: string): Promise<Product> {
    const response = await api.get<Product>(`/product/${id}`);

    return response.data;
  },

  async createProduct(data: ProductFormValues) {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("categoryId", data.categoryId);
    formData.append("type", data.type);
    formData.append("sku", data.sku || "");
    formData.append("unit", data.unit);
    formData.append("hpp", String(data.hpp));
    formData.append("sellingPrice", String(data.sellingPrice));

    if (data.image instanceof File) {
      formData.append("imageUrl", data.image);
    }

    console.log(formData);

    return api.post("/product", formData);
  },
  async updateProduct(id: string, data: ProductFormValues) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("categoryId", data.categoryId);
    formData.append("type", data.type);
    formData.append("sku", data.sku || "");
    formData.append("unit", data.unit);
    formData.append("hpp", String(data.hpp));
    formData.append("sellingPrice", String(data.sellingPrice));

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    console.log("FORM DATA:");

    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    return api.patch(`/product/${id}`, formData);
  },

  async updateStatus(id: string, data: { status: boolean }) {
    const response = await api.patch(`/product/${id}/status`, data);

    return response.data;
  },
};
