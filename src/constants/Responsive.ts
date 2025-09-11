import { Dimensions, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
} as const;

// Device type detection
export const getDeviceType = () => {
  if (SCREEN_WIDTH < BREAKPOINTS.mobile) return 'mobile';
  if (SCREEN_WIDTH < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
};

// Grid system for mobile-first design
export const Grid = {
  // Mobile: 2-column max, simple layout
  mobile: {
    columns: 2,
    cardGap: 12,
    containerPadding: 20,
    cardSizes: {
      small: { width: '48%', minHeight: 100 },
      medium: { width: '48%', minHeight: 120 },
      large: { width: '100%', minHeight: 140 },
    }
  },
  
  // Tablet: 3-column max
  tablet: {
    columns: 3,
    cardGap: 16,
    containerPadding: 24,
    cardSizes: {
      small: { width: '31%', minHeight: 110 },
      medium: { width: '48%', minHeight: 130 },
      large: { width: '100%', minHeight: 150 },
    }
  },
  
  // Desktop: 4-column max
  desktop: {
    columns: 4,
    cardGap: 20,
    containerPadding: 32,
    cardSizes: {
      small: { width: '23%', minHeight: 120 },
      medium: { width: '48%', minHeight: 140 },
      large: { width: '100%', minHeight: 160 },
    }
  }
} as const;

// Get current grid configuration
export const getCurrentGrid = () => {
  const deviceType = getDeviceType();
  return Grid[deviceType];
};

// Responsive values
export const Responsive = {
  // Screen dimensions
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    isMobile: SCREEN_WIDTH < BREAKPOINTS.mobile,
    isTablet: SCREEN_WIDTH >= BREAKPOINTS.mobile && SCREEN_WIDTH < BREAKPOINTS.tablet,
    isDesktop: SCREEN_WIDTH >= BREAKPOINTS.tablet,
  },
  
  // Current grid config
  grid: getCurrentGrid(),
  
  // Device type
  deviceType: getDeviceType(),
  
  // Platform
  platform: Platform.OS,
  
  // Responsive spacing
  spacing: {
    xs: SCREEN_WIDTH < BREAKPOINTS.mobile ? 4 : 6,
    sm: SCREEN_WIDTH < BREAKPOINTS.mobile ? 8 : 12,
    md: SCREEN_WIDTH < BREAKPOINTS.mobile ? 12 : 16,
    lg: SCREEN_WIDTH < BREAKPOINTS.mobile ? 16 : 24,
    xl: SCREEN_WIDTH < BREAKPOINTS.mobile ? 20 : 32,
    xxl: SCREEN_WIDTH < BREAKPOINTS.mobile ? 24 : 48,
  },
  
  // Responsive font sizes
  fontSize: {
    xs: SCREEN_WIDTH < BREAKPOINTS.mobile ? 10 : 12,
    sm: SCREEN_WIDTH < BREAKPOINTS.mobile ? 12 : 14,
    md: SCREEN_WIDTH < BREAKPOINTS.mobile ? 14 : 16,
    lg: SCREEN_WIDTH < BREAKPOINTS.mobile ? 16 : 18,
    xl: SCREEN_WIDTH < BREAKPOINTS.mobile ? 18 : 20,
    xxl: SCREEN_WIDTH < BREAKPOINTS.mobile ? 20 : 24,
    xxxl: SCREEN_WIDTH < BREAKPOINTS.mobile ? 24 : 32,
  },
} as const;

export default Responsive;
