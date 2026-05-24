import { Stack } from 'expo-router';
import { useEffect } from 'react';
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
  const [interLoaded] = useInterFonts({
    InterRegular: Inter_400Regular,
  });

  const loaded = poppinsLoaded && interLoaded;

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  // No retornes null — deja que Stack monte aunque las fuentes no hayan cargado
  // Expo Router preserva la ruta actual si el árbol no se desmonta
  return <Stack screenOptions={{ headerShown: false }} />;
}
