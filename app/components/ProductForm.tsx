import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Button, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { Product } from "../models/Product";

type Props = {
  onCreate: (product: Product) => void;
};

const ProductForm: React.FC<Props> = ({ onCreate }) => {
  const { control, handleSubmit } = useForm<Product>();

  const onSubmit: SubmitHandler<Product> = (data) => {
    console.log(data);
    onCreate(data);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create New Product</Text>

      <Text style={styles.label}>Title</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            onChangeText={onChange}
            value={value}
          />
        )}
        name="title"
      />

      <Text style={styles.label}>Price</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter price"
            onChangeText={onChange}
            value={value?.toString() ?? ""}
          />
        )}
        name="price"
      />

      <Text style={styles.label}>Description</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter description"
            multiline
            onChangeText={onChange}
            value={value}
          />
        )}
        name="description"
      />

      <Text style={styles.label}>Category</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter category"
            onChangeText={onChange}
            value={value}
          />
        )}
        name="category"
      />

      <Text style={styles.label}>Image URL</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Enter image URL"
            onChangeText={onChange}
            value={value}
          />
        )}
        name="image"
      />

      <Button title="Create Product" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
};

export default ProductForm;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    marginTop: 10,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
});
