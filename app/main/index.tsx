import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MainApp() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Main App</Text>
        <Text style={styles.subtitle}>
          This is where your main app content will go.
        </Text>
        <Text style={styles.description}>
          You can build your custom features here, using the navigation patterns
          from the demo section as reference.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    maxWidth: 400,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#888",
    lineHeight: 24,
    textAlign: "center",
  },
});
