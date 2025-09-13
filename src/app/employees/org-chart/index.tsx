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
  SafeAreaView,
} from 'react-native';
import { Layout } from '@/constants/Layout';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { useEmployees } from '@/hooks/useEmployees';
import { Employee } from '@/types/AdminTypes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

// Department colors
const DEPT_COLORS = {
  'facility': '#6366F1',
  'process': '#8B5CF6', 
  'hq': '#EC4899',
  'crew': '#F59E0B',
  'default': '#64748B'
} as const;

// Tier colors for hierarchy levels
const TIER_COLORS = {
  'executive': '#DC2626',
  'heads': '#7C3AED',
  'management': '#2563EB',
  'senior_staff': '#059669',
  'supervisor': '#D97706',
  'staff': '#64748B',
  'default': '#94A3B8'
} as const;

// Simple Avatar Component
const Avatar = ({ name, department, size = 48 }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const bgColor = DEPT_COLORS[department as keyof typeof DEPT_COLORS] || DEPT_COLORS.default;
  
  return (
    <View style={[styles.avatar, { width: size, height: size, backgroundColor: bgColor }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{initials}</Text>
    </View>
  );
};

// Employee Card Component - Full width, always visible
const EmployeeCard = ({ 
  employee, 
  onPress,
  childCount = 0,
  isCurrentLevel = false,
  showNavigation = true 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.98, duration: 50, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 50, useNativeDriver: true }),
    ]).start();
    onPress(employee);
  };
  
  const tierColor = TIER_COLORS[employee.tier as keyof typeof TIER_COLORS] || TIER_COLORS.default;
  
  return (
    <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity 
        style={[styles.card, isCurrentLevel && styles.currentCard]}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.cardContent}>
          <Avatar name={employee.employee_name} department={employee.department} />
          
          <View style={styles.cardInfo}>
            <Text style={styles.cardName} numberOfLines={1}>
              {employee.nickname || employee.employee_name}
            </Text>
            <Text style={styles.cardRole} numberOfLines={1}>
              {employee.designation}
            </Text>
            <View style={styles.cardMeta}>
              <View style={[styles.deptBadge, { backgroundColor: tierColor }]}>
                <Text style={styles.deptBadgeText}>{employee.tier}</Text>
              </View>
              <Text style={styles.deptText}>{employee.department}</Text>
            </View>
          </View>
          
          {showNavigation && childCount > 0 && (
            <View style={styles.cardNav}>
              <View style={styles.childCountBadge}>
                <Text style={styles.childCountText}>{childCount}</Text>
              </View>
              <Icon name="chevron-right" size={24} color={Colors.text.secondary} />
            </View>
          )}
        </View>
        
        {/* Quick Actions Bar */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Icon name="phone" size={18} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Icon name="email" size={18} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Icon name="message-text" size={18} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Icon name="information" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Breadcrumb Navigation
const Breadcrumbs = ({ path, onNavigate }) => {
  const scrollRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    // Auto scroll to end when path changes
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [path]);
  
  return (
    <View style={styles.breadcrumbContainer}>
      <ScrollView 
        ref={scrollRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.breadcrumbContent}
      >
        <TouchableOpacity 
          style={styles.breadcrumbItem}
          onPress={() => onNavigate([])}
        >
          <Icon name="domain" size={18} color={Colors.primary} />
          <Text style={styles.breadcrumbText}>Company</Text>
        </TouchableOpacity>
        
        {path.map((employee, index) => (
          <View key={employee.company_id} style={styles.breadcrumbWrapper}>
            <Icon name="chevron-right" size={16} color={Colors.text.secondary} />
            <TouchableOpacity 
              style={[
                styles.breadcrumbItem,
                index === path.length - 1 && styles.breadcrumbActive
              ]}
              onPress={() => onNavigate(path.slice(0, index + 1))}
            >
              <Text style={[
                styles.breadcrumbText,
                index === path.length - 1 && styles.breadcrumbActiveText
              ]}>
                {employee.nickname || employee.employee_name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Search Component
const SearchBar = ({ onSearch, onClose }) => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  
  const handleSearch = (text: string) => {
    setQuery(text);
    onSearch(text);
  };
  
  return (
    <View style={[styles.searchBar, isActive && styles.searchBarActive]}>
      <Icon name="magnify" size={20} color={Colors.text.secondary} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search employees..."
        placeholderTextColor={Colors.text.secondary}
        value={query}
        onChangeText={handleSearch}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={() => {
          setQuery('');
          onSearch('');
          onClose();
        }}>
          <Icon name="close-circle" size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Level Navigation Header
const LevelHeader = ({ 
  currentEmployee, 
  onBack, 
  onHome,
  totalAtLevel 
}) => {
  if (!currentEmployee) {
    return (
      <View style={styles.levelHeader}>
        <View style={styles.levelInfo}>
          <Text style={styles.levelTitle}>Organization Structure</Text>
          <Text style={styles.levelSubtitle}>
            {totalAtLevel} {totalAtLevel === 1 ? 'member' : 'members'} at top level
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.levelHeader}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Icon name="arrow-left" size={24} color={Colors.primary} />
      </TouchableOpacity>
      
      <View style={styles.levelInfo}>
        <Text style={styles.levelTitle} numberOfLines={1}>
          {currentEmployee.nickname || currentEmployee.employee_name}'s Team
        </Text>
        <Text style={styles.levelSubtitle}>
          {totalAtLevel} direct {totalAtLevel === 1 ? 'report' : 'reports'}
        </Text>
      </View>
      
      <TouchableOpacity style={styles.homeButton} onPress={onHome}>
        <Icon name="home" size={24} color={Colors.text.secondary} />
      </TouchableOpacity>
    </View>
  );
};

// Statistics Bar
const StatsBar = ({ totalEmployees, currentLevel, activeDepartments }) => {
  return (
    <View style={styles.statsBar}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{totalEmployees}</Text>
        <Text style={styles.statLabel}>Total</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{currentLevel}</Text>
        <Text style={styles.statLabel}>Level</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{activeDepartments}</Text>
        <Text style={styles.statLabel}>Depts</Text>
      </View>
    </View>
  );
};

// Main Organization Chart Component
export default function SimplifiedOrgChart() {
  const { employees, loading, error, refetch } = useEmployees();
  const [navigationPath, setNavigationPath] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  
  // Build hierarchy
  const orgData = useMemo(() => {
    if (!employees) return { hierarchy: new Map(), topLevel: [], employeeMap: new Map() };
    
    const activeEmployees = employees.filter(emp => emp.employment_status === 'Active');
    const hierarchy = new Map<string, Employee[]>();
    const employeeMap = new Map<string, Employee>();
    
    // Build maps
    activeEmployees.forEach(emp => {
      employeeMap.set(emp.company_id, emp);
    });
    
    // Build hierarchy
    activeEmployees.forEach(emp => {
      if (emp.reporting_to && employeeMap.has(emp.reporting_to)) {
        if (!hierarchy.has(emp.reporting_to)) {
          hierarchy.set(emp.reporting_to, []);
        }
        hierarchy.get(emp.reporting_to)!.push(emp);
      }
    });
    
    // Find top level (no manager or manager not in active list)
    const topLevel = activeEmployees.filter(emp => 
      !emp.reporting_to || !employeeMap.has(emp.reporting_to)
    );
    
    return { hierarchy, topLevel, employeeMap };
  }, [employees]);
  
  // Get current level employees to display
  const currentLevelEmployees = useMemo(() => {
    if (navigationPath.length === 0) {
      return orgData.topLevel;
    }
    
    const currentParent = navigationPath[navigationPath.length - 1];
    return orgData.hierarchy.get(currentParent.company_id) || [];
  }, [navigationPath, orgData]);
  
  // Handle navigation
  const navigateToEmployee = useCallback((employee: Employee) => {
    const hasChildren = orgData.hierarchy.has(employee.company_id);
    if (hasChildren) {
      setNavigationPath([...navigationPath, employee]);
    }
  }, [navigationPath, orgData]);
  
  const navigateToBreadcrumb = useCallback((newPath: Employee[]) => {
    setNavigationPath(newPath);
  }, []);
  
  const navigateBack = useCallback(() => {
    if (navigationPath.length > 0) {
      setNavigationPath(navigationPath.slice(0, -1));
    }
  }, [navigationPath]);
  
  const navigateHome = useCallback(() => {
    setNavigationPath([]);
  }, []);
  
  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query) {
      setSearchResults([]);
      return;
    }
    
    const results = employees?.filter(emp => 
      emp.employment_status === 'Active' &&
      (emp.employee_name.toLowerCase().includes(query.toLowerCase()) ||
       emp.designation.toLowerCase().includes(query.toLowerCase()) ||
       emp.department.toLowerCase().includes(query.toLowerCase()))
    ) || [];
    
    setSearchResults(results);
  }, [employees]);
  
  const selectSearchResult = useCallback((employee: Employee) => {
    // Build path to this employee
    const path: Employee[] = [];
    let current = employee;
    
    while (current.reporting_to && orgData.employeeMap.has(current.reporting_to)) {
      const parent = orgData.employeeMap.get(current.reporting_to)!;
      path.unshift(parent);
      current = parent;
    }
    
    setNavigationPath(path);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  }, [orgData]);
  
  // Calculate stats
  const stats = useMemo(() => {
    const depts = new Set(currentLevelEmployees.map(e => e.department));
    return {
      total: employees?.filter(e => e.employment_status === 'Active').length || 0,
      level: navigationPath.length + 1,
      departments: depts.size,
    };
  }, [employees, currentLevelEmployees, navigationPath]);
  
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Icon name="sitemap" size={64} color={Colors.primary} />
          <Text style={styles.loadingText}>Loading organization...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color={Colors.error} />
          <Text style={styles.errorText}>Failed to load organization</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Organization</Text>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => setShowSearch(!showSearch)}
        >
          <Icon name="magnify" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar (toggleable) */}
      {showSearch && (
        <SearchBar 
          onSearch={handleSearch}
          onClose={() => setShowSearch(false)}
        />
      )}
      
      {/* Search Results Overlay */}
      {searchResults.length > 0 && (
        <View style={styles.searchResults}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {searchResults.slice(0, 10).map(emp => (
              <TouchableOpacity
                key={emp.company_id}
                style={styles.searchResultItem}
                onPress={() => selectSearchResult(emp)}
              >
                <Avatar name={emp.employee_name} department={emp.department} size={36} />
                <View style={styles.searchResultInfo}>
                  <Text style={styles.searchResultName}>{emp.employee_name}</Text>
                  <Text style={styles.searchResultRole}>{emp.designation}</Text>
                </View>
                <Icon name="arrow-right" size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      
      {/* Breadcrumbs */}
      <Breadcrumbs 
        path={navigationPath}
        onNavigate={navigateToBreadcrumb}
      />
      
      {/* Level Header */}
      <LevelHeader
        currentEmployee={navigationPath[navigationPath.length - 1]}
        onBack={navigateBack}
        onHome={navigateHome}
        totalAtLevel={currentLevelEmployees.length}
      />
      
      {/* Statistics Bar */}
      <StatsBar
        totalEmployees={stats.total}
        currentLevel={stats.level}
        activeDepartments={stats.departments}
      />
      
      {/* Employee List */}
      <ScrollView 
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {currentLevelEmployees.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="account-group-outline" size={64} color={Colors.text.secondary} />
            <Text style={styles.emptyText}>No direct reports</Text>
            <Text style={styles.emptySubtext}>
              This employee doesn't have any direct reports
            </Text>
          </View>
        ) : (
          currentLevelEmployees.map((employee, index) => {
            const childCount = orgData.hierarchy.get(employee.company_id)?.length || 0;
            
            return (
              <EmployeeCard
                key={employee.company_id}
                employee={employee}
                onPress={navigateToEmployee}
                childCount={childCount}
                isCurrentLevel={false}
                showNavigation={true}
              />
            );
          })
        )}
      </ScrollView>
      
      {/* Floating Action Buttons */}
      {navigationPath.length > 0 && (
        <View style={styles.fabContainer}>
          <TouchableOpacity 
            style={[styles.fab, styles.fabSecondary]}
            onPress={navigateBack}
          >
            <Icon name="arrow-up" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.fab}
            onPress={navigateHome}
          >
            <Icon name="view-grid" size={24} color={Colors.base} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  searchButton: {
    padding: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchBarActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.base,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text.primary,
  },
  searchResults: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 160 : 140,
    left: 16,
    right: 16,
    maxHeight: 400,
    backgroundColor: Colors.base,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 1000,
    padding: 8,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  breadcrumbContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  breadcrumbWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  breadcrumbActive: {
    backgroundColor: Colors.primary,
  },
  breadcrumbText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  breadcrumbActiveText: {
    color: Colors.base,
    fontWeight: '600',
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  homeButton: {
    padding: 4,
  },
  levelInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  levelSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  statsBar: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.primary + '10',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  cardContainer: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.base,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  currentCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.base,
    fontWeight: '600',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  cardRole: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deptBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  deptBadgeText: {
    fontSize: 10,
    color: Colors.base,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  deptText: {
    fontSize: 12,
    color: Colors.text.secondary,
    textTransform: 'capitalize',
  },
  cardNav: {
    alignItems: 'center',
  },
  childCountBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  childCountText: {
    color: Colors.base,
    fontSize: 12,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: Colors.gray[50],
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionBtn: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 16,
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
  },
  errorSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.base,
    fontSize: 16,
    fontWeight: '600',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    gap: 12,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabSecondary: {
    backgroundColor: Colors.base,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
});