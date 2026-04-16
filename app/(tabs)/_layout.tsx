import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { StatusBar } from "react-native";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#10AF6F",
          tabBarInactiveTintColor: "#111827",
          tabBarStyle: {
            height: 84,
            paddingBottom: 16,
            paddingTop: 10,
            backgroundColor: "#e4e4e7",
            borderTopWidth: 1,
            borderTopColor: "#000000",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="cog" color={color} />
            ),
          }}
        />
      </Tabs>
      <StatusBar />
    </>
  );
}
