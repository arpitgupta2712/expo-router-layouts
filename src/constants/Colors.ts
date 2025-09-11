export const Colors = {
  // Brand Colors - Yellow/Lime Family
  chartreuse: "#DCFF00",
  keyLime: "#EDFD8A", 
  lightGoldenrodYellow: "#F9FFD0",
  
  // Brand Colors - Green Family
  oceanGreen: "#47C686",
  illuminatingEmerald: "#2CA166",
  forestGreen: "#003D1E",
  darkGreen: "#032516",
  
  // Brand Colors - Orange Family
  veryLightTangelo: "#FFB777",
  royalOrange: "#FF9E4A",
  safetyOrange: "#FF7700",
  
  // Essential Neutrals
  white: "#FFFFFF",
  black: "#000000",
  
  // Minimal Neutrals (for UI elements)
  gray: {
    100: "#F3F4F6",  // Light backgrounds
    300: "#D1D5DB",  // Borders
    500: "#6B7280",  // Secondary text
    700: "#374151",  // Primary text
    900: "#111827",  // Dark text
  },
  
  // Semantic Colors (using brand colors)
  primary: "#47C686",        // Ocean Green as primary
  primaryLight: "#2CA166",   // Illuminating Emerald
  primaryDark: "#003D1E",    // Forest Green
  
  secondary: "#FF9E4A",      // Royal Orange as secondary
  secondaryLight: "#FFB777", // Very Light Tangelo
  secondaryDark: "#FF7700",  // Safety Orange
  
  accent: "#DCFF00",         // Chartreuse as accent
  accentLight: "#EDFD8A",    // Key Lime
  accentDark: "#F9FFD0",     // Light Goldenrod Yellow
  
  // Status Colors (using brand colors where appropriate)
  success: "#47C686",        // Ocean Green
  warning: "#FF9E4A",        // Royal Orange
  error: "#FF7700",          // Safety Orange
  info: "#2CA166",           // Illuminating Emerald
  
  // Background Colors (using neutrals)
  background: "#FFFFFF",
  surface: "#F3F4F6",
  
  // Text Colors
  text: {
    primary: "#111827",      // Dark gray for primary text
    secondary: "#6B7280",    // Medium gray for secondary text
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
