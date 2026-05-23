import { View, Image, Text } from 'react-native';
import { styles } from '../app/(login)/styles';
const CustomPageHeader = () => {
  return (
    <View style={styles.header}>
      <Image
        source={require('../assets/images/logoUniversidad.png')}
        style={styles.imageCircle}
      />
      <Text style={styles.title}>miCredencial</Text>
    </View>
  );
};

export default CustomPageHeader;
