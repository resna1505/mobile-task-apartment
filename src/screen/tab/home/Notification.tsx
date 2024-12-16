import {
  useNavigation,
} from '@react-navigation/core';
import React, {FC, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import moment from 'moment';
import {request, baseUrl} from '../../../Api';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Stacks } from '../../../../route/shared';
import axios from 'axios';
import { store } from '../../../../states/store';

// Config
const imageMain = require('../../../../assets/image/ImageMain.png');

const deviceWidth = Dimensions.get('window').width;

const Notification: FC<Props> = ({route}: any) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const url = 'notification/mobile';
    setLoading(true);
    try {
      const res = await request.get(url);
      console.log(res, 'xxx')
      setData(res.data.data.reverse())
    } catch (err: any) {
     
    }
  };

  const readNotif = async (val: any, type: any) => {
    const url = `${baseUrl}mobile/notification/${val.id}/read`;
    try {
      const res = await axios.patch(
        url,
        {
          status: val,
        },
        {
          headers: {
            Authorization: 'Bearer ' + store.getState().auth.token,
          },
        },
      );
      if (res) {
        if(type == 'change'){
          navigation.navigate(Stacks.DetailTask, {id: val.notificationData.taskId})
        } else {
          navigation.navigate(Stacks.Task)
        }
      }
    } catch (error) {
      if(type == 'change'){
        navigation.navigate(Stacks.DetailTask, {id: val.notificationData.taskId})
      } else {
        navigation.navigate(Stacks.Task)
      }
      console.log(error, 'error');
    }
  };

  // const readNotif = async (value) => {
  //   const url = `mobile/${value.id}/read`;
  //   try {
  //     const res = await request.patch(url);
  //     console.log(res, 'terbaca')
  //     // setData(res.data.data.reverse())
  //     navigation.navigate(Stacks.DetailTask, {id: value.notificationData.taskId})
  //   } catch (err: any) {
     
  //   }
  // };

  return (
    <View style={{flex: 1, backgroundColor: '#FFF', paddingTop: 10}}>
      <StatusBar backgroundColor={'#FFF'} barStyle={'dark-content'}/>
      <View style={{flexDirection: 'row', paddingLeft: 24}}>
        <MaterialIcon name='arrow-left' size={20} style={{marginRight: 20}} onPress={() => navigation.goBack()}/>
        <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>Notification</Text>
      </View>
     <ScrollView showsVerticalScrollIndicator={false}>
        {data.map(value => (
          <TouchableOpacity style={{
              borderBottomWidth: 0.5, 
              borderBottomColor: '#c4c4c4', 
              paddingHorizontal: 24, 
              paddingVertical: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            onPress={() => readNotif(value, value.notificationData.taskId ? 'change' : 'work')}
          >
            <View style={{flex: 1, paddingRight: 10}}>
              <Text allowFontScaling={false} style={{fontSize: 13, fontWeight: 'bold', color: value?.notificationUsers[0]?.readStatusMobile ? '#6c757d' : '#000000', fontFamily: 'NunitoSans-Regular'}}>{value.notificationTitle}</Text>
              <Text allowFontScaling={false} style={{color:'#CED4DA', fontSize: 13}}>{value.notificationDescription}</Text>
            </View>
            <Text allowFontScaling={false} style={{color:'#CED4DA', fontSize: 10}}>{moment(value.createdAt).startOf('seconds').fromNow()}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
};

export default Notification;
