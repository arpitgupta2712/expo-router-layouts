import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography } from '@/constants/Typography';

export default function FontTest() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Font Loading Test</Text>
      
      {/* Test Archivo Extra Condensed fonts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Archivo Extra Condensed Fonts (Captions & Brand):</Text>
        <Text style={Typography.styles.heroBrandName}>CLAYGROUNDS - Archivo Extra Condensed Light</Text>
        <Text style={Typography.styles.heroTagline}>Premium Football Facilities - Archivo Extra Condensed Regular</Text>
        <Text style={Typography.styles.caption}>Caption Text - Archivo Extra Condensed Regular</Text>
        <Text style={Typography.styles.captionBold}>Bold Caption - Archivo Extra Condensed Bold</Text>
      </View>

      {/* Test PT Sans fonts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PT Sans Fonts (Body Text):</Text>
        <Text style={Typography.styles.dashboardGreeting}>Good morning - PT Sans Regular</Text>
        <Text style={Typography.styles.bodyLarge}>Large Body Text - PT Sans Regular</Text>
        <Text style={Typography.styles.bodyMedium}>Medium Body Text - PT Sans Regular</Text>
        <Text style={Typography.styles.bodySmall}>Small Body Text - PT Sans Regular</Text>
      </View>

      {/* Test Poppins fonts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Poppins Fonts (Titles & Subtitles):</Text>
        <Text style={Typography.styles.h1}>H1 Title - Poppins Bold</Text>
        <Text style={Typography.styles.h2}>H2 Subtitle - Poppins SemiBold</Text>
        <Text style={Typography.styles.h3}>H3 Heading - Poppins Medium</Text>
        <Text style={Typography.styles.h4}>H4 Subheading - Poppins Regular</Text>
        <Text style={Typography.styles.button}>Button Text - Poppins SemiBold</Text>
      </View>

      {/* Font family verification */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Font Family Verification:</Text>
        <Text style={[styles.debugText, { fontFamily: 'ArchivoExtraCondensed-Light' }]}>
          ArchivoExtraCondensed-Light: Should show condensed light weight
        </Text>
        <Text style={[styles.debugText, { fontFamily: 'Poppins_700Bold' }]}>
          Poppins_700Bold: Should show bold weight
        </Text>
        <Text style={[styles.debugText, { fontFamily: 'PTSans_400Regular' }]}>
          PTSans_400Regular: Should show regular weight
        </Text>
        <Text style={[styles.debugText, { fontFamily: 'System' }]}>
          System Font: Fallback if custom fonts fail
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  debugText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
});
