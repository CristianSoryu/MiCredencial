import React from 'react';
import { styles } from './styles';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const index = () => {
  return (
    <SafeAreaProvider>
      <View style={styles.appBackGround}></View>;
    </SafeAreaProvider>
  );
};

export default index;
