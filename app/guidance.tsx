import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
    Pressable,
    ScrollView,
    Share,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { getGuidanceStepImage } from "../constants/guidanceImages";
import { protocolSteps, type ProtocolId } from "../constants/protocols";

const fallbackProtocol: ProtocolId = "unconscious";

const copy = {
  supportActiveTitle: "Emergency support is active",
  completedProtocolMessage:
    "The guided protocol has finished. Use the actions below if you still need help or want to start over.",
  call911: "Call 911",
  shareSos: "Share SOS",
  repeat: "Repeat",
  home: "Home",
};

type ActionCardProps = {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  onPress: () => void;
  isLoading?: boolean;
};

function ActionCard({
  title,
  icon,
  color,
  onPress,
  isLoading,
}: ActionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      className={`w-[48%] rounded-3xl px-4 py-5 ${color} active:opacity-90`}
    >
      <View className="min-h-[132px] justify-between">
        <Ionicons name={icon} size={28} color="#ffffff" />
        <View>
          {isLoading ? (
            <ActivityIndicator style={{ marginBottom: 12 }} color="#ffffff" />
          ) : null}
          <Text className="text-xl font-black text-white">{title}</Text>
        </View>
      </View>
    </Pressable>
  );
}

type GeoLocationLike = {
  getCurrentPosition: (
    success: (position: {
      coords: { latitude: number; longitude: number };
    }) => void,
    error: () => void,
    options: {
      enableHighAccuracy: boolean;
      timeout: number;
      maximumAge: number;
    },
  ) => void;
};

export default function GuidanceScreen() {
  const params = useLocalSearchParams<{
    protocol?: string;
    protocolId?: string;
    summary?: string;
  }>();
  const resolvedMode = useColorScheme() ?? "light";
  // Use either protocol or protocolId depending on how it was passed
  const rawProtocol = params.protocol || params.protocolId;
  const protocol = (rawProtocol as ProtocolId) || fallbackProtocol;
  const steps = protocolSteps[protocol] || protocolSteps[fallbackProtocol];
  const [stepIndex, setStepIndex] = React.useState(0);
  const [isFinished, setIsFinished] = React.useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = React.useState(false);

  const currentStep = steps[stepIndex];
  const currentStepImage = getGuidanceStepImage(protocol, stepIndex);

  const colors = {
    background: resolvedMode === "dark" ? "#020617" : "#e4e4e7",
    textPrimary: resolvedMode === "dark" ? "#f8fafc" : "#111827",
    textSecondary: resolvedMode === "dark" ? "#cbd5e1" : "#4b5563",
  };

  useFocusEffect(
    React.useCallback(() => {
      Speech.stop();

      if (!isFinished) {
        // Only speak the AI summary if it exists and we're starting step 1
        if (stepIndex === 0 && params.summary) {
          Speech.speak(params.summary, {
            rate: 0.95,
            pitch: 1,
            language: "en-US",
          });
        }

        Speech.speak(currentStep.title, {
          rate: 0.95,
          pitch: 1,
          language: "en-US",
        });
      }

      return () => {
        Speech.stop();
      };
    }, [currentStep.title, isFinished, params.summary, stepIndex]),
  );

  const handlePrevious = () => {
    setStepIndex((value) => Math.max(0, value - 1));
  };

  const handleRepeatStep = () => {
    Speech.stop();
    Speech.speak(currentStep.title, {
      rate: 0.95,
      pitch: 1,
      language: "en-US",
    });
  };

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((value) => value + 1);
      return;
    }

    setIsFinished(true);
  };

  const handleCall911 = React.useCallback(async () => {
    try {
      await Linking.openURL("tel:911");
    } catch {
      await Share.share({
        message: "Emergency services: 911",
      });
    }
  }, []);

  const getCurrentLocationLink = React.useCallback(async () => {
    const geolocation = (
      globalThis as {
        navigator?: { geolocation?: GeoLocationLike };
      }
    ).navigator?.geolocation;

    if (!geolocation?.getCurrentPosition) {
      return null;
    }

    return await new Promise<string | null>((resolve) => {
      geolocation.getCurrentPosition(
        (position) => {
          resolve(
            `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`,
          );
        },
        () => resolve(null),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 10000,
        },
      );
    });
  }, []);

  const handleShareLocation = React.useCallback(async () => {
    setIsFetchingLocation(true);

    try {
      const locationLink = await getCurrentLocationLink();
      const message = locationLink
        ? `SOS: I need emergency help. My current location: ${locationLink}`
        : "SOS: I need emergency help. Please call emergency services and share my location if possible.";

      await Share.share({ message });
    } finally {
      setIsFetchingLocation(false);
    }
  }, [getCurrentLocationLink]);

  const handleRepeat = React.useCallback(() => {
    Speech.stop();
    setStepIndex(0);
    setIsFinished(false);
  }, []);

  if (isFinished) {
    return (
      <SafeAreaView
        className="flex-1 px-6"
        style={{ backgroundColor: colors.background }}
      >
        <StatusBar style={resolvedMode === "dark" ? "light" : "dark"} />
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingVertical: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeIn.duration(800)}
            className="items-center"
          >
            <View className="mb-8 rounded-full bg-emerald-500/20 p-8">
              <Ionicons name="shield-checkmark" size={80} color="#10b981" />
            </View>
            <Text
              className="mb-4 text-center text-3xl font-black tracking-tighter"
              style={{ color: colors.textPrimary }}
            >
              {copy.supportActiveTitle}
            </Text>
            <Text
              className="mb-12 px-4 text-center text-lg leading-relaxed"
              style={{ color: colors.textSecondary }}
            >
              {copy.completedProtocolMessage}
            </Text>

            <View className="w-full space-y-4">
              <View className="mb-4 flex-row justify-between">
                <ActionCard
                  title={copy.call911}
                  icon="call"
                  color="bg-rose-600"
                  onPress={handleCall911}
                />
                <ActionCard
                  title={copy.shareSos}
                  icon="location"
                  color="bg-blue-600"
                  isLoading={isFetchingLocation}
                  onPress={handleShareLocation}
                />
              </View>

              <View className="flex-row justify-between">
                <ActionCard
                  title={copy.repeat}
                  icon="refresh"
                  color={
                    resolvedMode === "dark" ? "bg-slate-800" : "bg-slate-600"
                  }
                  onPress={handleRepeat}
                />
                <ActionCard
                  title={copy.home}
                  icon="home"
                  color={
                    resolvedMode === "dark" ? "bg-slate-800" : "bg-slate-600"
                  }
                  onPress={() => router.replace("/")}
                />
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-5 pt-4">
        <View className="mb-5 flex-row items-center justify-between px-1">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-black/5"
          >
            <Ionicons name="chevron-back" size={26} color="#111827" />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-black">Guidance</Text>

          <View className="h-11 w-11" />
        </View>

        <View className="mb-4 rounded-3xl bg-[#10AF6F]/10 px-4 py-3">
          <Text className="text-sm font-semibold uppercase tracking-wide text-[#0F766E]">
            Protocol
          </Text>
          <Text className="text-xl font-bold text-black capitalize">
            {protocol.replace("_", " ")}
          </Text>
        </View>

        <View className="mb-4 flex-row items-center gap-2">
          {steps.map((_, index) => (
            <View
              key={index}
              className={`h-2 flex-1 rounded-full ${
                index <= stepIndex ? "bg-[#10AF6F]" : "bg-zinc-200"
              }`}
            />
          ))}
        </View>

        <ScrollView className="flex-1" contentContainerClassName="pb-6">
          <View className="rounded-[28px] bg-zinc-100 px-5 py-6">
            {currentStepImage ? (
              <Image
                source={currentStepImage}
                className="mb-4 h-48 w-full rounded-2xl"
                resizeMode="cover"
              />
            ) : null}
            <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Step {stepIndex + 1} of {steps.length}
            </Text>
            <Text className="mb-4 text-3xl font-bold text-black">
              {currentStep.title}
            </Text>
            <Text className="text-[18px] leading-8 text-zinc-700">
              {currentStep.description}
            </Text>
          </View>
        </ScrollView>

        <View className="mb-4 flex-row gap-3">
          <TouchableOpacity
            onPress={handleRepeatStep}
            className="flex-1 items-center rounded-full border border-black px-4 py-4"
          >
            <Text className="text-lg font-bold text-black">Repeat Step</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePrevious}
            className="flex-1 items-center rounded-full bg-zinc-900 px-4 py-4"
          >
            <Text className="text-lg font-bold text-white">Previous Step</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleNext}
          className="mb-6 items-center rounded-full bg-[#10AF6F] px-4 py-5"
        >
          <Text className="text-xl font-bold text-white">
            {stepIndex < steps.length - 1 ? "Next Step" : "Finish"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
