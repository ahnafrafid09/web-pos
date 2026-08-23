import { api } from "@/lib/api";
import { CategoryListResponse, CategoryQuery } from "../types/category-types";
import { CategoryFormValues } from "../schemas/category-schemas";

export const categoryService = {
  async findAll(query: CategoryQuery = {}): Promise<CategoryListResponse> {
    const response = await api.get<CategoryListResponse>("/category", {
      params: query,
    });

    return response.data;
  },

  async createCategory(data: CategoryFormValues) {
    // console.log(data);
    const response = await api.post("/category", data);

    return response.data;
  },

  async updateCategory(id: string, data: CategoryFormValues) {
    const response = await api.patch(`/category/${id}`, data);

    return response.data;
  },

  async updateStatus(id: string, data: { status: boolean }) {
    const response = await api.patch(`/category/${id}/status`, data);

    return response.data;
  },
};
