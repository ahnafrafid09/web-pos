import { api } from "@/lib/api";
import { SupplierListResponse, SupplierQuery } from "../types/supplier-types";
import { SupplierFormValues } from "../schemas/supplier-schemas";

export const supplierService = {
  async findAll(query: SupplierQuery = {}): Promise<SupplierListResponse> {
    const response = await api.get<SupplierListResponse>("/supplier", {
      params: query,
    });

    return response.data;
  },

  async create(data: SupplierFormValues) {
    // console.log(data);
    const response = await api.post("/supplier", data);

    return response.data;
  },

  async update(id: string, data: SupplierFormValues) {
    const response = await api.patch(`/supplier/${id}`, data);

    return response.data;
  },

  async updateStatus(id: string, data: { status: boolean }) {
    const response = await api.patch(`/supplier/${id}/status`, data);

    return response.data;
  },
};
