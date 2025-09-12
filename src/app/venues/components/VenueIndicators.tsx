import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

interface VenueIndicatorsProps {
  venuesCount: number;
  currentIndex: number;
}

export const VenueIndicators: React.FC<VenueIndicatorsProps> = ({ 
  venuesCount, 
  currentIndex 
}) => {
  if (venuesCount <= 1) return null;

  return (
    <View style={styles.venueIndicatorsContainer}>
      {Array.from({ length: venuesCount }, (_, index) => (
        <View
          key={index}
          style={[
            styles.horizontalDot,
            {
              backgroundColor: index === currentIndex ? Colors.accent : Colors.gray[300],
              width: index === currentIndex ? 10 : 6,
              height: index === currentIndex ? 10 : 6,
              borderRadius: index === currentIndex ? 5 : 3,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  venueIndicatorsContainer: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  horizontalDot: {
    marginHorizontal: 4,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default VenueIndicators;
