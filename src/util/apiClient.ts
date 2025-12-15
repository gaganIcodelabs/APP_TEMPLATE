import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import Decimal from 'decimal.js';
import appSettings from '@config/settings';
import { ENV } from '@constants/env';
import { ApiErrorData } from '@appTypes/index';
import { types as sdkTypes, transit } from './sdkLoader';

/**
 * Type handler configuration for SDK types
 */
interface TypeHandler {
  type: any;
  customType: any;
  writer: (v: any) => any;
  reader: (v: any) => any;
}

/**
 * API request options extending Axios config
 */
interface ApiRequestOptions
  extends Omit<AxiosRequestConfig, 'url' | 'method' | 'data'> {
  body?: any;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
}

/**
 * Get the API base URL
 * For React Native, you'll need to use your actual server URL
 * @param {string} marketplaceRootURL - Optional marketplace root URL
 * @returns {string} Base URL for API requests
 */
export const apiBaseUrl = (marketplaceRootURL?: string): string => {
  const port = ENV.DEV_API_SERVER_PORT;
  const useDevApiServer = __DEV__ && !!port;

  // In development, connect to dev API server
  if (useDevApiServer) {
    // For Android emulator, use 10.0.2.2 instead of localhost
    // For iOS simulator, localhost works fine
    // For physical devices, use your computer's IP address
    return `http://localhost:${port}`;
  }

  // Otherwise, use the provided marketplace URL or default
  return marketplaceRootURL
    ? marketplaceRootURL.replace(/\/$/, '')
    : ENV.API_URL;
};

/**
 * Application type handlers for JS SDK
 * NOTE: keep in sync with `typeHandlers` in `server/api-util/sdk.js`
 */
export const typeHandlers: TypeHandler[] = [
  {
    type: sdkTypes.BigDecimal,
    customType: Decimal,
    writer: (v: Decimal) => new sdkTypes.BigDecimal(v.toString()),
    reader: (v: { value: string }) => new Decimal(v.value),
  },
];

/**
 * Serialize data to Transit format
 */
const serialize = (data: any): string => {
  return transit.write(data, {
    typeHandlers,
    verbose: appSettings.sdk.transitVerbose,
  });
};

/**
 * Deserialize Transit format data
 */
const deserialize = <T = any>(str: string): T => {
  return transit.read(str, { typeHandlers });
};

/**
 * Create configured Axios instance
 */
const createApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: apiBaseUrl(),
    // timeout: 30000,
    withCredentials: true, // Similar to credentials: 'include'
    headers: {
      'Content-Type': 'application/transit+json',
    },
  });

  // Request interceptor - serialize body if needed
  instance.interceptors.request.use(
    config => {
      const contentType = config.headers?.['Content-Type'] as
        | string
        | undefined;

      // Serialize body if content type is transit+json and body exists
      if (
        contentType === 'application/transit+json' &&
        config.data &&
        config.method !== 'get'
      ) {
        config.data = serialize(config.data);
        // Ensure we're sending as text, not JSON
        config.transformRequest = [data => data];
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor - deserialize response if needed
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const contentType = response.headers['content-type'] as
        | string
        | undefined;
      const actualContentType = contentType ? contentType.split(';')[0] : null;

      // Deserialize transit responses
      if (
        actualContentType === 'application/transit+json' &&
        typeof response.data === 'string'
      ) {
        response.data = deserialize(response.data);
      }
      // JSON responses are already parsed by Axios
      // Text responses remain as is

      return response;
    },
    (error: AxiosError) => {
      // Handle error responses
      if (error.response) {
        const statusCode = error.response.status;

        if (statusCode >= 400) {
          const contentType = error.response.headers['content-type'] as
            | string
            | undefined;
          const actualContentType = contentType
            ? contentType.split(';')[0]
            : null;

          let errorData: any = error.response.data;

          // Handle different content types in error responses
          if (
            actualContentType === 'application/transit+json' &&
            typeof errorData === 'string'
          ) {
            errorData = deserialize(errorData);
          } else if (actualContentType === 'application/json') {
            // Axios already parses JSON, so errorData is already an object
            // If it's a string, it needs parsing (shouldn't happen with Axios)
            if (typeof errorData === 'string') {
              try {
                errorData = JSON.parse(errorData);
              } catch (e) {
                e;
                // If parsing fails, keep as string
              }
            }
          }
          // For plain text or other types, errorData remains as is

          // Create error object similar to original implementation
          const apiError = new Error(
            errorData?.message || 'API Error',
          ) as unknown as ApiErrorData;
          Object.assign(apiError, errorData);
          return Promise.reject(apiError);
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

// Create the API client instance
const apiClient: AxiosInstance = createApiClient();

/**
 * Generic request method
 * @param {string} path - API endpoint path
 * @param {ApiRequestOptions} options - Request options
 * @returns {Promise<T>} Response data
 */
export const request = async <T = any>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const { body, headers, method = 'GET', ...rest } = options;

  try {
    const response = await apiClient.request<T>({
      url: path,
      method,
      data: body,
      headers: headers || undefined,
      ...rest,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * POST request helper
 * @param {string} path - API endpoint path
 * @param {any} body - Request body
 * @param {ApiRequestOptions} options - Additional options
 * @returns {Promise<T>} Response data
 */
export const post = <T = any>(
  path: string,
  body?: any,
  options: ApiRequestOptions = {},
): Promise<T> => {
  return request<T>(path, {
    ...options,
    method: 'POST',
    body,
  });
};

/**
 * GET request helper
 * @param {string} path - API endpoint path
 * @param {ApiRequestOptions} options - Additional options
 * @returns {Promise<T>} Response data
 */
export const get = <T = any>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  return request<T>(path, {
    ...options,
    method: 'GET',
  });
};

/**
 * PUT request helper
 * @param {string} path - API endpoint path
 * @param {any} body - Request body
 * @param {ApiRequestOptions} options - Additional options
 * @returns {Promise<T>} Response data
 */
export const put = <T = any>(
  path: string,
  body?: any,
  options: ApiRequestOptions = {},
): Promise<T> => {
  return request<T>(path, {
    ...options,
    method: 'PUT',
    body,
  });
};

/**
 * PATCH request helper
 * @param {string} path - API endpoint path
 * @param {any} body - Request body
 * @param {ApiRequestOptions} options - Additional options
 * @returns {Promise<T>} Response data
 */
export const patch = <T = any>(
  path: string,
  body?: any,
  options: ApiRequestOptions = {},
): Promise<T> => {
  return request<T>(path, {
    ...options,
    method: 'PATCH',
    body,
  });
};

/**
 * DELETE request helper
 * @param {string} path - API endpoint path
 * @param {ApiRequestOptions} options - Additional options
 * @returns {Promise<T>} Response data
 */
export const del = <T = any>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  return request<T>(path, {
    ...options,
    method: 'DELETE',
  });
};

export default {
  request,
  post,
  get,
  put,
  patch,
  delete: del,
  apiClient, // Export raw axios instance for advanced usage
};
