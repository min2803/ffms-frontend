import axiosClient from "../api/axiosClient";

const ENDPOINT = "/budgets";

const budgetService = {
  /**
   * POST /budgets
   * Thiết lập ngân sách mới.
   */
  setBudget(data) {
    return axiosClient.post(ENDPOINT, data);
  },

  /**
   * GET /budgets/current
   * Lấy ngân sách tháng hiện tại (server time).
   */
  getCurrentBudget() {
    return axiosClient.get(`${ENDPOINT}/current`);
  },

  /**
   * GET /budgets/history
   * Lấy lịch sử ngân sách theo tháng.
   */
  getBudgetHistory(limit = 12, offset = 0) {
    return axiosClient.get(`${ENDPOINT}/history`, { params: { limit, offset } });
  },

  /**
   * GET /budgets?month=&year=
   * Lấy ngân sách theo tháng (legacy).
   */
  getBudget(month, year = new Date().getFullYear()) {
    return axiosClient.get(ENDPOINT, { params: { month, year } });
  },

  /**
   * PUT /budgets/:id
   * Cập nhật ngân sách theo ID.
   */
  updateBudget(id, data) {
    return axiosClient.put(`${ENDPOINT}/${id}`, data);
  },

  /**
   * DELETE /budgets/:id
   * Xoá ngân sách theo ID.
   */
  deleteBudget(id) {
    return axiosClient.delete(`${ENDPOINT}/${id}`);
  },
};

export default budgetService;
