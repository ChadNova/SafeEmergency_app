import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AppLanguage = "en" | "fr" | "rw";

type AppSettingsContextType = {
  voiceGuidance: boolean;
  setVoiceGuidance: (value: boolean) => void;
  haptics: boolean;
  setHaptics: (value: boolean) => void;
  offlinePrompts: boolean;
  setOfflinePrompts: (value: boolean) => void;
  analytics: boolean;
  setAnalytics: (value: boolean) => void;
  language: AppLanguage;
  setLanguage: (value: AppLanguage) => void;
};

const SETTINGS_STORAGE_KEYS = {
  voiceGuidance: "ai-emergency-setting-voice-guidance",
  haptics: "ai-emergency-setting-haptics",
  offlinePrompts: "ai-emergency-setting-offline-prompts",
  analytics: "ai-emergency-setting-analytics",
  language: "ai-emergency-setting-language",
} as const;
let isStorageAvailable: boolean | null = null;


const safeGetItem = async (key: string) => {
  if (isStorageAvailable === false) return null;

  try {
    const value = await AsyncStorage.getItem(key);
    isStorageAvailable = true;
    return value;
  } catch {
    isStorageAvailable = false;
    return null;
  }
};

const safeSetItem = async (key: string, value: string) => {
  if (isStorageAvailable === false) return;

  try {
    await AsyncStorage.setItem(key, value);
    isStorageAvailable = true;
  } catch {
    isStorageAvailable = false;
  }
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(
  undefined,
);

export const AppSettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [offlinePrompts, setOfflinePrompts] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [language, setLanguage] = useState<AppLanguage>("en");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const [
        storedVoiceGuidance,
        storedHaptics,
        storedOfflinePrompts,
        storedAnalytics,
        storedLanguage,
      ] = await Promise.all([
        safeGetItem(SETTINGS_STORAGE_KEYS.voiceGuidance),
        safeGetItem(SETTINGS_STORAGE_KEYS.haptics),
        safeGetItem(SETTINGS_STORAGE_KEYS.offlinePrompts),
        safeGetItem(SETTINGS_STORAGE_KEYS.analytics),
        safeGetItem(SETTINGS_STORAGE_KEYS.language),
      ]);

      if (storedVoiceGuidance != null) {
        setVoiceGuidance(storedVoiceGuidance === "true");
      }

      if (storedHaptics != null) {
        setHaptics(storedHaptics === "true");
      }

      if (storedOfflinePrompts != null) {
        setOfflinePrompts(storedOfflinePrompts === "true");
      }

      if (storedAnalytics != null) {
        setAnalytics(storedAnalytics === "true");
      }

      if (
        storedLanguage === "en" ||
        storedLanguage === "fr" ||
        storedLanguage === "rw"
      ) {
        // Enforcing English for now based on user instruction
        setLanguage("en");
      }

      setIsHydrated(true);
    };

    loadSettings();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const persistSettings = async () => {
      await Promise.all([
        safeSetItem(SETTINGS_STORAGE_KEYS.voiceGuidance, String(voiceGuidance)),
        safeSetItem(SETTINGS_STORAGE_KEYS.haptics, String(haptics)),
        safeSetItem(
          SETTINGS_STORAGE_KEYS.offlinePrompts,
          String(offlinePrompts),
        ),
        safeSetItem(SETTINGS_STORAGE_KEYS.analytics, String(analytics)),
        safeSetItem(SETTINGS_STORAGE_KEYS.language, language),
      ]);
    };

    persistSettings();
  }, [voiceGuidance, haptics, offlinePrompts, analytics, language, isHydrated]);

  const value = useMemo(
    () => ({
      voiceGuidance,
      setVoiceGuidance,
      haptics,
      setHaptics,
      offlinePrompts,
      setOfflinePrompts,
      analytics,
      setAnalytics,
      language,
      setLanguage,
    }),
    [voiceGuidance, haptics, offlinePrompts, analytics, language],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error(
      "useAppSettings must be used within an AppSettingsProvider",
    );
  }
  return context;
};
