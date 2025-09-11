import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  return (
    <View style={styles.container}>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
