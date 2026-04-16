import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProfile = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#e4e4e7]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8 flex-row items-center justify-between px-1">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-black/5"
          >
            <Ionicons name="chevron-back" size={26} color="#111827" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-black">Edit Profile</Text>

          <View className="h-11 w-11">
            <Image
              source={require("../assets/images/logo.png")}
              className="h-9 w-9"
              resizeMode="contain"
            />
          </View>
        </View>

        <View className="mt-10 gap-5">
          <View>
            <Text className="mb-2 text-base font-semibold text-black">
              Full Name
            </Text>
            <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="#6B7280"
              className="rounded-2xl bg-white px-4 py-4 text-[16px] text-black"
            />
          </View>

          <View>
            <Text className="mb-2 text-base font-semibold text-black">
              Phone Number
            </Text>
            <TextInput
              placeholder="Enter your phone number"
              placeholderTextColor="#6B7280"
              keyboardType="phone-pad"
              className="rounded-2xl bg-white px-4 py-4 text-[16px] text-black"
            />
          </View>

          <View>
            <Text className="mb-2 text-base font-semibold text-black">
              Email Address
            </Text>
            <TextInput
              placeholder="Enter your email address"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              className="rounded-2xl bg-white px-4 py-4 text-[16px] text-black"
            />
          </View>
        </View>

        <TouchableOpacity className="mt-10 rounded-full bg-[#10AF6F] py-4">
          <Text className="text-center text-xl font-bold text-white">Edit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
