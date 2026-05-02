import { useState, useEffect, useCallback, useMemo } from "react";
import incomeService from "../services/modules/incomeService";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function useIncome(params = {}) {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stableParams = useMemo(() => params, [params.type, params.month, params.year]);

  const fetchIncomes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await incomeService.getIncomes(stableParams);
      setIncomes(Array.isArray(data) ? data : data?.data ?? []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [stableParams]);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const addIncome = useCallback(async (payload) => {
    try {
      await incomeService.addIncome(payload);
      await fetchIncomes();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchIncomes]);

  const updateIncome = useCallback(async (id, payload) => {
    try {
      await incomeService.updateIncome(id, payload);
      await fetchIncomes();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchIncomes]);

  const deleteIncome = useCallback(async (id) => {
    try {
      await incomeService.deleteIncome(id);
      await fetchIncomes();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchIncomes]);

  return {
    incomes,
    loading,
    error,
    refetch: fetchIncomes,
    addIncome,
    updateIncome,
    deleteIncome,
  };
}
