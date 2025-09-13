import { Employee, EmployeeResponse } from '@/types/AdminTypes';

const BASE_URL = 'https://claygrounds-6d703322b3bc.herokuapp.com/api';

export class EmployeeService {
  /**
   * Fetch all employees from the company endpoint
   */
  static async getEmployees(): Promise<Employee[]> {
    try {
      const response = await fetch(`${BASE_URL}/db/employees/company`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Employee[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw new Error('Failed to fetch employees');
    }
  }

  /**
   * Get employees by company ID
   */
  static async getEmployeesByCompany(companyId: string): Promise<Employee[]> {
    const employees = await this.getEmployees();
    return employees.filter(emp => emp.company_id === companyId);
  }

  /**
   * Get employees by department
   */
  static async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    const employees = await this.getEmployees();
    return employees.filter(emp => emp.department === department);
  }

  /**
   * Get employees by tier
   */
  static async getEmployeesByTier(tier: Employee['tier']): Promise<Employee[]> {
    const employees = await this.getEmployees();
    return employees.filter(emp => emp.tier === tier);
  }

  /**
   * Get only active employees
   */
  static async getActiveEmployees(): Promise<Employee[]> {
    const employees = await this.getEmployees();
    return employees.filter(emp => emp.employment_status === 'Active');
  }

  /**
   * Get employees by reporting manager
   */
  static async getEmployeesByReportingTo(reportingTo: string): Promise<Employee[]> {
    const employees = await this.getEmployees();
    return employees.filter(emp => emp.reporting_to === reportingTo);
  }

  /**
   * Get employee by ID
   */
  static async getEmployeeById(employeeId: string): Promise<Employee | null> {
    const employees = await this.getEmployees();
    return employees.find(emp => emp.employee_id === employeeId) || null;
  }

  /**
   * Get unique companies from employees
   */
  static async getUniqueCompanies(): Promise<string[]> {
    const employees = await this.getEmployees();
    const companies = [...new Set(employees.map(emp => emp.company_billed_to))];
    return companies.sort();
  }

  /**
   * Get unique departments from employees
   */
  static async getUniqueDepartments(): Promise<string[]> {
    const employees = await this.getEmployees();
    const departments = [...new Set(employees.map(emp => emp.department))];
    return departments.sort();
  }

  /**
   * Get employee statistics
   */
  static async getEmployeeStats(): Promise<{
    total: number;
    active: number;
    terminated: number;
    byTier: Record<string, number>;
    byDepartment: Record<string, number>;
    byCompany: Record<string, number>;
  }> {
    const employees = await this.getEmployees();
    
    const stats = {
      total: employees.length,
      active: employees.filter(emp => emp.employment_status === 'Active').length,
      terminated: employees.filter(emp => emp.employment_status === 'Terminated').length,
      byTier: {} as Record<string, number>,
      byDepartment: {} as Record<string, number>,
      byCompany: {} as Record<string, number>,
    };

    // Count by tier
    employees.forEach(emp => {
      stats.byTier[emp.tier] = (stats.byTier[emp.tier] || 0) + 1;
    });

    // Count by department
    employees.forEach(emp => {
      stats.byDepartment[emp.department] = (stats.byDepartment[emp.department] || 0) + 1;
    });

    // Count by company
    employees.forEach(emp => {
      stats.byCompany[emp.company_billed_to] = (stats.byCompany[emp.company_billed_to] || 0) + 1;
    });

    return stats;
  }
}
