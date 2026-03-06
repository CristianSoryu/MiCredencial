import { Tabs } from 'expo-router';
import { HeaderShownContext } from '@react-navigation/elements';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarStyle: { display: 'none' },
    }}>
      <Tabs.Screen name="init" options={{ headerShown: false}}/>
      <Tabs.Screen name="login" options={{ headerShown: false}}/>
      <Tabs.Screen name="signUp" options={{ headerShown: false}}/>
    </Tabs>
  );
}