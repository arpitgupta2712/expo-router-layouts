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
      fontSize: 36,
      fontWeight: '700',
      lineHeight: 43.2, // 36 * 1.2
      letterSpacing: -0.5,
    },
    h2: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: 28,
      fontWeight: '600',
      lineHeight: 39.2, // 28 * 1.4
      letterSpacing: -0.5,
    },
    h3: {
      fontFamily: 'Poppins_500Medium',
      fontSize: 24,
      fontWeight: '500',
      lineHeight: 33.6, // 24 * 1.4
      letterSpacing: 0,
    },
    h4: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 20,
      fontWeight: '400',
      lineHeight: 28, // 20 * 1.4
      letterSpacing: 0,
    },
    
    // Body Text - PT Sans for body text
    bodyLarge: {
      fontFamily: 'PTSans_400Regular',
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 28.8, // 18 * 1.6
      letterSpacing: 0,
    },
    bodyMedium: {
      fontFamily: 'PTSans_400Regular',
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 25.6, // 16 * 1.6
      letterSpacing: 0,
    },
    bodySmall: {
      fontFamily: 'PTSans_400Regular',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 22.4, // 14 * 1.6
      letterSpacing: 0,
    },

    // UI Elements - Poppins for buttons
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

    // Captions and Secondary Text - Archivo Extra Condensed (Italics)
    caption: {
      fontFamily: 'ArchivoExtraCondensed-Italic',
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 18, // 12 * 1.5
      letterSpacing: 0.5,
    },
    captionBold: {
      fontFamily: 'ArchivoExtraCondensed-BoldItalic',
      fontSize: 12,
      fontWeight: '700',
      lineHeight: 18, // 12 * 1.5
      letterSpacing: 0.5,
    },
    overline: {
      fontFamily: 'ArchivoExtraCondensed-BoldItalic',
      fontSize: 10,
      fontWeight: '700',
      lineHeight: 15, // 10 * 1.5
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },

    // Brand/Logo Text - Archivo Extra Condensed for brand identity (Italics)
    brandName: {
      fontFamily: 'ArchivoExtraCondensed-LightItalic',
      fontSize: 28,
      fontWeight: '300',
      lineHeight: 39.2, // 28 * 1.4
      letterSpacing: 6,
    },
    tagline: {
      fontFamily: 'ArchivoExtraCondensed-Italic',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 21, // 14 * 1.5
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },

    // Page-specific styles
    // Hero page - Archivo Extra Condensed for brand (Italics), PT Sans for body
    heroBrandName: {
      fontFamily: 'ArchivoExtraCondensed-LightItalic',
      fontSize: 28,
      fontWeight: '300',
      lineHeight: 39.2, // 28 * 1.4
      letterSpacing: 6,
    },
    heroTagline: {
      fontFamily: 'ArchivoExtraCondensed-Italic',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 21, // 14 * 1.5
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
    heroCtaText: {
      fontFamily: 'PTSans_400Regular',
      fontSize: 18,
      fontWeight: '400',
      lineHeight: 28.8, // 18 * 1.6
      letterSpacing: 0,
    },
    heroButtonText: {
      fontFamily: 'Poppins_600SemiBold',
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 27, // 18 * 1.5
      letterSpacing: 0.5,
    },

    // Dashboard page - Poppins for titles, PT Sans for body, Archivo for captions
    dashboardGreeting: {
      fontFamily: 'PTSans_400Regular',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 22.4, // 14 * 1.6
      letterSpacing: 0,
    },
    dashboardTitle: {
      fontFamily: 'Poppins_700Bold',
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 39.2, // 28 * 1.4
      letterSpacing: -0.5,
    },
    dashboardDate: {
      fontFamily: 'PTSans_400Regular',
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 22.4, // 14 * 1.6
      letterSpacing: 0,
    },
    dashboardCardTitle: {
      fontFamily: 'ArchivoExtraCondensed-BoldItalic',
      fontSize: 20,
      fontWeight: '700',
      lineHeight: 28, // 20 * 1.4
      letterSpacing: 0.5,
    },
    dashboardCardSize: {
      fontFamily: 'Poppins_400Regular',
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 18, // 12 * 1.5
      letterSpacing: 0,
    },

    // Venues page - Poppins for titles, PT Sans for descriptions
    venuesCityTitle: {
      fontFamily: 'Poppins_700Bold',
      fontSize: 36,
      fontWeight: '700',
      lineHeight: 43.2, // 36 * 1.2
      letterSpacing: -0.5,
    },
    venuesCityDescription: {
      fontFamily: 'PTSans_400Regular',
      fontSize: 20,
      fontWeight: '400',
      lineHeight: 28, // 20 * 1.4
      letterSpacing: 0,
    },
    venuesVenueTitle: {
      fontFamily: 'Poppins_700Bold',
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 33.6, // 36 * 1.2
      letterSpacing: -0.5,
    },
    venuesBackButton: {
      fontFamily: 'ArchivoExtraCondensed-BoldItalic',
      fontSize: 20,
      fontWeight: '700',
      lineHeight: 33.6, // 24 * 1.4
      letterSpacing: 0,
    },
  },
} as const;

export type TypographyKey = keyof typeof Typography;
export type TypographyStyleKey = keyof typeof Typography.styles;
