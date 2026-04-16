import { FontAwesome, Ionicons } from "@expo/vector-icons";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoIcon}>✳️</Text>
        <Text style={styles.brandName}>SafeEmergency</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.instruction}>
          press the button to describe the situation in a voice mode
        </Text>

        <View style={styles.micContainer}>
          {/* Wave decorative elements */}
          <View style={styles.wave} />
          <View style={[styles.wave, { height: 40 }]} />

          <TouchableOpacity style={styles.micButton}>
            <FontAwesome name="microphone" size={45} color="#EF4444" />
          </TouchableOpacity>

          <View style={[styles.wave, { height: 40 }]} />
          <View style={styles.wave} />
        </View>

        <TouchableOpacity style={styles.chatButton}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={30}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* Custom Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={28} color="#10B981" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={28} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { alignItems: "center", marginTop: 20 },
  logoIcon: { fontSize: 40, color: "#10B981" },
  brandName: { fontSize: 14, fontWeight: "500", color: "#000" },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  instruction: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 60,
    lineHeight: 28,
  },
  micContainer: { flexDirection: "row", alignItems: "center", gap: 15 },
  micButton: {
    backgroundColor: "#10B981",
    padding: 30,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "#065F46",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  wave: { width: 4, height: 25, backgroundColor: "#A7F3D0", borderRadius: 2 },
  chatButton: {
    position: "absolute",
    bottom: 40,
    right: 0,
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#FFF",
  },
  navItem: { alignItems: "center", flex: 1 },
});
