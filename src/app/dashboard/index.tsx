import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Layout } from "@/constants/Layout";

export default function MainPage() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Main App</Text>
        <Text style={styles.subtitle}>Your professional app is ready for development</Text>
        
        <View style={styles.buttonContainer}>
          <Link href="/venues" asChild>
            <TouchableOpacity style={styles.featureButton}>
              <Text style={styles.featureButtonText}>Sports Venues</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    justifyContent: "center",
    alignItems: "center",
    padding: Layout.spacing.lg,
  },
  content: {
    alignItems: "center",
    maxWidth: 400,
  },
  title: {
    fontSize: Layout.fontSize.xxxl,
    fontWeight: Layout.fontWeight.bold,
    color: Colors.text.primary,
    textAlign: "center",
    marginBottom: Layout.spacing.md,
  },
  subtitle: {
    fontSize: Layout.fontSize.md,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Layout.spacing.xl,
  },
  buttonContainer: {
    width: "100%",
  },
  featureButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
    marginBottom: Layout.spacing.sm,
    ...Layout.shadow.md,
  },
  featureButtonText: {
    color: Colors.text.inverse,
    fontSize: Layout.fontSize.md,
    fontWeight: Layout.fontWeight.semibold,
    textAlign: "center",
  },
});
