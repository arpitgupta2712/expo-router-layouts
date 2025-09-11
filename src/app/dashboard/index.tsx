import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity 
} from "react-native";
import { Link } from "expo-router";
import { Layout } from "@/constants/Layout";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";

const { width } = Dimensions.get("window");
const CARD_GAP = 12;
const CONTAINER_PADDING = 20;

// Responsive card sizing for web vs mobile
const getCardSize = () => {
  if (Platform.OS === 'web') {
    // For web, use a fixed max width and center the grid
    const maxWidth = Math.min(width, 800); // Max 800px width
    return (maxWidth - CONTAINER_PADDING * 2 - CARD_GAP) / 2;
  }
  // For mobile, use full width
  return (width - CONTAINER_PADDING * 2 - CARD_GAP) / 2;
};

const CARD_SIZE = getCardSize();

// Simple card component with 3 sizes
const GridCard = ({ size, title, color, href = null }) => {
  const getCardStyle = () => {
    switch (size) {
      case 'small':
        return {
          width: CARD_SIZE,
          height: CARD_SIZE,
          backgroundColor: color,
        };
      case 'rectangle':
        return {
          width: CARD_SIZE * 2 + CARD_GAP,
          height: CARD_SIZE,
          backgroundColor: color,
        };
      case 'big':
        return {
          width: CARD_SIZE * 2 + CARD_GAP,
          height: CARD_SIZE * 2 + CARD_GAP,
          backgroundColor: color,
        };
      default:
        return {
          width: CARD_SIZE,
          height: CARD_SIZE,
          backgroundColor: color,
        };
    }
  };

  const cardContent = (
    <View style={[styles.card, getCardStyle()]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSize}>{size}</Text>
    </View>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        <TouchableOpacity activeOpacity={0.8}>
          {cardContent}
        </TouchableOpacity>
      </Link>
    );
  }

  return cardContent;
};

export default function DashboardPage() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning</Text>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        })}</Text>
      </View>

      <View style={styles.grid}>
        {/* Row 1: Two small cards */}
        <View style={styles.row}>
          <GridCard size="small" title="Card 1" color={Colors.primary} />
          <GridCard size="small" title="Card 2" color={Colors.primaryLight} />
        </View>

        {/* Row 2: One rectangle card */}
        <View style={styles.row}>
          <GridCard size="rectangle" title="Sports Venues" color={Colors.accent} href="/venues" />
        </View>

        {/* Row 3: Two small cards */}
        <View style={styles.row}>
          <GridCard size="small" title="Card 4" color={Colors.warning} />
          <GridCard size="small" title="Card 5" color={Colors.accentLight} />
        </View>

        {/* Row 4: One big card */}
        <View style={styles.row}>
          <GridCard size="big" title="Card 6" color={Colors.success} />
        </View>

        {/* Row 5: Two small cards */}
        <View style={styles.row}>
          <GridCard size="small" title="Card 7" color={Colors.info} />
          <GridCard size="small" title="Card 8" color={Colors.primaryDark} />
        </View>

        {/* Row 6: One rectangle card */}
        <View style={styles.row}>
          <GridCard size="rectangle" title="Card 9" color={Colors.error} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: CONTAINER_PADDING,
    paddingTop: 60,
    paddingBottom: Layout.spacing.lg,
    backgroundColor: Colors.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[300],
    ...(Platform.OS === 'web' && {
      maxWidth: 800,
      alignSelf: 'center',
      width: '100%',
    }),
  },
  greeting: {
    ...Typography.styles.dashboardGreeting,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  title: {
    ...Typography.styles.dashboardTitle,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  date: {
    ...Typography.styles.dashboardDate,
    color: Colors.text.tertiary,
  },
  grid: {
    padding: CONTAINER_PADDING,
    paddingTop: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
    ...(Platform.OS === 'web' && {
      maxWidth: 800,
      alignSelf: 'center',
      width: '100%',
    }),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: CARD_GAP,
    flexWrap: "wrap",
  },
  card: {
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    ...Typography.styles.dashboardCardTitle,
    color: Colors.base,
    marginBottom: Layout.spacing.xs,
  },
  cardSize: {
    ...Typography.styles.dashboardCardSize,
    color: Colors.base,
    opacity: 0.8,
  },
});