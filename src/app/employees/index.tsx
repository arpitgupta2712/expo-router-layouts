import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from "react-native";
import { Link } from "expo-router";
import { Layout } from "@/constants/Layout";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { CalendarIcon, TaskStatsBarChart, FeaturedCard } from "@/components";
import { useEmployees, useEmployeeStats, useTaskOverview } from "@/hooks";
import { 
  getCardSize, 
  getCardStyle,
  getCityCardLayout,
  DASHBOARD_CONFIG,
  getDepartmentImage
} from "@/utils";

const CARD_GAP = DASHBOARD_CONFIG.CARD_GAP;
const CONTAINER_PADDING = DASHBOARD_CONFIG.CONTAINER_PADDING;

// Get card size using extracted utility
const CARD_SIZE = getCardSize(CARD_GAP, CONTAINER_PADDING);

// Dynamic Calendar Icon Component
const DynamicCalendarIcon = () => {
  return <CalendarIcon size="small" />;
};

// Department card component for bento grid
const DepartmentCard = ({ department, activeCount, borderColor, size = 'small' }) => {
  const cardStyle = getCardStyle(size, CARD_SIZE, CARD_GAP);
  const departmentImage = getDepartmentImage(department);

  const cardContent = (
    <View style={[styles.card, cardStyle, { borderColor }]}>
      {/* Department Image Background */}
      <Image 
        source={departmentImage} 
        style={styles.departmentImage}
        resizeMode="cover"
      />
      
      {/* Active employee count badge */}
      <View style={styles.employeeBadge}>
        <Text style={styles.employeeBadgeText}>{activeCount}</Text>
      </View>
      
      {/* Footer with department title only */}
      <View style={styles.cardFooter}>
        <Text style={styles.departmentName}>{department}</Text>
      </View>
    </View>
  );

  return (
    <TouchableOpacity activeOpacity={0.8}>
      {cardContent}
    </TouchableOpacity>
  );
};


// Static feature card component
const FeatureCard = ({ size, title, href = null }) => {
  const cardStyle = getCardStyle(size, CARD_SIZE, CARD_GAP);

  const cardContent = (
    <View style={[styles.card, cardStyle, { borderColor: Colors.primary }]}>
      {/* Footer with title */}
      <View style={styles.cardFooter}>
        <Text style={styles.featureTitle}>{title}</Text>
      </View>
    </View>
  );

  // Handle internal routing
  if (href) {
    return (
      <Link href={href} asChild>
        <TouchableOpacity activeOpacity={0.8}>
          {cardContent}
        </TouchableOpacity>
      </Link>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.8}>
      {cardContent}
    </TouchableOpacity>
  );
};

export default function EmployeesPage() {
  const { employees, loading, error, refetch } = useEmployees();
  const { stats } = useEmployeeStats();
  const { stats: taskStats, loading: taskLoading, error: taskError } = useTaskOverview();

  // Group employees by department and calculate stats
  const departmentStats = React.useMemo(() => {
    if (!employees) return {};
    
    const stats = employees.reduce((acc, employee) => {
      const dept = employee.department;
      if (!acc[dept]) {
        acc[dept] = { total: 0, active: 0, terminated: 0 };
      }
      acc[dept].total++;
      if (employee.employment_status === 'Active') {
        acc[dept].active++;
      } else if (employee.employment_status === 'Terminated') {
        acc[dept].terminated++;
      }
      return acc;
    }, {} as Record<string, { total: number; active: number; terminated: number }>);
    
    
    return stats;
  }, [employees]);

  // Get department list for cards
  const departments = React.useMemo(() => {
    return Object.keys(departmentStats).sort((a, b) => 
      departmentStats[b].total - departmentStats[a].total
    );
  }, [departmentStats]);

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

      <View style={styles.grid}>
        {/* Featured Task Statistics Card */}
        <View style={styles.row}>
          <FeaturedCard 
            title="Task Status"
            badgeValue={taskStats?.totalTasks || 0}
            loading={taskLoading}
            size="rectangle"
            contentMode="aboveFooter"
          >
            {taskStats?.tasksByProgress && (
              <TaskStatsBarChart 
                tasksByProgress={taskStats.tasksByProgress}
                variant="horizontal"
                showLabels={true}
                showValues={true}
                maxHeight={80}
              />
            )}
          </FeaturedCard>
        </View>

        {/* Department Cards */}
        {departments.map((department, index) => {
          const deptStats = departmentStats[department];
          const borderColor = Colors.primary;
          const layout = getCityCardLayout(departments.length, index);
          
          // Only render if the utility says we should
          if (!layout.shouldRender) {
            return null;
          }
          
          // If it's a solo rectangle (last department in odd list)
          if (layout.isSolo) {
            return (
              <View key={`row-${index}`} style={styles.row}>
                <DepartmentCard 
                  department={department}
                  activeCount={deptStats.active}
                  borderColor={borderColor}
                  size={layout.size}
                />
              </View>
            );
          }
          
          // Regular pair rendering
          const nextDepartment = departments[index + 1];
          const nextDeptStats = nextDepartment ? departmentStats[nextDepartment] : null;
          
          return (
            <View key={`row-${index}`} style={styles.row}>
              <DepartmentCard 
                department={department}
                activeCount={deptStats.active}
                borderColor={borderColor}
                size={layout.size}
              />
              {nextDepartment && nextDeptStats && (
                <DepartmentCard 
                  department={nextDepartment}
                  activeCount={nextDeptStats.active}
                  borderColor={borderColor}
                  size="small"
                />
              )}
            </View>
          );
        })}

        {/* Additional Feature Cards */}
        <View style={styles.row}>
          <FeatureCard size="big" title="Org Chart" href="/employees/org-chart" />
        </View>
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
  employeeBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.primary,
    paddingTop: Layout.spacing.sm,
    paddingBottom: Layout.spacing.xs,
    paddingRight: Layout.spacing.sm,
    paddingLeft: Layout.spacing.xs,
    minWidth: 36,
    minHeight: 24,
    borderRadius: Layout.borderRadius.md,

    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  employeeBadgeText: {
    ...Typography.styles.captionBold,
    color: Colors.base,
    textAlign: 'center',
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
  departmentImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  departmentName: {
    ...Typography.styles.dashboardCardTitle,
    color: Colors.base,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  featureTitle: {
    ...Typography.styles.dashboardCardTitle,
    color: Colors.base,
    textAlign: 'left',
    textTransform: 'uppercase',
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
