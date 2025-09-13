import { useState, useEffect, useCallback } from 'react';
import { TaskOverviewStats, EmployeeTaskStats, UseTaskStatsReturn } from '@/types/AdminTypes';
import { TaskStatsService } from '@/services/TaskStatsService';

export const useTaskStats = (): UseTaskStatsReturn => {
  const [overviewStats, setOverviewStats] = useState<TaskOverviewStats | null>(null);
  const [employeeStats, setEmployeeStats] = useState<EmployeeTaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both overview and employee stats in parallel
      const [overview, employee] = await Promise.all([
        TaskStatsService.getTaskOverview(),
        TaskStatsService.getEmployeeTaskStats()
      ]);
      
      setOverviewStats(overview);
      setEmployeeStats(employee);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch task statistics';
      setError(errorMessage);
      console.error('Error in useTaskStats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    overviewStats,
    employeeStats,
    loading,
    error,
    refetch: fetchStats,
  };
};

// Specialized hook for just overview stats (for dashboard cards)
export const useTaskOverview = () => {
  const { overviewStats, loading, error, refetch } = useTaskStats();
  
  return {
    stats: overviewStats,
    loading,
    error,
    refetch,
  };
};

// Specialized hook for just employee stats (for performance analysis)
export const useEmployeeTaskStats = () => {
  const { employeeStats, loading, error, refetch } = useTaskStats();
  
  return {
    stats: employeeStats,
    loading,
    error,
    refetch,
  };
};