import axiosClient from "../api/axiosClient";

const ENDPOINT = "/auth";

const authService = {
  /**
   * POST /auth/register
   * Đăng ký tài khoản người dùng mới.
   */
  register(data) {
    return axiosClient.post(`${ENDPOINT}/register`, data);
  },

  /**
   * POST /auth/login
   * Đăng nhập → lưu accessToken vào localStorage.
   */
  async login(data) {
    const response = await axiosClient.post(`${ENDPOINT}/login`, data);

    // Interceptor unwrap axios response.data → response = { success, message, data: { user, accessToken, refreshToken } }
    // Token nằm trong response.data (inner payload)
    const inner = response?.data ?? response;
    const token = inner?.accessToken || inner?.token;
    if (token) {
      localStorage.setItem("accessToken", token);
    }

    const refresh = inner?.refreshToken;
    if (refresh) {
      localStorage.setItem("refreshToken", refresh);
    }

    return response;
  },

  /**
   * GET /users/profile
   * Lấy thông tin người dùng hiện tại đang đăng nhập.
   */
  getMe() {
    return axiosClient.get("/users/profile");
  },

  /**
   * POST /auth/logout
   * Đăng xuất → xoá token khỏi localStorage.
   */
  async logout() {
    try {
      await axiosClient.post(`${ENDPOINT}/logout`);
    } finally {
      // Luôn xoá token dù request thất bại
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole"); // Xóa role để tránh redirect sai sau logout
    }
  },

  forgotPassword(email) {
    return axiosClient.post(`${ENDPOINT}/forgot-password`, { email });
  },

  resetPassword(token, newPassword) {
    return axiosClient.post(`${ENDPOINT}/reset-password`, { token, newPassword });
  },

  /**
   * POST /auth/refresh
   * Đổi refresh token lấy access token mới.
   */
  async refreshToken(refreshToken) {
    const response = await axiosClient.post(`${ENDPOINT}/refresh`, {
      refreshToken,
    });

    const result = response?.data || response;

    // Lưu access token mới
    const newToken = result?.accessToken || result?.token;
    if (newToken) {
      localStorage.setItem("accessToken", newToken);
    }

    // Lưu refresh token mới nếu server xoay vòng token
    const newRefresh = result?.refreshToken;
    if (newRefresh) {
      localStorage.setItem("refreshToken", newRefresh);
    }

    return response;
  },
};

export default authService;
