import axios from "axios";
import type { apiArgumentProps, fileArgumentProps } from "../interfaces/apiInterface";
import {
  runCatchErrorLogger,
  runTryErrorLogger,
  throwCatchError,
  throwTryError,
} from "../utils/response.handler";

export const API_URL = import.meta.env.VITE_API_URL;

/* ==============================================================
 * CREATE AXIOS INSTANCES
 * ============================================================== */

// Main instance for app requests
const apiService = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15000,
});

// Separate instance without interceptors for refreshing tokens
const tokenApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
});

/* ==============================================================
 * REQUEST INTERCEPTOR
 * ============================================================== */
apiService.interceptors.request.use(
  async (config) => {
    try {
      // Skip adding token for the refresh endpoint itself
      if (config.url?.includes("/get-access-token")) return config;

      const { data } = await tokenApi.get("/get-access-token");
      if (data?.accessToken) {
        config.headers["Authorization"] = `Bearer ${data.accessToken}`;
      }
    } catch (error) {
      console.warn("Token fetch failed in interceptor:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ==============================================================
 * RESPONSE INTERCEPTOR
 * ============================================================== */
apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use tokenApi to safely get a new token
        const { data } = await tokenApi.get("/get-access-token");

        if (data?.accessToken) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiService(originalRequest); 
        }
      } catch (err) {
        runCatchErrorLogger(err);
        throwCatchError(err);
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

/* ==============================================================
 * GENERIC CRUD METHODS
 * ============================================================== */

/**
 * Fetch a single resource
 */
export const fetchDatas = async ({ url, params = {} }: apiArgumentProps) => {
  try {
    const response = await apiService.get(url, { params });

    if (!response || !response.data) {
      throwTryError(response);
      runTryErrorLogger(response);
    }

    const data = Array.isArray(response.data) ? response.data[0] : response.data;
    return data;
  } catch (error: any) {
    runCatchErrorLogger(error);
    throwCatchError(error);
  }
};

/**
 * Fetch multiple resources
 */
export const fetchData = async ({ url, params = {} }: apiArgumentProps) => {
  try {
    const response = await apiService.get(url, { params });

    if (!response || !response.data) {
      throwTryError(response);
      runTryErrorLogger(response);
    }

    return response.data;
  } catch (error: any) {
    runCatchErrorLogger(error);
    throwCatchError(error);
  }
};

/**
 * Create a resource (POST)
 */
export const postDatas = async ({ url, data = {} }: apiArgumentProps) => {
  try {
    const response = await apiService.post(url, data);

    if (!response || !response.data) {
      throwTryError(response);
      runTryErrorLogger(response);
    }

    return response.data;
  } catch (error: any) {
    runCatchErrorLogger(error);
    throwCatchError(error);
  }
};

/**
 * Update a resource (PUT)
 */
export const putDatas = async ({ url, data = {}, params = {} }: apiArgumentProps) => {
  try {
    const response = await apiService.put(url, data, { params });

    if (!response || !response.data) {
      throwTryError(response);
      runTryErrorLogger(response);
    }

    return response.data;
  } catch (error: any) {
    runCatchErrorLogger(error);
    throwCatchError(error);
  }
};

/**
 * Delete a resource (DELETE)
 */
export const deleteDatas = async ({ url, params = {} }: apiArgumentProps) => {
  try {
    const response = await apiService.delete(url, { params });

    if (!response || !response.data) {
      throwTryError(response);
      runTryErrorLogger(response);
    }

    return response.data;
  } catch (error: any) {
    runCatchErrorLogger(error);
    throwCatchError(error);
  }
};

/* ==============================================================
 * UPLOAD & DOWNLOAD METHODS
 * ============================================================== */

/**
 * Upload a single file
 */
export const uploadAsset = async ({ url, file, onProgress }: fileArgumentProps) => {
  if (!file) throw new Error("No file provided");

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiService.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress(progress);
        }
      },
    });

    if (!response || !response.data) {
      throwTryError(response);
      runTryErrorLogger(response);
    }

    return response.data;
  } catch (error: any) {
    runCatchErrorLogger(error);
    throwCatchError(error);
  }
};

/**
 * Upload multiple files
 */
export const uploadAssets = async ({ url, files, onProgress }: fileArgumentProps) => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new Error("No files provided");
  }

  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await apiService.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    if (!response || !response.data) {
      throwTryError(response);
      runTryErrorLogger(response);
    }

    return response.data;
  } catch (error: any) {
    runCatchErrorLogger(error);
    throwCatchError(error);
  }
};

/**
 * Download a file
 */
export const downloadAsset = async ({
  url,
  params = {},
  filename = "file",
}: fileArgumentProps) => {
  if (!filename) throw new Error("No filename provided");

  try {
    const response = await apiService.get(url, {
      params,
      responseType: "blob",
    });

    if (!response || !response.data) {
      throwTryError(response);
      runTryErrorLogger(response);
    }

    const blobUrl = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);

    return true;
  } catch (error: any) {
    runCatchErrorLogger(error);
    throwCatchError(error);
  }
};
