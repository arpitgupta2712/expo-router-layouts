import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants';

// Sports abbreviation mapping
export const getSportIcon = (sportName: string) => {
  const normalizedSport = sportName.toLowerCase().trim();
  
  switch (normalizedSport) {
    case 'badminton':
      return React.createElement(Text, { style: styles.sportIcon }, 'BD');
    case 'box cricket':
    case 'cricket':
      return React.createElement(Text, { style: styles.sportIcon }, 'CR');
    case 'football':
    case 'soccer':
      return React.createElement(Text, { style: styles.sportIcon }, 'FB');
    case 'volleyball':
      return React.createElement(Text, { style: styles.sportIcon }, 'VB');
    case 'pickleball':
      return React.createElement(Text, { style: styles.sportIcon }, 'PB');
    default:
      return React.createElement(Text, { style: styles.sportIcon }, sportName.substring(0, 2).toUpperCase());
  }
};

const styles = StyleSheet.create({
  sportIcon: {
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

// Image mapping utilities
export const getCityImage = (cityName: string) => {
  const cityImages = {
    'Gurgaon': require('../../assets/images/Gurgaon.jpg'),
    'Delhi': require('../../assets/images/Delhi.jpg'),
    'Faridabad': require('../../assets/images/Faridabad.jpg'),
    'Noida': require('../../assets/images/Noida.jpg'),
    'Kolkata': require('../../assets/images/Kolkata.jpg'),
    'Jhansi': require('../../assets/images/Jhansi.jpg'),
    'Roorkee': require('../../assets/images/Roorkee.jpg'),
    'Lucknow': require('../../assets/images/Lucknow.jpg'),
    'Ludhiana': require('../../assets/images/Ludhiana.jpg'),
  };
  
  // Fallback to Delhi map image
  return cityImages[cityName as keyof typeof cityImages] || cityImages['Delhi'];
};

export const getFeatureImage = (title: string) => {
  const featureImages = {
    'ClayGrounds': require('../../assets/images/dashboard-dark.png'),
    'Bookings': require('../../assets/images/Stadium.jpg'),
    'Favorites': require('../../assets/images/Stadium.jpg'),
    'Analytics': require('../../assets/images/Analytics.jpg'),
  };
  
  return featureImages[title as keyof typeof featureImages] || { 
    uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format' 
  };
};