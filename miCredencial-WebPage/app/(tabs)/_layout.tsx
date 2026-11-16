import CustomHeader from '@/components/CustomHeader';
import { getStoredUsuario, isStaffUser } from '@/constants/api';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { CustomTabBar } from '../../components/CustomTabBar';

export default function TabLayout() {
  const [esStaff, setEsStaff] = useState(false);

  const verificarRol = useCallback(() => {
    getStoredUsuario().then((user) => {
      setEsStaff(isStaffUser(user));
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      verificarRol();
    }, [verificarRol])
  );

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        header: () => <CustomHeader />,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bienestar"
        options={{
          title: 'Bienestar',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="herramientas"
        options={{
          title: 'Gestión',
          href: esStaff ? undefined : null,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'briefcase' : 'briefcase-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={
                focused ? 'information-circle' : 'information-circle-outline'
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
