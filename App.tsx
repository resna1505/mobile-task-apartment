import React, { FC, useEffect } from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import codePush from "react-native-code-push";

import Navigator from './route/Navigator';
import {store} from './states/store';

const App: FC = () => {

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  }, []);
  
  return (
    
    <Provider store={store}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </Provider>
  );
};

export default codePush(App);
