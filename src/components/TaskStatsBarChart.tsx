import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Typography } from '@/constants/Typography';
import { TaskProgressStatus } from '@/types/AdminTypes';
import { 
  Clock, 
  PlayCircle, 
  CheckCircle, 
  XCircle 
} from 'lucide-react-native';

interface TaskStatsBarChartProps {
  tasksByProgress: {
    Pending: number;
    'In Progress': number;
    Completed: number;
    Cancelled: number;
  };
  variant?: 'vertical' | 'horizontal';
  showLabels?: boolean;
  showValues?: boolean;
  maxHeight?: number;
  maxWidth?: number;
}

// Color mapping for different task statuses
const getStatusColor = (status: TaskProgressStatus): string => {
  switch (status) {
    case 'Pending':
      return Colors.warning; // Orange for pending
    case 'In Progress':
      return Colors.info; // Green for in progress
    case 'Completed':
      return Colors.success; // Green for completed
    case 'Cancelled':
      return Colors.error; // Red for cancelled
    default:
      return Colors.gray[500];
  }
};

// Get icon for status
const getStatusIcon = (status: TaskProgressStatus, size: number = 12) => {
  const iconProps = {
    size,
    color: getStatusColor(status),
  };

  switch (status) {
    case 'Pending':
      return <Clock {...iconProps} />;
    case 'In Progress':
      return <PlayCircle {...iconProps} />;
    case 'Completed':
      return <CheckCircle {...iconProps} />;
    case 'Cancelled':
      return <XCircle {...iconProps} />;
    default:
      return <Clock {...iconProps} />;
  }
};

export const TaskStatsBarChart: React.FC<TaskStatsBarChartProps> = ({
  tasksByProgress,
  variant = 'vertical',
  showLabels = true,
  showValues = true,
  maxHeight = 120,
  maxWidth = 200,
}) => {
  const statuses: TaskProgressStatus[] = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
  const values = statuses.map(status => tasksByProgress[status]);
  const maxValue = Math.max(...values, 1); // Avoid division by zero

  const renderVerticalChart = () => (
    <View style={styles.verticalContainer}>
      <View style={styles.chartContainer}>
        {statuses.map((status, index) => {
          const value = values[index];
          const height = (value / maxValue) * maxHeight;
          const color = getStatusColor(status);
          
          return (
            <View key={status} style={styles.verticalBarContainer}>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.verticalBar, 
                    { 
                      height: Math.max(height, 4), // Minimum height for visibility
                      backgroundColor: color 
                    }
                  ]} 
                />
                {showValues && (
                  <Text style={styles.barValue}>{value}</Text>
                )}
              </View>
              {showLabels && (
                <View style={styles.iconContainer}>
                  {getStatusIcon(status, 10)}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderHorizontalChart = () => (
    <View style={styles.horizontalContainer}>
      {statuses.map((status, index) => {
        const value = values[index];
        const width = (value / maxValue) * maxWidth;
        const color = getStatusColor(status);
        
        return (
          <View key={status} style={styles.horizontalBarContainer}>
            {showLabels && (
              <View style={styles.horizontalIconContainer}>
                {getStatusIcon(status, 10)}
              </View>
            )}
            <View style={styles.horizontalBarWrapper}>
              {showValues && (
                <Text style={styles.horizontalValue}>{value}</Text>
              )}
              <View 
                style={[
                  styles.horizontalBar, 
                  { 
                    width: Math.max(width, 8), // Minimum width for visibility
                    backgroundColor: color 
                  }
                ]} 
              />
            </View>
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      {variant === 'vertical' ? renderVerticalChart() : renderHorizontalChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Vertical Chart Styles
  verticalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingHorizontal: Layout.spacing.sm,
  },
  verticalBarContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 100,
  },
  verticalBar: {
    width: 20,
    borderRadius: Layout.borderRadius.sm,
    minHeight: 4,
    marginBottom: Layout.spacing.xs,
  },
  barValue: {
    ...Typography.styles.caption,
    color: Colors.text.primary,
    fontSize: 10,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Layout.spacing.xs,
    width: 20,
    height: 16,
  },
  
  // Horizontal Chart Styles
  horizontalContainer: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 1, // Reduced gap between bars
  },
  horizontalBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1, // Reduced vertical margin
  },
  horizontalIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    marginRight: Layout.spacing.xs,
  },
  horizontalBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalBar: {
    height: 10,
    borderRadius: Layout.borderRadius.sm,
    minWidth: 8,
    marginRight: Layout.spacing.xs,
  },
  horizontalValue: {
    ...Typography.styles.bodyMedium,
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '400',
    minWidth: 18,
    textAlign: 'left',
    marginRight: Layout.spacing.xs,
  },
});

export default TaskStatsBarChart;
