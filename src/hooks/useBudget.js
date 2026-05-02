import { useState, useEffect, useCallback } from "react";
import budgetService from "../services/modules/budgetService";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function useBudget() {
  const [budget, setBudgetData] = useState(null);
  const [hasNoBudget, setHasNoBudget] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentBudget = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await budgetService.getCurrentBudget();
      const payload = response?.data?.data ?? response?.data ?? response;
      setBudgetData(payload.budgets || []);
      setHasNoBudget(!!payload.hasNoBudget);
      setCurrentMonth(payload.month);
      setCurrentYear(payload.year);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async (limit = 12, offset = 0) => {
    try {
      const response = await budgetService.getBudgetHistory(limit, offset);
      const payload = response?.data?.data ?? response?.data ?? response;
      setHistory(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error("[useBudget] fetchHistory error:", getErrorMessage(err));
    }
  }, []);

  useEffect(() => {
    fetchCurrentBudget();
    fetchHistory();
  }, [fetchCurrentBudget, fetchHistory]);

  const setBudget = useCallback(async (payload) => {
    try {
      await budgetService.setBudget(payload);
      await fetchCurrentBudget();
      await fetchHistory();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchCurrentBudget, fetchHistory]);

  const updateBudget = useCallback(async (id, payload) => {
    try {
      await budgetService.updateBudget(id, payload);
      await fetchCurrentBudget();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchCurrentBudget]);

  const deleteBudget = useCallback(async (id) => {
    try {
      await budgetService.deleteBudget(id);
      await fetchCurrentBudget();
      await fetchHistory();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchCurrentBudget, fetchHistory]);

  return {
    budget,
    hasNoBudget,
    currentMonth,
    currentYear,
    history,
    loading,
    error,
    refetch: fetchCurrentBudget,
    refetchHistory: fetchHistory,
    setBudget,
    updateBudget,
    deleteBudget,
  };
}
