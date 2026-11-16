import { StyleSheet } from 'react-native';
export const herramientasStyles = StyleSheet.create({
  appBackGround: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#f4f6f9',
    marginBottom: 150,
  },
  topContainer: {
    width: '100%',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#d4af37',
    marginBottom: 30,
  },
  topText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d4af37',
    alignSelf: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOptions: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f5f1',
    margin: '2%',
    width: '42%',
    height: 130,
    borderRadius: 8,
    borderWidth: 1,
    borderTopWidth: 0.4,
    borderBottomWidth: 4,
    borderColor: '#d4af37',
    elevation: 4,
  },
  titleButton: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  subTitleButton: {
    color: '#555',
    fontSize: 12,
    textAlign: 'center',
  },
  iconButton: {
    width: 'auto',
    height: 'auto',
    margin: 5,
  },
});
