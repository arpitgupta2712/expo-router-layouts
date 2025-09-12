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
import { useCityService } from "@/hooks/useCityService";
import { 
  getCityImage, 
  getFeatureImage, 
  getCardSize, 
  getCardStyle,
  getCityCardLayout,
  DASHBOARD_CONFIG,
  filterCitiesWithVenues
} from "@/utils";

const { width } = Dimensions.get("window");
const CARD_GAP = DASHBOARD_CONFIG.CARD_GAP;
const CONTAINER_PADDING = DASHBOARD_CONFIG.CONTAINER_PADDING;

// Get card size using extracted utility
const CARD_SIZE = getCardSize(CARD_GAP, CONTAINER_PADDING);

// City card component for bento grid
const CityCard = ({ city, venueCount, borderColor, size = 'small' }) => {
  const cardStyle = getCardStyle(size, CARD_SIZE, CARD_GAP);

  const cardContent = (
    <View style={[styles.card, cardStyle, { borderColor }]}>
      {/* City Image Background */}
      <Image 
        source={getCityImage(city.name)} 
        style={styles.cityImage}
        resizeMode="cover"
      />
      
      {/* Footer with title and venue count */}
      <View style={styles.cardFooter}>
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
  const cardStyle = getCardStyle(size, CARD_SIZE, CARD_GAP);

  const cardContent = (
    <View style={[styles.card, cardStyle, { borderColor: Colors.primary }]}>
      {/* Feature Image Background */}
      <Image 
        source={getFeatureImage(title)} 
        style={styles.featureImage}
        resizeMode="cover"
      />
      
      {/* Footer with title */}
      <View style={styles.cardFooter}>
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
  const { venues, getVenuesByCity, loading: venuesLoading, error: venuesError } = useCitiesAndVenues();
  const { cities: allCities, loading: citiesLoading, error: citiesError } = useCityService();
  
  const loading = venuesLoading || citiesLoading;
  const error = venuesError || citiesError;
  
  // Filter cities to only show those that have venues
  const cities = filterCitiesWithVenues(allCities, getVenuesByCity);
  
  // Debug logging
  if (allCities.length > 0) {
    console.log(`🏙️ Dashboard: Showing ${cities.length} cities with venues out of ${allCities.length} total cities`);
  }

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
            title="ClayGrounds" 
            href="/hero"
          />
        </View>

        {/* Dynamic City Cards */}
        {cities.map((city, index) => {
          const venueCount = getVenuesByCity(city.id).length;
          const borderColor = Colors.primary;
          const layout = getCityCardLayout(cities.length, index);
          
          // Only render if the utility says we should
          if (!layout.shouldRender) {
            return null;
          }
          
          // If it's a solo rectangle (last city in odd list)
          if (layout.isSolo) {
            return (
              <View key={`row-${index}`} style={styles.row}>
                <CityCard 
                  city={city}
                  venueCount={venueCount}
                  borderColor={borderColor}
                  size={layout.size}
                />
              </View>
            );
          }
          
          // Regular pair rendering
          const nextCity = cities[index + 1];
          const nextVenueCount = nextCity ? getVenuesByCity(nextCity.id).length : 0;
          const nextBorderColor = Colors.primary;
          
          return (
            <View key={`row-${index}`} style={styles.row}>
              <CityCard 
                city={city}
                venueCount={venueCount}
                borderColor={borderColor}
                size={layout.size}
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
    backgroundColor: Colors.gray[100],
  },
  header: {
    paddingHorizontal: CONTAINER_PADDING,
    paddingTop: 60,
    paddingBottom: Layout.spacing.lg,
    backgroundColor: Colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    ...(Platform.OS === 'web' && {
      maxWidth: 800,
      alignSelf: 'center',
      width: '100%',
    }),
  },
  greeting: {
    ...Typography.styles.dashboardGreeting,
    color: Colors.text.inverse,
    marginBottom: Layout.spacing.xs,
  },
  title: {
    ...Typography.styles.dashboardTitle,
    color: Colors.text.inverse,
    marginBottom: Layout.spacing.sm,
  },
  date: {
    ...Typography.styles.dashboardDate,
    color: Colors.text.inverse,
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
  cityImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  featureImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cardFooter: {
    position: 'absolute',
    bottom: -1,
    left: -1,
    right: -1,
    backgroundColor: Colors.primary,
    paddingLeft: Layout.spacing.md,
    paddingRight: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
    paddingTop: Layout.spacing.sm,
    borderTopWidth: 2,
    borderTopColor: Colors.accent,
    borderBottomLeftRadius: Layout.borderRadius.xl,
    borderBottomRightRadius: Layout.borderRadius.xl,
  },
  cityName: {
    ...Typography.styles.dashboardCardTitle,
    color: Colors.base,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  venueCount: {
    ...Typography.styles.dashboardCardSize,
    color: Colors.base,
    opacity: 0.9,
    textAlign: 'left',
    textTransform: 'uppercase',
  },
  featureTitle: {
    ...Typography.styles.dashboardCardTitle,
    color: Colors.base,
    textAlign: 'left',
    textTransform: 'uppercase',
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