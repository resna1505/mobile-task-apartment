import {RouteProp, useNavigation} from '@react-navigation/core';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import 'moment/locale/en-gb';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, Stacks} from '../../../../../route/shared';
import axios from 'axios';
import Loading from '../../../../components/loading';
import {format} from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SearchInput from '../../../../components/InputTextSearch';
import {ENDPOINT_LIVE} from '@env';
import {baseUrl} from '../../../../Api';

const user1 = require('../../../../../assets/image/User1.png');
const user2 = require('../../../../../assets/image/User2.png');
const user3 = require('../../../../../assets/image/User3.png');

interface Props {
  navigation: StackNavigationProp<RootStackParamList, Stacks.Tab>;
  // route: RouteProp<
  //   {params: {id: number; firstName: any; lastName: any; type: any}},
  //   'params'
  // >;
}

const History: FC<Props> = ({navigation, route}: any) => {
  const [idBoard, setIdBoard] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [data, setData] = useState<any>([]);
  const [keyword, setKeyword] = useState('');
  const [selectDate, setSelectDate] = useState(
    moment().locale('en').format('YYYY-MM-DD'),
    // format(new Date(new Date().toLocaleString().split('-')[0]), 'yyyy-MM-dd'),
  );

  const menuLabel = [
    {
      id: 0,
      name: 'To Do List',
    },
    {
      id: 1,
      name: 'In Progress',
    },
    // {
    //   id: 2,
    //   name: 'Resolve',
    // },
    {
      id: 2,
      name: 'In Review',
    },
    {
      id: 3,
      name: 'Closed',
    },
  ];

  const content = [
    {
      id: 0,
      taskNumber: 'Error',
      due: '00 00 0000',
      label: [
        {id: 0, labelName: 'Error'},
        {id: 1, labelName: 'Error'},
      ],
      users: [
        {profileImages: user1},
        {profileImages: user1},
        {profileImages: user1},
      ],
      taskName: 'Error',
      taskDescription:
        'Lorem ipsum dolor sir ametLorem ipsum dolor sir ametLorem ipsum...',
      comment: '0',
      attachment: '0',
      late: '0',
    },
    // {
    //   id: 1,
    //   title: 'U322',
    //   due: '15 Jan 2020',
    //   division: 'Operations',
    //   taskName: 'Task Name here',
    //   description:
    //     'Lorem ipsum dolor sir ametLorem ipsum dolor sir ametLorem ipsum...',
    //   taskNum: '2',
    //   late: '3',
    // },
    // {
    //   id: 2,
    //   title: 'U323',
    //   due: '15 Jan 2020',
    //   division: 'Operations',
    //   taskName: 'Task Name here',
    //   description:
    //     'Lorem ipsum dolor sir ametLorem ipsum dolor sir ametLorem ipsum...',
    //   taskNum: '2',
    //   late: '2',
    // },
    // {
    //   id: 3,
    //   title: 'U324',
    //   due: '15 Jan 2020',
    //   division: 'Operations',
    //   taskName: 'Task Name here',
    //   description:
    //     'Lorem ipsum dolor sir ametLorem ipsum dolor sir ametLorem ipsum...',
    //   taskNum: '2',
    //   late: '2',
    // },
  ];

  const onDateSelected = async (selectedDate: any) => {
    const datePost = await selectedDate.format().toString().split('T')[0];
    setSelectDate(datePost);
    getData(datePost);
  };

  const diffDate = (date: any) => {
    // const dateNow: any =
    // format(
    //   new Date(new Date().toLocaleString().split('-')[0]),
    //   'yyyy-MM-dd',
    // );
    let datenow = moment();
    let datedue = moment(date);
    let diff = moment.duration(datenow.diff(datedue));
    if (diff.asDays() > 0) {
      return diff.asDays().toString().split('.')[0];
    } else {
      return 0;
    }
  };

  const errorComponent = () => {
    return (
      <View style={{flex: 1}}>
        {loading ? (
          <Text>Getting Data ...</Text>
        ) : (
          <Text>No Data to Display</Text>
        )}
      </View>
    );
  };

  const taskCard = (data: any) => {
    return data?.map((item: any) => (
      <View style={{flexDirection: 'row'}}>
        <View style={{alignItems: 'center', marginRight: 25}}>
          <View style={{width: 1, height: 12, backgroundColor: '#C4C4C4'}} />
          <View
            style={{
              width: 15,
              height: 15,
              borderRadius: 100,
              backgroundColor: '#52B788',
            }}
          />
          <View style={{width: 1, height: 225, backgroundColor: '#C4C4C4'}} />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate(Stacks.DetailTask, {id: item.id})}
          style={{
            height: 237,
            width: 315,
            borderRadius: 10,
            backgroundColor: '#FFF',
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'NunitoSans-Bold',
                color: '#555',
              }}>
              {item.taskCode}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'NunitoSans-Light',
                color: '#555',
              }}>
              Due: {moment(item.due).locale('en').format('DD MMM YYYY')}
            </Text>
          </View>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            {item?.taskTags.map((label: any) => (
              <View
                style={{
                  backgroundColor: label.taskTag.taskTagColor,
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  borderWidth: 1,
                  paddingVertical: 2,
                  borderRadius: 50,
                  paddingHorizontal: 5,
                  marginRight: 5,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Lato-Bold',
                    color: label.taskTag.taskTagTextColor,
                  }}>
                  {label.taskTag.taskTagName}
                </Text>
              </View>
            ))}
          </View>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              justifyContent: 'flex-start',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'NunitoSans-Bold',
                color: '#000',
              }}>
              {item.taskName}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'NunitoSans-Light',
                color: '#555',
              }}>
              {item.taskDescription}
            </Text>
          </View>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-start',
            }}>
            <MaterialCommunity
              name="comment-outline"
              size={16}
              color="#ADB5BD"
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'NunitoSans-Regular',
                color: '#C4C4C4',
                paddingHorizontal: 10,
              }}
              numberOfLines={1}>
              {item.comment}
            </Text>
            <MaterialCommunity name="attachment" size={16} color="#ADB5BD" />
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'NunitoSans-Regular',
                color: '#C4C4C4',
                paddingHorizontal: 10,
              }}
              numberOfLines={1}>
              {item.attachment}
            </Text>
            {diffDate(item.due) !== 0 ? (
              <View
                style={{
                  backgroundColor: '#FF5F57',
                  flexDirection: 'row',
                  borderRadius: 50,
                  paddingHorizontal: 10,
                }}>
                <MaterialCommunity
                  name="alert-outline"
                  size={16}
                  color="#FFF"
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Lato-Bold',
                    color: '#FFF',
                    marginLeft: 5,
                  }}>
                  Late: {diffDate(item.due)} Days
                </Text>
              </View>
            ) : null}
          </View>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingBottom: 5,
            }}>
            <View style={{flexDirection: 'row'}}>
              {item.taskWorkers.length > 0 && (
                <Image
                  source={{
                    // require (images)
                    uri: `${baseUrl}files/${item.taskWorkers[0].user.profileImage}`,
                  }}
                  style={{height: 24, width: 24, zIndex: 10, borderRadius: 100}}
                />
              )}
              {item.taskWorkers.length > 1 && (
                <Image
                  source={{
                    // require (images)
                    uri: `${baseUrl}files/${item.taskWorkers[1].user.profileImage}`,
                  }}
                  style={{height: 24, width: 24, zIndex: 10, borderRadius: 100}}
                />
              )}
              {item.taskWorkers.length > 2 && (
                <Image
                  source={{
                    // require (images)
                    uri: `${baseUrl}files/${item.taskWorkers[2].user.profileImage}`,
                  }}
                  style={{height: 24, width: 24, zIndex: 10, borderRadius: 100}}
                />
              )}
            </View>
            {item.taskWorkers.length > 3 && (
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'NunitoSans-Regular',
                  color: '#000',
                  paddingLeft: 10,
                }}>
                and {item.taskWorkers.length - 3} others
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    ));
  };

  useEffect(() => {
    getData(selectDate);
  }, []);

  const getData = async (dates: any) => {
    const token: any = await AsyncStorage.getItem('access_token');
    console.log('get data', dates);
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}task/mobile/history/${dates}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res) {
        setLoading(false);
        setData(res.data.data);
      }
    } catch (err: any) {
      await setTimeout(() => {
        setLoading(false);
        setErrors(err.response.data.message);
        console.log('errror home', {...err});
        if (err?.response.status == 404) {
          ToastAndroid.show(err?.message, ToastAndroid.SHORT);
          // setErrors(err);
        } else if (err?.response.status == 503) {
          ToastAndroid.show(err?.message, ToastAndroid.SHORT);
          // setErrors(err);
        }
        // else {
        //   ToastAndroid.show( err?.response.status.toString(), ToastAndroid.SHORT);
        // }
      }, 1500);
    }
  };

  const DataList = useMemo(() => {
    if (keyword !== null && keyword !== '') {
      return data.filter((e: any) =>
        e.taskName.toLowerCase().includes(keyword.toLowerCase()),
      );
    }
    return data;
  }, [data, keyword]);

  // const dateNow: any = format(
  //   new Date(new Date().toLocaleString().split('-')[0]),
  //   'yyyy-MM-dd',
  // );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F2F6F8'}}>
      {loading ? <Loading /> : null}
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />

      <View
        style={{
          height: 150,
          backgroundColor: '#FFF',
          borderBottomWidth: 1,
          borderBottomColor: '#DEE4E5',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 30,
            justifyContent: 'space-between',
            width: '85%',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcon
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={23}
              color="#ADB5BD"
            />
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'NunitoSans-Bold',
                color: '#000',
                marginLeft: 28,
              }}>
              Task History
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'NunitoSans-Regular',
                color: '#6C757D',
                marginRight: 7,
              }}>
              This Month
            </Text>
            <MaterialCommunity
              name="calendar-range-outline"
              size={24}
              color="#ADB5BD"
            />
          </View>
        </View>
        <View>
          <CalendarStrip
            style={{
              height: 100,
            }}
            highlightDateNumberStyle={{color: '#FFF'}}
            highlightDateNameStyle={{color: '#FFF'}}
            iconLeft={false}
            iconRight={false}
            scrollerPaging={true}
            daySelectionAnimation={{
              type: 'background',
              duration: 200,
              highlightColor: '#32D185',
            }}
            scrollable={true}
            useNativeDriver={true}
            showMonth={false}
            selectedDate={selectDate}
            startingDate={moment().locale('en').format('YYYY-MM-DD')}
            onDateSelected={onDateSelected}
            scrollToOnSetSelectedDate={true}
          />
        </View>
      </View>
      <View
        style={{
          height: 50,
          marginVertical: 20,
          justifyContent: 'center',
        }}>
        <View style={{width: '90%', marginVertical: 20, alignSelf: 'center'}}>
          <SearchInput
            onChangeText={(val: any) => setKeyword(val)}
            value={keyword}
            name="search"
            placeholder="Search Here"
          />
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          width: '95%',
          height: undefined,
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 15,
          paddingBottom: 35,
        }}>
        {data.length < 1
          ? errorComponent()
          : taskCard(errors ? content : DataList)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default History;
