import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Typography } from '@/constants/Typography';
import { getCardSize, getCardStyle, DASHBOARD_CONFIG } from '@/utils';

const CARD_GAP = DASHBOARD_CONFIG.CARD_GAP;
const CARD_SIZE = getCardSize(CARD_GAP, DASHBOARD_CONFIG.CONTAINER_PADDING);

interface FeaturedCardProps {
  title: string;
  badgeValue?: number | string;
  children?: React.ReactNode;
  loading?: boolean;
  size?: 'small' | 'medium' | 'big' | 'rectangle';
  borderColor?: string;
  onPress?: () => void;
  badgeColor?: string;
  badgeTextColor?: string;
  contentMode?: 'aboveFooter' | 'fillContainer'; // New prop to control content positioning
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({
  title,
  badgeValue,
  children,
  loading = false,
  size = 'rectangle',
  borderColor = Colors.primary,
  onPress,
  badgeColor = Colors.primary,
  badgeTextColor = Colors.base,
  contentMode = 'aboveFooter',
}) => {
  const cardStyle = getCardStyle(size, CARD_SIZE, CARD_GAP);

  const cardContent = (
    <View style={[styles.card, cardStyle, { borderColor }]}>
      {/* Badge */}
      {badgeValue !== undefined && (
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={[styles.badgeText, { color: badgeTextColor }]}>
            {badgeValue}
          </Text>
        </View>
      )}
      
      {/* Content Area - positioned based on contentMode */}
      <View style={contentMode === 'fillContainer' ? styles.contentAreaFill : styles.contentAreaAbove}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.accent} />
          </View>
        ) : (
          children
        )}
      </View>
      
      {/* Footer with title */}
      <View style={styles.cardFooter}>
        <Text style={styles.footerTitle}>{title}</Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Layout.borderRadius.xl,
    borderWidth: 2,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: "hidden",
    position: 'relative',
    backgroundColor: Colors.base,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    paddingTop: Layout.spacing.sm,
    paddingBottom: Layout.spacing.xs,
    paddingRight: Layout.spacing.sm,
    paddingLeft: Layout.spacing.xs,
    minWidth: 36,
    minHeight: 24,
    borderRadius: Layout.borderRadius.md,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeText: {
    ...Typography.styles.captionBold,
    textAlign: 'center',
  },
  contentAreaAbove: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 40, // Reserve space for footer
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.sm,
    backgroundColor: Colors.primary,
  },
  contentAreaFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, // Fill entire container
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFooter: {
    position: 'absolute',
    bottom: -1,
    left: -1,
    right: -1,
    backgroundColor: Colors.accent,
    paddingLeft: Layout.spacing.md,
    paddingRight: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
    paddingTop: Layout.spacing.sm,
    borderTopWidth: 3,
    borderTopColor: Colors.safetyOrange,
    borderBottomLeftRadius: Layout.borderRadius.xl,
    borderBottomRightRadius: Layout.borderRadius.xl,
  },
  footerTitle: {
    ...Typography.styles.dashboardCardTitle,
    color: Colors.primary,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
});

export default FeaturedCard;
