import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { storage } from "../../services/storage";

export default function Storage() {
  const [email, setEmail] = useState<string>();

  useEffect(() => {
    loadEmail();
  }, []);

  const loadEmail = async () => {
    setEmail((await storage.load<string>("email")) ?? "");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Async Storage Example</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email:"
        value={email}
        onChangeText={setEmail}
      />

      <Button
        title="Save"
        onPress={() => {
          storage.save("email", email);
        }}
      />
      <Text>Hello dear, {email || "anonymous"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 6,
    margin: 6,
    borderRadius: 5,
  },
});
