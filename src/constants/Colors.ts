export const Colors = {
  // PRIMARY BRAND COLORS (from brand guidelines)
  forestGreen: "#003D1E",    // Primary brand color
  chartreuse: "#DCFF00",     // Accent color
  black: "#000000",          // Base color
  white: "#FFFFFF",          // Base color
  
  // EXTENDED PALETTE (from extended palette)
  keyLime: "#EDFD8A", 
  lightGoldenrodYellow: "#F9FFD0",
  oceanGreen: "#47C686",
  illuminatingEmerald: "#2CA166",
  darkGreen: "#032516",
  veryLightTangelo: "#FFB777",
  royalOrange: "#FF9E4A",
  safetyOrange: "#FF7700",
  
  // SEMANTIC COLORS (mapped to primary palette)
  primary: "#003D1E",        // Forest Green - PRIMARY BRAND
  primaryLight: "#47C686",   // Ocean Green - lighter variant
  primaryDark: "#032516",    // Dark Green - darker variant
  
  accent: "#DCFF00",         // Chartreuse - ACCENT COLOR
  accentLight: "#EDFD8A",    // Key Lime - lighter accent
  accentDark: "#F9FFD0",     // Light Goldenrod Yellow - darker accent
  
  // Base colors
  base: "#FFFFFF",           // White - BASE COLOR
  baseDark: "#000000",       // Black - BASE COLOR
  
  // Status Colors (using extended palette appropriately)
  success: "#47C686",        // Ocean Green
  warning: "#FF9E4A",        // Royal Orange
  error: "#FF7700",          // Safety Orange
  info: "#2CA166",           // Illuminating Emerald
  
  // Minimal Neutrals (for UI elements)
  gray: {
    100: "#F3F4F6",  // Light backgrounds
    300: "#D1D5DB",  // Borders
    500: "#6B7280",  // Secondary text
    700: "#374151",  // Primary text
    900: "#111827",  // Dark text
  },
  
  // Background Colors
  background: "#FFFFFF",     // White background
  surface: "#F3F4F6",        // Light surface
  
  // Text Colors
  text: {
    primary: "#000000",      // Black for primary text
    secondary: "#6B7280",    // Gray for secondary text
    tertiary: "#9CA3AF",     // Light gray for tertiary text
    inverse: "#FFFFFF",      // White for text on dark backgrounds
    brand: "#003D1E",        // Forest Green for brand text
  },
  
  // Border Colors
  border: "#D1D5DB",
  borderLight: "#F3F4F6",
  borderDark: "#374151",
} as const;

export type ColorKey = keyof typeof Colors;
