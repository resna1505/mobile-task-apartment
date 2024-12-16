import {View, Text} from 'react-native';
import React from 'react';

export default function buttonText(props: any) {
  const {onPress} = props;
  return (
    <View style={{justifyContent: 'center', height: 50, marginTop: 10}}>
      <Text style={{fontSize: 14, fontFamily: 'NunitoSans-Regular'}}>
        Can't remember your password?{' '}
        <Text
          onPress={onPress}
          style={{fontSize: 14, fontFamily: 'NunitoSans-Bold'}}>
          Forgot Password
        </Text>
      </Text>
    </View>
  );
}
