import * as Speech from "expo-speech";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { useAppSettings } from "./useAppSettings";

type SpeechVoice = {
  identifier: string;
  language?: string;
  quality?: string;
  name?: string;
};

const LANGUAGE_TAG = {
  en: "en-US",
  fr: "fr-FR",
  rw: "rw-RW",
} as const;

const chooseVoice = (voices: SpeechVoice[], target: string) => {
  const exact = voices.filter(
    (voice) => voice.language?.toLowerCase() === target.toLowerCase(),
  );
  const base = target.split("-")[0].toLowerCase();
  const partial = voices.filter((voice) =>
    voice.language?.toLowerCase().startsWith(base),
  );
  const candidates = exact.length > 0 ? exact : partial;

  if (candidates.length === 0) return undefined;

  const premium = candidates.find((voice) => {
    const haystack = `${voice.quality ?? ""} ${voice.name ?? ""}`.toLowerCase();
    return haystack.includes("premium") || haystack.includes("enhanced");
  });

  return premium ?? candidates[0];
};

export const useAppSpeech = () => {
  const { voiceGuidance, language } = useAppSettings();
  const [voiceIdentifier, setVoiceIdentifier] = useState<string | undefined>();

  const speechLanguage = useMemo(() => LANGUAGE_TAG[language], [language]);

  useEffect(() => {
    let active = true;

    const loadPreferredVoice = async () => {
      try {
        const voices =
          (await Speech.getAvailableVoicesAsync()) as SpeechVoice[];
        const selected = chooseVoice(voices, speechLanguage);

        if (active) {
          setVoiceIdentifier(selected?.identifier);
        }
      } catch {
        if (active) {
          setVoiceIdentifier(undefined);
        }
      }
    };

    loadPreferredVoice();

    return () => {
      active = false;
    };
  }, [speechLanguage]);

  const speak = useCallback(
    (message: string) => {
      if (!voiceGuidance) return;

      Speech.speak(message, {
        language: speechLanguage,
        voice: voiceIdentifier,
        // Slower pace sounds more natural and less robotic for emergency guidance.
        rate: Platform.OS === "ios" ? 0.45 : 0.9,
        pitch: 1.0,
      });
    },
    [voiceGuidance, speechLanguage, voiceIdentifier],
  );

  const stop = useCallback(() => {
    Speech.stop();
  }, []);

  return {
    speak,
    stop,
  };
};
