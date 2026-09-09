import { api } from "@/lib/api";
import {
  PaymentMethodListResponse,
  PaymentMethodQuery,
} from "../types/payment-method-types";
import { PaymentMethodFormValues } from "../schemas/payment-method-schemas";

export const paymentMethodService = {
  async findAll(
    query: PaymentMethodQuery = {},
  ): Promise<PaymentMethodListResponse> {
    const response = await api.get<PaymentMethodListResponse>(
      "/payment-method",
      {
        params: query,
      },
    );

    return response.data;
  },

  async create(data: PaymentMethodFormValues) {
    const response = await api.post("/payment-method", data);

    return response.data;
  },

  async update(id: string, data: PaymentMethodFormValues) {
    const response = await api.patch(`/payment-method/${id}`, data);

    return response.data;
  },

  async updateStatus(id: string, data: { status: boolean }) {
    const response = await api.patch(`/payment-method/${id}/status`, data);

    return response.data;
  },
};
