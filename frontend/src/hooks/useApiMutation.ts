// frontend/src/hooks/useMutation.ts

import { useState } from "react";
import axiosClient from "../api/axiosClient";

type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

interface MutationOptions<TData = unknown> {
  onSuccess?: (data: TData) => void;
  onError?: (error: unknown) => void;
}

/**
 * Hook générique pour exécuter une requête API manuelle (POST, PUT, DELETE…)
 * @example
 * const { mutate, loading, error, data } = useApiMutation("/api/items", "POST");
 * mutate({ name: "Box" });
 */
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
    } catch (err) {
      console.error("API Mutation Error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Erreur inconnue lors de la requête";
      setError(message);
      options.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, loading, error };
}
