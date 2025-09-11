# Typography System

This project uses a comprehensive typography system with three Google Fonts variants:

## Font Families

### 1. Archivo Condensed
- **Primary font** for headings and titles
- **Variants**: Light, Regular, Medium, SemiBold, Bold
- **Usage**: Brand names, main headings (H1, H2, H3, H4)

### 2. Poppins
- **Secondary font** for body text and UI elements
- **Variants**: Light, Regular, Medium, SemiBold, Bold
- **Usage**: Body text, buttons, UI components

### 3. PT Sans
- **Tertiary font** for captions and secondary text
- **Variants**: Regular, Bold
- **Usage**: Captions, overlines, secondary information

## Usage

### Import the Typography constants:
```typescript
import { Typography } from "@/constants/Typography";
```

### Using Predefined Styles:
```typescript
// Headings
<Text style={Typography.styles.h1}>Main Heading</Text>
<Text style={Typography.styles.h2}>Section Heading</Text>
<Text style={Typography.styles.h3}>Subsection</Text>
<Text style={Typography.styles.h4}>Card Title</Text>

// Body Text
<Text style={Typography.styles.bodyLarge}>Large body text</Text>
<Text style={Typography.styles.bodyMedium}>Regular body text</Text>
<Text style={Typography.styles.bodySmall}>Small body text</Text>

// UI Elements
<Text style={Typography.styles.button}>Button Text</Text>
<Text style={Typography.styles.buttonLarge}>Large Button</Text>
<Text style={Typography.styles.buttonSmall}>Small Button</Text>

// Captions and Secondary
<Text style={Typography.styles.caption}>Caption text</Text>
<Text style={Typography.styles.captionBold}>Bold caption</Text>
<Text style={Typography.styles.overline}>OVERLINE TEXT</Text>

// Brand/Logo
<Text style={Typography.styles.brandName}>CLAYGROUNDS</Text>
<Text style={Typography.styles.tagline}>Premium Football Facilities</Text>
```

### Custom Typography:
```typescript
// Using individual properties
<Text style={{
  fontFamily: Typography.fontFamily.archivo.condensed.bold,
  fontSize: Typography.fontSize.xl,
  fontWeight: Typography.fontWeight.bold,
  lineHeight: Typography.lineHeight.tight,
  letterSpacing: Typography.letterSpacing.wide,
}}>Custom Text</Text>
```

## Font Setup

To use these Google Fonts in your React Native app, you'll need to:

1. **Install the fonts** (if using Expo):
   ```bash
   expo install @expo-google-fonts/archivo-condensed @expo-google-fonts/poppins @expo-google-fonts/pt-sans
   ```

2. **Load fonts in your app**:
   ```typescript
   import { useFonts } from 'expo-font';
   import {
     ArchivoCondensed_300Light,
     ArchivoCondensed_400Regular,
     ArchivoCondensed_500Medium,
     ArchivoCondensed_600SemiBold,
     ArchivoCondensed_700Bold,
   } from '@expo-google-fonts/archivo-condensed';
   import {
     Poppins_300Light,
     Poppins_400Regular,
     Poppins_500Medium,
     Poppins_600SemiBold,
     Poppins_700Bold,
   } from '@expo-google-fonts/poppins';
   import {
     PTSans_400Regular,
     PTSans_700Bold,
   } from '@expo-google-fonts/pt-sans';
   ```

## Best Practices

1. **Use predefined styles** whenever possible for consistency
2. **Extend styles** rather than overriding completely:
   ```typescript
   <Text style={[Typography.styles.h1, { color: 'red' }]}>Red Heading</Text>
   ```
3. **Follow the hierarchy**: Archivo Condensed → Poppins → PT Sans
4. **Maintain consistency** across the app by using the same styles for similar elements

## Migration Notes

- All hardcoded font values have been replaced with typography constants
- The old `Layout.fontSize` and `Layout.fontWeight` have been moved to `Typography`
- Components now use semantic style names (e.g., `Typography.styles.h1` instead of hardcoded values)
