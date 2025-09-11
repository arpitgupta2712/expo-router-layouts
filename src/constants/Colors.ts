export const Colors = {
  // Primary Colors
  primary: "#007AFF",
  primaryLight: "#4A9EFF",
  primaryDark: "#0056CC",
  
  // Secondary Colors
  secondary: "#5856D6",
  secondaryLight: "#7B7AE5",
  secondaryDark: "#3D3CB8",
  
  // Neutral Colors
  white: "#FFFFFF",
  black: "#000000",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
  
  // Status Colors
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
  
  // Background Colors
  background: "#F5F5F5",
  surface: "#FFFFFF",
  
  // Text Colors
  text: {
    primary: "#111827",
    secondary: "#6B7280",
    tertiary: "#9CA3AF",
    inverse: "#FFFFFF",
  },
  
  // Border Colors
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  borderDark: "#D1D5DB",
} as const;

export type ColorKey = keyof typeof Colors;
