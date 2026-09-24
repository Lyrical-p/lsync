import { Platform } from "react-native";

const DEFAULT_HOST = Platform.select({
  android: "10.0.2.2",
  ios: "localhost",
  default: "localhost",
});

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? `http://${DEFAULT_HOST}:3001/api`;
