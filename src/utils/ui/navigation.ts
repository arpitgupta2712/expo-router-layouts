// Navigation helper functions
export const createNavigationHelpers = (totalItems: number) => {
  const goToNext = (currentIndex: number, setIndex: (index: number) => void) => {
    if (!totalItems || totalItems <= 1) return;
    const nextIndex = (currentIndex + 1) % totalItems;
    setIndex(nextIndex);
  };

  const goToPrevious = (currentIndex: number, setIndex: (index: number) => void) => {
    if (!totalItems || totalItems <= 1) return;
    const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
    setIndex(prevIndex);
  };

  return { goToNext, goToPrevious };
};

// Format date for display
export const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Create array of items for indicators (dots, etc.)
export const createIndicatorArray = (count: number): number[] => {
  return Array.from({ length: count }, (_, index) => index);
};
