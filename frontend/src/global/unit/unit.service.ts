import { api } from "@/lib/api";
import type { Unit } from "./unit.types";

export const unitService = {
  async findAll(): Promise<Unit[]> {
    const { data } = await api.get("/unit");

    return data.data;
  },
};
