import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import LandingScreen from "../components/LandingScreen";
import { API_BASE_URL } from "../constants/api";
import { clearAuthToken, getAuthToken } from "../constants/auth";

export default function Page() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = React.useState(true);
  const [hasValidSession, setHasValidSession] = React.useState(false);

  React.useEffect(() => {
    let isActive = true;

    const restoreSession = async () => {
      try {
        const token = await getAuthToken();

        if (!token) {
          if (isActive) {
            setHasValidSession(false);
          }
          return;
        }

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          await clearAuthToken();
          if (isActive) {
            setHasValidSession(false);
          }
          return;
        }

        if (isActive) {
          setHasValidSession(true);
        }
      } catch {
        if (isActive) {
          setHasValidSession(false);
        }
      } finally {
        if (isActive) {
          setCheckingSession(false);
        }
      }
    };

    restoreSession();

    return () => {
      isActive = false;
    };
  }, []);

  React.useEffect(() => {
    if (hasValidSession) {
      router.replace("/(tabs)/home");
    }
  }, [hasValidSession, router]);

  if (checkingSession) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (hasValidSession) {
    return null;
  }

  return <LandingScreen />;
}
