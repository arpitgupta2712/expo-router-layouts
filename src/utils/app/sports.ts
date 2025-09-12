import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants';

// Sport image mapping
export const getSportIcon = (sportName: string) => {
  const normalizedSport = sportName.toLowerCase().trim();
  
  switch (normalizedSport) {
    case 'badminton':
      return React.createElement(Image, {
        source: require('../../../assets/sports/badminton_2.png'),
        style: styles.sportIcon,
        resizeMode: 'contain'
      });
    case 'box cricket':
    case 'cricket':
      return React.createElement(Image, {
        source: require('../../../assets/sports/cricket_2.png'),
        style: styles.sportIcon,
        resizeMode: 'contain'
      });
    case 'football':
    case 'soccer':
      return React.createElement(Image, {
        source: require('../../../assets/sports/football_2.png'),
        style: styles.sportIcon,
        resizeMode: 'contain'
      });
    case 'volleyball':
      return React.createElement(Image, {
        source: require('../../../assets/sports/volleyball_2.png'),
        style: styles.sportIcon,
        resizeMode: 'contain'
      });
    case 'pickleball':
      return React.createElement(Image, {
        source: require('../../../assets/sports/pickleball_2.png'),
        style: styles.sportIcon,
        resizeMode: 'contain'
      });
    default:
      // Fallback to text for unknown sports
      return React.createElement(Text, { style: styles.fallbackText }, sportName.substring(0, 2).toUpperCase());
  }
};

const styles = StyleSheet.create({
  sportIcon: {
    width: 24,
    height: 24,
  },
  fallbackText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.base,
    textAlign: 'center',
  },
});

// Export sport names for reference
export const SPORTS = {
  BADMINTON: 'Badminton',
  BOX_CRICKET: 'Box Cricket', 
  FOOTBALL: 'Football',
  VOLLEYBALL: 'Volleyball',
  PICKLEBALL: 'Pickleball',
} as const;

export type SportType = typeof SPORTS[keyof typeof SPORTS];
