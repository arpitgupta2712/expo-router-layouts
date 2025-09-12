// Image mapping utilities
export const getCityImage = (cityName: string) => {
  const cityImages = {
    'Gurgaon': require('../../../assets/cities/Gurgaon.jpg'),
    'Delhi': require('../../../assets/cities/Delhi.jpg'),
    'Faridabad': require('../../../assets/cities/Faridabad.jpg'),
    'Noida': require('../../../assets/cities/Noida.jpg'),
    'Kolkata': require('../../../assets/cities/Kolkata.jpg'),
    'Jhansi': require('../../../assets/cities/Jhansi.jpg'),
    'Roorkee': require('../../../assets/cities/Roorkee.jpg'),
    'Lucknow': require('../../../assets/cities/Lucknow.jpg'),
    'Ludhiana': require('../../../assets/cities/Ludhiana.jpg'),
  };
  
  // Fallback to Delhi map image
  return cityImages[cityName as keyof typeof cityImages] || cityImages['Delhi'];
};

export const getFeatureImage = (title: string) => {
  const featureImages = {
    'ClayGrounds': require('../../../assets/images/ClayGrounds-IMS.png'),
    'Bookings': require('../../../assets/images/Bookings.jpg'),
    'Favorites': require('../../../assets/images/Favorites.jpg'),
    'Analytics': require('../../../assets/images/Stadium.jpg'),
  };
  
  return featureImages[title as keyof typeof featureImages] || { 
    uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format' 
  };
};
