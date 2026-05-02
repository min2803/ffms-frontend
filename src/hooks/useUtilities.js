import { useState, useEffect, useCallback, useMemo } from "react";
import utilityService from "../services/modules/utilityService";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function useUtilities(params = {}) {
  const [consumption, setConsumption] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stableParams = useMemo(() => params, [params.type, params.month]);

  const fetchConsumption = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await utilityService.getConsumption(stableParams);
      const payload = response?.data ?? response;
      setConsumption(payload);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [stableParams]);

  const fetchSummary = useCallback(async (month) => {
    try {
      const response = await utilityService.getSummary(month);
      const payload = response?.data ?? response;
      setSummary(payload);
      return payload;
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchConsumption();
  }, [fetchConsumption]);

  const addReading = useCallback(async (payload) => {
    try {
      await utilityService.addReading(payload);
      await fetchConsumption();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchConsumption]);

  return {
    consumption,
    summary,
    loading,
    error,
    refetch: fetchConsumption,
    fetchSummary,
    addReading,
  };
}
