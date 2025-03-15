import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
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
  RefreshControl
} from 'react-native';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';
import axios from 'axios';
import {format} from 'date-fns';

import Loading from '../../../components/loading';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, Stacks} from '../../../../route/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {ENDPOINT_LIVE} from '@env';
import {request} from '../../../Api';
import  {store} from '../../../../states/store'

// Config
const imageMain = require('../../../../assets/image/ImageMain.png');

const deviceWidth = Dimensions.get('window').width;

interface Props {
  navigation: StackNavigationProp<RootStackParamList, Stacks.Tab>;
  // route: RouteProp<
  //   {params: {id: number; firstName: any; lastName: any; type: any}},
  //   'params'
  // >;
}

const Home: FC<Props> = ({route}: any) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState()
  const [work, setWork] = useState()
  const [boardData, setBoardData] = useState([]);
  const [activitiesData, setActivitiesData] = useState([]);
  const [errors, setErrors] = useState(null);
  const [refreshing, setRefresh] = useState(false)
  const [dataProfile, setDataProfile] = useState({})

  const {firstName, lastName, id} = route.params;

  useEffect(() => {
    getData();
    authMe();
  }, []);

  const authMe = async () => {
    setLoading(true)
    const url = 'auth/mobile/me';
    try {
      const res = await request.get(url, {
        Authorization: 'Bearer ' + store.getState().auth.token,
      });
      if (res) {
        setDataProfile(res.data)
      }
    } catch (error) {
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  const getData = async () => {
    const url = 'mobile';
    setLoading(true);
    try {
      const res = await request.get(url);
      if (res) {
        setLoading(false);
        setRefresh(false)
        setTask(res.data.task);
        setWork(res.data.work);
        setBoardData(res.data.work);
        setActivitiesData(res.data.activities);
      }
    } catch (err: any) {
      await setTimeout(() => {
        // setLoading(false);
        setRefresh(false)
        if (err?.response.status == 404) {
          ToastAndroid.show(err?.message, ToastAndroid.SHORT);
          setErrors(err);
        } else if (err?.response.status == 503) {
          ToastAndroid.show(err?.message, ToastAndroid.SHORT);
          setErrors(err);
        } else {
          ToastAndroid.show(
            JSON.stringify(err.response.data),
            ToastAndroid.SHORT,
          );
        }
      }, 500);
    }
  };

  const onRefresh = () => {
    setRefresh(true)
    getData()
    authMe()
  }

  function FocusAwareStatusBar({props}: any) {
    const isFocused = useIsFocused();

    return isFocused ? (
      <StatusBar
        backgroundColor="#52B788"
        barStyle="light-content"
        {...props}
      />
    ) : null;
  }
 
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F8F9FA'}}>
      {/* <StatusBar backgroundColor="#52B788" barStyle="light-content" /> */}
      <FocusAwareStatusBar />
      {loading ? <Loading /> : null}

      <View style={{flex: 1}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <View
            style={{
              width: '100%',
              height: 290,
              backgroundColor: '#3F916C',
              // color:'3F916C'
            }}>
            <View
              style={{
                height: 290,
                backgroundColor: '#52B788',
                borderBottomRightRadius: 300,
              }}>
              <View
                style={{
                  // flex: 1,
                  height: 100,
                  marginTop: 40,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '85%',
                  alignSelf: 'center',
                  alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MaterialCommunity
                    name="record-circle"
                    size={24}
                    color="#FFFFFF"
                    style={{marginRight: 15}}
                  />
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: 'Maison-Neue-Bold',
                      color: '#FFF',
                    }}>
                    INCOM
                  </Text>
                </View>
                <View>
                  {dataProfile.mobileNotification > 0 ?
                    <View 
                      style={{
                        width: 18, 
                        height: 18, 
                        borderRadius: 100, 
                        backgroundColor: 'red',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'absolute',
                        zIndex: 10,
                        top: -8,
                        right: -5
                      }}
                    >
                      <Text style={{color:'#FFF', fontSize: 15}}>{dataProfile.mobileNotification}</Text>
                    </View>
                    :
                    <></>
                  }
                  <MaterialCommunity
                    name="bell-outline"
                    size={24}
                    color="#FFFFFF"
                    onPress={() => navigation.navigate('Notification')}
                  />
                </View>
              </View>
              <View style={{flex: 1, width: '85%', paddingLeft: 27}}>
                <View style={{width: '90%', alignItems: 'flex-start'}}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'NunitoSans-Light',
                      color: '#FFF',
                    }}>
                    Royale Springhill, Kemayoran, Jakarta Utara
                  </Text>
                </View>
                <View style={{alignItems: 'flex-start'}}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: 'NunitoSans-Bold',
                      color: '#FFF',
                    }}
                    numberOfLines={1}>
                    Welcome, {firstName} {lastName}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* =========== WORK ========= */}
          <View style={{alignItems: 'center', top: -60}}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                width: '85%',
                height: 120,
                elevation: 5,
              }}>
              <View
                style={{
                  width: '90%',
                  height: 50,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'NunitoSans-Bold',
                    color: '#555555',
                  }}>
                  Ongoing Work
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'NunitoSans-Light',
                    color: '#6C757D',
                  }}>
                  {
                    moment().locale('en').format('DD MMM YYYY')
                  }
                </Text>
              </View>
              <View
                style={{
                  width: '95%',
                  alignSelf: 'center',
                  height: 50,
                  paddingLeft: 10,
                  paddingRight: 10,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}
                // onPress={() => Alert.alert("Note", "Fitur ini akan segera hadir")}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: 'NunitoSans-Bold',
                      color: '#52B788',
                      textAlign: 'center',
                    }}>
                    {work?.open}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'NunitoSans-Light',
                      color: '#555',
                    }}>
                    Open
                  </Text>
                </View>
                <View
                  style={{
                    width: 10,
                    height: 50,
                    justifyContent: 'center',
                    borderRightWidth: 1,
                    borderColor: '#C4C4C4',
                  }}
                />
                <View>
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: 'NunitoSans-Bold',
                      color: '#52B788',
                      textAlign: 'center',
                    }}>
                    {work?.onprogress}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'NunitoSans-Light',
                      color: '#555',
                    }}>
                    On Progress
                  </Text>
                </View>
                <View
                  style={{
                    width: 10,
                    height: 50,
                    justifyContent: 'center',
                    borderRightWidth: 1,
                    borderColor: '#C4C4C4',
                  }}
                />
                <View>
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: 'NunitoSans-Bold',
                      color: '#52B788',
                      textAlign: 'center',
                    }}>
                    {work?.overdue}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'NunitoSans-Light',
                      color: '#555',
                    }}>
                    Overdue
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/*========= CARD task ========*/}
          <View style={{alignItems: 'center', top: -30}}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                width: '85%',
                height: 120,
                elevation: 5,
              }}>
              <View
                style={{
                  width: '90%',
                  height: 50,
                  alignSelf: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'NunitoSans-Bold',
                    color: '#555555',
                  }}>
                  Ongoing Task
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'NunitoSans-Light',
                    color: '#6C757D',
                  }}>
                  {
                    moment().locale('en').format('DD MMM YYYY')
                  }
                </Text>
              </View>
              <View
                style={{
                  width: '95%',
                  alignSelf: 'center',
                  height: 50,
                  paddingLeft: 10,
                  paddingRight: 10,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}
                // onPress={() => Alert.alert("Note", "Fitur ini akan segera hadir")}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: 'NunitoSans-Bold',
                      color: '#52B788',
                      textAlign: 'center',
                    }}>
                    {task?.todo}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'NunitoSans-Light',
                      color: '#555',
                    }}>
                    To Do
                  </Text>
                </View>
                <View
                  style={{
                    width: 10,
                    height: 50,
                    justifyContent: 'center',
                    borderRightWidth: 1,
                    borderColor: '#C4C4C4',
                  }}
                />
                <View>
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: 'NunitoSans-Bold',
                      color: '#52B788',
                      textAlign: 'center',
                    }}>
                    {task?.onprogress}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'NunitoSans-Light',
                      color: '#555',
                    }}>
                    On Progress
                  </Text>
                </View>
                <View
                  style={{
                    width: 10,
                    height: 50,
                    justifyContent: 'center',
                    borderRightWidth: 1,
                    borderColor: '#C4C4C4',
                  }}
                />
                <View>
                  <Text
                    style={{
                      fontSize: 24,
                      fontFamily: 'NunitoSans-Bold',
                      color: '#52B788',
                      textAlign: 'center',
                    }}>
                    {task?.resolved}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'NunitoSans-Light',
                      color: '#555',
                    }}>
                    Resolved
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;
