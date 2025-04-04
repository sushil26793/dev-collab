import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface UseApiOptions<T=unknown> {
  route: string;
  /** The HTTP method to use, e.g. 'GET' */
  method?: HttpMethod;
  /** The body/payload for POST, PUT, PATCH, etc. */
  data?: T;
  /** Optional axios config overrides */
  config?: AxiosRequestConfig;
  /** Whether to automatically fetch on mount/update */
  autoFetch?: boolean;
}

interface UseApiReturn<T = unknown> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** Manually trigger the API call */
  callApi: (overrideData?: Record<string, unknown>) => Promise<void>;
}


export function useApi<T = unknown>({
  route,
  method = 'GET',
  data,
  config,
  autoFetch = false,
}: UseApiOptions<T>): UseApiReturn<T> {
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<T | null>(null);

  const fullUrl = route;

  // Default configuration
  const defaultConfig: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  // Merge default config with user provided config.
  // Headers from user config will override default headers.
  const mergedConfig: AxiosRequestConfig = {
    ...defaultConfig,
    ...config,
    headers: {
      ...defaultConfig.headers,
      ...(config?.headers || {}),
    },
  };


  // The core API calling function
  const callApi = useCallback(
    async (overrideData?: Record<string,unknown>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios({
          url: fullUrl,
          method,
          data: overrideData !== undefined ? overrideData : data,
          ...mergedConfig,
        });

        if (response.data && response.data.errors && response.data.errors.length > 0) {
          setError(response.data.errors[0].message || 'An error occurred');
          setResponseData(null);
        } else {
          setResponseData(response.data.data);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred');

        }
      } finally {
        setLoading(false);
      }
    },
    [fullUrl, method, data, mergedConfig]
  );

  // Optionally call the API on mount/update
  useEffect(() => {
    if (autoFetch) {
      callApi();
    }
  }, [autoFetch, callApi]);

  return { data: responseData, loading, error, callApi };
}
