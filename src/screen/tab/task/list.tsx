import {RouteProp, useIsFocused, useNavigation} from '@react-navigation/core';
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
  Dimensions,
} from 'react-native';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import 'moment/locale/id';
import {StackNavigationProp} from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'date-fns';
import Loading from '../../../components/loading';
import {RootStackParamList, Stacks} from '../../../../route/shared';
import SearchInput from '../../../components/InputTextSearch';
import {ENDPOINT_LIVE} from '@env';
import {baseUrl, request} from '../../../Api';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcons from 'react-native-vector-icons/Ionicons'

interface Props {
  navigation: StackNavigationProp<RootStackParamList, Stacks.Tab>;
}

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const Schedule: FC<Props> = ({navigation, route}: any) => {
  const [idBoard, setIdBoard] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [data, setData] = useState<any>([]);
  const [defaultData, setDefaultData] = useState<any>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('To Do');

  const menuLabel = [
    {
      id: 0,
      name: 'To Do',
    },
    {
      id: 1,
      name: 'On Progress',
    },
    {
      id: 2,
      name: 'Resolved',
    },
    {
      id: 3,
      name: 'Done',
    },
  ];

  const content = [
    {
      id: 0,
      title: 'Error',
      due: '00 00 0000',
      division: 'Error',
      taskName: 'Error',
      description:
        'Lorem ipsum dolor sir ametLorem ipsum dolor sir ametLorem ipsum...',
      taskNum: '0',
      late: '0',
    },
  ];

  const switchColor = (id: number, data: any) => {
    setSelectedLabel(data);
    if (id == 0) {
      getData(data);
      setIdBoard(id);
    } else if (id == 1) {
      getData(data);
      setIdBoard(id);
    } else if (id == 2) {
      getData(data);
      setIdBoard(id);
    } else if (id == 3) {
      getData(data);
      setIdBoard(id);
    }
  };

  const mainMenu = (data: any) => {
    return data.map((item: any, id: number) => (
      <TouchableOpacity
        onPress={() => switchColor(id, item.name)}
        style={{
          paddingHorizontal: 20,
          height: 38,
          backgroundColor: idBoard == id ? '#32D185' : '#FFF',
          borderWidth: 1,
          borderColor: idBoard == id ? '#4BA67B' : '#E5E5E5',
          borderRadius: 16,
          marginLeft: 8,
          marginRight: id == 3 ? 8 : 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'NunitoSans-Bold',
            color: idBoard == id ? '#FFF' : '#5F6368',
          }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    ));
  };

  const diffDate = (date: any) => {
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
      <View
        style={{flex: 1, height: deviceHeight / 2, justifyContent: 'center'}}>
        {loading ? (
          <Text>Getting Data ...</Text>
        ) : (
          <Text>No Data to Display</Text>
        )}
      </View>
    );
  };

  const errorServer = () => {
    return (
      <View
        style={{flex: 1, height: deviceHeight / 2, justifyContent: 'center'}}>
        <Text>Server Error</Text>
      </View>
    );
  };

  const taskCard = (data: any) => {
    if (data.length === 0) {
      return (
        <View>
          <Text>Data Kosong</Text>
        </View>
      );
    }
    return data?.map((item: any) => (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => navigation.navigate(Stacks.DetailTask, {id: item.id})}
          style={{
            width: 370,
            padding: 15,
            borderRadius: 10,
            backgroundColor: '#FFF',
            marginBottom: 10,
            borderWidth: 1,
            borderColor: '#DEE2E6',
          }}>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'NunitoSans-Bold',
                color: '#555',
              }}>
              ID: {item.id}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'NunitoSans-Light',
                color: '#555',
              }}>
              Due: {moment(item.times.scheduleEnd).format('DD MMM YYYY')}
            </Text>
          </View>
          <View
            style={{
              width: '90%',
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginBottom: 12
            }}>
            {item?.detail?.tags.map((label: any) => (
              <View
                style={{
                  backgroundColor: label.taskTagColor,
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
                    color: label.taskTagTextColor,
                  }}>
                  {label.taskTagName}
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
              {item.taskName.toUpperCase()}
            </Text>
            <View style={{marginVertical: 12}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'NunitoSans-Light',
                  color: '#555',
                }}>
                {item.taskDescription}
              </Text>
            </View>
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
              name="briefcase-outline"
              size={16}
              color="#ADB5BD"
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'NunitoSans-Regular',
                color: '#C4C4C4',
                paddingHorizontal: 5,
              }}
              numberOfLines={1}>
              {item.detail?.workers?.length}
            </Text>
            {/* <MaterialCommunity name="attachment" size={16} color="#ADB5BD" />
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'NunitoSans-Regular',
                color: '#C4C4C4',
                paddingHorizontal: 10,
              }}
              numberOfLines={1}>
              {item.attachment}
            </Text> */}
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
          <View style={{paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', marginTop: 10}}>

            {item.workers.slice(0, 3).map((value, id) => (
              <View key={id}>
                {value?.profileImage ?
                  <Image
                    source={{uri: `${baseUrl}user/profileImage/${value.profileImage}`}} 
                    style={{width: 34, height: 34, borderRadius: 100, zIndex: -id+10, marginLeft: id == 0 ? 0 : -(id+10)}}
                  />
                  :
                  <IonIcons name='person-circle' size={39} style={{zIndex: -id+10, marginLeft: id == 0 ? 0 : -(id+10)}} color='#4BA67B'/>
                }
              </View>
            ))}
            {item?.workers?.length > 3 && <Text style={{fontFamily: 'NunitoSans-Regular', marginLeft: 5}}>and {item.workers?.length - 3} others</Text>}
          </View>
        </TouchableOpacity>
      </View>
    ));
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    getData(selectedLabel);
  }, [isFocused, selectedLabel]);

  const getData = async (data: any) => {
    setKeyword('');
    const content: any =
      data == 'Resolved'
        ? 'resolved'
        : data == 'To Do'
        ? 'todo'
        : data == 'On Progress'
        ? 'inProgress'
        : data.toLowerCase();
    setLoading(true);
    try {
      const res = await request.get(`mobile/work/${route.params.id}/${content}`);
      if (res) {
        setTimeout(() => {
          setErrors(null);
          setLoading(false);
          setData(res.data.data);
          setDefaultData(res.data.data);
        }, 1000);
      }
    } catch (err: any) {
      await setTimeout(() => {
        setLoading(false);
        setErrors(err.response.data.message);
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

  function FocusAwareStatusBar({props}: any) {
    const isFocused = useIsFocused();

    return isFocused ? (
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" {...props} />
    ) : null;
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F2F6F8'}}>
      {loading ? <Loading /> : null}
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="#52B788" />
      <View style={{height: 60, backgroundColor: '#FFF'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 10,
            justifyContent: 'space-between',
            width: '90%',
          }}>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <MaterialIcon
              onPress={() => navigation.goBack()}
              name="arrow-back"
              size={23}
              color="#ADB5BD"
            />
            <Text
              style={{
                fontSize: 24,
                fontFamily: 'NunitoSans-Bold',
                color: '#000',
                marginLeft: 15
              }}>
              {route.params.name}
            </Text>
          </View>
          {/* <View>
            <MaterialCommunity
              onPress={() => navigation.navigate(Stacks.History)}
              name="history"
              size={24}
              color="#ADB5BD"
            />
          </View> */}
        </View>
      </View>
      <View
        style={{
          height: 50,
          marginVertical: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            height: 50,
            width: undefined,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {mainMenu(menuLabel)}
        </ScrollView>
      </View>
      <View
        style={{
          width: '100%',
          borderBottomWidth: 1.5,
          borderBottomColor: '#DEE4E5',
        }}
      />
      <View style={{width: 370, marginVertical: 20, alignSelf: 'center'}}>
        <SearchInput
          onChangeText={(val: any) => setKeyword(val)}
          value={keyword}
          name="search"
          placeholder="Search Here"
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          width: '95%',
          height: undefined,
          alignItems: 'center',
          alignSelf: 'center',
          paddingBottom: 35,
        }}>
        {errors ? errorComponent() : taskCard(DataList)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Schedule;
