import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CityHeader } from './CityHeader';

interface VenueHeaderProps {
  cityName: string;
  venuesCount: number;
}

export const VenueHeader: React.FC<VenueHeaderProps> = ({
  cityName,
  venuesCount,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerSpacer} />
      {/* City Header inside page header */}
      <CityHeader 
        cityName={cityName} 
        venuesCount={venuesCount} 
      />
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
});

export default VenueHeader;
