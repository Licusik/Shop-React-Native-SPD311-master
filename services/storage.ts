import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  async save<T>(key: string, value: T): Promise<void> {
    const jsonData = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonData);
  },
  async load<T>(key: string): Promise<T | null> {
    const jsonData = await AsyncStorage.getItem(key);
    if (jsonData === null) return null;

    return JSON.parse(jsonData) as T;
  },
};
