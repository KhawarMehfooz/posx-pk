import { apiClient } from "@/utils/apiClient";
import { getUserToken } from "./token";
import type { AxiosRequestConfig, AxiosResponse } from "axios";

// Allowed HTTP methods
export type HttpMethod = "get" | "post" | "put" | "delete";

/**
 * Sends an HTTP request with the specified method, URL, and optional data.
 * Automatically attaches the user's authentication token to the request headers.
 */
export const makeApiRequest = async <T = any>(
  method: HttpMethod,
  url: string,
  data: Record<string, any> | null = null,
  skipAuth: boolean = false
): Promise<T> => {
  try {
    const config: AxiosRequestConfig = {};

    // Add Authorization header if not skipped
    if (!skipAuth) {
      const token = await getUserToken();
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }

    // Add JSON content type if sending data
    if (data) {
      config.headers = {
        ...(config.headers || {}),
        "Content-Type": "application/json",
      };
    }

    let response: AxiosResponse<T>;

    switch (method) {
      case "get":
        config.params = data || undefined;
        response = await apiClient.get<T>(url, config);
        break;

      case "post":
        response = await apiClient.post<T>(url, data, config);
        break;

      case "put":
        response = await apiClient.put<T>(url, data, config);
        break;

      case "delete":
        response = await apiClient.delete<T>(url, config);
        break;

      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }

    return response.data;
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} ${url}:`, error);
    throw error;
  }
};
