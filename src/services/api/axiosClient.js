import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Interceptor Yêu cầu ─────────────────────────────────────────────
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("[Lỗi Yêu cầu]", error);
    return Promise.reject(error);
  }
);

// ── Interceptor Phản hồi ────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
}

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { response, config } = error;

    if (response) {
      const { status, data } = response;

      if (status === 401 && !config._isRetry) {
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then((token) => {
              config.headers.Authorization = `Bearer ${token}`;
              config._isRetry = true;
              return axiosClient(config);
            });
          }

          isRefreshing = true;
          config._isRetry = true;

          try {
            const res = await axiosClient.post("/auth/refresh", { refreshToken });
            // axiosClient interceptor đã unwrap response.data → res = { success, data: { accessToken, refreshToken } }
            const newToken = res?.data?.accessToken;
            if (newToken) {
              localStorage.setItem("accessToken", newToken);
              const newRefresh = res?.data?.refreshToken;
              if (newRefresh) localStorage.setItem("refreshToken", newRefresh);
              axiosClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
              processQueue(null, newToken);
              config.headers.Authorization = `Bearer ${newToken}`;
              return axiosClient(config);
            }
          } catch (refreshError) {
            processQueue(refreshError, null);
          } finally {
            isRefreshing = false;
          }
        }

        // Refresh thất bại hoặc không có refresh token — xóa và redirect
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      switch (status) {
        case 403:
          console.warn("[403] Bị cấm — không đủ quyền truy cập.");
          break;
        case 404:
          console.warn("[404] Không tìm thấy tài nguyên.");
          break;
        case 500:
          console.error("[500] Lỗi máy chủ nội bộ.");
          break;
        default:
          console.error(`[${status}]`, data?.message || "Lỗi không xác định.");
      }
    } else {
      console.error("[Lỗi Mạng]", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
