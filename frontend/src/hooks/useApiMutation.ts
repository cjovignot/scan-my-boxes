// frontend/src/hooks/useApiMutation.ts

import { useState } from "react";
import axiosClient from "../api/axiosClient";
import axios from "axios";

type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

interface MutationOptions<TData = unknown> {
  onSuccess?: (data: TData) => void;
  onError?: (error: unknown) => void;
}

export function useApiMutation<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  method: HttpMethod,
  options: MutationOptions<TResponse> = {}
) {
  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (body?: TBody) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.request<TResponse>({
        url: endpoint,
        method,
        data: body,
      });

      setData(response.data);
      options.onSuccess?.(response.data);
      return response.data;

    } catch (err: unknown) {
      console.error("❌ API Mutation Error:", err);

      let message = "Erreur inconnue";

      // ✅ SI c'est une erreur Axios → on récupère le vrai message du serveur
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.error || err.message || message;
      }

      setError(message);
      options.onError?.(err);
      throw err;

    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
}