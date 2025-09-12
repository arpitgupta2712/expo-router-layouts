import React, { useState, useCallback } from 'react';
import { Dimensions, View } from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State,
} from 'react-native-gesture-handler';
import Svg, { Circle, Line, G } from 'react-native-svg';
import { Colors } from '@/constants/Colors';

const { width: screenWidth } = Dimensions.get('window');

interface CustomPatternLockProps {
  size?: number;
  onPatternComplete: (pattern: number[]) => void;
  onPatternStart?: () => void;
}

interface Point {
  x: number;
  y: number;
  index: number;
}

export const CustomPatternLock: React.FC<CustomPatternLockProps> = ({
  size = Math.min(screenWidth * 0.8, 300),
  onPatternComplete,
  onPatternStart,
}) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);

  // Calculate grid points for 4x4 grid
  const gridSize = 4;
  const spacing = size / (gridSize + 1);
  const nodeRadius = 12;

  const getGridPoints = (): Point[] => {
    const points: Point[] = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        points.push({
          x: spacing + col * spacing,
          y: spacing + row * spacing,
          index: row * gridSize + col,
        });
      }
    }
    return points;
  };

  const gridPoints = getGridPoints();

  const getClosestPoint = (x: number, y: number): Point | null => {
    let closestPoint: Point | null = null;
    let minDistance = nodeRadius * 2;

    gridPoints.forEach((point) => {
      const distance = Math.sqrt(
        Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    });

    return closestPoint;
  };

  const handleGestureEvent = useCallback((event: PanGestureHandlerGestureEvent) => {
    const { x, y, state } = event.nativeEvent;

    switch (state) {
      case State.BEGAN:
        setIsDrawing(true);
        setPattern([]);
        setCurrentPath([]);
        onPatternStart?.();
        break;

      case State.ACTIVE:
        if (isDrawing) {
          const closestPoint = getClosestPoint(x, y);
          if (closestPoint && !pattern.includes(closestPoint.index)) {
            const newPattern = [...pattern, closestPoint.index];
            setPattern(newPattern);
            setCurrentPath([...currentPath, closestPoint]);
          }
        }
        break;

      case State.END:
      case State.CANCELLED:
        if (isDrawing && pattern.length > 0) {
          setIsDrawing(false);
          onPatternComplete(pattern);
          // Reset after a short delay
          setTimeout(() => {
            setPattern([]);
            setCurrentPath([]);
          }, 500);
        }
        break;
    }
  }, [pattern, currentPath, isDrawing, onPatternStart, onPatternComplete]);

  const renderGrid = () => {
    return gridPoints.map((point) => {
      const isSelected = pattern.includes(point.index);
      const isError = false; // You can add error state here

      return (
        <Circle
          key={point.index}
          cx={point.x}
          cy={point.y}
          r={nodeRadius}
          fill={isSelected ? Colors.accent : 'transparent'}
          stroke={isSelected ? Colors.accent : Colors.base}
          strokeWidth={2}
          opacity={isError ? 0.5 : 1}
        />
      );
    });
  };

  const renderLines = () => {
    if (currentPath.length < 2) return null;

    return currentPath.map((point, index) => {
      if (index === 0) return null;
      const previousPoint = currentPath[index - 1];

      return (
        <Line
          key={`line-${index}`}
          x1={previousPoint.x}
          y1={previousPoint.y}
          x2={point.x}
          y2={point.y}
          stroke={Colors.accent}
          strokeWidth={4}
          strokeLinecap="round"
        />
      );
    });
  };

  return (
    <GestureHandlerRootView style={{ width: size, height: size, alignSelf: 'center' }}>
      <PanGestureHandler
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleGestureEvent}
        minDist={10}
      >
        <View style={{ flex: 1 }}>
          <Svg width={size} height={size}>
            <G>
              {renderLines()}
              {renderGrid()}
            </G>
          </Svg>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default CustomPatternLock;
