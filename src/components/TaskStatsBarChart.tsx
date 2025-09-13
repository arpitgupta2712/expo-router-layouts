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

// Using brand status colors with gradients and better contrast
const getStatusConfig = (status: TaskProgressStatus) => {
  switch (status) {
    case 'Pending':
      return {
        colors: [Colors.warning, Colors.royalOrange], // Royal Orange gradient
        shadowColor: Colors.warning,
        bgColor: Colors.base,
        textColor: Colors.warning
      };
    case 'In Progress':
      return {
        colors: [Colors.info, Colors.illuminatingEmerald], // Illuminating Emerald gradient
        shadowColor: Colors.info,
        bgColor: Colors.base,
        textColor: Colors.info
      };
    case 'Completed':
      return {
        colors: [Colors.success, Colors.accent], // Accent Dark gradient
        shadowColor: Colors.success,
        bgColor: Colors.base,
        textColor: Colors.success
      };
    case 'Cancelled':
      return {
        colors: [Colors.error, Colors.safetyOrange], // Safety Orange gradient
        shadowColor: Colors.error,
        bgColor: Colors.base,
        textColor: Colors.error
      };
    default:
      return {
        colors: [Colors.gray[500], Colors.gray[700]],
        shadowColor: Colors.gray[500],
        bgColor: Colors.base,
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
  variant = 'vertical',
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
                {/* Percentage label on top */}
                {showValues && (
                  <Text style={[styles.verticalPercentLabel, { color: config.textColor }]}>
                    {percentage}%
                  </Text>
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
                
                {/* Value badge (only showing the actual value now) */}
                {showValues && (
                  <View style={[styles.valueBadge, { backgroundColor: 'transparent' }]}>
                    <Text style={[styles.valueText, { color: config.textColor }]}>
                      {value}
                    </Text>
                  </View>
                )}
              </View>
              
              {/* Icon with background */}
              {showLabels && (
                <View style={[styles.iconBadge, { backgroundColor: 'transparent' }]}>
                  {getStatusIcon(status, 24)}
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
        const width = (value / maxValue) * (maxWidth - 60);
        const config = getStatusConfig(status);
        const percentage = totalTasks > 0 ? Math.round((value / totalTasks) * 100) : 0;
        
        return (
          <View key={status} style={styles.horizontalBarContainer}>
            {/* Icon with modern badge */}
            {showLabels && (
              <View style={[styles.horizontalIconBadge, { backgroundColor: config.bgColor }]}>
                {getStatusIcon(status, 11)}
              </View>
            )}
            
            <View style={styles.horizontalProgressContainer}>
              {/* Progress track */}
              <View style={[styles.horizontalProgressTrack, { width: maxWidth - 60 }]}>
                {/* Animated progress bar */}
                <View 
                  style={[
                    styles.horizontalProgressBar,
                    {
                      width: Math.max(width, 8),
                      backgroundColor: config.colors[0],
                      shadowColor: config.shadowColor,
                    }
                  ]}
                />
              </View>
              
              {/* Value display */}
              {showValues && (
                <View style={styles.horizontalValueContainer}>
                  <Text style={[styles.horizontalValueText, { color: config.textColor }]}>
                    {value}
                  </Text>
                  <Text style={[styles.horizontalPercentText, { color: config.textColor }]}>
                    ({percentage}%)
                  </Text>
                </View>
              )}
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
    paddingHorizontal: 0,
    paddingVertical: 8,
    height: '100%',
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
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  progressTrack: {
    width: 40,
    backgroundColor: Colors.base,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 12,
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
    minWidth: 40,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  iconBadge: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Horizontal Chart Styles
  horizontalContainer: {
    flex: 1,
    paddingVertical: 1, // Minimal padding
    gap: 0, // No gap between bars
    minWidth: '100%',
  },
  horizontalBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6, // No vertical margin
    paddingHorizontal: 4,
  },
  horizontalIconBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 1,
    elevation: 1,
  },
  horizontalProgressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalProgressTrack: {
    height: 12,
    backgroundColor: Colors.gray[300],
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 8,
  },
  horizontalProgressBar: {
    height: '100%',
    borderRadius: 6,
    minWidth: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  horizontalValueContainer: {
    minWidth: 45,
    alignItems: 'flex-end',
  },
  horizontalValueText: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 13,
  },
  horizontalPercentText: {
    fontSize: 8,
    fontWeight: '500',
    opacity: 0.7,
    lineHeight: 10,
  },
});

export default TaskStatsBarChart;