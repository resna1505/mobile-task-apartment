import {StyleSheet} from 'react-native';

export const forgotStyles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#FFF'},
  container: {flex: 1},
  header: {flex: 1, alignItems: 'center'},
  containerTitle: {
    width: '90%',
    height: '30%',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  title: {fontSize: 24, fontFamily: 'NunitoSans-Light', color: '#6C757D'},
  imageContainer: {width: '100%', height: '70%', justifyContent: 'flex-end'},
  image: {width: '100%', height: '130%', resizeMode: 'contain'},
  footer:{flex: 1, alignItems: 'center'},
  descriptionContainer:{width: '85%', height: '20%', alignSelf: 'center' },
  description: {fontSize:14, fontFamily:'NunitoSans-Regular',color:'#495057'},
  emailContainer:{alignItems: 'center',height: '30%',  width: '100%'},
  textEmailContainer:{width: '85%', },
  emailLabel: {fontSize:14, fontFamily: 'NunitoSans-Bold',},
  inputContainer: {
    width: '85%',
    height: 40,
    marginVertical: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#DEE2E6',
  },
  textInput: {width: '80%', height: '100%'}
});
