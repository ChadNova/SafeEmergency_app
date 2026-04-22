import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { Image, Text, TouchableOpacity, View, Modal, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import Animated, {
  Extrapolation,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const PulseCircle = ({ delay = 0, color = "bg-emerald-500/20" }) => {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withDelay(delay, withTiming(1, { duration: 2000 })),
      -1,
      false,
    );
  }, [delay, pulse]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            pulse.value,
            [0, 1],
            [0.8, 1.5],
            Extrapolation.CLAMP,
          ),
        },
      ],
      opacity: interpolate(pulse.value, [0, 1], [0.4, 0], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View
      style={[styles.pulseCircle, animatedStyle]}
      className={`absolute ${color} rounded-full w-48 h-48`}
    />
  );
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const Home = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<number | null>(null);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  useEffect(() => {
    setAudioModeAsync({
      allowsRecording: false,
      playsInSilentMode: true,
    }).catch(() => {});
  }, []);

  const handleAnalyze = async (audioUri: string) => {
    setIsAnalyzing(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
      const formData = new FormData();

      const filename = audioUri.split("/").pop() || "recording.m4a";
      formData.append("audio", {
        uri: audioUri,
        name: filename,
        type: "audio/m4a",
      } as any);

      const response = await fetch(`${apiUrl}/classify`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();
      console.log("AI RESPONSE:", data);

      if (data.intent && data.intent !== "unknown") {
        router.push({
          pathname: "/guidance",
          params: { 
            protocolId: data.intent,
            summary: data.summary || `${data.intent.replace("_", " ")} protocol initiated.`
          },
        });
      } else {
        Speech.speak("Emergency sequence could not be identified. Please proceed manually.");
        router.push("/triage");
      }
    } catch (error) {
      console.error("ANALYSIS ERROR:", error);
      router.push("/triage");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startRecording = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const permission = await requestRecordingPermissionsAsync();
      if (permission.status !== "granted") {
        alert("Microphone permission required to describe the situation.");
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await recorder.prepareToRecordAsync();
      recorder.record();

      setIsRecording(true);
      setTimer(0);
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000) as unknown as number;

      Speech.speak("Please describe the situation.");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      await recorder.stop();
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });
      const uri = recorder.uri;

      if (uri) {
        Speech.speak("Analyzing your description.");
        handleAnalyze(uri);
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#e4e4e7" }}
      edges={["top"]}
    >
      <View className="flex-1 px-6">
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
            {isAnalyzing
              ? "Analyzing emergency details..."
              : "press the button to describe the situation in a voice mode"}
          </Text>
        </View>

        <View className="mt-24 items-center">
          <View className="flex-row items-center gap-8">
            <View className="flex-row items-center gap-2">
              <View className="h-9 w-[6px] rounded-full bg-[#10AF6F]" />
              <View className="h-14 w-[6px] rounded-full bg-[#10AF6F]" />
              <View className="h-9 w-[6px] rounded-full bg-[#10AF6F]" />
            </View>

            <TouchableOpacity
              onPress={handleVoiceToggle}
              className="h-36 w-36 items-center justify-center rounded-[22px] border-[3px] border-emerald-950 bg-emerald-600"
            >
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
          <TouchableOpacity
            onPress={() => router.push("/chat")}
            className="h-[60px] w-[60px] items-center justify-center rounded-full border-[2px] border-black bg-transparent"
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={36}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Fullscreen Recording Modal */}
      <Modal transparent visible={isRecording || isAnalyzing} animationType="fade">
        <View className="flex-1 bg-slate-950/95 items-center justify-center">
          <Animated.View entering={FadeIn} exiting={FadeOut} className="items-center">
            <View className="items-center justify-center mb-20">
              <PulseCircle delay={0} color="bg-emerald-500/30" />
              <PulseCircle delay={500} color="bg-emerald-500/20" />
              <View className="w-40 h-40 bg-emerald-600 rounded-full items-center justify-center shadow-2xl shadow-emerald-600/50">
                <Ionicons name="mic" size={60} color="white" />
              </View>
            </View>

            <Text className="text-white text-4xl font-black mb-4">
              {formatTime(timer)}
            </Text>
            
            <Text className="text-emerald-500 text-xs font-black uppercase tracking-widest mb-12 animate-pulse">
              {isAnalyzing ? "Processing..." : "Listening..."}
            </Text>

            {!isAnalyzing && (
              <Pressable
                onPress={stopRecording}
                className="bg-white px-10 py-5 rounded-full shadow-xl active:scale-95"
              >
                <Text className="text-slate-950 font-black uppercase text-lg">
                  STOP & ANALYZE
                </Text>
              </Pressable>
            )}
          </Animated.View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pulseCircle: {
    position: "absolute",
  },
});

export default Home;
