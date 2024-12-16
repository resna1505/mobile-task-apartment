import {StyleSheet} from 'react-native';

export const AccessStyle = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#FFF'
  },

  MainWrapper: {
    flex: 1, 
    backgroundColor: '#52B788',
    paddingTop: 56,
    paddingHorizontal: 33
  },

  CardAccess: {
    backgroundColor: '#FFF',
    width: '100%',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center'
  },

  ImageCard: {
    width: 60,
    height: 60,
    marginRight: 10
  },
});
