import { Animated } from 'react-native';

/**
 * Centralized animation constants and utilities for the app
 * This provides consistent animation timing, easing, and configurations
 */

// Animation durations (in milliseconds)
export const AnimationDurations = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,
} as const;

// Animation easing configurations
export const AnimationEasing = {
  easeInOut: 'ease-in-out',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  linear: 'linear',
} as const;

// Common animation configurations
export const AnimationConfigs = {
  // Fade animations
  fadeIn: {
    duration: AnimationDurations.normal,
    useNativeDriver: true,
  },
  fadeOut: {
    duration: AnimationDurations.normal,
    useNativeDriver: true,
  },
  quickFade: {
    duration: AnimationDurations.fast,
    useNativeDriver: true,
  },

  // Slide animations
  slideUp: {
    duration: AnimationDurations.normal,
    useNativeDriver: true,
  },
  slideDown: {
    duration: AnimationDurations.normal,
    useNativeDriver: true,
  },
  slideLeft: {
    duration: AnimationDurations.normal,
    useNativeDriver: true,
  },
  slideRight: {
    duration: AnimationDurations.normal,
    useNativeDriver: true,
  },

  // Scale animations
  scaleIn: {
    duration: AnimationDurations.normal,
    useNativeDriver: true,
  },
  scaleOut: {
    duration: AnimationDurations.normal,
    useNativeDriver: true,
  },

  // Spring animations
  spring: {
    tension: 100,
    friction: 8,
    useNativeDriver: true,
  },
  bouncySpring: {
    tension: 200,
    friction: 4,
    useNativeDriver: true,
  },
} as const;

// Animation utility functions
export const AnimationUtils = {
  /**
   * Create a fade sequence animation (fade out then fade in)
   */
  createFadeSequence: (animatedValue: Animated.Value, duration: number = AnimationDurations.fast) => {
    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration / 2,
        useNativeDriver: true,
      }),
    ]);
  },

  /**
   * Create a slide animation for card transitions (Instagram Reels style)
   */
  createSlideAnimation: (
    animatedValue: Animated.Value,
    direction: 'up' | 'down' | 'left' | 'right',
    duration: number = AnimationDurations.slow
  ) => {
    const { width: screenWidth, height: screenHeight } = require('react-native').Dimensions.get('window');
    
    let fromValue: number;
    let toValue: number = 0;

    switch (direction) {
      case 'up':
        fromValue = screenHeight;
        break;
      case 'down':
        fromValue = -screenHeight;
        break;
      case 'left':
        fromValue = screenWidth;
        break;
      case 'right':
        fromValue = -screenWidth;
        break;
    }

    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: fromValue,
        duration: duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: toValue,
        duration: duration / 2,
        useNativeDriver: true,
      }),
    ]);
  },

  /**
   * Create a natural Instagram Reels style transition with momentum
   */
  createReelsStyleTransition: (
    currentCardValue: Animated.Value,
    nextCardValue: Animated.Value,
    direction: 'up' | 'down',
    duration: number = AnimationDurations.slow
  ) => {
    const { height: screenHeight } = require('react-native').Dimensions.get('window');
    
    const slideDistance = screenHeight;
    const currentCardEndValue = direction === 'up' ? -slideDistance : slideDistance;
    const nextCardStartValue = direction === 'up' ? slideDistance : -slideDistance;

    return Animated.parallel([
      // Current card slides out
      Animated.timing(currentCardValue, {
        toValue: currentCardEndValue,
        duration: duration,
        useNativeDriver: true,
      }),
      // Next card slides in simultaneously
      Animated.timing(nextCardValue, {
        toValue: 0,
        duration: duration,
        useNativeDriver: true,
      }),
    ]);
  },

  /**
   * Create a whip pan transition (horizontal blur effect)
   */
  createWhipPanTransition: (
    animatedValue: Animated.Value,
    direction: 'left' | 'right',
    duration: number = AnimationDurations.fast
  ) => {
    const { width: screenWidth } = require('react-native').Dimensions.get('window');
    
    const fromValue = direction === 'left' ? screenWidth : -screenWidth;
    const toValue = direction === 'left' ? -screenWidth : screenWidth;

    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: fromValue,
        duration: duration / 3,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: toValue,
        duration: duration / 3,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: duration / 3,
        useNativeDriver: true,
      }),
    ]);
  },

  /**
   * Create a scale animation for card transitions
   */
  createScaleAnimation: (
    animatedValue: Animated.Value,
    duration: number = AnimationDurations.normal
  ) => {
    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 0.8,
        duration: duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration / 2,
        useNativeDriver: true,
      }),
    ]);
  },

  /**
   * Create a spring animation for bouncy effects
   */
  createSpringAnimation: (
    animatedValue: Animated.Value,
    toValue: number = 1,
    config: any = AnimationConfigs.spring
  ) => {
    return Animated.spring(animatedValue, {
      toValue,
      ...config,
    });
  },
};

// Pre-configured animation sequences for common use cases
export const AnimationSequences = {
  // Card transition animations
  cardFadeTransition: (animatedValue: Animated.Value) => 
    AnimationUtils.createFadeSequence(animatedValue, AnimationDurations.fast),
  
  cardSlideUpTransition: (animatedValue: Animated.Value) => 
    AnimationUtils.createSlideAnimation(animatedValue, 'up', AnimationDurations.normal),
  
  cardSlideDownTransition: (animatedValue: Animated.Value) => 
    AnimationUtils.createSlideAnimation(animatedValue, 'down', AnimationDurations.normal),
  
  cardScaleTransition: (animatedValue: Animated.Value) => 
    AnimationUtils.createScaleAnimation(animatedValue, AnimationDurations.normal),

  // Instagram Reels style transitions
  reelsSlideUp: (currentCard: Animated.Value, nextCard: Animated.Value) => 
    AnimationUtils.createReelsStyleTransition(currentCard, nextCard, 'up', AnimationDurations.slow),
  
  reelsSlideDown: (currentCard: Animated.Value, nextCard: Animated.Value) => 
    AnimationUtils.createReelsStyleTransition(currentCard, nextCard, 'down', AnimationDurations.slow),

  // Whip pan transitions for horizontal swipes
  whipPanLeft: (animatedValue: Animated.Value) => 
    AnimationUtils.createWhipPanTransition(animatedValue, 'left', AnimationDurations.fast),
  
  whipPanRight: (animatedValue: Animated.Value) => 
    AnimationUtils.createWhipPanTransition(animatedValue, 'right', AnimationDurations.fast),

  // Button animations
  buttonPress: (animatedValue: Animated.Value) => 
    AnimationUtils.createSpringAnimation(animatedValue, 0.95, AnimationConfigs.bouncySpring),
  
  buttonRelease: (animatedValue: Animated.Value) => 
    AnimationUtils.createSpringAnimation(animatedValue, 1, AnimationConfigs.spring),

  // Loading animations
  loadingPulse: (animatedValue: Animated.Value) => 
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ),
} as const;

// Animation types for TypeScript
export type AnimationDirection = 'up' | 'down' | 'left' | 'right';
export type AnimationType = 'fade' | 'slide' | 'scale' | 'spring';
export type AnimationDuration = keyof typeof AnimationDurations;
