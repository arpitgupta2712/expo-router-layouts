import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Responsive font scaling based on screen width
const getResponsiveFontSize = (baseSize: number, scaleFactor: number = 0.8) => {
  // Use screen width to determine scaling
  // iPhone SE (375px) gets smaller fonts, iPhone 16 Pro Max (430px) gets larger fonts
  const minWidth = 320; // iPhone SE width
  const maxWidth = 430; // iPhone 16 Pro Max width
  const normalizedWidth = Math.max(minWidth, Math.min(SCREEN_WIDTH, maxWidth));
  
  // Scale factor: 0.8 for smallest screens, 1.0 for largest screens
  const scale = scaleFactor + (1 - scaleFactor) * ((normalizedWidth - minWidth) / (maxWidth - minWidth));
  
  return Math.round(baseSize * scale);
};

// Responsive line height scaling
const getResponsiveLineHeight = (fontSize: number, lineHeightRatio: number = 1.2) => {
  return Math.round(fontSize * lineHeightRatio);
};

export const Typography = {
  // Font Families
  fontFamily: {
    // Primary font for titles and subtitles
    poppins: {
      light: 'Poppins_300Light',
      regular: 'Poppins_400Regular',
      medium: 'Poppins_500Medium',
      semibold: 'Poppins_600SemiBold',
      bold: 'Poppins_700Bold',
    },
    // Secondary font for body text and UI elements
    ptSans: {
      regular: 'PTSans_400Regular',
      bold: 'PTSans_700Bold',
    },
    // Tertiary font for captions and secondary text (custom brand font)
    archivoExtraCondensed: {
      thin: 'ArchivoExtraCondensed-Thin',
      thinItalic: 'ArchivoExtraCondensed-ThinItalic',
      light: 'ArchivoExtraCondensed-Light',
      lightItalic: 'ArchivoExtraCondensed-LightItalic',
      regular: 'ArchivoExtraCondensed-Regular',
      italic: 'ArchivoExtraCondensed-Italic',
      medium: 'ArchivoExtraCondensed-Medium',
      mediumItalic: 'ArchivoExtraCondensed-MediumItalic',
      semibold: 'ArchivoExtraCondensed-SemiBold',
      semiboldItalic: 'ArchivoExtraCondensed-SemiBoldItalic',
      bold: 'ArchivoExtraCondensed-Bold',
      boldItalic: 'ArchivoExtraCondensed-BoldItalic',
      extrabold: 'ArchivoExtraCondensed-ExtraBold',
      extraboldItalic: 'ArchivoExtraCondensed-ExtraBoldItalic',
      black: 'ArchivoExtraCondensed-Black',
      blackItalic: 'ArchivoExtraCondensed-BlackItalic',
    }
  },

  // Font Sizes - Comprehensive scale
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    xxxxl: 32,
    xxxxxl: 36,
    xxxxxxl: 48,
  },

  // Font Weights
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 1.5,
  },

  // Predefined Typography Styles
  styles: {
    // Headings - Poppins for titles and subtitles
    h1: {
      fontFamily: 'Poppins_700Bold',
      fontSize: getResponsiveFontSize(36, 0.8),
      fontWeight: '700',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(36, 0.8), 1.2),
      letterSpacing: -0.5,
    },
    h2: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: getResponsiveFontSize(28, 0.8),
      fontWeight: '600',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(28, 0.8), 1.4),
      letterSpacing: -0.5,
    },
    h3: {
      fontFamily: 'Poppins_500Medium',
      fontSize: getResponsiveFontSize(24, 0.8),
      fontWeight: '500',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(24, 0.8), 1.4),
      letterSpacing: 0,
    },
    h4: {
      fontFamily: 'Poppins_400Regular',
      fontSize: getResponsiveFontSize(20, 0.8),
      fontWeight: '400',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(20, 0.8), 1.4),
      letterSpacing: 0,
    },
    
    // Body Text - PT Sans for body text
    bodyLarge: {
      fontFamily: 'PTSans_400Regular',
      fontSize: getResponsiveFontSize(18, 0.8),
      fontWeight: '400',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(18, 0.8), 1.6),
      letterSpacing: 0,
    },
    bodyMedium: {
      fontFamily: 'PTSans_400Regular',
      fontSize: getResponsiveFontSize(16, 0.8),
      fontWeight: '400',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(16, 0.8), 1.6),
      letterSpacing: 0,
    },
    bodySmall: {
      fontFamily: 'PTSans_400Regular',
      fontSize: getResponsiveFontSize(14, 0.8),
      fontWeight: '400',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(14, 0.8), 1.6),
      letterSpacing: 0,
    },

    // UI Elements - Poppins for buttons
    button: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: getResponsiveFontSize(16, 0.8),
      fontWeight: '600',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(16, 0.8), 1.5),
      letterSpacing: 0.5,
    },
    buttonLarge: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: getResponsiveFontSize(18, 0.8),
      fontWeight: '600',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(18, 0.8), 1.5),
      letterSpacing: 0.5,
    },
    buttonSmall: {
      fontFamily: 'Poppins_500Medium',
      fontSize: getResponsiveFontSize(14, 0.8),
      fontWeight: '500',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(14, 0.8), 1.5),
      letterSpacing: 0.5,
    },

    // Captions and Secondary Text - Archivo Extra Condensed (Italics)
    caption: {
      fontFamily: 'ArchivoExtraCondensed-Italic',
      fontSize: getResponsiveFontSize(12, 0.8),
      fontWeight: '400',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(12, 0.8), 1.5),
      letterSpacing: 0.5,
    },
    captionBold: {
      fontFamily: 'ArchivoExtraCondensed-BoldItalic',
      fontSize: getResponsiveFontSize(12, 0.8),
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(12, 0.8), 1.5),
      letterSpacing: 0.5,
    },
    overline: {
      fontFamily: 'ArchivoExtraCondensed-BoldItalic',
      fontSize: getResponsiveFontSize(10, 0.8),
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(10, 0.8), 1.5),
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },

    // Brand/Logo Text - Archivo Extra Condensed for brand identity (Italics)
    brandName: {
      fontFamily: 'ArchivoExtraCondensed-LightItalic',
      fontSize: getResponsiveFontSize(28, 0.8),
      fontWeight: '300',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(28, 0.8), 1.4),
      letterSpacing: 6,
    },
    tagline: {
      fontFamily: 'ArchivoExtraCondensed-Italic',
      fontSize: getResponsiveFontSize(14, 0.8),
      fontWeight: '400',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(14, 0.8), 1.5),
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },

    // Page-specific styles
    // Hero page - Archivo Extra Condensed for brand (Italics), PT Sans for body
    heroBrandName: {
      fontFamily: 'ArchivoExtraCondensed-ExtraBoldItalic',
      fontSize: getResponsiveFontSize(48, 0.7), // Scale from 70% to 100% based on screen size
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(48, 0.7), 1.2),
      letterSpacing: -1,
    },
    heroTagline: {
      fontFamily: 'Poppins_400Regular',
      fontSize: getResponsiveFontSize(14, 0.8),
      fontWeight: '400',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(14, 0.8), 1.5),
      letterSpacing: 0,
      textTransform: 'uppercase',
    },
    heroCtaText: {
      fontFamily: 'PTSans_400Regular',
      fontSize: getResponsiveFontSize(18, 0.8),
      fontWeight: '400',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(18, 0.8), 1.6),
      letterSpacing: 0,
    },
    heroButtonText: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: getResponsiveFontSize(18, 0.8),
      fontWeight: '600',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(18, 0.8), 1.5),
      letterSpacing: 0.5,
    },

    // Dashboard page - Poppins for titles, PT Sans for body, Archivo for captions
    dashboardGreeting: {
      fontFamily: 'PTSans_400Regular',
      fontSize: getResponsiveFontSize(14, 0.8),
      fontWeight: '400',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(14, 0.8), 1.6),
      letterSpacing: 0,
    },
    dashboardTitle: {
      fontFamily: 'Poppins_700Bold',
      fontSize: getResponsiveFontSize(28, 0.8),
      fontWeight: '700',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(28, 0.8), 1.4),
      letterSpacing: -0.5,
    },
    dashboardDate: {
      fontFamily: 'PTSans_400Regular',
      fontSize: getResponsiveFontSize(14, 0.8),
      fontWeight: '400',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(14, 0.8), 1.6),
      letterSpacing: 0,
    },
    dashboardCardTitle: {
      fontFamily: 'ArchivoExtraCondensed-BoldItalic',
      fontSize: getResponsiveFontSize(20, 0.8),
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(20, 0.8), 1.4),
      letterSpacing: 0.5,
    },
    dashboardCardSize: {
      fontFamily: 'Poppins_400Regular',
      fontSize: getResponsiveFontSize(12, 0.8),
      fontWeight: '500',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(12, 0.8), 1.5),
      letterSpacing: 0,
    },

    // Venues page - Poppins for titles, PT Sans for descriptions
    venuesCityTitle: {
      fontFamily: 'Poppins_700Bold',
      fontSize: getResponsiveFontSize(36, 0.8),
      fontWeight: '700',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(36, 0.8), 1.2),
      letterSpacing: -0.5,
    },
    venuesCityDescription: {
      fontFamily: 'PTSans_400Regular',
      fontSize: getResponsiveFontSize(20, 0.8),
      fontWeight: '400',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(20, 0.8), 1.4),
      letterSpacing: 0,
    },
    venuesVenueTitle: {
      fontFamily: 'Poppins_700Bold',
      fontSize: getResponsiveFontSize(24, 0.8),
      fontWeight: '700',
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(28, 0.8), 1.2),
      letterSpacing: -0.5,
    },
    venuesBackButton: {
      fontFamily: 'ArchivoExtraCondensed-BoldItalic',
      fontSize: getResponsiveFontSize(20, 0.8),
      lineHeight: getResponsiveLineHeight(getResponsiveFontSize(20, 0.8), 1.4),
      letterSpacing: 0,
    },
  },
} as const;

export type TypographyKey = keyof typeof Typography;
export type TypographyStyleKey = keyof typeof Typography.styles;
