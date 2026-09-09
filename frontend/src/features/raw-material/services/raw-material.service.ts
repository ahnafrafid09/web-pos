import { api } from "@/lib/api";
import type {
  RawMaterial,
  RawMaterialListResponse,
  RawMaterialQuery,
} from "../types/raw-material-types";
import { RawMaterialFormValues } from "../schemas/raw-material-schema";
import { Console } from "console";

export const rawMaterialService = {
  async findAll(
    query: RawMaterialQuery = {},
  ): Promise<RawMaterialListResponse> {
    const response = await api.get<RawMaterialListResponse>("/raw-material", {
      params: query,
    });

    return response.data;
  },

  async findOne(id: string): Promise<RawMaterial> {
    const response = await api.get<RawMaterial>(`/raw-material/${id}`);

    return response.data;
  },

  async createRawMaterial(data: RawMaterialFormValues) {
    // console.log(data);
    const response = await api.post("/raw-material", data);

    return response.data;
  },

  async updateRawMaterial(id: string, data: RawMaterialFormValues) {
    const response = await api.patch(`/raw-material/${id}`, data);

    return response.data;
  },

  async updateStatus(id: string, data: { status: boolean }) {
    const response = await api.patch(`/raw-material/${id}/status`, data);

    return response.data;
  },
};
