import { useState, useEffect, useCallback } from "react";
import axiosClient from "../services/api/axiosClient";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function useAdminData(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get(`/admin/${endpoint}`);
      setData(res?.data || res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
