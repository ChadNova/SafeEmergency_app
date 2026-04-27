import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSettings } from "../hooks/useAppSettings";
import { useAppSpeech } from "../hooks/useAppSpeech";

type TriageStep = "Q1" | "Q2" | "Q3" | "Q4";

const colors = {
  background: "#e4e4e7",
  textPrimary: "#111827",
  textSecondary: "#4b5563",
  border: "#d1d5db",
  icon: "#6b7280",
};

const copy = {
  header: "Step",
  of: "of",
  questions: {
    Q1: {
      text: "Is the person conscious?",
      description:
        "Can you talk to them and they respond, open their eyes, or move?",
      voice:
        "Is the person conscious? Can they talk to you, open their eyes, or move?",
    },
    Q2: {
      text: "Are they breathing normally?",
      description:
        "Is their chest rising and falling regularly and without terrible struggle?",
      voice: "Are they breathing normally?",
    },
    Q3: {
      text: "Is there severe bleeding?",
      description:
        "Is blood heavily pouring out or entirely soaking through their clothes?",
      voice: "Is there severe, heavy bleeding?",
    },
    Q4: {
      text: "Is the person having a seizure?",
      description:
        "Are they having uncontrolled jerking movements, stiffening, or unresponsiveness?",
      voice:
        "Is the person having a seizure? Are they having uncontrolled jerking or are they unresponsive?",
    },
  },
  yes: "Yes",
  no: "No",
  replayQuestion: "Replay Question",
  noThreatSpeech:
    "No immediate life-threatening emergency identified. Returning to general help.",
};

export default function TriageScreen() {
  const router = useRouter();
  const { haptics, analytics } = useAppSettings();
  const [step, setStep] = useState<TriageStep>("Q1");
  const [isConscious, setIsConscious] = useState<boolean | null>(null);
  const { speak, stop } = useAppSpeech();

  const pulseHaptics = async () => {
    if (!haptics) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const track = (event: string) => {
    if (analytics) {
      console.info(`[analytics] ${event}`);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        stop();
      };
    }, [stop]),
  );

  useEffect(() => {
    // Auto-read the question when step changes
    stop();
    speak(copy.questions[step].voice);
  }, [step, speak, stop]);

  const handleAnswer = async (answer: "YES" | "NO") => {
    await pulseHaptics();
    track(`triage_answer_${step}_${answer.toLowerCase()}`);

    if (step === "Q1") {
      if (answer === "NO") {
        setIsConscious(false);
        setStep("Q2");
      } else {
        setIsConscious(true);
        setStep("Q3");
      }
    } else if (step === "Q2") {
      if (answer === "NO") {
        // Navigate to Cardiac Arrest Protocol
        stop();
        router.push({
          pathname: "/guidance",
          params: { protocolId: "cardiac_arrest" },
        });
      } else {
        // Go to Seizure check
        setStep("Q4");
      }
    } else if (step === "Q3") {
      if (answer === "YES") {
        // Navigate to Bleeding Protocol
        stop();
        router.push({
          pathname: "/guidance",
          params: { protocolId: "bleeding" },
        });
      } else {
        // Go to Seizure check
        setStep("Q4");
      }
    } else if (step === "Q4") {
      if (answer === "YES") {
        // Navigate to Epilepsy Protocol
        stop();
        router.push({
          pathname: "/guidance",
          params: { protocolId: "epilepsy" },
        });
      } else {
        if (isConscious === false) {
          // Navigate to Unconscious Protocol
          stop();
          router.push({
            pathname: "/guidance",
            params: { protocolId: "unconscious" },
          });
        } else {
          // No threat
          stop();
          Speech.speak(copy.noThreatSpeech, {
            onDone: () => router.replace("/"),
          });
        }
      }
    }
  };

  return (
    <SafeAreaView
      className="flex-1 px-6"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header / Progress Bar */}
      <View className="flex-row items-center justify-between mt-4 mb-12">
        <Pressable
          onPress={() => {
            stop();
            router.back();
          }}
          className="p-2"
        >
          <Ionicons name="close" size={28} color={colors.textPrimary} />
        </Pressable>
        <View className="flex-row space-x-2">
          {(["Q1", "Q2", "Q3", "Q4"] as TriageStep[]).map((s) => (
            <View
              key={s}
              className="h-1.5 w-12 rounded-full"
              style={{
                backgroundColor: step === s ? "#e11d48" : colors.border,
              }}
            />
          ))}
        </View>
        <View className="w-10" />
      </View>

      {/* Question Container */}
      <Animated.View
        key={step}
        entering={SlideInRight.duration(400)}
        exiting={SlideOutLeft.duration(400)}
        className="flex-1 justify-center"
      >
        <Text
          className="text-xs font-bold uppercase tracking-widest mb-4"
          style={{ color: colors.textSecondary }}
        >
          {copy.header}{" "}
          {(["Q1", "Q2", "Q3", "Q4"] as TriageStep[]).indexOf(step) + 1}{" "}
          {copy.of} 4
        </Text>
        <Text
          className="text-4xl font-black mb-6 leading-tight"
          style={{ color: colors.textPrimary }}
        >
          {copy.questions[step].text}
        </Text>
        <Text
          className="text-lg leading-relaxed mb-12"
          style={{ color: colors.textSecondary }}
        >
          {copy.questions[step].description}
        </Text>

        {/* Large Action Buttons */}
        <View className="space-y-4 gap-4">
          <Pressable
            onPress={() => handleAnswer("YES")}
            className="bg-emerald-600 h-24 rounded-3xl items-center justify-center active:bg-emerald-700 active:scale-95 transition-all shadow-xl shadow-emerald-900/20"
          >
            <Text className="text-white text-2xl font-black uppercase tracking-tighter">
              {copy.yes}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => handleAnswer("NO")}
            className="bg-rose-600 h-24 rounded-3xl items-center justify-center active:bg-rose-700 active:scale-95 transition-all shadow-xl shadow-rose-900/20"
          >
            <Text className="text-white text-2xl font-black uppercase tracking-tighter">
              {copy.no}
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* Footer Support */}
      <View className="pb-8 items-center">
        <Pressable
          onPress={() => speak(copy.questions[step].voice)}
          className="flex-row items-center opacity-60"
        >
          <Ionicons name="volume-medium" size={20} color={colors.icon} />
          <Text
            className="font-bold ml-2 uppercase text-[10px] tracking-widest"
            style={{ color: colors.textSecondary }}
          >
            {copy.replayQuestion}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
