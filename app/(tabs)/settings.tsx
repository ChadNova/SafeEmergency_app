import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  return (
    <SafeAreaView className="flex-1 bg-zinc-200 px-5 pt-10">
      <View className="flex-1">
        <View className="mb-20 flex-row items-center justify-between px-2">
          <Text className="text-4xl font-bold text-black">Setting</Text>
          <Image
            source={require("../../assets/images/logo.png")}
            className="h-12 w-12"
            resizeMode="contain"
          />
        </View>

        <View className="px-1">
          <TouchableOpacity
            onPress={() => router.push("/edit-profile")}
            className="mb-16 flex-row items-center justify-between border-b border-black pb-4"
          >
            <Text className="text-3xl font-medium text-black">
              Edit Profile
            </Text>
            <Ionicons name="arrow-forward" size={35} color="#10AF6F" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between border-b border-black pb-4">
            <Text className="text-3xl font-medium text-black">
              Term and conditions
            </Text>
            <Ionicons name="arrow-forward" size={35} color="#10AF6F" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity className="mb-8 self-center rounded-full bg-[#10AF6F] px-36 py-4">
        <Text className="text-3xl font-bold text-white">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Settings;
