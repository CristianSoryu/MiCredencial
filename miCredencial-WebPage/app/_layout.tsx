import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts as usePoppinsFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import {
  useFonts as useInterFonts,
  Inter_400Regular,
} from '@expo-google-fonts/inter';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [poppinsLoaded] = usePoppinsFonts({
    PoppinsRegular: Poppins_400Regular,
    PoppinsSemiBold: Poppins_600SemiBold,
  });
  const [interLoaded] = useInterFonts({ InterRegular: Inter_400Regular });
  const [ready, setReady] = useState(false);

  const loaded = poppinsLoaded && interLoaded;

  useEffect(() => {
    if (!loaded) return;
    SplashScreen.hideAsync();
    setReady(true); // ← primero monta el Stack
  }, [loaded]);

  // La protección va DESPUÉS de que el Stack ya está montado
  useEffect(() => {
    if (!ready) return;
    AsyncStorage.getItem('usuario').then((raw) => {
      if (!raw) router.replace('/(login)');
    });
  }, [ready]);

  if (!ready) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
