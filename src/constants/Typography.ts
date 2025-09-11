export const Typography = {
  // Font Families
  fontFamily: {
    // Primary font for headings and titles
    archivo: {
      light: 'Archivo_300Light',
      regular: 'Archivo_400Regular',
      medium: 'Archivo_500Medium',
      semibold: 'Archivo_600SemiBold',
      bold: 'Archivo_700Bold',
    },
    // Secondary font for body text and UI elements
    poppins: {
      light: 'Poppins_300Light',
      regular: 'Poppins_400Regular',
      medium: 'Poppins_500Medium',
      semibold: 'Poppins_600SemiBold',
      bold: 'Poppins_700Bold',
    },
    // Tertiary font for captions and secondary text
    ptSans: {
      regular: 'PTSans_400Regular',
      bold: 'PTSans_700Bold',
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
    // Headings
    h1: {
      fontFamily: 'Archivo_700Bold',
      fontSize: 36,
      fontWeight: '700',
      lineHeight: 43.2, // 36 * 1.2
      letterSpacing: -0.5,
    },
    h2: {
      fontFamily: 'Archivo_600SemiBold',
      fontSize: 28,
      fontWeight: '600',
      lineHeight: 39.2, // 28 * 1.4
      letterSpacing: -0.5,
    },
    h3: {
      fontFamily: 'Archivo_500Medium',
      fontSize: 24,
      fontWeight: '500',
      lineHeight: 33.6, // 24 * 1.4
      letterSpacing: 0,
    },
    h4: {
      fontFamily: 'Archivo_400Regular',
      fontSize: 20,
      fontWeight: '400',
      lineHeight: 28, // 20 * 1.4
      letterSpacing: 0,
    },
    
    // Body Text
    bodyLarge: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 28.8, // 18 * 1.6
      letterSpacing: 0,
    },
    bodyMedium: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 25.6, // 16 * 1.6
      letterSpacing: 0,
    },
    bodySmall: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 22.4, // 14 * 1.6
      letterSpacing: 0,
    },

    // UI Elements
    button: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24, // 16 * 1.5
      letterSpacing: 0.5,
    },
    buttonLarge: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 27, // 18 * 1.5
      letterSpacing: 0.5,
    },
    buttonSmall: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 21, // 14 * 1.5
      letterSpacing: 0.5,
    },

    // Captions and Secondary Text
    caption: {
      fontFamily: 'PTSans_400Regular',
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 18, // 12 * 1.5
      letterSpacing: 0.5,
    },
    captionBold: {
      fontFamily: 'PTSans_700Bold',
      fontSize: 12,
      fontWeight: '700',
      lineHeight: 18, // 12 * 1.5
      letterSpacing: 0.5,
    },
    overline: {
      fontFamily: 'PTSans_700Bold',
      fontSize: 10,
      fontWeight: '700',
      lineHeight: 15, // 10 * 1.5
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },

    // Brand/Logo Text
    brandName: {
      fontFamily: 'Archivo_300Light',
      fontSize: 28,
      fontWeight: '300',
      lineHeight: 39.2, // 28 * 1.4
      letterSpacing: 6,
    },
    tagline: {
      fontFamily: 'PTSans_400Regular',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 21, // 14 * 1.5
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },

    // Page-specific styles
    // Hero page - Archivo fonts
    heroBrandName: {
      fontFamily: 'Archivo_300Light',
      fontSize: 28,
      fontWeight: '300',
      lineHeight: 39.2, // 28 * 1.4
      letterSpacing: 6,
    },
    heroTagline: {
      fontFamily: 'Archivo_400Regular',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 21, // 14 * 1.5
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
    heroCtaText: {
      fontFamily: 'Archivo_400Regular',
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 28.8, // 18 * 1.6
      letterSpacing: 0,
    },
    heroButtonText: {
      fontFamily: 'Archivo_600SemiBold',
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 27, // 18 * 1.5
      letterSpacing: 0.5,
    },

    // Dashboard page - PT Sans fonts
    dashboardGreeting: {
      fontFamily: 'PTSans_400Regular',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 22.4, // 14 * 1.6
      letterSpacing: 0,
    },
    dashboardTitle: {
      fontFamily: 'PTSans_700Bold',
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 39.2, // 28 * 1.4
      letterSpacing: 0,
    },
    dashboardDate: {
      fontFamily: 'PTSans_400Regular',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 22.4, // 14 * 1.6
      letterSpacing: 0,
    },
    dashboardCardTitle: {
      fontFamily: 'PTSans_700Bold',
      fontSize: 20,
      fontWeight: '700',
      lineHeight: 28, // 20 * 1.4
      letterSpacing: 0,
    },
    dashboardCardSize: {
      fontFamily: 'PTSans_400Regular',
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 18, // 12 * 1.5
      letterSpacing: 0.5,
    },

    // Venues page - Poppins fonts
    venuesCityTitle: {
      fontFamily: 'Poppins_700Bold',
      fontSize: 36,
      fontWeight: '700',
      lineHeight: 43.2, // 36 * 1.2
      letterSpacing: -0.5,
    },
    venuesCityDescription: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 20,
      fontWeight: '400',
      lineHeight: 28, // 20 * 1.4
      letterSpacing: 0,
    },
    venuesVenueTitle: {
      fontFamily: 'Poppins_700Bold',
      fontSize: 36,
      fontWeight: '700',
      lineHeight: 43.2, // 36 * 1.2
      letterSpacing: -0.5,
    },
    venuesBackButton: {
      fontFamily: 'Poppins_700Bold',
      fontSize: 24,
      fontWeight: '700',
      lineHeight: 33.6, // 24 * 1.4
      letterSpacing: 0,
    },
  },
} as const;

export type TypographyKey = keyof typeof Typography;
export type TypographyStyleKey = keyof typeof Typography.styles;
