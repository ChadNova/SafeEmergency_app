import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Sender = "ai" | "user";

type Message = {
  id: string;
  text: string;
  sender: Sender;
};

const triggerQuestions = [
  {
    question: "Are you in immediate danger?",
    yes: "Move to a safe place now and call emergency services.",
    no: "Okay. Is someone else with you right now?",
  },
  {
    question: "Is someone else with you right now?",
    yes: "Stay together and share your exact location.",
    no: "Keep your phone ready and tell me if you need medical help.",
  },
  {
    question: "Do you need medical help?",
    yes: "Please call local emergency services immediately.",
    no: "Understood. I will keep guiding you step by step.",
  },
];

const Chat = () => {
  const [step, setStep] = React.useState(0);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "ai-0",
      text: triggerQuestions[0].question,
      sender: "ai",
    },
  ]);

  const handleAnswer = (answer: "yes" | "no") => {
    const currentQuestion = triggerQuestions[step];
    const responseText = currentQuestion[answer];

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

    const nextStep = step + 1;

    if (nextStep < triggerQuestions.length) {
      nextMessages.push({
        id: `ai-question-${nextStep}`,
        text: triggerQuestions[nextStep].question,
        sender: "ai",
      });
    } else {
      nextMessages.push({
        id: "ai-complete",
        text: "Thank you. If the situation changes, tell me immediately.",
        sender: "ai",
      });
    }

    setStep(nextStep);
    setMessages(nextMessages);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#e4e4e7]">
      <View className="flex-1 px-5 pt-4">
        <View className="mb-6 flex-row items-center justify-between px-1">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-11 w-11 items-center justify-center rounded-full bg-black/5"
          >
            <Ionicons name="chevron-back" size={26} color="#111827" />
          </TouchableOpacity>

          <View className="items-center">
            <Image
              source={require("../assets/images/logo.png")}
              className="h-12 w-12"
              resizeMode="contain"
            />
            <Text className="mt-1 text-lg font-bold text-black">Chat</Text>
          </View>

          <View className="h-11 w-11" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-4 pb-6"
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => {
            const isUser = message.sender === "user";

            return (
              <View
                key={message.id}
                className={`max-w-[84%] rounded-3xl px-4 py-3 ${
                  isUser
                    ? "self-end rounded-br-md bg-[#10AF6F]"
                    : "self-start rounded-bl-md bg-white"
                }`}
              >
                <Text
                  className={`text-[16px] leading-6 ${
                    isUser ? "text-white" : "text-black"
                  }`}
                >
                  {message.text}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View className="mb-5 flex-row gap-4">
          <TouchableOpacity
            onPress={() => handleAnswer("yes")}
            className="flex-1 items-center justify-center rounded-full bg-[#10AF6F] py-4"
          >
            <Text className="text-xl font-bold text-white">Yes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleAnswer("no")}
            className="flex-1 items-center justify-center rounded-full bg-black py-4"
          >
            <Text className="text-xl font-bold text-white">No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Chat;
