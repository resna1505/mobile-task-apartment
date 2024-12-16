import React from 'react';
import {View} from 'react-native';
import LottieView from 'lottie-react-native';

import { GlobalStyle } from '../global/styles';

const LoadingAnim = require('../../assets/animation/loading.json');

export default function loading() {
  return (
    <View style={GlobalStyle.loadingContainer}>
      <View style={GlobalStyle.loadingSubCont}>
        <LottieView
          loop
          autoPlay
          ref={(animation) => {
            animation;
          }}
          style={GlobalStyle.loading}
          source={LoadingAnim}
        />
      </View>
    </View>
  );
}
