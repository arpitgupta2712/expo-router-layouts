import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, StatusBar } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "@/constants/Typography";

const { width, height } = Dimensions.get("window");

export default function HeroPage() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={["#0A1F1B", "#1B4D3E", "#2A6F57"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative circles for visual interest */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        
        <View style={styles.content}>
          {/* Brand section */}
          <View style={styles.brandSection}>
            <Text style={styles.brandName}>CLAYGROUNDS</Text>
            <View style={styles.divider} />
            <Text style={styles.tagline}>Premium Football Facilities</Text>
          </View>
          
          {/* Logo section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoGlow}>
              <Image 
                source={require("../../../assets/logos/CG_Logo Neon.png")} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>
          
          {/* CTA section */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaText}>
              Book your perfect pitch today
            </Text>
            
            <Link href="/dashboard" asChild>
              <TouchableOpacity 
                style={styles.getStartedButton}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#4ADE80", "#22C55E"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.getStartedText}>Get Started</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Link>
            
            <Text style={styles.subText}>
              Experience the difference
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1F1B",
  },
  gradient: {
    flex: 1,
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
    color: "white",
    marginBottom: 12,
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: "#4ADE80",
    marginBottom: 12,
  },
  tagline: {
    ...Typography.styles.heroTagline,
    color: "rgba(255, 255, 255, 0.7)",
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
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 24,
  },
  getStartedButton: {
    width: "100%",
    maxWidth: 280,
    marginBottom: 20,
  },
  buttonGradient: {
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  getStartedText: {
    ...Typography.styles.heroButtonText,
    color: "white",
  },
  subText: {
    ...Typography.styles.caption,
    color: "rgba(255, 255, 255, 0.5)",
    fontStyle: "italic",
  },
});