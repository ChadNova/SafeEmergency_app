import React from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    // Replaces styles.container
    <SafeAreaView className="flex-1 bg-white">
      
      {/* Replaces styles.header */}
      <View className="items-center mt-5">
        <Text className="text-4xl">✳️</Text>
        <Text className="text-[14px] font-medium text-black">SafeEmergency</Text>
      </View>

      {/* Replaces styles.content */}
      <View className="flex-1 items-center justify-center px-10">
        
        {/* Replaces styles.instruction */}
        <Text className="text-xl text-center font-semibold mb-14 leading-7 text-black">
          press the button to describe the situation in a voice mode
        </Text>

        {/* Replaces styles.micContainer */}
        <View className="flex-row items-center gap-4">
          
          {/* Wave decorative elements (styles.wave) */}
          <View className="w-1 h-6 bg-[#A7F3D0] rounded-sm" />
          <View className="w-1 h-10 bg-[#A7F3D0] rounded-sm" />

          {/* Replaces styles.micButton */}
          <TouchableOpacity 
            className="bg-[#10B981] p-8 rounded-[25px] border-[3px] border-[#065F46] shadow-lg shadow-black/20"
            activeOpacity={0.7}
          >
            <FontAwesome name="microphone" size={45} color="#EF4444" />
          </TouchableOpacity>

          <View className="w-1 h-10 bg-[#A7F3D0] rounded-sm" />
          <View className="w-1 h-6 bg-[#A7F3D0] rounded-sm" />
        </View>

        {/* Replaces styles.chatButton */}
        <TouchableOpacity 
          className="absolute bottom-10 right-0 bg-white p-3 rounded-full shadow-md shadow-black/10"
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={30}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* Replaces styles.bottomNav */}
      <View className="flex-row justify-around py-4 border-t border-[#F3F4F6] bg-white">
        <TouchableOpacity className="items-center flex-1">
          <Ionicons name="home" size={28} color="#10B981" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center flex-1">
          <Ionicons name="settings-outline" size={28} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}