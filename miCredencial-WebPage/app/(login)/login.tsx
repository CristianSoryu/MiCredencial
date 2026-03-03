import { View, Text } from 'react-native';
import { styles } from './styles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function login() {
    return(
        <SafeAreaView style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.logo}>miCredencial</Text>
            </View>
        </SafeAreaView>

    );
}