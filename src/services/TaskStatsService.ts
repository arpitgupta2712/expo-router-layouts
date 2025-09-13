import { TaskOverviewStats, EmployeeTaskStats } from '@/types/AdminTypes';

const BASE_URL = 'https://claygrounds-6d703322b3bc.herokuapp.com/api';

export class TaskStatsService {
  /**
   * Fetch task overview statistics from the API
   */
  static async getTaskOverview(): Promise<TaskOverviewStats> {
    try {
      const response = await fetch(`${BASE_URL}/db/tasks/stats/overview`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: TaskOverviewStats = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching task overview:', error);
      throw new Error('Failed to fetch task overview statistics');
    }
  }

  /**
   * Fetch employee-specific task statistics from the API
   */
  static async getEmployeeTaskStats(): Promise<EmployeeTaskStats> {
    try {
      const response = await fetch(`${BASE_URL}/db/tasks/stats/all`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: EmployeeTaskStats = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching employee task stats:', error);
      throw new Error('Failed to fetch employee task statistics');
    }
  }

  /**
   * Get task statistics for a specific employee
   */
  static async getEmployeeTaskStatsByEmail(email: string): Promise<EmployeeTaskStats[string] | null> {
    try {
      const allStats = await this.getEmployeeTaskStats();
      return allStats[email] || null;
    } catch (error) {
      console.error('Error fetching employee task stats by email:', error);
      return null;
    }
  }

  /**
   * Get task statistics for multiple employees
   */
  static async getEmployeeTaskStatsByEmails(emails: string[]): Promise<EmployeeTaskStats> {
    try {
      const allStats = await this.getEmployeeTaskStats();
      const filteredStats: EmployeeTaskStats = {};
      
      emails.forEach(email => {
        if (allStats[email]) {
          filteredStats[email] = allStats[email];
        }
      });
      
      return filteredStats;
    } catch (error) {
      console.error('Error fetching employee task stats by emails:', error);
      return {};
    }
  }

  /**
   * Get task completion rate for a specific employee
   */
  static async getEmployeeCompletionRate(email: string): Promise<number> {
    try {
      const employeeStats = await this.getEmployeeTaskStatsByEmail(email);
      return employeeStats?.completionRate || 0;
    } catch (error) {
      console.error('Error fetching employee completion rate:', error);
      return 0;
    }
  }

  /**
   * Get top performing employees by completion rate
   */
  static async getTopPerformers(limit: number = 5): Promise<Array<{ email: string; stats: EmployeeTaskStats[string] }>> {
    try {
      const allStats = await this.getEmployeeTaskStats();
      
      return Object.entries(allStats)
        .map(([email, stats]) => ({ email, stats }))
        .sort((a, b) => b.stats.completionRate - a.stats.completionRate)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching top performers:', error);
      return [];
    }
  }

  /**
   * Get task statistics summary
   */
  static async getTaskSummary(): Promise<{
    totalTasks: number;
    totalEmployees: number;
    averageCompletionRate: number;
    topPerformer: string | null;
  }> {
    try {
      const [overview, employeeStats] = await Promise.all([
        this.getTaskOverview(),
        this.getEmployeeTaskStats()
      ]);

      const employees = Object.values(employeeStats);
      const averageCompletionRate = employees.length > 0 
        ? employees.reduce((sum, emp) => sum + emp.completionRate, 0) / employees.length 
        : 0;

      const topPerformer = employees.length > 0
        ? Object.entries(employeeStats)
            .sort(([,a], [,b]) => b.completionRate - a.completionRate)[0][0]
        : null;

      return {
        totalTasks: overview.totalTasks,
        totalEmployees: overview.totalEmployees,
        averageCompletionRate: Math.round(averageCompletionRate),
        topPerformer,
      };
    } catch (error) {
      console.error('Error fetching task summary:', error);
      throw new Error('Failed to fetch task summary');
    }
  }
}
