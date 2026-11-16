import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface LogoutProps {
  showLabel?: boolean;
}

const Logout = ({ showLabel = false }: LogoutProps) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('usuario');
    router.replace('/(login)');
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={[styles.btn, !showLabel && { marginRight: 16 }]}
    >
      <Ionicons name="log-out-outline" size={20} color="#d9534f" />
      {showLabel ? <Text style={styles.label}>Cerrar sesión</Text> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  label: {
    color: '#d9534f',
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default Logout;
