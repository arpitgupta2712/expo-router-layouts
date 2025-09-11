import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";

export default function HeroPage() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome</Text>
        
        <View style={styles.logoContainer}>
          <Image 
            source={require("../../../assets/logos/CG_Logo Neon.png")} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <Link href="/dashboard" asChild>
          <TouchableOpacity style={styles.getStartedButton}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B4D3E", // Dark green background
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    marginBottom: 60,
    marginTop: 80,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: 200,
    height: 200,
  },
  getStartedButton: {
    backgroundColor: "white",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedText: {
    color: "#1B4D3E",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
