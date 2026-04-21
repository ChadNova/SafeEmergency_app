import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../constants/api";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.error ?? "Login failed");
        return;
      }

      router.replace("/(tabs)/home");
    } catch (_error) {
      setErrorMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 30,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Replaces styles.logo */}
          <Text className="text-[60px] text-[#10B981] text-center">✳️</Text>

          {/* Replaces styles.header */}
          <Text className="text-2xl font-bold text-center mb-10 text-black">
            Login
          </Text>

          <View className="mb-5">
            <Text className="text-gray-700 font-medium">Email</Text>
            {/* Replaces styles.input */}
            <TextInput
              className="border-b border-[#CCC] py-2 mb-5 text-base"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
            />

            <Text className="text-gray-700 font-medium">Password</Text>
            <TextInput
              className="border-b border-[#CCC] py-2 mb-5 text-base"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="********"
            />
          </View>

          {errorMessage ? (
            <Text className="text-red-500 mb-4 text-center">
              {errorMessage}
            </Text>
          ) : null}

          {/* Sign Up Link */}
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text className="text-[#10B981] self-end mb-5 font-semibold">
              Don't have an Account? Sign Up
            </Text>
          </TouchableOpacity>

          {/* Replaces styles.button & styles.buttonText */}
          <TouchableOpacity
            className={`p-[18px] rounded-[30px] items-center shadow-md shadow-black/10 ${
              loading ? "bg-[#A7F3D0]" : "bg-[#10B981] active:opacity-80"
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white text-lg font-semibold">
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
