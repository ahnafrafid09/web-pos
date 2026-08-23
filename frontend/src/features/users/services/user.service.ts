import { api } from "@/lib/api";
import { UserListResponse, UserQuery } from "../types/user-types";
import { UserFormValues } from "../schemas/user-schemas";

export const userService = {
  async findAll(query: UserQuery = {}): Promise<UserListResponse> {
    const response = await api.get<UserListResponse>("/users", {
      params: query,
    });

    return response.data;
  },

  async createUser(data: UserFormValues) {
    // console.log(data);
    const response = await api.post("/users", data);

    return response.data;
  },

  async updateUser(id: string, data: UserFormValues) {
    const response = await api.patch(`/users/${id}`, data);

    return response.data;
  },

  async updateStatus(id: string, data: { status: boolean }) {
    const response = await api.patch(`/users/${id}/status`, data);

    return response.data;
  },
};
