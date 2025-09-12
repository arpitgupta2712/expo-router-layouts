import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
  Image 
} from "react-native";
import { Link } from "expo-router";
import { Layout } from "@/constants/Layout";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { useCitiesAndVenues } from "@/hooks";

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

// City card component for bento grid
const CityCard = ({ city, venueCount, borderColor, size = 'small' }) => {
  const getCardStyle = () => {
    switch (size) {
      case 'small':
        return {
          width: CARD_SIZE,
          height: CARD_SIZE,
          backgroundColor: Colors.base,
          borderColor: borderColor,
        };
      case 'rectangle':
        return {
          width: CARD_SIZE * 2 + CARD_GAP,
          height: CARD_SIZE,
          backgroundColor: Colors.base,
          borderColor: borderColor,
        };
      case 'big':
        return {
          width: CARD_SIZE * 2 + CARD_GAP,
          height: CARD_SIZE * 2 + CARD_GAP,
          backgroundColor: Colors.base,
          borderColor: borderColor,
        };
      default:
        return {
          width: CARD_SIZE,
          height: CARD_SIZE,
          backgroundColor: Colors.base,
          borderColor: borderColor,
        };
    }
  };

  const cardContent = (
    <View style={[styles.card, getCardStyle()]}>
      <View style={styles.cardContent}>
        <Text style={styles.cityName}>{city.name}</Text>
        <Text style={styles.venueCount}>{venueCount} venues</Text>
      </View>
    </View>
  );

  return (
    <Link href={`/venues?city=${city.id}`} asChild>
      <TouchableOpacity activeOpacity={0.8}>
        {cardContent}
      </TouchableOpacity>
    </Link>
  );
};

// Static card component for other features
const FeatureCard = ({ size, title, href = null }) => {
  const getCardStyle = () => {
    switch (size) {
      case 'small':
        return {
          width: CARD_SIZE,
          height: CARD_SIZE,
          backgroundColor: Colors.base,
          borderColor: Colors.primary,
        };
      case 'rectangle':
        return {
          width: CARD_SIZE * 2 + CARD_GAP,
          height: CARD_SIZE,
          backgroundColor: Colors.base,
          borderColor: Colors.primary,
        };
      case 'big':
        return {
          width: CARD_SIZE * 2 + CARD_GAP,
          height: CARD_SIZE * 2 + CARD_GAP,
          backgroundColor: Colors.base,
          borderColor: Colors.primary,
        };
      default:
        return {
          width: CARD_SIZE,
          height: CARD_SIZE,
          backgroundColor: Colors.base,
          borderColor: Colors.primary,
        };
    }
  };

  const cardContent = (
    <View style={[styles.card, getCardStyle()]}>
      <View style={styles.cardContent}>
        <Text style={styles.featureTitle}>{title}</Text>
      </View>
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
  const { cities, getVenuesByCity, loading, error } = useCitiesAndVenues();

  // Border color palette for city cards [[memory:8782456]]
  const cityBorderColors = [
    Colors.primary,        // Forest Green
    Colors.accent,         // Chartreuse
    Colors.primaryLight,   // Ocean Green
    Colors.info,           // Illuminating Emerald
    Colors.warning,        // Royal Orange
    Colors.error,          // Safety Orange
    Colors.accentLight,    // Key Lime
    Colors.primaryDark,    // Dark Green
  ];

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading cities...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.title}>Dashboard</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load cities</Text>
          <Text style={styles.errorSubtext}>{error}</Text>
        </View>
      </View>
    );
  }

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
        {/* Hero Feature Card */}
        <View style={styles.row}>
          <FeatureCard 
            size="rectangle" 
            title="Sports Hero" 
            href="/hero"
          />
        </View>

        {/* Dynamic City Cards */}
        {cities.map((city, index) => {
          const venueCount = getVenuesByCity(city.id).length;
          const borderColor = cityBorderColors[index % cityBorderColors.length];
          
          // Render cities in pairs
          if (index % 2 === 0) {
            const nextCity = cities[index + 1];
            const nextVenueCount = nextCity ? getVenuesByCity(nextCity.id).length : 0;
            const nextBorderColor = nextCity ? cityBorderColors[(index + 1) % cityBorderColors.length] : null;
            
            return (
              <View key={`row-${index}`} style={styles.row}>
                <CityCard 
                  city={city}
                  venueCount={venueCount}
                  borderColor={borderColor}
                  size="small"
                />
                {nextCity && (
                  <CityCard 
                    city={nextCity}
                    venueCount={nextVenueCount}
                    borderColor={nextBorderColor}
                    size="small"
                  />
                )}
              </View>
            );
          }
          return null;
        })}

        {/* Additional Feature Cards */}
        <View style={styles.row}>
          <FeatureCard size="small" title="Bookings" />
          <FeatureCard size="small" title="Favorites" />
        </View>

        <View style={styles.row}>
          <FeatureCard size="big" title="Analytics" />
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
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cityName: {
    ...Typography.styles.dashboardCardTitle,
    color: Colors.text.primary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Layout.spacing.xs,
  },
  venueCount: {
    ...Typography.styles.dashboardCardSize,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  featureTitle: {
    ...Typography.styles.dashboardCardTitle,
    color: Colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  loadingText: {
    ...Typography.styles.dashboardCardTitle,
    color: Colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  errorText: {
    ...Typography.styles.dashboardCardTitle,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Layout.spacing.sm,
  },
  errorSubtext: {
    ...Typography.styles.dashboardCardSize,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});