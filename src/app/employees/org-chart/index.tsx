import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Modal,
  FlatList,
  PanResponder,
} from 'react-native';
import { Layout } from '@/constants/Layout';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { useEmployees } from '@/hooks/useEmployees';
import { Employee } from '@/types/AdminTypes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { logger, LogLevel } from '@/utils/core/logging';

const { width, height } = Dimensions.get('window');

// Enhanced color schemes
const LEVEL_COLORS = [
  '#6366F1', // Indigo - CEO
  '#8B5CF6', // Purple - VPs
  '#EC4899', // Pink - Directors
  '#F59E0B', // Amber - Managers
  '#10B981', // Emerald - Leads
  '#06B6D4', // Cyan - Senior Staff
  '#64748B', // Slate - Staff
];

const DEPARTMENT_GRADIENTS = {
  'facility': ['#6366F1', '#4F46E5'],
  'process': ['#8B5CF6', '#7C3AED'],
  'hq': ['#EC4899', '#DB2777'],
  'crew': ['#F59E0B', '#D97706'],
} as const;

// Avatar component with initials
const EmployeeAvatar = ({ name, size = 40, level = 0 }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const backgroundColor = LEVEL_COLORS[Math.min(level, LEVEL_COLORS.length - 1)];
  
  return (
    <View style={[styles.avatar, { width: size, height: size, backgroundColor }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{initials}</Text>
    </View>
  );
};

// Connection line component
const ConnectionLine = ({ isVisible, height = 30, isLastChild = false }) => {
  const opacity = useRef(new Animated.Value(isVisible ? 1 : 0)).current;
  
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);
  
  return (
    <Animated.View style={[styles.connectionLine, { height, opacity }]}>
      <View style={[styles.verticalLine, isLastChild && styles.halfLine]} />
      <View style={styles.horizontalLine} />
    </Animated.View>
  );
};

// Enhanced Employee Node Component
const EmployeeNode = ({ 
  employee, 
  level = 0, 
  isExpanded, 
  onToggle, 
  onSelect,
  isSelected,
  childCount = 0,
  isLastChild = false,
  searchQuery = '',
  isFocusPath = false,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.spring(translateX, {
      toValue: level * 20,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [level]);
  
  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, tension: 300, friction: 10 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }),
    ]).start();
    onSelect(employee);
  };
  
  const handleToggle = () => {
    logger.logUserAction('Org Chart Node Toggle Attempt', {
      employeeId: employee.company_id,
      employeeName: employee.employee_name,
      designation: employee.designation,
      reportingTo: employee.reporting_to,
      childCount,
      level,
      isExpanded
    });
    
    if (childCount > 0) {
      logger.logUserAction('Org Chart Node Toggle - Expanding', {
        employeeId: employee.company_id,
        employeeName: employee.employee_name,
        childCount,
        currentExpanded: isExpanded
      });
      onToggle(employee.company_id);
    } else {
      logger.logUserAction('Org Chart Node Toggle - No Children', {
        employeeId: employee.company_id,
        employeeName: employee.employee_name,
        childCount
      });
    }
  };
  
  // Highlight search matches
  const isMatch = searchQuery && 
    employee.employee_name.toLowerCase().includes(searchQuery.toLowerCase());
  
  const gradientColors = DEPARTMENT_GRADIENTS[employee.department as keyof typeof DEPARTMENT_GRADIENTS] 
    || DEPARTMENT_GRADIENTS.hq;
  
  return (
    <Animated.View style={[
      styles.nodeContainer,
      { transform: [{ translateX }, { scale }] },
    ]}>
      {/* Connection line for non-root nodes */}
      {level > 0 && (
        <ConnectionLine isVisible={true} isLastChild={isLastChild} />
      )}
      
      <TouchableOpacity 
        onPress={handlePress}
        onLongPress={handleToggle}
        activeOpacity={0.8}
      >
        <View style={[
          styles.nodeCard,
          isSelected && styles.selectedCard,
          isMatch && styles.matchCard,
          isFocusPath && styles.focusPathCard,
        ]}>
          <View style={styles.nodeHeader}>
            <EmployeeAvatar name={employee.employee_name} level={level} />
            
            <View style={styles.nodeInfo}>
              <Text style={styles.nodeName} numberOfLines={1}>
                {employee.nickname || employee.employee_name}
              </Text>
              <Text style={styles.nodeRole} numberOfLines={1}>
                {employee.designation}
              </Text>
              <View style={styles.nodeMeta}>
                <View style={[styles.deptBadge, { backgroundColor: gradientColors[0] }]}>
                  <Text style={styles.deptBadgeText}>{employee.department}</Text>
                </View>
                <Text style={styles.tierText}>{employee.tier}</Text>
              </View>
            </View>
            
            {childCount > 0 && (
              <TouchableOpacity onPress={handleToggle} style={styles.expandButton}>
                <View style={[styles.expandCircle, isExpanded && styles.expandCircleActive]}>
                  <Icon 
                    name={isExpanded ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={isExpanded ? Colors.base : Colors.text.secondary} 
                  />
                  <Text style={styles.childCountBadge}>{childCount}</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Quick actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="phone" size={16} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="email" size={16} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="message" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Breadcrumb Navigation Component
const BreadcrumbNav = ({ path, onNavigate }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.breadcrumbContainer}
    >
      <TouchableOpacity onPress={() => onNavigate(null)} style={styles.breadcrumbItem}>
        <Icon name="domain" size={16} color={Colors.primary} />
        <Text style={styles.breadcrumbText}>Company</Text>
      </TouchableOpacity>
      
      {path.map((emp, index) => (
        <View key={emp.company_id} style={styles.breadcrumbWrapper}>
          <Icon name="chevron-right" size={16} color={Colors.text.secondary} />
          <TouchableOpacity 
            onPress={() => onNavigate(emp)}
            style={[
              styles.breadcrumbItem,
              index === path.length - 1 && styles.breadcrumbItemActive
            ]}
          >
            <Text style={[
              styles.breadcrumbText,
              index === path.length - 1 && styles.breadcrumbTextActive
            ]}>
              {emp.nickname || emp.employee_name.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

// Search Bar Component
const SearchBar = ({ value, onChangeText, onClear, resultCount = 0 }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
      <Icon name="magnify" size={20} color={Colors.text.secondary} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search employees..."
        placeholderTextColor={Colors.text.secondary}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {value.length > 0 && (
        <>
          <Text style={styles.searchResultCount}>
            {resultCount} found
          </Text>
          <TouchableOpacity onPress={onClear}>
            <Icon name="close-circle" size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

// Employee Detail Modal
const EmployeeDetailModal = ({ employee, isVisible, onClose, onNavigateToEmployee }) => {
  if (!employee) return null;
  
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Icon name="close" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          
          <View style={styles.modalHeader}>
            <EmployeeAvatar name={employee.employee_name} size={80} />
            <Text style={styles.modalName}>{employee.employee_name}</Text>
            <Text style={styles.modalDesignation}>{employee.designation}</Text>
          </View>
          
          <View style={styles.modalDetails}>
            <View style={styles.detailRow}>
              <Icon name="briefcase" size={20} color={Colors.primary} />
              <Text style={styles.detailLabel}>Department</Text>
              <Text style={styles.detailValue}>{employee.department}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Icon name="chart-line" size={20} color={Colors.primary} />
              <Text style={styles.detailLabel}>Tier</Text>
              <Text style={styles.detailValue}>{employee.tier}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Icon name="phone" size={20} color={Colors.primary} />
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{employee.phone}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Icon name="identifier" size={20} color={Colors.primary} />
              <Text style={styles.detailLabel}>ID</Text>
              <Text style={styles.detailValue}>{employee.company_id}</Text>
            </View>
          </View>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.modalActionButton}
              onPress={() => {
                onNavigateToEmployee(employee);
                onClose();
              }}
            >
              <Icon name="sitemap" size={20} color={Colors.base} />
              <Text style={styles.modalActionText}>View in Chart</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.modalActionButton, styles.modalActionButtonSecondary]}>
              <Icon name="phone" size={20} color={Colors.primary} />
              <Text style={[styles.modalActionText, { color: Colors.primary }]}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Main Enhanced Org Chart Component
export default function EnhancedOrgChart() {
  const { employees, loading, error, refetch } = useEmployees();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [focusedEmployee, setFocusedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [navigationPath, setNavigationPath] = useState<Employee[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Build hierarchy with enhanced structure
  const orgHierarchy = useMemo(() => {
    if (!employees) return { topLevel: [], hierarchy: new Map(), employeeMap: new Map() };
    
    const activeEmployees = employees.filter(emp => emp.employment_status === 'Active');
    const employeeMap = new Map<string, Employee>();
    const childrenMap = new Map<string, Employee[]>();
    const parentMap = new Map<string, string>();
    
    logger.logUserAction('Building Org Hierarchy', {
      totalEmployees: employees.length,
      activeEmployees: activeEmployees.length,
      activeEmployeesList: activeEmployees.map(emp => ({
        id: emp.company_id,
        name: emp.employee_name,
        reportingTo: emp.reporting_to,
        designation: emp.designation
      }))
    });
    
    // First pass: Build employee map
    activeEmployees.forEach(emp => {
      employeeMap.set(emp.company_id, emp);
    });
    
    // Second pass: Build relationships (now all employees are in the map)
    activeEmployees.forEach(emp => {
      if (emp.reporting_to && employeeMap.has(emp.reporting_to)) {
        if (!childrenMap.has(emp.reporting_to)) {
          childrenMap.set(emp.reporting_to, []);
        }
        childrenMap.get(emp.reporting_to)!.push(emp);
        parentMap.set(emp.company_id, emp.reporting_to);
        
        logger.logUserAction('Added Child Relationship', {
          childId: emp.company_id,
          childName: emp.employee_name,
          parentId: emp.reporting_to,
          parentName: employeeMap.get(emp.reporting_to)?.employee_name
        });
      } else if (emp.reporting_to) {
        logger.logUserAction('Orphaned Employee - Parent Not Found', {
          employeeId: emp.company_id,
          employeeName: emp.employee_name,
          reportingTo: emp.reporting_to,
          reason: 'Parent not in active employees list'
        });
      }
    });
    
    const topLevel = activeEmployees.filter(emp => 
      !emp.reporting_to || !employeeMap.has(emp.reporting_to)
    );
    
    logger.logUserAction('Top Level Employees Identified', {
      topLevelCount: topLevel.length,
      topLevelEmployees: topLevel.map(emp => ({
        id: emp.company_id,
        name: emp.employee_name,
        reportingTo: emp.reporting_to,
        hasChildren: childrenMap.has(emp.company_id),
        childrenCount: childrenMap.get(emp.company_id)?.length || 0
      }))
    });
    
    // Log hierarchy structure
    logger.logUserAction('Final Hierarchy Structure', {
      totalNodes: childrenMap.size,
      hierarchyDetails: Array.from(childrenMap.entries()).map(([parentId, children]) => ({
        parentId,
        parentName: employeeMap.get(parentId)?.employee_name,
        childrenCount: children.length,
        children: children.map(child => ({
          id: child.company_id,
          name: child.employee_name
        }))
      }))
    });
    
    return { topLevel, hierarchy: childrenMap, employeeMap, parentMap };
  }, [employees]);
  
  // Build path to employee
  const buildPathToEmployee = useCallback((employee: Employee): Employee[] => {
    const path: Employee[] = [];
    let current = employee;
    
    while (current) {
      path.unshift(current);
      const parentId = orgHierarchy.parentMap.get(current.company_id);
      if (parentId && orgHierarchy.employeeMap.has(parentId)) {
        current = orgHierarchy.employeeMap.get(parentId)!;
      } else {
        break;
      }
    }
    
    return path;
  }, [orgHierarchy]);
  
  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery || !employees) return [];
    
    return employees.filter(emp => 
      emp.employment_status === 'Active' &&
      (emp.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
       emp.department.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, employees]);
  
  // Toggle node expansion with smart collapsing
  const toggleNode = useCallback((nodeId: string) => {
    logger.logUserAction('Toggle Node Called', {
      nodeId,
      currentExpandedNodes: Array.from(expandedNodes),
      employee: orgHierarchy.employeeMap.get(nodeId)
    });
    
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      const employee = orgHierarchy.employeeMap.get(nodeId);
      
      if (newSet.has(nodeId)) {
        logger.logUserAction('Collapsing Node', {
          nodeId,
          employeeName: employee?.employee_name,
          hasChildren: (orgHierarchy.hierarchy.get(nodeId) || []).length > 0
        });
        
        // Collapsing: also collapse all children
        const collapseRecursive = (id: string) => {
          newSet.delete(id);
          const children = orgHierarchy.hierarchy.get(id) || [];
          logger.logUserAction('Collapsing Child', {
            childId: id,
            childName: orgHierarchy.employeeMap.get(id)?.employee_name,
            childrenCount: children.length
          });
          children.forEach(child => collapseRecursive(child.company_id));
        };
        collapseRecursive(nodeId);
      } else {
        logger.logUserAction('Expanding Node', {
          nodeId,
          employeeName: employee?.employee_name,
          reportingTo: employee?.reporting_to,
          hasReportingTo: !!employee?.reporting_to
        });
        
        // Expanding: collapse siblings
        if (employee && employee.reporting_to) {
          const siblings = orgHierarchy.hierarchy.get(employee.reporting_to) || [];
          logger.logUserAction('Collapsing Siblings', {
            nodeId,
            employeeName: employee.employee_name,
            siblingsCount: siblings.length,
            siblings: siblings.map(s => ({ id: s.company_id, name: s.employee_name }))
          });
          siblings.forEach(sibling => {
            if (sibling.company_id !== nodeId) {
              newSet.delete(sibling.company_id);
            }
          });
        } else {
          logger.logUserAction('Top Level Employee - No Siblings to Collapse', {
            nodeId,
            employeeName: employee?.employee_name
          });
        }
        newSet.add(nodeId);
      }
      
      logger.logUserAction('Expansion State Updated', {
        nodeId,
        newExpandedNodes: Array.from(newSet),
        previousExpandedNodes: Array.from(prev)
      });
      
      return newSet;
    });
  }, [orgHierarchy, expandedNodes]);
  
  // Navigate to employee
  const navigateToEmployee = useCallback((employee: Employee | null) => {
    if (!employee) {
      setFocusedEmployee(null);
      setNavigationPath([]);
      setExpandedNodes(new Set());
      return;
    }
    
    const path = buildPathToEmployee(employee);
    setNavigationPath(path);
    setFocusedEmployee(employee);
    
    // Expand path to this employee
    const newExpanded = new Set<string>();
    path.forEach((emp, index) => {
      if (index < path.length - 1) {
        newExpanded.add(emp.company_id);
      }
    });
    setExpandedNodes(newExpanded);
    
    // Scroll to top
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [buildPathToEmployee]);
  
  // Select employee (show details)
  const selectEmployee = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  }, []);
  
  // Render hierarchy recursively
  const renderHierarchy = useCallback((
    employees: Employee[], 
    level = 0,
    parentPath: string[] = []
  ) => {
    if (!employees || employees.length === 0) return null;
    
    // Filter based on focused view
    let visibleEmployees = employees;
    if (focusedEmployee && level === 0) {
      // Show only the focused branch at root level
      visibleEmployees = employees.filter(emp => 
        navigationPath.some(p => p.company_id === emp.company_id)
      );
    }
    
    return visibleEmployees.map((employee, index) => {
      const isExpanded = expandedNodes.has(employee.company_id);
      const children = orgHierarchy.hierarchy.get(employee.company_id) || [];
      const isLastChild = index === visibleEmployees.length - 1;
      const isFocusPath = navigationPath.some(p => p.company_id === employee.company_id);
      const isSelected = selectedEmployee?.company_id === employee.company_id;
      
      logger.logUserAction('Rendering Employee Node', {
        employeeId: employee.company_id,
        employeeName: employee.employee_name,
        level,
        isExpanded,
        childrenCount: children.length,
        hasChildren: children.length > 0,
        expandedNodes: Array.from(expandedNodes),
        childrenList: children.map(child => ({
          id: child.company_id,
          name: child.employee_name
        }))
      });
      
      return (
        <View key={employee.company_id}>
          <EmployeeNode
            employee={employee}
            level={level}
            isExpanded={isExpanded}
            onToggle={toggleNode}
            onSelect={selectEmployee}
            isSelected={isSelected}
            childCount={children.length}
            isLastChild={isLastChild}
            searchQuery={searchQuery}
            isFocusPath={isFocusPath}
          />
          
          {isExpanded && children.length > 0 && (
            <View style={styles.childrenContainer}>
              {renderHierarchy(
                children, 
                level + 1,
                [...parentPath, employee.company_id]
              )}
            </View>
          )}
        </View>
      );
    });
  }, [expandedNodes, focusedEmployee, navigationPath, selectedEmployee, searchQuery, orgHierarchy, toggleNode, selectEmployee]);
  
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Animated.View style={styles.loadingIcon}>
            <Icon name="sitemap" size={48} color={Colors.primary} />
          </Animated.View>
          <Text style={styles.loadingText}>Building organization chart...</Text>
        </View>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={48} color={Colors.error} />
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
      {/* Header with search */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Organization</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          resultCount={searchResults.length}
        />
      </View>
      
      {/* Breadcrumb navigation */}
      {navigationPath.length > 0 && (
        <BreadcrumbNav 
          path={navigationPath}
          onNavigate={navigateToEmployee}
        />
      )}
      
      {/* Search results overlay */}
      {searchQuery && searchResults.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <FlatList
            data={searchResults.slice(0, 5)}
            keyExtractor={(item) => item.company_id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.searchResultItem}
                onPress={() => {
                  navigateToEmployee(item);
                  setSearchQuery('');
                }}
              >
                <EmployeeAvatar name={item.employee_name} size={32} />
                <View style={styles.searchResultInfo}>
                  <Text style={styles.searchResultName}>{item.employee_name}</Text>
                  <Text style={styles.searchResultRole}>{item.designation}</Text>
                </View>
                <Icon name="chevron-right" size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      
      {/* Main org chart */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {focusedEmployee ? (
          // Focused view: show manager, employee, and reports
          <View>
            {/* Show manager if exists */}
            {focusedEmployee.reporting_to && orgHierarchy.employeeMap.has(focusedEmployee.reporting_to) && (
              <View style={styles.managerSection}>
                <Text style={styles.sectionLabel}>Reports to</Text>
                {renderHierarchy([orgHierarchy.employeeMap.get(focusedEmployee.reporting_to)!], 0)}
              </View>
            )}
            
            {/* Show focused employee and their reports */}
            <View style={styles.focusedSection}>
              <Text style={styles.sectionLabel}>Focus</Text>
              {renderHierarchy([focusedEmployee], 0)}
            </View>
          </View>
        ) : (
          // Full hierarchy view
          renderHierarchy(orgHierarchy.topLevel)
        )}
      </ScrollView>
      
      {/* Employee detail modal */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        isVisible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onNavigateToEmployee={navigateToEmployee}
      />
      
      {/* Floating action button for overview */}
      {focusedEmployee && (
        <TouchableOpacity 
          style={styles.fab}
          onPress={() => navigateToEmployee(null)}
        >
          <Icon name="view-grid" size={24} color={Colors.base} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.base,
  },
  header: {
    backgroundColor: Colors.base,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchContainerFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.base,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text.primary,
  },
  searchResultCount: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginRight: 8,
  },
  searchResultsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 140 : 120,
    left: 16,
    right: 16,
    backgroundColor: Colors.base,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
    maxHeight: 300,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchResultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  searchResultRole: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  breadcrumbContainer: {
    backgroundColor: Colors.gray[50],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  breadcrumbWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  breadcrumbItemActive: {
    backgroundColor: Colors.primary,
  },
  breadcrumbText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  breadcrumbTextActive: {
    color: Colors.base,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  nodeContainer: {
    marginBottom: 12,
    position: 'relative',
  },
  connectionLine: {
    position: 'absolute',
    left: -20,
    top: -12,
    width: 40,
  },
  verticalLine: {
    position: 'absolute',
    left: 20,
    top: 0,
    width: 2,
    height: '100%',
    backgroundColor: Colors.border,
  },
  halfLine: {
    height: '50%',
  },
  horizontalLine: {
    position: 'absolute',
    left: 20,
    top: '50%',
    width: 20,
    height: 2,
    backgroundColor: Colors.border,
  },
  nodeCard: {
    backgroundColor: Colors.base,
    borderRadius: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  matchCard: {
    backgroundColor: Colors.warning + '10',
    borderColor: Colors.warning,
  },
  focusPathCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  nodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.base,
    fontWeight: '600',
  },
  nodeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nodeName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  nodeRole: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  nodeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deptBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  deptBadgeText: {
    fontSize: 11,
    color: Colors.base,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tierText: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  expandButton: {
    padding: 4,
  },
  expandCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  expandCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  childCountBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    color: Colors.base,
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.gray[50],
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
  },
  childrenContainer: {
    marginLeft: 20,
  },
  managerSection: {
    marginBottom: 24,
  },
  focusedSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.error,
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.base,
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.base,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: height * 0.7,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: 12,
  },
  modalDesignation: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  modalDetails: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 12,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  modalActionButtonSecondary: {
    backgroundColor: Colors.base,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  modalActionText: {
    color: Colors.base,
    fontWeight: '600',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});