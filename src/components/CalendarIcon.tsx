import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { Calendar } from "lucide-react-native";
import { Layout } from "@/constants/Layout";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";

export interface CalendarIconProps {
  /**
   * Custom date to display. If not provided, uses current date
   */
  date?: Date;
  
  /**
   * Size variant for the calendar icon
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Custom style for the container
   */
  style?: ViewStyle;
  
  /**
   * Whether to show the month/year header
   */
  showHeader?: boolean;
  
  /**
   * Custom background color
   */
  backgroundColor?: string;
  
  /**
   * Custom text color
   */
  textColor?: string;
  
  /**
   * Custom icon color
   */
  iconColor?: string;
}

export const CalendarIcon: React.FC<CalendarIconProps> = ({
  date = new Date(),
  size = 'medium',
  style,
  showHeader = true,
  backgroundColor = Colors.base,
  textColor = Colors.safetyOrange,
  iconColor = Colors.primary,
}) => {
  const day = date.getDate();
  const monthName = date.toLocaleDateString('en-US', { month: 'short' }); // e.g., "Dec"
  
  const sizeConfig = {
    small: {
      container: { minWidth: 45, minHeight: 45, padding: Layout.spacing.xs },
      icon: 18,
      dayFontSize: 12,
      headerFontSize: 12,
      yearFontSize: 8,
    },
    medium: {
      container: { minWidth: 60, minHeight: 60, padding: Layout.spacing.sm },
      icon: 24,
      dayFontSize: 14,
      headerFontSize: 10,
      yearFontSize: 8,
    },
    large: {
      container: { minWidth: 75, minHeight: 75, padding: Layout.spacing.md },
      icon: 30,
      dayFontSize: 16,
      headerFontSize: 12,
      yearFontSize: 10,
    },
  };
  
  const config = sizeConfig[size];
  
  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor,
      ...config.container,
    },
    calendarDayNumber: {
      fontSize: config.headerFontSize,
      color: textColor,
    },
    calendarMonthName: {
      fontSize: config.yearFontSize,
      color: Colors.primary,
    },
  });
  
  return (
    <View style={[styles.calendarIcon, dynamicStyles.container, style]}>
      {showHeader && (
        <View style={styles.calendarHeader}>
          <Text style={[styles.calendarDayNumber, dynamicStyles.calendarDayNumber]}>
            {day}
          </Text>
          <Text style={[styles.calendarMonthName, dynamicStyles.calendarMonthName]}>
            {monthName}
          </Text>
        </View>
      )}
      <View style={styles.calendarBody}>
        <Calendar size={config.icon} color={iconColor} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarIcon: {
    borderRadius: Layout.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  calendarDayNumber: {
    ...Typography.styles.dashboardCardSize,
    fontWeight: '700',
    marginRight: 2,
  },
  calendarMonthName: {
    ...Typography.styles.dashboardCardSize,
  },
  calendarBody: {
    alignItems: 'center',
    position: 'relative',
  },
});
