import axios from "axios";
import { axiosInstance } from "./axiosInstance";
import type { ApiResponse, AuthData } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function isSuccess<T>(res: ApiResponse<T>): res is ApiResponse<T> & { success: true; data: T } {
  return res.success === true;
}

export const authApi = {
  async login(email: string, password: string) {
    const { data } = await axiosInstance.post<ApiResponse<AuthData>>("/auth/login", {
      email,
      password,
    });
    if (!isSuccess(data)) {
      throw new Error(data.message ?? "Login failed");
    }
    return data.data;
  },

  async register(name: string, email: string, password: string) {
    const { data } = await axiosInstance.post<ApiResponse<AuthData>>("/auth/register", {
      name,
      email,
      password,
    });
    if (!isSuccess(data)) {
      throw new Error(data.message ?? "Registration failed");
    }
    return data.data;
  },

  async refresh() {
    const { data } = await axios.post<ApiResponse<AuthData>>(`${API_URL}/auth/refresh`, undefined, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    if (!isSuccess(data)) {
      throw new Error(data.message ?? "Refresh failed");
    }
    return data.data;
  },

  async logout() {
    await axiosInstance.post("/auth/logout");
  },
};
