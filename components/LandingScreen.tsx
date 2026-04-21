import React from "react";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LandingScreen() {
  const router = useRouter();

  return (
    // Replaces styles.container
    <SafeAreaView className="flex-1 bg-white">
      
      {/* Replaces styles.content */}
      <View className="flex-1 items-center justify-center p-[30px]">
        
        {/* Replaces styles.logoIcon */}
        <Text className="text-[80px] mb-5 text-[#10B981]">✳️</Text>

        {/* Replaces styles.titleText */}
        <Text className="text-[32px] font-bold text-center text-black mb-5">
          Welcome to{"\n"}SafeEmergency
        </Text>

        {/* Replaces styles.subtitleText */}
        <Text className="text-base text-center text-[#6B7280] mb-[60px] leading-6">
          Emergency Help. Instantly. When Every{"\n"}Second Matters.
        </Text>

        {/* Replaces styles.button & styles.buttonText */}
        <TouchableOpacity
          className="bg-[#10B981] w-full p-[18px] rounded-[30px] items-center active:opacity-80"
          onPress={() => router.push("/signup")}
        >
          <Text className="text-white text-[18px] font-semibold">next →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}