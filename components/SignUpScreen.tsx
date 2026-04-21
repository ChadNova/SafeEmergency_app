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

export default function SignUpScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMessage("Name, email, and password are required");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.error ?? "Registration failed");
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
          <View className="items-center">
            {/* Replaces styles.logo */}
            <Text className="text-[60px] text-[#10B981] mb-[10px]">✳️</Text>

            {/* Replaces styles.header */}
            <Text className="text-[28px] font-bold mb-10 text-black">
              Register
            </Text>
          </View>

          {/* Replaces styles.inputGroup */}
          <View className="w-full">
            <Text className="text-[14px] text-[#374151] mb-[5px]">Name</Text>
            <TextInput
              className="border-b border-[#D1D5DB] py-[10px] mb-[25px] text-[16px]"
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
            />

            <Text className="text-[14px] text-[#374151] mb-[5px]">Email</Text>
            <TextInput
              className="border-b border-[#D1D5DB] py-[10px] mb-[25px] text-[16px]"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
            />

            {/* Password Input */}
            <Text className="text-[14px] text-[#374151] mb-[5px]">
              Password
            </Text>
            <TextInput
              className="border-b border-[#D1D5DB] py-[10px] mb-[25px] text-[16px]"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />

            {/* Confirm Password Input */}
            <Text className="text-[14px] text-[#374151] mb-[5px]">
              Again Password
            </Text>
            <TextInput
              className="border-b border-[#D1D5DB] py-[10px] mb-[25px] text-[16px]"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {errorMessage ? (
            <Text className="text-red-500 mb-4 text-center">
              {errorMessage}
            </Text>
          ) : null}

          {/* Login Link - Replaces styles.linkText */}
          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="w-full"
          >
            <Text className="text-[#10B981] self-end mb-[30px] font-semibold">
              have an Account? Login
            </Text>
          </TouchableOpacity>

          {/* Sign Up Button - Replaces styles.button & styles.buttonText */}
          <TouchableOpacity
            className={`w-full p-[18px] rounded-[35px] items-center shadow-md shadow-black/10 ${
              loading ? "bg-[#A7F3D0]" : "bg-[#10B981] active:opacity-80"
            }`}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text className="text-white text-[18px] font-bold">
              {loading ? "Creating account..." : "Sign up"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
