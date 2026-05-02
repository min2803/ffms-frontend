import { useState, useEffect, useCallback, useMemo } from "react";
import dashboardService from "../services/modules/dashboardService";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function useDashboard(params = {}) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stableParams = useMemo(() => params, [params.month, params.year]);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getSummary(stableParams);
      const payload = response?.data ?? response;
      setSummary(payload);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [stableParams]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const compare = useCallback(async (compareParams = {}) => {
    try {
      return await dashboardService.compare(compareParams);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, []);

  const expenseByCategory = useCallback(async (catParams = {}) => {
    try {
      return await dashboardService.expenseByCategory(catParams);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, []);

  const financialReport = useCallback(async (reportParams = {}) => {
    try {
      return await dashboardService.financialReport(reportParams);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, []);

  const trend = useCallback(async (trendParams = {}) => {
    try {
      return await dashboardService.trend(trendParams);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, []);

  const detail = useCallback(async (detailParams = {}) => {
    try {
      return await dashboardService.detail(detailParams);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, []);

  return {
    summary,
    loading,
    error,
    refetch: fetchSummary,
    compare,
    expenseByCategory,
    financialReport,
    trend,
    detail,
  };
}
