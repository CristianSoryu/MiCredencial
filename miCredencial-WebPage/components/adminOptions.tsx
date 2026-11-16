import { herramientasStyles } from '@/constants/herramientasStyles';
import React from 'react';
import { useRouter, Href } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

interface AdminOptionsProps {
  icon: string;
  title: string;
  subTitle: string;
  ruta?: Href;
}

const AdminOptions = (adminProps: AdminOptionsProps) => {
  const router = useRouter();
  const handlePress = () => {
    router.push(adminProps.ruta ? adminProps.ruta : '/');
  };
  return (
    <TouchableOpacity
      style={herramientasStyles.buttonOptions}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={herramientasStyles.iconButton}>{adminProps.icon}</Text>
      <Text style={herramientasStyles.titleButton} numberOfLines={2}>
        {adminProps.title}
      </Text>
      <Text style={herramientasStyles.subTitleButton} numberOfLines={2}>
        {adminProps.subTitle}
      </Text>
    </TouchableOpacity>
  );
};

export default AdminOptions;
