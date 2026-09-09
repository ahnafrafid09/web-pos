import { api } from "@/lib/api";

export const recipeService = {
  async findAll(productId: string) {
    try {
      const response = await api.get(`/product/${productId}/recipe`);

      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }

      throw error;
    }
  },

  async create(
    productId: string,
    payload: {
      items: {
        rawMaterialId: string;
        quantity: number;
        unitId: string;
      }[];
    },
  ) {
    const response = await api.post(`/product/${productId}/recipe`, payload);

    return response.data;
  },

  async update(
    productId: string,
    payload: {
      items: {
        rawMaterialId: string;
        quantity: number;
        unitId: string;
      }[];
    },
  ) {
    const response = await api.put(`/product/${productId}/recipe`, payload);

    return response.data;
  },
};
