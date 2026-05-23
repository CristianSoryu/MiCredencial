import { Tabs } from 'expo-router';
import { HeaderShownContext } from '@react-navigation/elements';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index" options={{ headerShown: false }} />
      <Tabs.Screen name="noAccount" options={{ headerShown: false }} />
      <Tabs.Screen
        name="renovacionSolicitud"
        options={{ headerShown: false }}
      />
      <Tabs.Screen name="registro" options={{ headerShown: false }} />
    </Tabs>
  );
}
