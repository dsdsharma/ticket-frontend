import { axiosInstance } from "./axiosInstance";
import type { ApiResponse, User } from "./types";

function isSuccess<T>(res: ApiResponse<T>): res is ApiResponse<T> & { success: true; data: T } {
  return res.success === true;
}

export const userApi = {
  async getMe(): Promise<User> {
    const { data } = await axiosInstance.get<ApiResponse<User>>("/user/me");
    if (!isSuccess(data)) {
      throw new Error(data.message ?? "Failed to fetch user");
    }
    return data.data;
  },
};
