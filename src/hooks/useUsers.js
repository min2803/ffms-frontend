import { useState, useEffect, useCallback } from "react";
import userService from "../services/modules/userService";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAdminUsers({
        search: params.search ?? search,
        page: params.page ?? pagination.page,
        limit: params.limit ?? pagination.limit,
      });
      const payload = data?.data ?? data;
      setUsers(payload?.users ?? (Array.isArray(payload) ? payload : []));
      if (payload?.pagination) setPagination(payload.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [search, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const searchUsers = useCallback((term) => {
    setSearch(term);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const deleteUser = useCallback(async (id) => {
    try {
      await userService.adminDeleteUser(id);
      await fetchUsers();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchUsers]);

  const updateRole = useCallback(async (id, role_id) => {
    try {
      await userService.adminUpdateRole(id, role_id);
      await fetchUsers();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchUsers]);

  return {
    users,
    pagination,
    loading,
    error,
    refetch: fetchUsers,
    searchUsers,
    deleteUser,
    updateRole,
  };
}
