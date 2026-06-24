import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../lib/apiClient";

export function useApiData<T>(fetcher: (token: string) => Promise<T>) {
  const { accessToken } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (!accessToken) return;
    setIsLoading(true);
    setError(null);
    fetcher(accessToken)
      .then(setData)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Failed to load data"),
      )
      .finally(() => setIsLoading(false));
  }, [accessToken, fetcher]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, isLoading, error, reload };
}
