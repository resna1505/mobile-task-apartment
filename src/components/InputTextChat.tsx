import React, {useState} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Warning from 'react-native-vector-icons/AntDesign';

const InputText = (props: any) => {
  const onChangeText = (value: any) => {
    const {name} = props;
    // console.log('propts', props)
    props.onChangeValue(name, value);
  };

  const {name, label, errorText, hasError, onChanges} = props;

  const errorTxt = () => {
    if (errorText) {
      return (
        <View
          style={{
            alignItems: 'flex-start',
            marginTop: 5,
            flexDirection: 'row',
          }}>
          <Warning name="warning" size={14} color="#EA2518" />
          <Text style={{fontSize: 10, color: '#C41D08', marginLeft: 5}}>
            {errorText}
          </Text>
        </View>
      );
    }
  };

  return (
    <View>
      {name === 'password' ? (
         <>
         <View
           style={{
             height: 45,
             flexDirection: 'row',
             justifyContent: 'space-between',
             alignItems: 'center',
             borderWidth: 1,
             borderRadius: 5,
             borderColor: !hasError ?'#DEE2E6' : '#EA2518',
           }}>
           <View style={{width: '6%', alignItems: 'center', paddingLeft:5}}>
             <Icons name="lock-outline" size={22} color="#ADB5BD" />
           </View>
           <TextInput
             onChangeText={(text: any) => onChangeText(text)}
             fontSize={14}
             placeholderTextColor="#CED4DA"
             style={{
               paddingLeft: 10,
               height: 45,
               width: '95%',
               color: '#10180F',
             }}
             selectionColor={'#1B7472'}
             {...props}
           />
         </View>
         {errorTxt()}
       </>
      ) : (
        <>
          <View
            style={{
              height: 60,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTopWidth: 1,
              borderStartWidth:1,
              borderEndWidth: 1,
              borderTopRightRadius: 5,
              borderTopLeftRadius:5,
              backgroundColor: '#FFF',
              borderColor: !hasError ?'#DEE2E6' : '#EA2518',
            }}>
            <View style={{width: '10%', borderRadius: 5,  alignItems: 'center', paddingLeft:5}}>
              <Icons name="note-text-outline" size={18} color="#CED4DA" />
            </View>
            <TextInput
              onChangeText={(text: any) => onChangeText(text)}
              fontSize={14}
              placeholderTextColor="#CED4DA"
              style={{
                paddingLeft: 10,
                height: 45,
                width: '80%',
                color: '#10180F',
                fontFamily: 'NunitoSans-Regular',
                fontSize: 14
              }}
              selectionColor={'#1B7472'}
              {...props}
            />
            <View style={{width: '10%', flexDirection: 'row', borderRadius: 5,  alignItems: 'center', paddingRight: 5, }}>
              <View style={{height: 25, borderLeftWidth: 1, borderLeftColor:'#ADB5BD', paddingLeft: 5}}/>
              <MaterialIcon name="attach-file" size={22} color="#ADB5BD" />
            </View>
          </View>
          {errorTxt()}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ToForm: {
    // width: '85%',
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#DEE2E6',
  },
  ToNewPassword: {borderRadius: 5},
});

export default InputText;
