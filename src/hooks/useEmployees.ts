import { useState, useEffect, useCallback } from 'react';
import { Employee, UseEmployeesReturn } from '@/types/AdminTypes';
import { EmployeeService } from '@/services/EmployeeService';

export const useEmployees = (): UseEmployeesReturn => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await EmployeeService.getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees');
      console.error('Error in useEmployees:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const getEmployeesByCompany = useCallback((companyId: string): Employee[] => {
    return employees.filter(emp => emp.company_id === companyId);
  }, [employees]);

  const getEmployeesByDepartment = useCallback((department: string): Employee[] => {
    return employees.filter(emp => emp.department === department);
  }, [employees]);

  const getEmployeesByTier = useCallback((tier: Employee['tier']): Employee[] => {
    return employees.filter(emp => emp.tier === tier);
  }, [employees]);

  const getActiveEmployees = useCallback((): Employee[] => {
    return employees.filter(emp => emp.employment_status === 'Active');
  }, [employees]);

  return {
    employees,
    loading,
    error,
    getEmployeesByCompany,
    getEmployeesByDepartment,
    getEmployeesByTier,
    getActiveEmployees,
    refetch: fetchEmployees,
  };
};

// Specialized hooks for specific use cases
export const useEmployeesByCompany = (companyId: string) => {
  const { employees, loading, error, refetch } = useEmployees();
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const filtered = employees.filter(emp => emp.company_id === companyId);
    setFilteredEmployees(filtered);
  }, [employees, companyId]);

  return {
    employees: filteredEmployees,
    loading,
    error,
    refetch,
  };
};

export const useEmployeesByDepartment = (department: string) => {
  const { employees, loading, error, refetch } = useEmployees();
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const filtered = employees.filter(emp => emp.department === department);
    setFilteredEmployees(filtered);
  }, [employees, department]);

  return {
    employees: filteredEmployees,
    loading,
    error,
    refetch,
  };
};

export const useActiveEmployees = () => {
  const { employees, loading, error, refetch } = useEmployees();
  const [activeEmployees, setActiveEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const active = employees.filter(emp => emp.employment_status === 'Active');
    setActiveEmployees(active);
  }, [employees]);

  return {
    employees: activeEmployees,
    loading,
    error,
    refetch,
  };
};

export const useEmployeeStats = () => {
  const { employees, loading, error } = useEmployees();
  const [stats, setStats] = useState<{
    total: number;
    active: number;
    terminated: number;
    byTier: Record<string, number>;
    byDepartment: Record<string, number>;
    byCompany: Record<string, number>;
  } | null>(null);

  useEffect(() => {
    if (employees.length > 0) {
      const calculatedStats = {
        total: employees.length,
        active: employees.filter(emp => emp.employment_status === 'Active').length,
        terminated: employees.filter(emp => emp.employment_status === 'Terminated').length,
        byTier: {} as Record<string, number>,
        byDepartment: {} as Record<string, number>,
        byCompany: {} as Record<string, number>,
      };

      // Count by tier
      employees.forEach(emp => {
        calculatedStats.byTier[emp.tier] = (calculatedStats.byTier[emp.tier] || 0) + 1;
      });

      // Count by department
      employees.forEach(emp => {
        calculatedStats.byDepartment[emp.department] = (calculatedStats.byDepartment[emp.department] || 0) + 1;
      });

      // Count by company
      employees.forEach(emp => {
        calculatedStats.byCompany[emp.company_billed_to] = (calculatedStats.byCompany[emp.company_billed_to] || 0) + 1;
      });

      setStats(calculatedStats);
    }
  }, [employees]);

  return {
    stats,
    loading,
    error,
  };
};
