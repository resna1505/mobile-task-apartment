import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
export const GlobalStyle = StyleSheet.create({
    loadingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        height: deviceHeight,
        zIndex: 1,
        alignItems: 'center',
      },
      loadingSubCont: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: (40 / 100) * deviceHeight,
      },
      loading: {
        width: deviceWidth / 3,
        height: (16 / 100) * deviceHeight,
      },
});