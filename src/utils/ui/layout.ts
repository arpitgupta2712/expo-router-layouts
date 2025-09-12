/**
 * Layout configuration constants for consistent spacing and sizing
 */

// Dashboard layout constants
export const DASHBOARD_CONFIG = {
  CARD_GAP: 20,
  CONTAINER_PADDING: 20,
  MAX_WEB_WIDTH: 800,
  CARDS_PER_ROW: 2,
} as const;

// Venues layout constants
export const VENUES_CONFIG = {
  HEADER_HEIGHT: 160,
  STATUS_BAR_HEIGHT: 50,
  HEADER_SPACER: 20,
  INDICATORS_BOTTOM_OFFSET: 60,
  RATING_OVERLAY_PADDING: 16,
} as const;

// Card size configurations
export const CARD_CONFIG = {
  SMALL: 'small',
  RECTANGLE: 'rectangle', 
  BIG: 'big',
} as const;

export type CardSize = typeof CARD_CONFIG[keyof typeof CARD_CONFIG];

// Responsive breakpoints
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
} as const;

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Touch target sizes
export const TOUCH_TARGETS = {
  MINIMUM: 44, // iOS HIG recommendation
  COMFORTABLE: 48, // Android Material Design
  LARGE: 56,
} as const;
