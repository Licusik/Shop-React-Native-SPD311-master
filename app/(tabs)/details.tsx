import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Details() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Details screen</Text>
      <Link href="/components/ProductForm">Go to About screen</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
