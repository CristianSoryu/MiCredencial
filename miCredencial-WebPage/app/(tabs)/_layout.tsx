import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { CustomTabBar } from "../../components/CustomTabBar";
export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        tabBarInactiveTintColor: "white",
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: "Poppins_400Regular",
        },
        headerStyle: {
          backgroundColor: "#ef310b",
        },
        headerShadowVisible: false,
        headerTintColor: "white",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="prestamos"
        options={{
          title: "Prestamos",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={
                focused ? "information-circle" : "information-circle-outline"
              }
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
