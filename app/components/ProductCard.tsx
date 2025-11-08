import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Product } from "../models/Product";

type Props = {
  item: Product;
};

const ProductCard = ({ item }: Props) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.title}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 16,
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    color: "#888",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
