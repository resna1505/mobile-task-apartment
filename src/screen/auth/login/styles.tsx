import {Keyboard, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export const LoginStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  firstGroup: {flex: 1, justifyContent: 'center', marginBottom: 0, marginTop: 50},
  mainLogo: {width: '100%', height: '100%', resizeMode: 'contain', zIndex: 10},
  secondGroup: {
    height: 50,
    marginTop: 0,
    marginLeft: 17,
    justifyContent: 'center',
  },
  watchwordcontainer: {
    width: '90%',
    alignItems: 'flex-start',
    marginLeft: 17,
  },
  watchword: {fontSize: 24, fontFamily: 'NunitoSans-Bold'},
  watchwordsubContainer: {width: '90%', alignItems: 'flex-start'},
  textCover: {
    fontSize: 18,
    fontFamily: 'NunitoSans-Light',
  },
  inputContainer: {flex: 1, marginTop: 0},
  inputLabelContainer: {
    alignItems: 'center',
    height: '40%',
    marginVertical: 10,
  },
  labelTextContainer: {width: '85%'},
  labelInput: {
    fontSize: 14,
    marginVertical: 10,
    fontFamily: 'NunitoSans-Bold',
  },
  inputsContainer: {
    width: '85%',
  },
  buttonContainer: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 30,
  },
});
