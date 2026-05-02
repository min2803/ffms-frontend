import { useState, useEffect, useCallback, useMemo } from "react";
import expenseService from "../services/modules/expenseService";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function useExpenses(params = {}) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stableParams = useMemo(() => params, [params.type]);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expenseService.getExpenses(stableParams);
      setExpenses(Array.isArray(data) ? data : data?.data ?? []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [stableParams]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = useCallback(async (payload) => {
    try {
      await expenseService.addExpense(payload);
      await fetchExpenses();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchExpenses]);

  const updateExpense = useCallback(async (id, payload) => {
    try {
      await expenseService.updateExpense(id, payload);
      await fetchExpenses();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchExpenses]);

  const deleteExpense = useCallback(async (id) => {
    try {
      await expenseService.deleteExpense(id);
      await fetchExpenses();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchExpenses]);

  return {
    expenses,
    loading,
    error,
    refetch: fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}
