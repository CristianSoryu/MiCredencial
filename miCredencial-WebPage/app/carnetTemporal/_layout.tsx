import CustomHeader from '@/components/CustomHeader';
import { Stack } from 'expo-router';

export default function CarnetTemporalLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <CustomHeader />,
        headerShadowVisible: false,
      }}
    />
  );
}
