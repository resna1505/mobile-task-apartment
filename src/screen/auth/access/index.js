import axios from 'axios';
import React, {useState, FC, useRef, useEffect} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {request} from '../../../Api';
import  {store} from '../../../../states/store'
import Icon from 'react-native-vector-icons/SimpleLineIcons';

// Images
const MainImage = require('../../../../assets/image/TaskManagement.png');
const GoggleIcon = require('../../../../assets/image/Google-icon.png')



// Styling
import {AccessStyle} from './styles';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {RootStackParamList, Stacks} from '../../../../route/shared';
// import {RouteProp} from '@react-navigation/core';
// import {request} from '../../../Api';
import { useDispatch } from 'react-redux';
import { TOKEN } from '../../../../states/reducer/auth/case';


const Access: FC<Props> = ({navigation, route}) => {
  // const navigation = useNavigation();
  // const dispatch = useDispatch();
  // const [email, setEmail] = useState('');
  // const [validate, setValidate] = useState(false);
  // const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [bm, setBm] = useState([]);

  useEffect(() => {
    getRoles()
  }, []);

  const getRoles = async () => {
    const url = 'auth/mobile/roles';
    try {
      const res = await request.get(url, {
        Authorization: 'Bearer ' + store.getState().auth.token,
      });
      if (res) {
        console.log(res.data)
        setBm(res.data.bm)
      }
    } catch (error) {
      console.log(error, 'error');
    } finally {
      // setLoading(false);
    }
  };

  const sumbitAccess = async (id) => {
    const url = `auth/mobile/login/bm/${id}`;
    try {
      const res = await request.get(url, {
        Authorization: 'Bearer ' + store.getState().auth.token,
      });
      if (res) {
        console.log(res.data)
        await AsyncStorage.setItem('access_token', res.data.accessToken);
        await authMe(res.data.accessToken);
      }
    } catch (error) {
      console.log(error, 'error');
      if(error.response.data.error){
        ToastAndroid.show(error.response.data.error, ToastAndroid.SHORT)
      }
    } finally {
      // setLoading(false);
    }
  };

  const authMe = async (token) => {
    const url = 'auth/mobile/me';
    try {
      const res = await request.get(url, {
        Authorization: 'Bearer ' + token,
      });
      if (res) {
        console.log(res.data);
        dispatch({type: TOKEN, token: token});
        navigation.replace('Tab', {
          screen: 'Home',
          params: {
            firstName: res.data.firstName || res.data.email,
            lastName: res.data.lastName,
            id: res.data.id,
          },
        });
      }
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.setItem('access_token', '')
    navigation.replace('Login')
  }
  
  return (
    <KeyboardAvoidingView behavior="padding" style={AccessStyle.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={AccessStyle.MainWrapper}>
        <Text style={{fontFamily: 'NunitoSans-Light', fontSize: 24, color: '#FFF', marginBottom: 24}}>Properties</Text>
        {bm.map(value => (
          <TouchableOpacity 
            key={value.id} style={AccessStyle.CardAccess}
            onPress={() => sumbitAccess(value.domain.id)}
          >
            {value.domain.domainLogo ? 
              <Image source={{uri: `https://incom-api.dev001.incom.id/domain/files/${value.domain.domainLogo}`}} style={AccessStyle.ImageCard}/>
              :
              <Image source={{uri: `https://incom-api.dev001.incom.id/image/domainGroupDefault.png`}} style={AccessStyle.ImageCard}/>
            }
            <View style={{flex: 1}}>
              <Text style={{fontFamily: 'NunitoSans-Bold', fontSize: 15}}>{value.domain.domainName}</Text>
              <View style={{flexDirection: 'row', marginTop: 8}}>
                <View 
                  style={{
                    paddingRight: 8,
                    borderRightWidth: 1,
                    borderColor: '#cccccc',
                    alignSelf: 'flex-start',
                    marginRight: 8
                  }}
                >
                  <Text style={{color: '#6C757D', fontFamily: 'NunitoSans-Light', fontSize: 12}}>{value.domain.domainGroup?.domainGroupName}</Text>
                </View>
                <Text style={{color: '#6C757D', fontFamily: 'NunitoSans-Light', fontSize: 12}}>{value.units} Units</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={() => logout()}
          style={{
            backgroundColor: '#FFF', 
            height: 32, 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            alignSelf: 'center',
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 50,
            position: 'absolute',
            bottom: 40
          }}
        >
          <Icon name='logout'/>
          <Text style={{fontFamily: 'NunitoSans-Bold', color: '#495057', fontSize: 16, marginLeft: 10}}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Access;
