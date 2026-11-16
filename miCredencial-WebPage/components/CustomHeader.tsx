import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../constants/tabBarstyles';

export default function CustomHeader() {
  return (
    <SafeAreaView edges={['top']} style={styles.header}>
      <View style={styles.headerContainer}>
        <View style={localStyles.brandRow}>
          <Image
            source={require('../assets/images/logoUniversidad.png')}
            style={localStyles.logo}
            contentFit="contain"
          />
          <View>
            <Text style={localStyles.brandTitle}>miCredencial</Text>
            <Text style={localStyles.brandSub}>Universidad Libre • Cúcuta</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.4,
  },
  brandSub: {
    color: '#ffe082',
    fontSize: 11,
    fontWeight: '600',
  },
});
