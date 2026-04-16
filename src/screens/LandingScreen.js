import { useRouter } from "expo-router"; // <--- PASTE 1: The Import
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function LandingScreen() {
  const router = useRouter(); // <--- PASTE 2: The Hook

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Placeholder Logo */}
        <Text style={styles.logoIcon}>✳️</Text>

        <Text style={styles.titleText}>Welcome to{"\n"}SafeEmergency</Text>

        <Text style={styles.subtitleText}>
          Emergency Help. Instantly. When Every{"\n"}Second Matters.
        </Text>

        {/* PASTE 3: The Button with the Navigation Link */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.buttonText}>next →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  logoIcon: { fontSize: 80, marginBottom: 20, color: "#10B981" },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 20,
  },
  subtitleText: {
    fontSize: 16,
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 60,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#10B981",
    width: "100%",
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "600" },
});
