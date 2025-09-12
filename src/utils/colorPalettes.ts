import { Colors } from '@/constants';

/**
 * Color palettes for consistent theming across the app
 */

// Color palette for cities and venues
export const cityColors = [
  Colors.primary,        // Forest Green
  Colors.accent,         // Chartreuse
  Colors.primaryLight,   // Ocean Green
  Colors.info,           // Illuminating Emerald
  Colors.error,          // Safety Orange
  Colors.warning,        // Royal Orange
  Colors.accentLight,    // Key Lime
  Colors.primaryDark,    // Dark Green
];

export const venueColors = [
  Colors.primaryLight,   // Ocean Green
  Colors.info,           // Illuminating Emerald
  Colors.primaryDark,    // Dark Green
  Colors.veryLightTangelo, // Very Light Tangelo
  Colors.accentLight,    // Key Lime
  Colors.accentDark,     // Light Goldenrod Yellow
  Colors.warning,        // Royal Orange
  Colors.error,          // Safety Orange
];

// Border color palette for city cards
export const cityBorderColors = [
  Colors.primary,        // Forest Green
];

// Get color by index with cycling
export const getColorByIndex = (colors: string[], index: number): string => {
  return colors[index % colors.length];
};

// Get city color
export const getCityColor = (index: number): string => {
  return getColorByIndex(cityColors, index);
};

// Get venue color
export const getVenueColor = (index: number): string => {
  return getColorByIndex(venueColors, index);
};

// Get border color
export const getBorderColor = (index: number): string => {
  return getColorByIndex(cityBorderColors, index);
};
