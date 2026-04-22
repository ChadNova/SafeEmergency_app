import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as Speech from "expo-speech";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { protocolSteps, type ProtocolId } from "../constants/protocols";

const fallbackProtocol: ProtocolId = "unconscious";

export default function GuidanceScreen() {
  const params = useLocalSearchParams<{ protocol?: string; protocolId?: string; summary?: string }>();
  // Use either protocol or protocolId depending on how it was passed
  const rawProtocol = params.protocol || params.protocolId;
  const protocol = (rawProtocol as ProtocolId) || fallbackProtocol;
  const steps = protocolSteps[protocol] || protocolSteps[fallbackProtocol];
  const [stepIndex, setStepIndex] = React.useState(0);

  const currentStep = steps[stepIndex];

  React.useEffect(() => {
    Speech.stop();
    
    // Only speak the AI summary if it exists and we're starting step 1
    if (stepIndex === 0 && params.summary) {
      Speech.speak(params.summary, { rate: 0.95, pitch: 1, language: "en-US" });
    }

    Speech.speak(currentStep.title, {
      rate: 0.95,
      pitch: 1,
      language: "en-US",
    });

    return () => {
      Speech.stop();
    };
  }, [currentStep.title, params.summary, stepIndex]);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((value) => value + 1);
      return;
    }

    router.push("/(tabs)/settings");
  };

  const handlePrevious = () => {
    setStepIndex((value) => Math.max(0, value - 1));
  };

  const handleRepeat = () => {
    Speech.stop();
    Speech.speak(currentStep.title, {
      rate: 0.95,
      pitch: 1,
      language: "en-US",
    });
  };

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
            onPress={handleRepeat}
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
