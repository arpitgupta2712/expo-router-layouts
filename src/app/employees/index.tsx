import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Layout } from "@/constants/Layout";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { CalendarIcon } from "@/components";
import { useEmployees, useEmployeeStats } from "@/hooks/useEmployees";
import { Employee } from "@/types/AdminTypes";
import { 
  getCardSize, 
  getCardStyle,
  getCityCardLayout,
  DASHBOARD_CONFIG
} from "@/utils";

const { width } = Dimensions.get("window");
const CARD_GAP = DASHBOARD_CONFIG.CARD_GAP;
const CONTAINER_PADDING = DASHBOARD_CONFIG.CONTAINER_PADDING;

// Get card size using extracted utility
const CARD_SIZE = getCardSize(CARD_GAP, CONTAINER_PADDING);

// Dynamic Calendar Icon Component
const DynamicCalendarIcon = () => {
  return <CalendarIcon size="small" />;
};

// Employee card component for bento grid
const EmployeeCard = ({ employee, borderColor, size = 'small' }) => {
  const cardStyle = getCardStyle(size, CARD_SIZE, CARD_GAP);

  const cardContent = (
    <View style={[styles.card, cardStyle, { borderColor }]}>
      {/* Employee Status Badge */}
      <View style={[
        styles.statusBadge,
        employee.employment_status === 'Active' ? styles.activeBadge : styles.terminatedBadge
      ]}>
        <Text style={styles.statusBadgeText}>
          {employee.employment_status === 'Active' ? 'A' : 'T'}
        </Text>
      </View>
      
      {/* Footer with employee details */}
      <View style={styles.cardFooter}>
        <Text style={styles.employeeName}>{employee.nickname || employee.employee_name}</Text>
        <Text style={styles.employeeDesignation}>{employee.designation}</Text>
        <Text style={styles.employeeTier}>{employee.tier}</Text>
      </View>
    </View>
  );

  return (
    <TouchableOpacity activeOpacity={0.8}>
      {cardContent}
    </TouchableOpacity>
  );
};

// Department header component
const DepartmentHeader = ({ department, employeeCount }) => (
  <View style={styles.departmentHeader}>
    <Text style={styles.departmentTitle}>{department}</Text>
    <Text style={styles.departmentCount}>{employeeCount} employees</Text>
  </View>
);

export default function EmployeesPage() {
  const { employees, loading, error, refetch } = useEmployees();
  const { stats } = useEmployeeStats();

  // Group employees by department
  const employeesByDepartment = React.useMemo(() => {
    if (!employees) return {};
    
    return employees.reduce((acc, employee) => {
      const dept = employee.department;
      if (!acc[dept]) {
        acc[dept] = [];
      }
      acc[dept].push(employee);
      return acc;
    }, {} as Record<string, Employee[]>);
  }, [employees]);

  // Sort departments by employee count (descending)
  const sortedDepartments = React.useMemo(() => {
    return Object.keys(employeesByDepartment).sort((a, b) => 
      employeesByDepartment[b].length - employeesByDepartment[a].length
    );
  }, [employeesByDepartment]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.title}>Employees</Text>
          </View>
          <View style={styles.headerRight}>
            <DynamicCalendarIcon />
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading employees...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.title}>Employees</Text>
          </View>
          <View style={styles.headerRight}>
            <DynamicCalendarIcon />
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load employees</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.title}>Employees</Text>
        </View>
        <View style={styles.headerRight}>
          <DynamicCalendarIcon />
        </View>
      </View>

      {/* Stats Overview */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.success }]}>{stats.active}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: Colors.error }]}>{stats.terminated}</Text>
              <Text style={styles.statLabel}>Terminated</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.grid}>
        {/* Render each department */}
        {sortedDepartments.map((department) => {
          const departmentEmployees = employeesByDepartment[department];
          const activeEmployees = departmentEmployees.filter(emp => emp.employment_status === 'Active');
          
          return (
            <View key={department} style={styles.departmentSection}>
              <DepartmentHeader 
                department={department} 
                employeeCount={departmentEmployees.length}
              />
              
              {/* Employee cards for this department */}
              {departmentEmployees.map((employee, index) => {
                const borderColor = employee.employment_status === 'Active' ? Colors.primary : Colors.error;
                const layout = getCityCardLayout(departmentEmployees.length, index);
                
                // Only render if the utility says we should
                if (!layout.shouldRender) {
                  return null;
                }
                
                // If it's a solo rectangle (last employee in odd list)
                if (layout.isSolo) {
                  return (
                    <View key={`row-${department}-${index}`} style={styles.row}>
                      <EmployeeCard 
                        employee={employee}
                        borderColor={borderColor}
                        size={layout.size}
                      />
                    </View>
                  );
                }
                
                // Regular pair rendering
                const nextEmployee = departmentEmployees[index + 1];
                const nextBorderColor = nextEmployee?.employment_status === 'Active' ? Colors.primary : Colors.error;
                
                return (
                  <View key={`row-${department}-${index}`} style={styles.row}>
                    <EmployeeCard 
                      employee={employee}
                      borderColor={borderColor}
                      size={layout.size}
                    />
                    {nextEmployee && (
                      <EmployeeCard 
                        employee={nextEmployee}
                        borderColor={nextBorderColor}
                        size="small"
                      />
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CONTAINER_PADDING,
    paddingTop: 60,
    paddingBottom: Layout.spacing.lg,
    backgroundColor: Colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    ...(Platform.OS === 'web' && {
      maxWidth: 800,
      alignSelf: 'center',
      width: '100%',
    }),
  },
  headerLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  greeting: {
    ...Typography.styles.dashboardGreeting,
    color: Colors.text.inverse,
    marginBottom: Layout.spacing.xs,
  },
  title: {
    ...Typography.styles.dashboardTitle,
    color: Colors.accent,
  },
  statsContainer: {
    backgroundColor: Colors.surface,
    margin: CONTAINER_PADDING,
    marginTop: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.styles.h3,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  statLabel: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginTop: Layout.spacing.xs,
  },
  grid: {
    padding: CONTAINER_PADDING,
    paddingTop: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
    ...(Platform.OS === 'web' && {
      maxWidth: 800,
      alignSelf: 'center',
      width: '100%',
    }),
  },
  departmentSection: {
    marginBottom: Layout.spacing.xl,
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.sm,
  },
  departmentTitle: {
    ...Typography.styles.h4,
    color: Colors.text.primary,
    textTransform: 'uppercase',
  },
  departmentCount: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: CARD_GAP,
    flexWrap: "wrap",
  },
  card: {
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 2,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: "hidden",
    position: 'relative',
    backgroundColor: Colors.base,
  },
  statusBadge: {
    position: 'absolute',
    top: Layout.spacing.sm,
    right: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.full,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  activeBadge: {
    backgroundColor: Colors.success,
  },
  terminatedBadge: {
    backgroundColor: Colors.error,
  },
  statusBadgeText: {
    ...Typography.styles.caption,
    color: Colors.base,
    fontWeight: '600',
    fontSize: 10,
  },
  cardFooter: {
    position: 'absolute',
    bottom: -1,
    left: -1,
    right: -1,
    backgroundColor: Colors.primary,
    paddingLeft: Layout.spacing.md,
    paddingRight: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
    paddingTop: Layout.spacing.sm,
    borderTopWidth: 2,
    borderTopColor: Colors.accent,
    borderBottomLeftRadius: Layout.borderRadius.xl,
    borderBottomRightRadius: Layout.borderRadius.xl,
  },
  employeeName: {
    ...Typography.styles.dashboardCardTitle,
    color: Colors.base,
    textAlign: 'left',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  employeeDesignation: {
    ...Typography.styles.caption,
    color: Colors.accent,
    textAlign: 'left',
    marginBottom: 2,
  },
  employeeTier: {
    ...Typography.styles.caption,
    color: Colors.accent,
    textAlign: 'left',
    opacity: 0.8,
    fontSize: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  loadingText: {
    ...Typography.styles.dashboardCardTitle,
    color: Colors.text.secondary,
    marginTop: Layout.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  errorText: {
    ...Typography.styles.dashboardCardTitle,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  errorSubtext: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
  },
  retryButtonText: {
    ...Typography.styles.button,
    color: Colors.base,
  },
});
