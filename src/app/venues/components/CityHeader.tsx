import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography, Colors, Layout } from '@/constants';

interface CityHeaderProps {
  cityName: string;
  venuesCount: number;
}

export const CityHeader: React.FC<CityHeaderProps> = ({ cityName, venuesCount }) => {
  return (
    <View style={styles.cityHeaderContainer}>
      <Text style={styles.cityHeaderTitle}>{cityName}</Text>
      <Text style={styles.cityHeaderSubtitle}>{venuesCount} venues</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cityHeaderContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    alignItems: "center",
    paddingVertical: Layout.spacing.md,
    backgroundColor: "transparent",
    borderRadius: Layout.borderRadius.lg,
    zIndex: 15,
  },
  cityHeaderTitle: {
    ...Typography.styles.venuesCityTitle,
    color: Colors.accent,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  cityHeaderSubtitle: {
    ...Typography.styles.venuesCityDescription,
    color: Colors.accent,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default CityHeader;
