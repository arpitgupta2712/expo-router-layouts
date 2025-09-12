import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Typography, Colors, Layout, Responsive } from '@/constants';

interface FacilityCardProps {
  facility: {
    id: string;
    name: string;
    price: string;
    sports: { id: string; name: string }[];
  };
  onPress: () => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({ 
  facility, 
  onPress
}) => {
  const primarySport = facility.sports?.[0];

  
  const handlePress = () => {
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.facilityCard}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Facility Name and Price in same line */}
      <View style={styles.contentRow}>
        <Text style={styles.facilityName} numberOfLines={1}>
          {facility.name}
        </Text>
        
        <Text style={styles.priceText} numberOfLines={1}>
          ₹{facility.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  facilityCard: {
    backgroundColor: Colors.base,
    borderColor: Colors.primary,
    borderRadius: Layout.borderRadius.md,
    padding: Responsive.spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    width: Responsive.screen.width - (Responsive.grid.containerPadding * 2),
    marginBottom: Responsive.spacing.sm,
    minHeight: 48, // Ensure minimum touch target
    zIndex: 100, // Ensure it's above other elements
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  facilityName: {
    ...Typography.styles.venuesVenueTitle,
    color: Colors.primary,
    fontSize: Responsive.fontSize.sm,
    fontWeight: '600',
    lineHeight: 32,
    flex: 1,
    marginRight: Responsive.spacing.sm,
  },
  priceText: {
    ...Typography.styles.venuesVenueTitle,
    color: Colors.primary,
    fontSize: Responsive.fontSize.sm,
    fontWeight: '700',
    lineHeight: 32,
    textAlign: 'right',
  },
});

export default FacilityCard;
