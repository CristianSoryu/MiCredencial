import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const Logout = () => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('usuario');
    router.replace('/(login)');
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
      <Ionicons name="log-out-outline" size={24} color="#d9534f" />
    </TouchableOpacity>
  );
};

export default Logout;
