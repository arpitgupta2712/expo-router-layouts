import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Layout } from '@/constants/Layout';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { CalendarIcon } from '@/components';
import { useEmployees } from '@/hooks/useEmployees';
import { Employee } from '@/types/AdminTypes';
import { 
  getCardSize, 
  getCardStyle,
  getCityCardLayout,
  DASHBOARD_CONFIG
} from '@/utils';

const { width, height } = Dimensions.get('window');
const CARD_GAP = DASHBOARD_CONFIG.CARD_GAP;
const CONTAINER_PADDING = DASHBOARD_CONFIG.CONTAINER_PADDING;

// Get card size using extracted utility
const CARD_SIZE = getCardSize(CARD_GAP, CONTAINER_PADDING);

// Department and role color mapping
const DEPARTMENT_COLORS = {
  'facility': Colors.primary,
  'process': Colors.accent,
  'hq': Colors.success,
  'crew': Colors.warning,
} as const;

const ROLE_COLORS = {
  'executive': Colors.primary,
  'heads': Colors.accent,
  'management': Colors.success,
  'senior_staff': Colors.warning,
  'supervisor': Colors.info,
  'staff': Colors.gray[500],
} as const;

// Employee card component for bento grid (matching dashboard pattern)
const EmployeeCard = ({ employee, isExpanded, onToggle, borderColor, size = 'small', hasChildren = false }) => {
  const cardStyle = getCardStyle(size, CARD_SIZE, CARD_GAP);

  const cardContent = (
    <View style={[styles.card, cardStyle, { borderColor }]}>
      {/* Expand/Collapse Indicator Badge - only show if has children */}
      {hasChildren && (
        <View style={styles.expandBadge}>
          <Text style={styles.expandBadgeText}>
            {isExpanded ? '−' : '+'}
          </Text>
        </View>
      )}
      
      {/* Footer with employee details */}
      <View style={styles.cardFooter}>
        <Text style={styles.employeeName}>{employee.nickname || employee.employee_name}</Text>
        <Text style={styles.employeeDesignation}>{employee.designation}</Text>
        <Text style={styles.employeeDetails}>{employee.department} • {employee.tier}</Text>
        <Text style={styles.employeePhone}>{employee.phone}</Text>
      </View>
    </View>
  );

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={hasChildren ? onToggle : undefined}>
      {cardContent}
    </TouchableOpacity>
  );
};

// Dynamic Calendar Icon Component
const DynamicCalendarIcon = () => {
  return <CalendarIcon size="small" />;
};

export default function OrgChartPage() {
  const { employees, loading, error, refetch } = useEmployees();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Transform flat employee data to hierarchical structure (only active employees)
  const orgHierarchy = useMemo(() => {
    if (!employees) return { topLevel: [], hierarchy: new Map() };

    // Filter only active employees
    const activeEmployees = employees.filter(emp => emp.employment_status === 'Active');
    
    const employeeMap = new Map<string, Employee>();
    const childrenMap = new Map<string, Employee[]>();
    
    // Create employee map and children map
    activeEmployees.forEach(emp => {
      employeeMap.set(emp.company_id, emp);
      
      if (emp.reporting_to) {
        if (!childrenMap.has(emp.reporting_to)) {
          childrenMap.set(emp.reporting_to, []);
        }
        childrenMap.get(emp.reporting_to)!.push(emp);
      }
    });

    // Find top-level employees (no reporting_to or reporting_to not found)
    const topLevel = activeEmployees.filter(emp => 
      !emp.reporting_to || !employeeMap.has(emp.reporting_to)
    );

    return { topLevel, hierarchy: childrenMap, employeeMap };
  }, [employees]);

  // Toggle node expansion
  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  // Render employee hierarchy using dashboard's exact pattern
  const renderEmployeeHierarchy = useCallback((employees: Employee[], level = 0) => {
    if (level === 0) {
      // Top level: use dashboard's exact pattern
      return employees.map((employee, index) => {
        const isExpanded = expandedNodes.has(employee.company_id);
        const hasChildren = orgHierarchy.hierarchy.has(employee.company_id);
        const children = hasChildren ? orgHierarchy.hierarchy.get(employee.company_id) || [] : [];
        const departmentColor = DEPARTMENT_COLORS[employee.department as keyof typeof DEPARTMENT_COLORS] || Colors.primary;
        const layout = getCityCardLayout(employees.length, index);
        
        // Only render if the utility says we should
        if (!layout.shouldRender) {
          return null;
        }
        
        // If it's a solo rectangle (last employee in odd list)
        if (layout.isSolo) {
          return (
            <View key={`row-${index}`} style={styles.row}>
              <EmployeeCard 
                employee={employee}
                isExpanded={isExpanded}
                onToggle={() => toggleNode(employee.company_id)}
                borderColor={departmentColor}
                size={layout.size}
                hasChildren={hasChildren}
              />
              {isExpanded && hasChildren && (
                <View style={styles.childrenContainer}>
                  {renderEmployeeHierarchy(children, level + 1)}
                </View>
              )}
            </View>
          );
        }
        
        // Regular pair rendering
        const nextEmployee = employees[index + 1];
        const nextDepartmentColor = nextEmployee ? 
          DEPARTMENT_COLORS[nextEmployee.department as keyof typeof DEPARTMENT_COLORS] || Colors.primary : 
          Colors.primary;
        
        return (
          <View key={`row-${index}`} style={styles.row}>
            <EmployeeCard 
              employee={employee}
              isExpanded={isExpanded}
              onToggle={() => toggleNode(employee.company_id)}
              borderColor={departmentColor}
              size={layout.size}
              hasChildren={hasChildren}
            />
            {nextEmployee && (
              <EmployeeCard 
                employee={nextEmployee}
                isExpanded={expandedNodes.has(nextEmployee.company_id)}
                onToggle={() => toggleNode(nextEmployee.company_id)}
                borderColor={nextDepartmentColor}
                size="small"
                hasChildren={orgHierarchy.hierarchy.has(nextEmployee.company_id)}
              />
            )}
            {isExpanded && hasChildren && (
              <View style={styles.childrenContainer}>
                {renderEmployeeHierarchy(children, level + 1)}
              </View>
            )}
          </View>
        );
      });
    } else {
      // Sub-levels: use same pattern but with role colors
      return employees.map((employee, index) => {
        const isExpanded = expandedNodes.has(employee.company_id);
        const hasChildren = orgHierarchy.hierarchy.has(employee.company_id);
        const children = hasChildren ? orgHierarchy.hierarchy.get(employee.company_id) || [] : [];
        const roleColor = ROLE_COLORS[employee.tier as keyof typeof ROLE_COLORS] || Colors.gray[500];
        const layout = getCityCardLayout(employees.length, index);
        
        // Only render if the utility says we should
        if (!layout.shouldRender) {
          return null;
        }
        
        // If it's a solo rectangle (last employee in odd list)
        if (layout.isSolo) {
          return (
            <View key={`row-${index}`} style={styles.row}>
              <EmployeeCard 
                employee={employee}
                isExpanded={isExpanded}
                onToggle={() => toggleNode(employee.company_id)}
                borderColor={roleColor}
                size={layout.size}
                hasChildren={hasChildren}
              />
              {isExpanded && hasChildren && (
                <View style={styles.childrenContainer}>
                  {renderEmployeeHierarchy(children, level + 1)}
                </View>
              )}
            </View>
          );
        }
        
        // Regular pair rendering
        const nextEmployee = employees[index + 1];
        const nextRoleColor = nextEmployee ? 
          ROLE_COLORS[nextEmployee.tier as keyof typeof ROLE_COLORS] || Colors.gray[500] : 
          Colors.gray[500];
        
        return (
          <View key={`row-${index}`} style={styles.row}>
            <EmployeeCard 
              employee={employee}
              isExpanded={isExpanded}
              onToggle={() => toggleNode(employee.company_id)}
              borderColor={roleColor}
              size={layout.size}
              hasChildren={hasChildren}
            />
            {nextEmployee && (
              <EmployeeCard 
                employee={nextEmployee}
                isExpanded={expandedNodes.has(nextEmployee.company_id)}
                onToggle={() => toggleNode(nextEmployee.company_id)}
                borderColor={nextRoleColor}
                size="small"
                hasChildren={orgHierarchy.hierarchy.has(nextEmployee.company_id)}
              />
            )}
            {isExpanded && hasChildren && (
              <View style={styles.childrenContainer}>
                {renderEmployeeHierarchy(children, level + 1)}
              </View>
            )}
          </View>
        );
      });
    }
  }, [expandedNodes, orgHierarchy.hierarchy, toggleNode]);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good morning</Text>
            <Text style={styles.title}>Organization Chart</Text>
          </View>
          <View style={styles.headerRight}>
            <DynamicCalendarIcon />
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading organization...</Text>
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
            <Text style={styles.title}>Organization Chart</Text>
          </View>
          <View style={styles.headerRight}>
            <DynamicCalendarIcon />
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load organization</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.title}>Organization Chart</Text>
        </View>
        <View style={styles.headerRight}>
          <DynamicCalendarIcon />
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {renderEmployeeHierarchy(orgHierarchy.topLevel)}
        </View>
      </ScrollView>
    </View>
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
  childrenContainer: {
    marginTop: Layout.spacing.sm,
  },
  nodeContainer: {
    // Remove marginBottom to let the grid handle spacing
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
  },
  expandBadge: {
    position: 'absolute',
    top: Layout.spacing.sm,
    right: Layout.spacing.sm,
    backgroundColor: Colors.primary,
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
  expandBadgeText: {
    ...Typography.styles.caption,
    color: Colors.accent,
    fontWeight: '600',
    fontSize: 12,
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
  employeeDetails: {
    ...Typography.styles.caption,
    color: Colors.accent,
    textAlign: 'left',
    marginBottom: 2,
  },
  employeePhone: {
    ...Typography.styles.caption,
    color: Colors.accent,
    textAlign: 'left',
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
