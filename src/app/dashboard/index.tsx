import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Dimensions 
} from "react-native";
import { Layout } from "@/constants/Layout";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");
const CARD_GAP = 12;
const CONTAINER_PADDING = 20;
const CARD_SIZE = (width - CONTAINER_PADDING * 2 - CARD_GAP) / 2;

// Simple card component with 3 sizes
const GridCard = ({ size, title, color }) => {
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

  return (
    <View style={[styles.card, getCardStyle()]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSize}>{size}</Text>
    </View>
  );
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
          <GridCard size="small" title="Card 1" color="#FF6B6B" />
          <GridCard size="small" title="Card 2" color="#4ECDC4" />
        </View>

        {/* Row 2: One rectangle card */}
        <View style={styles.row}>
          <GridCard size="rectangle" title="Card 3" color="#45B7D1" />
        </View>

        {/* Row 3: Two small cards */}
        <View style={styles.row}>
          <GridCard size="small" title="Card 4" color="#96CEB4" />
          <GridCard size="small" title="Card 5" color="#FFEAA7" />
        </View>

        {/* Row 4: One big card */}
        <View style={styles.row}>
          <GridCard size="big" title="Card 6" color="#DDA0DD" />
        </View>

        {/* Row 5: Two small cards */}
        <View style={styles.row}>
          <GridCard size="small" title="Card 7" color="#98D8C8" />
          <GridCard size="small" title="Card 8" color="#F7DC6F" />
        </View>

        {/* Row 6: One rectangle card */}
        <View style={styles.row}>
          <GridCard size="rectangle" title="Card 9" color="#BB8FCE" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    paddingHorizontal: CONTAINER_PADDING,
    paddingTop: 60,
    paddingBottom: Layout.spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  greeting: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  title: {
    fontSize: Layout.fontSize.xxxl,
    fontWeight: Layout.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  date: {
    fontSize: Layout.fontSize.sm,
    color: Colors.text.tertiary,
  },
  grid: {
    padding: CONTAINER_PADDING,
    paddingTop: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xxl,
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
    ...Layout.shadow.md,
  },
  cardTitle: {
    fontSize: Layout.fontSize.lg,
    fontWeight: Layout.fontWeight.bold,
    color: Colors.white,
    marginBottom: Layout.spacing.xs,
  },
  cardSize: {
    fontSize: Layout.fontSize.sm,
    color: Colors.white,
    opacity: 0.8,
  },
});