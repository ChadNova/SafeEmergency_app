import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { type ProtocolId } from "../constants/protocols";

type Sender = "ai" | "user";

type Message = {
  id: string;
  text: string;
  sender: Sender;
};

type TriageStep = "Q1" | "Q2" | "Q3" | "Q4";

const questions = {
  Q1: {
    question: "Is the person conscious?",
    yesReply: "Okay, checking for bleeding now.",
    noReply: "Okay, they are unconscious. Checking breathing now.",
  },
  Q2: {
    question: "Is the person breathing?",
    yesReply: "Understood. The person is breathing but unconscious.",
    noReply: "Understood. The person is NOT breathing.",
  },
  Q3: {
    question: "Is there heavy bleeding?",
    yesReply: "Understood. Severe bleeding detected.",
    noReply: "Understood. No heavy bleeding detected.",
  },
  Q4: {
    question: "Are they having a seizure or shaking uncontrollably?",
    yesReply: "Understood. Seizure symptoms detected.",
    noReply: "Understood. No seizure symptoms detected.",
  },
} as const;

export default function Chat() {
  const [step, setStep] = React.useState<TriageStep>("Q1");
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "ai-0",
      text: questions["Q1"].question,
      sender: "ai",
    },
  ]);

  const handleAnswer = (answer: "yes" | "no") => {
    const currentQuestion = questions[step];
    const responseText =
      answer === "yes" ? currentQuestion.yesReply : currentQuestion.noReply;

    const nextMessages: Message[] = [
      ...messages,
      {
        id: `user-${step}-${answer}`,
        text: answer === "yes" ? "Yes" : "No",
        sender: "user",
      },
      {
        id: `ai-response-${step}-${answer}`,
        text: responseText,
        sender: "ai",
      },
    ];

    let nextStep: TriageStep | null = null;
    let protocol: ProtocolId | "unknown" | null = null;

    if (step === "Q1") {
      if (answer === "no") nextStep = "Q2";
      if (answer === "yes") nextStep = "Q3";
    } else if (step === "Q2") {
      if (answer === "no") protocol = "cardiac_arrest";
      if (answer === "yes") protocol = "unconscious";
    } else if (step === "Q3") {
      if (answer === "yes") protocol = "bleeding";
      if (answer === "no") nextStep = "Q4";
    } else if (step === "Q4") {
      if (answer === "yes") protocol = "epilepsy";
      if (answer === "no") protocol = "unknown";
    }

    if (nextStep) {
      nextMessages.push({
        id: `ai-question-${nextStep}`,
        text: questions[nextStep].question,
        sender: "ai",
      });
      setStep(nextStep);
    } else if (protocol) {
      if (protocol === "unknown") {
        nextMessages.push({
          id: "ai-complete",
          text: "No immediate life-threatening emergency identified. Returning to general help.",
          sender: "ai",
        });
        setTimeout(() => {
          router.replace("/");
        }, 1500);
      } else {
        nextMessages.push({
          id: "ai-complete",
          text: "Triage complete. Opening the emergency protocol now.",
          sender: "ai",
        });
        setTimeout(() => {
          router.replace({
            pathname: "/guidance",
            params: { protocolId: protocol },
          });
        }, 1000);
      }
    }

    setMessages(nextMessages);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-5 pt-2">
        <View className="items-center pt-3">
          <Image
            source={require("../assets/images/logo.png")}
            className="h-16 w-16"
            resizeMode="contain"
          />
          <Text className="mt-1 text-[22px] font-semibold text-black">
            SafeEmergency
          </Text>
          <Text className="mt-1 text-sm text-zinc-500">Guided triage chat</Text>
        </View>

        <View className="mt-8 flex-1 rounded-[54px] bg-[#def2ea] px-5 py-6 shadow-2xl shadow-emerald-950/10">
          <ScrollView
            className="flex-1"
            contentContainerClassName="gap-6 pb-6"
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => {
              const isUser = message.sender === "user";

              return (
                <View
                  key={message.id}
                  className={`flex-row items-start gap-3 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser ? (
                    <View className="mt-3 h-5 w-5 rounded-full border border-zinc-700 bg-transparent" />
                  ) : (
                    <View className="h-5 w-5" />
                  )}

                  {isUser ? (
                    <View className="max-w-[68%] rounded-full bg-white px-6 py-4">
                      <Text className="text-[16px] font-medium text-zinc-500">
                        {message.text}
                      </Text>
                    </View>
                  ) : (
                    <View
                      className={`max-w-[68%] rounded-full bg-white/65 px-6 py-4 ${
                        message.text.length > 34 ? "py-5" : "py-4"
                      }`}
                    >
                      <Text className="text-[16px] font-medium text-zinc-500">
                        {message.text}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}

            <View className="pt-2">
              <View className="rounded-[34px] border border-white/70 bg-white/75 px-5 py-5">
                <View className="mb-4 flex-row items-center justify-between">
                  <Text className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">
                    Response
                  </Text>
                  <Text className="text-xs font-medium text-zinc-400">
                    One tap answers
                  </Text>
                </View>

                <View className="gap-3">
                  <TouchableOpacity
                    onPress={() => handleAnswer("yes")}
                    className="flex-row items-center justify-center rounded-full bg-emerald-600 px-7 py-4 shadow-sm shadow-emerald-900/15"
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#ffffff"
                    />
                    <Text className="ml-2 text-[16px] font-semibold text-white">
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleAnswer("no")}
                    className="flex-row items-center justify-center rounded-full bg-rose-600 px-7 py-4 shadow-sm shadow-rose-900/15"
                  >
                    <Ionicons name="close-circle" size={18} color="#ffffff" />
                    <Text className="ml-2 text-[16px] font-semibold text-white">
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        <View className="mt-6 flex-row items-center justify-around pb-4">
          <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
            <Ionicons name="home" size={34} color="#000000" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/(tabs)/settings")}>
            <Ionicons name="settings-outline" size={34} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
