import axiosClient from "../api/axiosClient";

const ENDPOINT = "/categories";

const categoryService = {
  getCategories(params = {}) {
    return axiosClient.get(ENDPOINT, { params });
  },

  getCategoryById(id) {
    return axiosClient.get(`${ENDPOINT}/${id}`);
  },

  createCategory(data) {
    return axiosClient.post(ENDPOINT, data);
  },

  updateCategory(id, data) {
    return axiosClient.put(`${ENDPOINT}/${id}`, data);
  },

  deleteCategory(id) {
    return axiosClient.delete(`${ENDPOINT}/${id}`);
  },
};

export default categoryService;
