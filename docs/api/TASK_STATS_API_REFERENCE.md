# Task Stats API Reference

## Overview
Task management statistics endpoints for dashboard and analytics components.

## Endpoints

### 1. Task Overview Statistics
**GET** `/api/db/tasks/stats/overview`

High-level aggregated statistics for dashboard summaries.

#### Response Structure
```typescript
interface TaskOverviewStats {
  totalTasks: number;
  totalEmployees: number;
  averageTasksPerEmployee: number;
  tasksByProgress: {
    Pending: number;
    "In Progress": number;
    Completed: number;
    Cancelled: number;
  };
  tasksByDepartment: Record<string, number>;
  activeTasksByDepartment: Record<string, number>; // Excludes completed/cancelled
}
```

#### Example Response
```json
{
  "totalTasks": 40,
  "totalEmployees": 8,
  "averageTasksPerEmployee": 5,
  "tasksByProgress": {
    "Pending": 30,
    "In Progress": 8,
    "Completed": 1,
    "Cancelled": 1
  },
  "tasksByDepartment": {
    "process": 26,
    "hq": 14
  },
  "activeTasksByDepartment": {
    "process": 26,
    "hq": 12
  }
}
```

#### Usage Example (React)
```typescript
const fetchTaskOverview = async () => {
  try {
    const response = await fetch('/api/db/tasks/stats/overview');
    const data: TaskOverviewStats = await response.json();
    
    // Use for dashboard cards
    console.log(`Total Tasks: ${data.totalTasks}`);
    console.log(`Active Tasks: ${data.tasksByProgress['In Progress'] + data.tasksByProgress.Pending}`);
    
    return data;
  } catch (error) {
    console.error('Failed to fetch task overview:', error);
  }
};
```

### 2. Employee-Specific Statistics
**GET** `/api/db/tasks/stats/all`

Detailed per-employee breakdown for performance analysis.

#### Response Structure
```typescript
interface EmployeeTaskStats {
  [employeeEmail: string]: {
    total: number;
    completed: number;
    pending: number;
    completionRate: number; // Percentage
  };
}
```

#### Example Response
```json
{
  "anubhav@goaltech.in": {
    "total": 8,
    "completed": 1,
    "pending": 7,
    "completionRate": 13
  },
  "arpit@goaltech.in": {
    "total": 4,
    "completed": 0,
    "pending": 4,
    "completionRate": 0
  }
}
```

#### Usage Example (React)
```typescript
const fetchEmployeeStats = async () => {
  try {
    const response = await fetch('/api/db/tasks/stats/all');
    const data: EmployeeTaskStats = await response.json();
    
    // Sort by completion rate for leaderboard
    const sortedEmployees = Object.entries(data)
      .sort(([,a], [,b]) => b.completionRate - a.completionRate);
    
    return sortedEmployees;
  } catch (error) {
    console.error('Failed to fetch employee stats:', error);
  }
};
```

## UI Component Suggestions

### Dashboard Cards (use `/stats/overview`)
- **Total Tasks**: `totalTasks`
- **Active Tasks**: `tasksByProgress['In Progress'] + tasksByProgress.Pending`
- **Completion Rate**: `(tasksByProgress.Completed / totalTasks) * 100`

### Progress Charts (use `/stats/overview`)
- **Progress Status Pie Chart**: `tasksByProgress` object
- **Department Bar Chart**: `tasksByDepartment` object

### Employee Performance (use `/stats/all`)
- **Leaderboard Table**: Sort by `completionRate`
- **Employee Cards**: Show individual `total`, `completed`, `pending`

## Error Handling
Both endpoints return standard HTTP status codes:
- `200`: Success
- `500`: Server error with message in response body

## Notes
- Progress status enum: `Pending`, `In Progress`, `Completed`, `Cancelled`
- Department names are lowercase (e.g., `process`, `hq`, `facility`, `crew`)
- `activeTasksByDepartment` excludes completed and cancelled tasks
- All numbers are integers, completion rates are percentages
