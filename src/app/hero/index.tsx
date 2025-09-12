import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";
import { Typography } from "@/constants/Typography";
import { Colors } from "@/constants/Colors";
import { useAdminData } from "@/hooks";
import { useState } from "react";

const { width, height } = Dimensions.get("window");

export default function HeroPage() {
  const router = useRouter();
  const { refetch, loading } = useAdminData();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Preloading admin data from Hero section...');
      await refetch();
      console.log('✅ Admin data preloaded successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('❌ Failed to preload admin data:', error);
      // Still navigate to dashboard even if preload fails
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.background}>
        {/* Decorative circles for visual interest */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        
        <View style={styles.content}>
          {/* Brand section */}
          <View style={styles.brandSection}>
            <Text style={styles.brandName}>CLAYGROUNDS</Text>
            <View style={styles.divider} />
            <Text style={styles.tagline}>Your Game, Your Way</Text>
          </View>
          
          {/* Logo section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoGlow}>
              <Image 
                source={require("../../../assets/logos/logomark/CLAYGROUNDS_Logomark_Neon.png")} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>
          
          {/* CTA section */}
          <View style={styles.ctaSection}>
            
            <TouchableOpacity 
              style={[styles.getStartedButton, isLoading && styles.getStartedButtonLoading]}
              activeOpacity={0.9}
              onPress={handleGetStarted}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={Colors.black} />
                  <Text style={[styles.getStartedText, styles.loadingText]}>Loading...</Text>
                </View>
              ) : (
                <Text style={styles.getStartedText}>Get Started</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },
  background: {
    flex: 1,
    backgroundColor: Colors.primary,
    position: "relative",
  },
  decorativeCircle1: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    top: -width * 0.3,
    left: -width * 0.2,
  },
  decorativeCircle2: {
    position: "absolute",
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    bottom: -width * 0.2,
    right: -width * 0.3,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: height * 0.12,
    paddingBottom: height * 0.08,
  },
  brandSection: {
    alignItems: "center",
  },
  brandName: {
    ...Typography.styles.heroBrandName,
    color: Colors.chartreuse,
    marginBottom: 12,
  },
  divider: {
    width: 180,
    height: 2,
    backgroundColor: Colors.chartreuse,
    marginBottom: 12,
  },
  tagline: {
    ...Typography.styles.heroTagline,
    color: Colors.base,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  logoGlow: {
    padding: 20,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    maxWidth: 220,
    maxHeight: 220,
  },
  ctaSection: {
    alignItems: "center",
    width: "100%",
  },
  ctaText: {
    ...Typography.styles.heroCtaText,
    color: Colors.base,
    marginBottom: 24,
  },
  getStartedButton: {
    width: "100%",
    maxWidth: 280,
    marginBottom: 20,
    backgroundColor: Colors.accent,
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  getStartedText: {
    ...Typography.styles.heroButtonText,
    color: Colors.primary,
  },
  getStartedButtonLoading: {
    opacity: 0.8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    marginLeft: 0,
  },
  subText: {
    ...Typography.styles.caption,
    color: Colors.base,
    fontStyle: "italic",
  },
});