import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>✳️</Text>
      <Text style={styles.header}>Login</Text>

      <View style={styles.inputContainer}>
        <Text>Phone number</Text>
        <TextInput style={styles.input} keyboardType="phone-pad" />

        <Text>Password</Text>
        <TextInput style={styles.input} secureTextEntry />
      </View>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text
          style={{ color: "#10B981", alignSelf: "flex-end", marginBottom: 20 }}
        >
          Don&apos;t have an Account? Sign Up
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/home")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 30,
    justifyContent: "center",
  },
  logo: { fontSize: 60, color: "#10B981", textAlign: "center" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#CCC",
    paddingVertical: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#10B981",
    padding: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 18, fontWeight: "600" },
});
