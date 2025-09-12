import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Typography, Colors, Layout } from '@/constants';

interface VenueHeaderProps {
  cityName: string;
}

export const VenueHeader: React.FC<VenueHeaderProps> = ({
  cityName,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerSpacer} />
      
      {/* City Information */}
      <View style={styles.cityHeaderContainer}>
        <Text style={styles.cityHeaderTitle}>{cityName}</Text>
      </View>

      {/* Floating Back Button */}
      <Link href="/dashboard" asChild>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: "transparent",
    zIndex: 10,
    paddingTop: 50, // Status bar height
  },
  headerSpacer: {
    height: 20,
  },
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
    color: Colors.base,
    fontWeight: '700',
    textAlign: 'center',
  },
  backButton: {
    position: "absolute",
    top: 72,
    left: 30,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default VenueHeader;
