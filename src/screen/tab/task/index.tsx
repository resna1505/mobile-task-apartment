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
import * as Progress from 'react-native-progress';


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
  const [selectedLabel, setSelectedLabel] = useState('');

  const menuLabel = [
    {
      id: 0,
      name: 'All',
    },
    {
      id: 2,
      name: 'Open',
    },
    {
      id: 1,
      name: 'On Progress',
    },
    {
      id: 3,
      name: 'Done',
    },
    {
      id: 4,
      name: 'Overdue',
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
    }else if (id == 4) {
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

  const board = (data: any) => {
    if (data.length === 0) {
      return (
        <View style={{alignItems: 'center', marginVertical: 15}}>
          <Text>Data Empty</Text>
        </View>
      );
    }
    return data
      .map((item: any) => ({
        boardName: item.workName,
        due: item.scheduleEnd,
        percentage: item.totalTaskCompleted == 0 ? 0 : Math.round((item.totalTaskCompleted / item.totalTask) * 100),
        tasks: item.totalTask,
        id: item.id,
        workCode: item.workCode
      }))
      .map((item: any, index: number) => (
        <TouchableOpacity
          onPress={() => navigation.navigate(Stacks.List, {id: item.id, name: item.boardName})}
          key={index}
          style={{
            width: '95%',
            height: 102,
            backgroundColor: '#FFF',
            paddingVertical: 5,
            paddingHorizontal: 10,
            elevation: 2,
            borderWidth: 0.5,
            borderColor: '#DEE2E6',
            borderRadius: 10,
            marginBottom: 10,
            justifyContent: 'space-around',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '95%',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'NunitoSans-Bold',
                color: '#555',
                width: '50%',
              }}
              numberOfLines={1}>
              {item.boardName}
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontFamily: 'NunitoSans-Light',
                color: '#555',
                width: '50%',
                textAlign: 'right',
              }}
              numberOfLines={1}>
              Due: {moment(item.due).locale('en').format('DD MMM YYYY')}
            </Text>
          </View>
          <View style={{width: '100%'}}>
            <Progress.Bar
              progress={item.percentage / 100}
              width={null}
              // style={{}}
              borderWidth={0}
              color="#52B788"
              unfilledColor="#CED4DA"
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '95%',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'NunitoSans-Light',
                color: '#555',
                width: '70%',
              }}
              numberOfLines={1}>
              ID: {item.workCode}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '25%',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'NunitoSans-Bold',
                  color: '#52B788',
                }}
                numberOfLines={1}>
                {item.percentage}%
              </Text>
              <MaterialCommunity
                name="briefcase-outline"
                size={20}
                color="#ADB5BD"
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'NunitoSans-Regular',
                  color: '#C4C4C4',
                }}
                numberOfLines={1}>
                {item.tasks}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ));
    };

  const isFocused = useIsFocused();
  useEffect(() => {
    getData(selectedLabel);
  }, [isFocused, selectedLabel]);

  const getData = async (data: any) => {
    setKeyword('');
    const content: any =
      data == 'All'
        ? ''
        : data == 'On Progress'
        ? 'onGoing'
        : data.toLowerCase();
    setLoading(true);
    try {
      const res = await request.get(`mobile/work/${content}`);
      if (res) {
        setTimeout(() => {
          setErrors(null);
          setLoading(false);
          setData(res.data.data);
          setDefaultData(res.data.data);
        }, 500);
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
        e.workName.toLowerCase().includes(keyword.toLowerCase()),
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
          <View>
            <Text
              style={{
                fontSize: 24,
                fontFamily: 'NunitoSans-Bold',
                color: '#000',
              }}>
              My Work
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
        {errors ? errorComponent() : board(DataList)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Schedule;
