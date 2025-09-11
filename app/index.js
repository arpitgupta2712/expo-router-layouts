import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function Page() {
  const sections = [
    { name: "Main App", path: "/main", description: "Your main application content", primary: true },
    { name: "Navigation Demos", path: "/demo", description: "Reference implementations and examples", primary: false },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>App Navigation</Text>
        <Text style={styles.subtitle}>Choose where to go:</Text>
        
        <View style={styles.sectionList}>
          {sections.map((section, index) => (
            <Link key={index} href={section.path} asChild>
              <TouchableOpacity style={[
                styles.sectionCard,
                section.primary && styles.primaryCard
              ]}>
                <Text style={[
                  styles.sectionName,
                  section.primary && styles.primaryText
                ]}>
                  {section.name}
                </Text>
                <Text style={[
                  styles.sectionDescription,
                  section.primary && styles.primaryDescription
                ]}>
                  {section.description}
                </Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
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
  sectionList: {
    gap: 20,
  },
  sectionCard: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryCard: {
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOpacity: 0.3,
  },
  sectionName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  primaryText: {
    color: "white",
  },
  sectionDescription: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  primaryDescription: {
    color: "rgba(255, 255, 255, 0.9)",
  },
});
