import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_STORAGE_KEY = "safeemergency_user_profile";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (data) {
          const profile = JSON.parse(data);
          setName(profile.name || "");
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Required Field", "Please enter your full name.");
      return;
    }
    
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match.");
        return;
      }
    }

    setIsSaving(true);
    try {
      // In a real app, you would dispatch a backend request here to update the user's password
      const profileData = { name };
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
      
      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Failed to save profile", error);
      Alert.alert("Error", "Failed to save profile updates. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#e4e4e7]">
        <ActivityIndicator size="large" color="#10AF6F" />
      </SafeAreaView>
    );
  }

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
            disabled={isSaving}
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
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#6B7280"
              className="rounded-2xl bg-white px-4 py-4 text-[16px] text-black border border-zinc-200"
              editable={!isSaving}
            />
          </View>

          <View>
            <Text className="mb-2 text-base font-semibold text-black">
              New Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter new password"
              placeholderTextColor="#6B7280"
              secureTextEntry
              className="rounded-2xl bg-white px-4 py-4 text-[16px] text-black border border-zinc-200"
              editable={!isSaving}
            />
          </View>

          <View>
            <Text className="mb-2 text-base font-semibold text-black">
              Confirm Password
            </Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor="#6B7280"
              secureTextEntry
              className="rounded-2xl bg-white px-4 py-4 text-[16px] text-black border border-zinc-200"
              editable={!isSaving}
            />
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleSave}
          disabled={isSaving}
          className={`mt-10 rounded-full py-4 flex-row items-center justify-center space-x-2 ${isSaving ? 'bg-[#10AF6F]/50' : 'bg-[#10AF6F]'}`}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-xl font-bold text-white">Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
