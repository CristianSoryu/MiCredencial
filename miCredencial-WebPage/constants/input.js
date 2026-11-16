import { StyleSheet } from 'react-native';

export const input = StyleSheet.create({
  button: {
    backgroundColor: '#c4001a',
    borderRadius: 40,
    width: '80%',
    padding: 13,
    margin: 20,
    justifyContent: 'center',
    elevation: 5, // Added for Android shadow support
  },
  moreActionsButton: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 40,
    width: '80%',
    height: '30%',
    justifyContent: 'center',
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: '#d4af37',
    elevation: 5, // Added for Android shadow support
  },
  input: {
    backgroundColor: '#fdfbe3', // Fix invalid color code
    borderRadius: 15,
    width: '80%',
    height: 45,
    margin: 10,
    paddingLeft: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 3, // Added for Android shadow support
    alignSelf: 'auto',
  },
  buttonText: {
    fontFamily: 'PoppinsSemiBold',
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  picker: {
    backgroundColor: '#fdfbe3', // Fix invalid color code
    width: '80%',
    padding: 10,
    margin: 10,
    borderColor: '#ccc',
    elevation: 3, // Added for Android shadow support
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
