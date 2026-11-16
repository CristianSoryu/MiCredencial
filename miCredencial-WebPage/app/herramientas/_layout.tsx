import CustomHeader from '@/components/CustomHeader';
import { Stack } from 'expo-router';

export default function HerramientasLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <CustomHeader />,
        headerShadowVisible: false,
      }}
    />
  );
}
