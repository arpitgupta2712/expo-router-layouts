// Image mapping utilities
import { Department } from '@/types/AdminTypes';

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
    'Gallery': require('../../../assets/images/Stadium.png'),
    'Players': require('../../../assets/graphics/Player.png'),
    'Employees': require('../../../assets/graphics/Referee.png'),
    'ClayGrounds': require('../../../assets/images/ClayGrounds-IMS.png'),
  };
  
  return featureImages[title as keyof typeof featureImages] || { 
    uri: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format' 
  };
};

export const getDepartmentImage = (departmentName: Department) => {
  const departmentImages: Record<Department, any> = {
    'hq': require('../../../assets/graphics/Stadium.png'),
    'crew': require('../../../assets/graphics/Field.png'),
    'facility': require('../../../assets/graphics/Booking.png'),
    'process': require('../../../assets/graphics/Extra.png'),
  };
  
  // Direct mapping for the 4 departments
  return departmentImages[departmentName] || departmentImages['hq'];
};
