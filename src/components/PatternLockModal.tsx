import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { CustomPatternLock } from './CustomPatternLock';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface PatternLockModalProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

// Define the 'G' pattern for 4x4 grid
// Grid positions: 0,1,2,3 (top row), 4,5,6,7 (second row), etc.
// G pattern: 0-1-2-6-10-9-8-12-13-14-15
const CORRECT_PATTERN = [0, 1, 2, 6, 10, 9, 8, 12, 13, 14, 15];
const MAX_ATTEMPTS = 5;
const TIMEOUT_DURATION = 3 * 60 * 1000; // 3 minutes in milliseconds

export const PatternLockModal: React.FC<PatternLockModalProps> = ({
  visible,
  onSuccess,
  onCancel,
}) => {
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timeoutEnd, setTimeoutEnd] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Show/hide animation
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Countdown timer for lockout
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLocked && timeoutEnd) {
      interval = setInterval(() => {
        const now = Date.now();
        const timeLeft = Math.max(0, timeoutEnd - now);
        setRemainingTime(timeLeft);

        if (timeLeft === 0) {
          setIsLocked(false);
          setAttempts(0);
          setTimeoutEnd(null);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLocked, timeoutEnd]);

  const handlePatternChange = (path: number[]) => {
    setCurrentPath(path);
  };

  const handlePatternComplete = (code: number[]) => {
    if (isLocked) return;

    const isCorrect = JSON.stringify(code) === JSON.stringify(CORRECT_PATTERN);

    if (isCorrect) {
      // Success animation
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -height,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onSuccess();
        resetModal();
      });
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // Shake animation for wrong pattern
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();

      setCurrentPath([]);

      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setTimeoutEnd(Date.now() + TIMEOUT_DURATION);
        Alert.alert(
          'Too Many Attempts',
          'You have exceeded the maximum number of attempts. Please wait 3 minutes before trying again.',
          [{ text: 'OK' }]
        );
      } else {
        const remainingAttempts = MAX_ATTEMPTS - newAttempts;
        Alert.alert(
          'Incorrect Pattern',
          `Wrong pattern! ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`,
          [{ text: 'Try Again' }]
        );
      }
    }
  };

  const resetModal = () => {
    setCurrentPath([]);
    setAttempts(0);
    setIsLocked(false);
    setTimeoutEnd(null);
    setRemainingTime(0);
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <X size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Lock Screen</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Unlock to login @ ClayGrounds
        </Text>

        {/* Pattern Lock */}
        <Animated.View style={[styles.patternContainer, { transform: [{ translateX: shakeAnim }] }]}>
          <CustomPatternLock
            size={width * 0.8}
            onPatternComplete={handlePatternComplete}
            onPatternStart={() => {
              // Optional: Add haptic feedback or visual feedback here
            }}
          />
        </Animated.View>

        {/* Status Messages */}
        <View style={styles.statusContainer}>
          {isLocked ? (
            <View style={styles.lockoutContainer}>
              <Text style={styles.lockoutTitle}>Too Many Failed Attempts</Text>
              <Text style={styles.lockoutText}>
                Please wait {formatTime(remainingTime)} before trying again
              </Text>
            </View>
          ) : (
            <View style={styles.attemptsContainer}>
              <Text style={styles.attemptsText}>
                You have {MAX_ATTEMPTS - attempts} attempts remaining
              </Text>
            </View>
          )}
        </View>

      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.styles.caption,
    color: Colors.base,
    fontSize: 20,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    ...Typography.styles.bodyMedium,
    color: Colors.accent,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.9,
  },
  patternContainer: {
    marginBottom: 40,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 30,
    minHeight: 60,
  },
  lockoutContainer: {
    alignItems: 'center',
  },
  lockoutTitle: {
    ...Typography.styles.h4,
    color: Colors.error,
    marginBottom: 8,
  },
  lockoutText: {
    ...Typography.styles.bodyMedium,
    color: Colors.base,
    opacity: 0.8,
  },
  attemptsContainer: {
    alignItems: 'center',
  },
  attemptsText: {
    ...Typography.styles.bodyMedium,
    color: Colors.accent,
    marginBottom: 4,
  },
  remainingText: {
    ...Typography.styles.caption,
    color: Colors.base,
    opacity: 0.7,
  },
  instructions: {
    ...Typography.styles.caption,
    color: Colors.base,
    opacity: 0.6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PatternLockModal;
