import React from 'react';
import {TouchableOpacity,View, ActivityIndicator, Text} from 'react-native';

export default function mainButton(props: any) {
  const {loading, onPress, Title, marginTop} = props;
  return (
    <View style={{width: '85%', height: 40, alignSelf: 'center', marginTop:marginTop}}>
      <TouchableOpacity
        style={{
          width: '100%',
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          height: 40,
          backgroundColor: '#52B788',
        }}
        onPress={onPress}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={{color: '#FFF'}}>{Title}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
