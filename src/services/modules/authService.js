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

    // Lưu token từ phản hồi (tuỳ chỉnh key theo API backend)
    const token = response?.accessToken || response?.token;
    if (token) {
      localStorage.setItem("accessToken", token);
    }

    // Lưu refresh token nếu có
    const refresh = response?.refreshToken;
    if (refresh) {
      localStorage.setItem("refreshToken", refresh);
    }

    return response;
  },

  /**
   * GET /auth/me
   * Lấy thông tin người dùng hiện tại đang đăng nhập.
   * Token được tự động đính kèm qua interceptor của axiosClient.
   */
  getMe() {
    return axiosClient.get(`${ENDPOINT}/me`);
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
    }
  },

  /**
   * POST /auth/refresh
   * Đổi refresh token lấy access token mới.
   */
  async refreshToken(refreshToken) {
    const response = await axiosClient.post(`${ENDPOINT}/refresh`, {
      refreshToken,
    });

    // Lưu access token mới
    const newToken = response?.accessToken || response?.token;
    if (newToken) {
      localStorage.setItem("accessToken", newToken);
    }

    // Lưu refresh token mới nếu server xoay vòng token
    const newRefresh = response?.refreshToken;
    if (newRefresh) {
      localStorage.setItem("refreshToken", newRefresh);
    }

    return response;
  },
};

export default authService;
