import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Layout } from "@/constants/Layout";

export default function HomePage() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Your professional app is ready</Text>
        
        <Link href="/dashboard" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Layout.spacing.lg,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 600,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 36,
    fontWeight: Layout.fontWeight.bold,
    textAlign: "center",
    marginBottom: Layout.spacing.md,
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: Layout.fontSize.lg,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    ...Layout.shadow.lg,
  },
  primaryButtonText: {
    color: Colors.text.inverse,
    fontSize: Layout.fontSize.lg,
    fontWeight: Layout.fontWeight.semibold,
    textAlign: "center",
  },
});
