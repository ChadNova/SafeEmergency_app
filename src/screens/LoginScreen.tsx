import React from "react";
import { useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  return (
    // Replaces styles.container
    <View className="flex-1 bg-white p-[30px] justify-center">
      
      {/* Replaces styles.logo */}
      <Text className="text-[60px] text-[#10B981] text-center">✳️</Text>
      
      {/* Replaces styles.header */}
      <Text className="text-2xl font-bold text-center mb-10 text-black">Login</Text>

      <View className="mb-5">
        <Text className="text-gray-700 font-medium">Phone number</Text>
        {/* Replaces styles.input */}
        <TextInput 
          className="border-b border-[#CCC] py-2 mb-5 text-base" 
          keyboardType="phone-pad" 
          placeholder="078..."
        />

        <Text className="text-gray-700 font-medium">Password</Text>
        <TextInput 
          className="border-b border-[#CCC] py-2 mb-5 text-base" 
          secureTextEntry 
          placeholder="********"
        />
      </View>

      {/* Sign Up Link */}
      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text className="text-[#10B981] self-end mb-5 font-semibold">
          Don't have an Account? Sign Up
        </Text>
      </TouchableOpacity>

      {/* Replaces styles.button & styles.buttonText */}
      <TouchableOpacity 
        className="bg-[#10B981] p-[18px] rounded-[30px] items-center active:opacity-80 shadow-md shadow-black/10"
        onPress={() => router.push("/(tabs)/home")}
      >
        <Text className="text-white text-lg font-semibold">Login</Text>
      </TouchableOpacity>
    </View>
  );
}