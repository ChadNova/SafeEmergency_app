import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { clearAuthToken } from "../../constants/auth";

type SettingRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
};

const SettingRow = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
}: SettingRowProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={!onPress}
      className="mb-3 flex-row items-center rounded-2xl border border-[#c9ddcf] bg-[#f6fbf7] px-4 py-4"
    >
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#ddf2e6]">
        <Ionicons name={icon} size={20} color="#0e8f5e" />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold text-[#102318]">{title}</Text>
        <Text className="mt-1 text-xs text-[#507264]">{subtitle}</Text>
      </View>

      {rightElement ?? <Ionicons name="chevron-forward" size={19} color="#0e8f5e" />}
    </TouchableOpacity>
  );
};

const Settings = () => {
  const [emergencyAlerts, setEmergencyAlerts] = React.useState(true);
  const [voiceFeedback, setVoiceFeedback] = React.useState(true);

  const handleLogout = async () => {
    await clearAuthToken();
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#eef5ef]">
      <View className="absolute -left-8 top-12 h-28 w-28 rounded-full bg-[#d5eadc]" />
      <View className="absolute right-[-34] top-40 h-36 w-36 rounded-full bg-[#c6e2cf]" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-7 flex-row items-center justify-between">
          <View>
            <Text className="text-xs font-semibold uppercase tracking-[2px] text-[#3d6956]">
              SafeEmergency
            </Text>
            <Text className="mt-2 text-4xl font-black text-[#0f271a]">Settings</Text>
            <Text className="mt-1 text-sm text-[#4f7363]">
              Personalize your emergency experience
            </Text>
          </View>

          <Image
            source={require("../../assets/images/logo.png")}
            className="h-14 w-14"
            resizeMode="contain"
          />
        </View>

        <View className="mb-5 rounded-3xl border border-[#bfd8c7] bg-[#e3f2e8] p-4">
          <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-[#447261]">
            Account
          </Text>

          <View className="mt-3">
            <SettingRow
              icon="person-circle"
              title="Edit Profile"
              subtitle="Update your personal details"
              onPress={() => router.push("/edit-profile")}
            />
            <SettingRow
              icon="shield-checkmark"
              title="Privacy"
              subtitle="Review app permissions and data access"
            />
          </View>
        </View>

        <View className="mb-5 rounded-3xl border border-[#bfd8c7] bg-[#ffffff] p-4">
          <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-[#447261]">
            Preferences
          </Text>

          <View className="mt-3">
            <SettingRow
              icon="notifications"
              title="Emergency Alerts"
              subtitle="Receive urgent notifications and warnings"
              rightElement={
                <Switch
                  value={emergencyAlerts}
                  onValueChange={setEmergencyAlerts}
                  trackColor={{ false: "#d5ddd8", true: "#8ad3ad" }}
                  thumbColor={emergencyAlerts ? "#0f975f" : "#ffffff"}
                  ios_backgroundColor="#d5ddd8"
                />
              }
            />
            <SettingRow
              icon="volume-high"
              title="Voice Guidance"
              subtitle="Enable spoken instructions in emergencies"
              rightElement={
                <Switch
                  value={voiceFeedback}
                  onValueChange={setVoiceFeedback}
                  trackColor={{ false: "#d5ddd8", true: "#8ad3ad" }}
                  thumbColor={voiceFeedback ? "#0f975f" : "#ffffff"}
                  ios_backgroundColor="#d5ddd8"
                />
              }
            />
          </View>
        </View>

        <View className="mb-8 rounded-3xl border border-[#bfd8c7] bg-[#f3f8f4] p-4">
          <Text className="text-xs font-semibold uppercase tracking-[1.5px] text-[#447261]">
            Legal
          </Text>

          <View className="mt-3">
            <SettingRow
              icon="document-text"
              title="Terms and Conditions"
              subtitle="Read the latest user agreement"
            />
            <SettingRow
              icon="help-buoy"
              title="Help and Support"
              subtitle="Get assistance when you need it"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.9}
          className="self-center rounded-full border border-[#0f8f5b] bg-[#12a566] px-14 py-4"
        >
          <View className="flex-row items-center">
            <Ionicons name="log-out-outline" size={20} color="#ffffff" />
            <Text className="ml-2 text-lg font-bold tracking-wide text-white">
              Log Out
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
