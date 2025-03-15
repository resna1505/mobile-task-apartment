import axios from 'axios';
import {ENDPOINT_LIVE} from '@env';
import {Keyboard, ToastAndroid} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {ERROR, ISLOGIN, LOADING} from '../reducer/auth/case';
import { useDispatch } from 'react-redux';

export const fetchLogin = async (email: any, password: any) => {
    // const dispatch = useDispatch();
    // const navigation = useNavigation();
    // return async dispatch => {
    // Keyboard.dismiss();
    // dispatch({type: LOADING, loading: true});
    try {
      const res = await axios.post(`${ENDPOINT_LIVE}auth/mobile/login`, {
        email: email,
        password: password,
      });
      if (res) {
        setTimeout(() => {
        //   navigation.replace('Tab', {
        //     screen: 'Home',
        //     params: {
        //       firstName: res.data.firstName,
        //       lastName: res.data.lastName,
        //       id: res.data.id,
        //       type: res.data.type,
        //     },
        //   });
        //   dispatch({type: LOADING, loading: false});
        }, 1500);
      }
    } catch (err: any) {
      await setTimeout(() => {
        // dispatch({type: LOADING, loading: false});
        if (err?.response.data?.status == 401) {
        //   dispatch({type: ERROR, error: err.response.data.message});
        } else {
          ToastAndroid.show('Server Error', ToastAndroid.SHORT);
        }
      }, 500);
    }
//   };
};
