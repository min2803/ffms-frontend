import { useState, useEffect, useCallback } from "react";
import householdService from "../services/modules/householdService";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function useHousehold() {
  const [household, setHousehold] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHousehold = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await householdService.getMyHousehold();
      const payload = response?.data ?? response;
      setHousehold(payload);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHousehold();
  }, [fetchHousehold]);

  const updateHousehold = useCallback(async (id, payload) => {
    try {
      await householdService.updateHousehold(id, payload);
      await fetchHousehold();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchHousehold]);

  const addMember = useCallback(async (id, userId) => {
    try {
      await householdService.addMember(id, userId);
      await fetchHousehold();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchHousehold]);

  const removeMember = useCallback(async (id, userId) => {
    try {
      await householdService.removeMember(id, userId);
      await fetchHousehold();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchHousehold]);

  const inviteMember = useCallback(async (payload) => {
    try {
      await householdService.inviteMember(payload);
      await fetchHousehold();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchHousehold]);

  const changeRole = useCallback(async (memberId, payload) => {
    try {
      await householdService.changeRole(memberId, payload);
      await fetchHousehold();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    }
  }, [fetchHousehold]);

  return {
    household,
    loading,
    error,
    refetch: fetchHousehold,
    updateHousehold,
    addMember,
    removeMember,
    inviteMember,
    changeRole,
  };
}
