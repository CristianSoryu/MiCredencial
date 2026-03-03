import { View, Text, Image} from 'react-native';
import { styles } from './styles';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function login() {
    return(
        <SafeAreaView style={styles.background}>
            <Image source={require('../../assets/icon.png')} 
            style={{width: 200, 
                height: 200, 
                marginTop: '40%',
                marginBottom: 20, 
            }} />

            <Text style={styles.tittle}>miCredencial</Text>

            <Link href='login' style={styles.button} >
                <Text style={styles.text}>Login</Text>
            </Link>
        </SafeAreaView>
    );
}