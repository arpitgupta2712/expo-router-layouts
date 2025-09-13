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
  showLabels?: boolean;
  showValues?: boolean;
  maxHeight?: number;
  maxWidth?: number;
}

// Using brand status colors with gradients and better contrast
const getStatusConfig = (status: TaskProgressStatus) => {
  switch (status) {
    case 'Pending':
      return {
        colors: [Colors.warning, Colors.royalOrange], // Royal Orange gradient
        shadowColor: Colors.warning,
        bgColor: Colors.warning,
        textColor: Colors.warning
      };
    case 'In Progress':
      return {
        colors: [Colors.info, Colors.illuminatingEmerald], // Illuminating Emerald gradient
        shadowColor: Colors.info,
        bgColor: Colors.info,
        textColor: Colors.info
      };
    case 'Completed':
      return {
        colors: [Colors.success, Colors.accent], // Accent Dark gradient
        shadowColor: Colors.success,
        bgColor: Colors.success,
        textColor: Colors.success
      };
    case 'Cancelled':
      return {
        colors: [Colors.error, Colors.safetyOrange], // Safety Orange gradient
        shadowColor: Colors.error,
        bgColor: Colors.error,
        textColor: Colors.error
      };
    default:
      return {
        colors: [Colors.gray[500], Colors.gray[700]],
        shadowColor: Colors.gray[500],
        bgColor: Colors.gray[500],
        textColor: Colors.gray[700]
      };
  }
};

// Enhanced icon with modern styling
const getStatusIcon = (status: TaskProgressStatus, size: number = 14) => {
  const config = getStatusConfig(status);
  const iconProps = {
    size,
    color: config.textColor,
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
  showLabels = true,
  showValues = true,
  maxHeight = 120,
  maxWidth = 200,
}) => {
  const statuses: TaskProgressStatus[] = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
  const values = statuses.map(status => tasksByProgress[status]);
  const maxValue = Math.max(...values, 1);
  const totalTasks = values.reduce((sum, val) => sum + val, 0);

  const renderVerticalChart = () => (
    <View style={styles.verticalContainer}>
      <View style={styles.chartContainer}>
        {statuses.map((status, index) => {
          const value = values[index];
          const height = (value / maxValue) * (maxHeight - 10);
          const config = getStatusConfig(status);
          const percentage = totalTasks > 0 ? Math.round((value / totalTasks) * 100) : 0;
          
          return (
            <View key={status} style={styles.verticalBarContainer}>
              <View style={styles.verticalBarWrapper}>
                {/* Icon with background */}
                {showLabels && (
                  <View style={[styles.iconBadge, { backgroundColor: 'transparent' }]}>
                    {getStatusIcon(status, 20)}
                  </View>
                )}
                
                {/* Progress indicator background */}
                <View style={[styles.progressTrack, { height: maxHeight - 10 }]}>
                  {/* Animated progress bar with gradient */}
                  <View 
                    style={[
                      styles.verticalProgressBar,
                      {
                        height: Math.max(height, 10),
                        backgroundColor: config.colors[0],
                        shadowColor: config.shadowColor,
                      }
                    ]}
                  />
                </View>
                
                {/* Percentage label */}
                {showValues && (
                  <Text style={[styles.verticalPercentLabel, { color: config.textColor }]}>
                    {percentage}%
                  </Text>
                )}
              </View>
              
              {/* Horizontal dotted separator */}
              <View style={styles.dottedSeparator}>
                {[...Array(5)].map((_, index) => (
                  <View 
                    key={index} 
                    style={[styles.dot, { backgroundColor: config.textColor }]} 
                  />
                ))}
              </View>
              
              {/* Value badge (only showing the actual value now) */}
              {showValues && (
                <View style={[styles.valueBadge, { backgroundColor: config.bgColor }]}>
                  <Text style={[styles.valueText, { color: Colors.primary }]}>
                    {value}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderVerticalChart()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
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
    width: '100%',
    height: '100%',
    bottom: 6,
  },
  verticalBarContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 3,
    height: '100%',
    justifyContent: 'center',
  },
  verticalBarWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 'auto',
    marginBottom: 8,
  },
  verticalPercentLabel: {
    ...Typography.styles.buttonSmall,
    marginBottom: 2,
    textAlign: 'center',
  },
  progressTrack: {
    width: 36,
    backgroundColor: Colors.base,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 10,
    minHeight: 120,
  },
  verticalProgressBar: {
    width: '100%',
    minHeight: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    borderTopWidth: 2.5,
    borderTopColor: Colors.primary,
  },
  valueBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    minWidth: 36,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    ...Typography.styles.buttonLarge,
  },
  iconBadge: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  dottedSeparator: {
    width: 24,
    height: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
});

export default TaskStatsBarChart;