import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
        background: {
            flex: 1,
            backgroundColor: 'red',
            alignItems: 'center',
        },
        container: {
            borderRadius: 20,
            width: '90%',
            height: '85%',
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: 'white',
            borderWidth: 2,
        },
        text: {
            color: 'black',
            fontSize: 20,
            alignItems: 'center',
            padding: 10,
        },
        tittle : {
            color: 'black',
            fontSize: 30,
            alignItems: 'center',
            padding: 10,
            fontWeight: 'bold',
            fontFamily: 'Arial',
        },
        button : {
            backgroundColor: 'white',
            borderRadius: 40,
            width: '80%',
            height: '9%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        

});

export default styles;