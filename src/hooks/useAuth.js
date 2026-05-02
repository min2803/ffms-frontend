import { useState, useCallback } from "react";
import authService from "../services/modules/authService";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      const userData = response?.data?.user || response?.user || response;
      setUser(userData);
      return response;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      return response;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.getMe();
      setUser(response?.data?.user || response?.data || response?.user || response);
      return response;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error("[Logout Error]", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, login, register, getMe, logout };
}
