import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#e4e4e7" }}
      edges={["top"]}
    >
      <View className="flex-1 px-8">
        <View className="mt-7 items-center">
          <Image
            source={require("../../assets/images/logo.png")}
            className="h-16 w-16"
          />
          <Text className="mt-1 text-2xl font-bold leading-[46px] text-black">
            SafeEmergency
          </Text>
        </View>

        <View className="mt-24 px-2">
          <Text className="text-center text-[22px] font-medium leading-[36px] text-black">
            press the button to describe the situation in a voice mode
          </Text>
        </View>

        <View className="mt-24 items-center">
          <View className="flex-row items-center gap-8">
            <View className="flex-row items-center gap-2">
              <View className="h-9 w-[6px] rounded-full bg-[#10AF6F]" />
              <View className="h-14 w-[6px] rounded-full bg-[#10AF6F]" />
              <View className="h-9 w-[6px] rounded-full bg-[#10AF6F]" />
            </View>

            <TouchableOpacity className="h-36 w-36 items-center justify-center rounded-[22px] border-[3px] border-emerald-950 bg-emerald-600">
              <View className="h-28 w-28 items-center justify-center rounded-[18px] border-[3px] border-emerald-700 bg-emerald-600">
                <View className="h-[70px] w-[70px] items-center justify-center rounded-[18px] border-[4px] border-emerald-600 bg-zinc-100">
                  <FontAwesome name="microphone" size={22} color="#B91C1C" />
                </View>
              </View>
            </TouchableOpacity>

            <View className="flex-row items-center gap-2">
              <View className="h-9 w-[6px] rounded-full bg-[#10AF6F]" />
              <View className="h-14 w-[6px] rounded-full bg-[#10AF6F]" />
              <View className="h-9 w-[6px] rounded-full bg-[#10AF6F]" />
            </View>
          </View>
        </View>

        <View className="mt-auto mb-6 items-end">
          <TouchableOpacity className="h-[60px] w-[60px] items-center justify-center rounded-full border-[2px] border-black bg-transparent">
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={36}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
