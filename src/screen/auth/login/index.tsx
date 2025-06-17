import axios from 'axios';
import React, {useState, FC, useRef, useEffect,} from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ToastAndroid,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import packageJson from '../../../../package.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useDispatch, useSelector } from 'react-redux';

// import {fetchLogin} from '../../../../states/action/user';

// Images
const MainImage = require('../../../../assets/image/bg-login.png');
const GoggleIcon = require('../../../../assets/image/Google-icon.png')

// Components
import MainButton from '../../../components/mainButton';
import ButtonText from '../../../components/buttonText';
import InputText from '../../../components/InputTextCustom';

// Styling
import {LoginStyle} from './styles';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, Stacks} from '../../../../route/shared';
import {RouteProp} from '@react-navigation/core';
import {request} from '../../../Api';
import { useDispatch } from 'react-redux';
import { TOKEN } from '../../../../states/reducer/auth/case';
import messaging from '@react-native-firebase/messaging';

interface Props {
  navigation: StackNavigationProp<RootStackParamList, Stacks.Tab>;
  route: RouteProp<
    {params: {id: number; firstName: any; lastName: any; type: any}},
    'params'
  >;
}

const Login: FC<Props> = ({navigation, route}) => {
  // const navigation = useNavigation();
  // const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [validate, setValidate] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState('');
  const [visible, setVisible] = useState(true);
  const [tokenFCM, setFCMtoken] = useState(true);
  const dispatch = useDispatch();

  // const checkroutes = route

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem('access_token');
    if (token !== null) {
      await authMe(token);
    }
  };

  useEffect(() => {
    checkLogin();
    messaging().getToken()
    .then(token => {
      setFCMtoken(token)
    });
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      ToastAndroid.show('A new FCM message arrived!', JSON.stringify(remoteMessage), ToastAndroid.SHORT);
    });

    return unsubscribe;
  }, []);

  const authMe = async (token) => {
    const url = 'auth/mobile/me';
    try {
      const res = await request.get(url, {
        Authorization: 'Bearer ' + token,
      });
      if (res) {
        dispatch({type: TOKEN, token: token});
        navigation.replace('Access')
        // navigation.replace('Tab', {
        //   screen: 'Home',
        //   params: {
        //     firstName: res.data.firstName || res.data.email,
        //     lastName: res.data.lastName,
        //     id: res.data.id,
        //   },
        // });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchLogin = async () => {
    Keyboard.dismiss();
    const url = 'auth/mobile/login';
    try {
      setLoading(true);
      if (email !== '' && password !== '') {
        const res = await request.post(url, {
          email: email.trim(),
          password: password.trim(),
          firebaseToken: tokenFCM,
        });
        if (res) {
          await AsyncStorage.setItem('access_token', res.data.accessToken);
          await authMe(res.data.accessToken);
        }
      } else if (email == '' && password == '') {
        ToastAndroid.show(
          'Email or Password cannot be empty',
          ToastAndroid.SHORT,
        );
        setLoading(false);
      } else {
        ToastAndroid.show('Email or Password not valid', ToastAndroid.SHORT);
        setLoading(false);
      }
    } catch (err: any) {
      await setTimeout(() => {
        setLoading(false);
        if (err?.response.data?.status == 401) {
          setErrors(err.response.data.message);
        } else {
          ToastAndroid.show('Email/Password Salah', ToastAndroid.SHORT);
        }
      }, 500);
    }
  };

  const hasError = (key: any) => {
    // if (errors.includes('email')) {
    //   return true;
    // } else {
    //   return false;
    // }
    return Boolean(errors[key]);
  };

  const hasErrorPass = (key: any) => {
    return Boolean(errors[key]);
  };

  const getError = (key: any) => {
    const error = errors[key] ? errors[key][0] : '';
    return error;
  };

  const emailCheck =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passwordCheck = /^(?=.*\d).{8,}$/;

  const onchangeEmail = (val: any) => {
    setValidate(val.toLowerCase().match(emailCheck));
    if (val.toLowerCase().match(emailCheck)) {
      setEmail(val);
    } else {
      setErrors('Format email salah');
      // ToastAndroid.show('Format Email Salah', ToastAndroid.SHORT);
    }
  };

  const onVisible = () => {
    setVisible(!visible)
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={LoginStyle.container}>
      <SafeAreaView style={LoginStyle.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        <View style={LoginStyle.firstGroup}>
          <Image source={MainImage} style={LoginStyle.mainLogo} />
        </View>
        <View style={LoginStyle.secondGroup}>
          <Text style={LoginStyle.watchword}>Complete your daily Tasks</Text>
          <Text style={LoginStyle.textCover}>Please login to continue</Text>
        </View>

        <View>
          <ScrollView>
            <View style={LoginStyle.inputContainer}>
              <View style={LoginStyle.inputLabelContainer}>
                <View style={LoginStyle.labelTextContainer}>
                  <Text style={LoginStyle.labelInput}>Email</Text>
                </View>
                <View style={LoginStyle.inputsContainer}>
                  <InputText
                    name="email"
                    placeholder="Type your email"
                    placeholderTextColor="#CED4DA"
                    autoCapitalize="none"
                    onChangeText={(val: any) => onchangeEmail(val)}
                    hasError={hasError('email')}
                    errorText={getError('email')}
                    returnKeyType="next"
                    // onSubmitEditing={() => {
                    //   if (passwordInput.current !== undefined) {
                    //     passwordInput.current.focus();
                    //   }
                    // }}
                    // onSubmitEditing={() => {
                    //   billingFirstNameInput.current.focus()
                    // }}
                  />
                </View>
              </View>
              <View style={LoginStyle.inputLabelContainer}>
                <View style={LoginStyle.labelTextContainer}>
                  <Text style={LoginStyle.labelInput}>Password</Text>
                </View>
                <View style={LoginStyle.inputsContainer}>
                  <InputText
                    name="password"
                    placeholder="Type your password"
                    placeholderTextColor="#CED4DA"
                    secureTextEntry={visible}
                    autoCapitalize="none"
                    onChangeText={(val: any) => setPassword(val)}
                    hasError={hasErrorPass('password')}
                    errorText={getError('password')}
                    onVisible={onVisible}
                    // ref={passwordInput}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={LoginStyle.buttonContainer}>
          <MainButton
            loading={loading}
            Title="Sign in"
            onPress={() => fetchLogin()}
          />
          {/* <ButtonText
            onPress={() => navigation.navigate(Stacks.ForgotPassword)}
          /> */}
          {/* <View style={{flexDirection: 'row', borderRadius: 5, width: '90%', borderWidth: 1, borderColor: '#cccccc', marginBottom: 20, justifyContent: 'center', alignItems: 'center', height: 48, alignSelf: 'center'}}>
            <Image source={GoggleIcon} style={{width: 24, height: 25, marginRight: 12}} />
            <Text style={{fontFamily: 'NunitoSans-Regular'}}>Sign in with google</Text>
          </View> */}
          <Text style={{fontFamily: 'NunitoSans-Regular', marginTop: 10}}>v.{packageJson.version}</Text>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Login;
