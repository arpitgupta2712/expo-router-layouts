import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function DemoPage() {
  const demos = [
    { name: "Swipable Cards", path: "/demo/swipable-cards", description: "Card-based interface with swipe gestures" },
    { name: "Material Top Tabs", path: "/demo/material-top-tabs", description: "Material Design top tabs" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Navigation Demos</Text>
        <Text style={styles.subtitle}>Reference implementations for your main app:</Text>
        
        <View style={styles.demoList}>
          {demos.map((demo, index) => (
            <Link key={index} href={demo.path} asChild>
              <TouchableOpacity style={styles.demoCard}>
                <Text style={styles.demoName}>{demo.name}</Text>
                <Text style={styles.demoDescription}>{demo.description}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        <Link href="/main" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back to Main App</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 600,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  demoList: {
    gap: 15,
    marginBottom: 30,
  },
  demoCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  demoName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  demoDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
