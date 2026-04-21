import React from "react";
import { useRouter } from "expo-router";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const router = useRouter();

  return (
    // Replaces styles.container
    <SafeAreaView className="flex-1 bg-white">
      
      {/* Replaces styles.content */}
      <View className="flex-1 p-[30px] justify-center items-center">
        
        {/* Replaces styles.logo */}
        <Text className="text-[60px] text-[#10B981] mb-[10px]">✳️</Text>
        
        {/* Replaces styles.header */}
        <Text className="text-[28px] font-bold mb-10 text-black">Register</Text>

        {/* Replaces styles.inputGroup */}
        <View className="w-full">
          
          {/* Phone Number Input */}
          <Text className="text-[14px] text-[#374151] mb-[5px]">Phone number</Text>
          <TextInput 
            className="border-b border-[#D1D5DB] py-[10px] mb-[25px] text-[16px]" 
            keyboardType="phone-pad" 
          />

          {/* Password Input */}
          <Text className="text-[14px] text-[#374151] mb-[5px]">Password</Text>
          <TextInput 
            className="border-b border-[#D1D5DB] py-[10px] mb-[25px] text-[16px]" 
            secureTextEntry={true} 
          />

          {/* Confirm Password Input */}
          <Text className="text-[14px] text-[#374151] mb-[5px]">Again Password</Text>
          <TextInput 
            className="border-b border-[#D1D5DB] py-[10px] mb-[25px] text-[16px]" 
            secureTextEntry={true} 
          />
        </View>

        {/* Login Link - Replaces styles.linkText */}
        <TouchableOpacity onPress={() => router.push("/login")} className="w-full">
          <Text className="text-[#10B981] self-end mb-[30px] font-semibold">
            have an Account? Login
          </Text>
        </TouchableOpacity>

        {/* Sign Up Button - Replaces styles.button & styles.buttonText */}
        <TouchableOpacity
          className="bg-[#10B981] w-full p-[18px] rounded-[35px] items-center active:opacity-80 shadow-md shadow-black/10"
          onPress={() => router.push("/(tabs)/home")}
        >
          <Text className="text-white text-[18px] font-bold">Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}