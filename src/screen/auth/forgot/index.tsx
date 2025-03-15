import {ENDPOINT_LIVE} from '@env';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  ToastAndroid,
  Keyboard,
} from 'react-native';
import {request} from '../../../Api';
import { useNavigation } from '@react-navigation/native';

// Image
const MainImage = require('../../../../assets/image/ImageMain.png');

// Component
import MainButton from '../../../components/mainButton';

// Styling
import {forgotStyles} from './styles';

const Forgot = () => {
  const navigation = useNavigation();
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const fetchForgot = async () => {
    Keyboard.dismiss();
    try {
      if (email !== '') {
        setLoading(true);
        const res = await request.post(
          `auth/resetPassword`,
          // 'https://9bb1-103-121-18-9.ap.ngrok.io/auth/resetPassword',
          {
            email: email.trim(),
          },
        );
        if (res) {
          setTimeout(() => {
            setLoading(false);
            ToastAndroid.show(
              'Success please check your email.',
              ToastAndroid.SHORT,
            );
            navigation.navigate('Login')
          }, 1000);
        }
      } else {
        ToastAndroid.show('Email cannot be empty', ToastAndroid.SHORT);
        setLoading(false);
      }
    } catch (err: any) {
      await setTimeout(() => {
        setLoading(false);
        // setErrors(err.response.data.message)
        if (err?.response.status == 404) {
          ToastAndroid.show(err?.message, ToastAndroid.SHORT);
          setErrors(err);
        } else if (err?.response.status == 502) {
          ToastAndroid.show(err?.message, ToastAndroid.SHORT);
          setErrors(err);
        } else if (err?.response.status == 503) {
          ToastAndroid.show(err?.message, ToastAndroid.SHORT);
          setErrors(err);
        } else {
          ToastAndroid.show(err?.response.data.message[0], ToastAndroid.SHORT);
        }
      }, 1500);
    }
  };

  const emailCheck =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const onchangeEmail = (val: any) => {
    // setValidate(val.toLowerCase().match(emailCheck));
    // if (val.toLowerCase().match(emailCheck)) {
    setEmail(val);
    // } else {
    //   setErrors('Format email salah');
    //   // ToastAndroid.show('Format Email Salah', ToastAndroid.SHORT);
    // }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={forgotStyles.container}>
      <SafeAreaView style={forgotStyles.safeArea}>
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <View style={forgotStyles.container}>
          <View style={forgotStyles.header}>
            <View style={forgotStyles.containerTitle}>
              <Text style={forgotStyles.title}>Ooops, lost your password?</Text>
            </View>
            <View style={forgotStyles.imageContainer}>
              <Image source={MainImage} style={forgotStyles.image} />
            </View>
          </View>

          <View style={forgotStyles.footer}>
            <View style={forgotStyles.descriptionContainer}>
              <Text style={forgotStyles.description}>
                Input the email that you used to login, we will send the link to
                reset your password!
              </Text>
            </View>

            <View style={forgotStyles.emailContainer}>
              <View style={forgotStyles.textEmailContainer}>
                <Text style={forgotStyles.emailLabel}>Email</Text>
              </View>
              <View style={forgotStyles.inputContainer}>
                <TextInput
                  style={{width: '80%', height: '100%'}}
                  placeholder="Type your email"
                  autoCapitalize="none"
                  onChangeText={(val: any) => onchangeEmail(val)}
                  onSubmitEditing={() => setKeyboardVisible(false)}
                />
              </View>
            </View>
            <MainButton
              loading={loading}
              style={{}}
              onPress={() => fetchForgot()}
              Title="Reset Password"
              marginTop={isKeyboardVisible === true ? 10 : 0}
            />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Forgot;
