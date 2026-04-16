import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text className="text-2xl text-blue-500">Settings</Text>
    </SafeAreaView>
  );
};

export default Settings;
