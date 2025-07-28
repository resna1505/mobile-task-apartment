import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  StatusBar,
  TextInput,
  ToastAndroid,
  PermissionsAndroid,
  Modal,
  Platform,
} from 'react-native';

import React, {FC, useCallback, useMemo, useState, useEffect, useRef} from 'react';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import StopWatch from 'react-native-vector-icons/Fontisto';
import {StackNavigationProp} from '@react-navigation/stack';
import {useIsFocused} from '@react-navigation/core';
import CheckBox from '@react-native-community/checkbox';
import SlidingUpPanel from 'rn-sliding-up-panel';
import SelectDropdown from 'react-native-select-dropdown';
// Import untuk zoom image yang lebih simple
import ImageViewer from 'react-native-image-zoom-viewer';

import {RootStackParamList, Stacks} from '../../../../../route/shared';
import {useSwipe} from '../../../../components/useSwipe';
import {log, useSharedValue, withTiming, runOnJS} from 'react-native-reanimated';
import {baseUrl, request} from '../../../../Api';
import Loading from '../../../../components/loading';
import moment from 'moment';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {store} from '../../../../../states/store';
import RNFS from 'react-native-fs';
import axios from 'axios';
import RNFetchBlob from 'react-native-blob-util';
import RenderHtml from 'react-native-render-html';

// Device Config
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const {height} = Dimensions.get('window');
const halfScreen = height / 3;
const statusBarHeight = 12;
const topBarHeight = statusBarHeight + 72;

interface Props {
  navigation: StackNavigationProp<RootStackParamList, Stacks.Tab>;
}

const Detail: FC<Props> = ({navigation, route}: any) => {
  const [tabId, setTabId] = useState(0);
  const [panel, setPanel] = useState(false);
  const [checkDrag, setCheckDrag] = useState(false);
  const [statuses, setStatuses] = useState('To Do');
  const [load, setLoad] = useState(false);
  const [data, setData] = useState<any>(undefined);
  const {id} = route.params;
  const [loading, setLoading] = useState(false);
  const [visibleCamera, setVisibleCamera] = useState(false);
  const [slide, setSlide] = useState(false);
  const [checked, setChecked] = useState<any>([
    {
      id: 0,
      isChecked: false,
    },
    {
      id: 1,
      isChecked: false,
    },
    {
      id: 2,
      isChecked: false,
    },
    {
      id: 3,
      isChecked: false,
    },
    {
      id: 4,
      isChecked: true,
    },
    {
      id: 5,
      isChecked: false,
    },
    {
      id: 6,
      isChecked: false,
    },
    {
      id: 7,
      isChecked: false,
    },
    {
      id: 8,
      isChecked: false,
    },
    {
      id: 9,
      isChecked: false,
    },
    {
      id: 10,
      isChecked: false,
    },
  ]);
  const [Comment, setComment] = useState('');
  const [file, setFile] = useState('');
  const [image, setImage] = useState('');
  
  // State untuk zoom image - menggunakan ImageViewer
  const [modalVisible, setModalVisible] = useState(false);
  const [viewImage, setViewImage] = useState('');
  const [imageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  const showImage = (url: any) => {
    // Setup image untuk ImageViewer
    const imageObj = [{
      url: url,
      width: deviceWidth,
      height: 300,
    }];
    setImages(imageObj);
    setImageIndex(0);
    setModalVisible(true);
  };

  const getData = async () => {
    const url = 'mobile/task/' + id;
      
    console.log('resna',url);
    
    try {
      const res = await request.get(url);
      if (res) {
        setData(res.data);
        setStatuses(res.data.taskStatus);
      }
    } catch (error) {
    }
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id, load]);

  function FocusAwareStatusBar({props}: any) {
    const isFocused = useIsFocused();

    return isFocused ? (
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" {...props} />
    ) : null;
  }

  const TabTitle = [
    {
      id: 0,
      title: 'To Do',
    },
    {
      id: 1,
      title: 'Comments',
    },
    {
      id: 2,
      title: 'Attachment',
    },
  ];

  const status = [
    {
      id: 0,
      label: 'To Do',
    },
    {
      id: 1,
      label: 'On Progress',
    },
    {
      id: 2,
      label: 'Resolved',
    },
  ];

  const switchTab = (id: number) => {
    if (id == 0) {
      setTabId(id);
    } else {
      setTabId(id);
    }
  };

  const download = (item: any) => {
    RNFetchBlob.config({
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: false,
        description: 'File downloaded by download manager.',
        indicator: true,
        path: `${RNFS.ExternalStorageDirectoryPath}/Download/${item.taskFileSource}`,
      },
    })
      .fetch('GET', `${baseUrl}taskFile/files/download/${item.taskFileSource}`)
      .then((res) => {});
  };

  const chooseAction = () => {
    setVisibleCamera(!visibleCamera);
  };

  const pickImage = async () => {
    try {
      const res = await launchImageLibrary({
        includeBase64: true,
        mediaType: 'photo',
        quality: 0.5,
      });
      if (res) {
        setImage(res.assets[0]?.uri || '');
        setFile(res.assets[0]?.base64 || '');
        setVisibleCamera(!visibleCamera);
      }
    } catch (error) {
      setVisibleCamera(!visibleCamera);
    }
  };

  const takeCamera = async () => {
    try {
      const res = await launchCamera({
        includeBase64: true,
        mediaType: 'photo',
        quality: 0.5,
      });
      if (res) {
        setImage(res.assets[0]?.uri || '');
        setFile(res.assets[0]?.base64 || '');
        setVisibleCamera(!visibleCamera);
      }
    } catch (error) {
      setVisibleCamera(!visibleCamera);
    }
  };

  const changeChecked = async (item: any, val: any) => {
    setLoading(true);
    const url = `${baseUrl}subTask/changeStatus/${item.id}`;
    
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
        await getData();
      }
    } catch (error) {
      console.log('Error updating checkbox:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (val: any) => {
    const url = `${baseUrl}mobile/task/changeStatus/${id}`;
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
        setLoad(!load);
        getData();
      }
    } catch (error) {
    }
  };

  const submit = async () => {
    if (Comment || file) {
      setLoading(true);
      const url = `mobile/task/comment/${id}`;
      const body = {
        content: Comment,
        attachment: file !== '' ? 'data:image/png;base64,' + file : '',
      };
      try {
        const res = await request.post(url, body);
        if (res) {
          setLoad(!load);
          setComment('');
          setFile('');
          setImage('');
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle pinch gesture untuk zoom - tidak diperlukan lagi karena pakai ImageViewer

  const Tab = (data: any) => {
    return data.map((items: any, id: number) => (
      <TouchableOpacity
        key={id}
        onPress={() => switchTab(id)}
        style={{
          width: deviceWidth / 3,
          backgroundColor: tabId == id ? '#F2F6F8' : '#FFF',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 2,
          borderBottomColor: tabId == id ? '#53B888' : '#FFF',
          zIndex: 10,
        }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'NunitoSans-Bold',
            color: '#555',
          }}>
          {items.title}
        </Text>
      </TouchableOpacity>
    ));
  };

  const SubTask = (data: any) => {
    if (data.length === 0) {
      return (
        <View>
          <Text>Data Kosong</Text>
        </View>
      );
    }
    return data
      .sort((a, b) => a.id - b.id)
      .map((items: any, index: number) => (
        <View
          key={index}
          style={{
            height: 124,
            width: 351,
            justifyContent: 'center',
            backgroundColor: '#FFF',
            borderRadius: 10,
            paddingHorizontal: 15,
            marginBottom: 10,
            elevation: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'NunitoSans-Bold',
                color: '#555',
              }}>
              {items.subTaskName}
            </Text>
            <CheckBox
              tintColors={{true: '#52B788', false: 'rgba(0, 0, 0, 0.5)'}}
              value={items.subTaskStatus}
              onValueChange={(val) => changeChecked(items, val)}
            />
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#CED4DA',
              width: '100%',
              alignSelf: 'center',
              marginBottom: 14,
            }}
          />
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'NunitoSans-Regular',
                color: '#555',
              }}>
              Assigned to {items.subTaskWorkers[0]?.user?.firstName}
              <Text
                style={{
                  fontFamily: 'NunitoSans-Bold',
                }}>
                {items.assignee}
              </Text>
            </Text>
          </View>
        </View>
      ));
  };

  const Discussion = (data: any) => {
    if (data.length === 0) {
      return (
        <View style={{padding: 20, alignItems: 'center'}}>
          <Text style={{color: '#ADB5BD', fontFamily: 'NunitoSans-Regular'}}>Data Kosong</Text>
        </View>
      );
    }
    return data.map((items: any, index: number) => (
      <View
        key={index}
        style={{
          width: '90%',
          justifyContent: 'space-between',
          backgroundColor: '#FFF',
          borderRadius: 10,
          paddingHorizontal: 15,
          marginBottom: 10,
          elevation: 1,
          paddingVertical: 20,
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}>
        <View style={{flex: 1, paddingRight: 8}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 12, fontFamily: 'NunitoSans-Bold'}}>
              {items.user.firstName} {items.user.lastName},{' '}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'NunitoSans-Regular',
                color: '#555',
              }}>
              {moment(items.taskDiscussionTime).format('DD MMM HH:mm')}
            </Text>
          </View>
          <RenderHtml
            contentWidth={deviceWidth - 100}
            source={{
              html: `${items.taskDiscussionContent}`,
            }}
          />
        </View>
        {items.taskDiscussionAttachment ? (
          <TouchableOpacity
            onPress={() =>
              showImage(
                `${baseUrl}taskDiscussion/files/${items.taskDiscussionAttachment}`,
              )
            }>
            <Image
              source={{
                uri: `${baseUrl}taskDiscussion/files/${items.taskDiscussionAttachment}`,
              }}
              style={{
                height: 50,
                width: 50,
                marginTop: 10,
                borderRadius: 8,
              }}
            />
            {/* Indikator bahwa foto bisa di-zoom */}
            <View style={{
              position: 'absolute',
              top: 12,
              right: 2,
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderRadius: 10,
              padding: 2,
            }}>
              <MaterialCommunity name="magnify-plus" size={12} color="#FFF" />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    ));
  };

  const Files = (data: any) => {
    if (data.length === 0) {
      return (
        <View>
          <Text>Data Kosong</Text>
        </View>
      );
    }
    return data.map((items: any, index: number) => (
      <TouchableOpacity
        key={index}
        onPress={() =>
          showImage(`${baseUrl}taskFile/files/${items.taskFileSource}`)
        }
        style={{
          height: 65,
          width: 351,
          justifyContent: 'center',
          backgroundColor: '#FFF',
          borderRadius: 10,
          paddingHorizontal: 15,
          marginBottom: 10,
          elevation: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <MaterialCommunity
            name="folder-outline"
            size={20}
            color="#ADB5BD"
          />
          <View style={{marginLeft: 10, width: deviceWidth / 1.5}}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'NunitoSans-Bold',
              }}>
              {items.taskFileName}{' '}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'NunitoSans-Regular',
                color: '#555',
              }}>
              {items.taskFileSize} kb
            </Text>
          </View>
          <View style={{width: '10%', flexDirection: 'row', alignItems: 'center'}}>
            {/* Indikator zoom untuk file gambar */}
            {(items.taskFileName?.toLowerCase().includes('.jpg') || 
              items.taskFileName?.toLowerCase().includes('.jpeg') || 
              items.taskFileName?.toLowerCase().includes('.png') || 
              items.taskFileName?.toLowerCase().includes('.gif')) && (
              <MaterialCommunity
                name="magnify-plus"
                size={16}
                color="#ADB5BD"
                style={{marginRight: 8}}
              />
            )}
            <MaterialCommunity
              name="download-outline"
              size={20}
              color="#ADB5BD"
              onPress={() => download(items)}
            />
          </View>
        </View>
      </TouchableOpacity>
    ));
  };

  let _panel: any = React.useRef();

  const backPress = () => {
    _panel.hide();
    setTimeout(() => {
      navigation.goBack();
    }, 100);
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

  if (data === undefined) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={{height: deviceHeight, backgroundColor: '#FFF'}}>
      {loading && <Loading />}
      <FocusAwareStatusBar />
      
      <View style={{height: !panel ? deviceHeight / 0.7 : deviceHeight}}>
        <View
          style={{
            height: '7%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 21,
            backgroundColor: '#FFF',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcon
              onPress={() => backPress()}
              name="arrow-back"
              size={23}
              color="#ADB5BD"
            />
            <Text
              style={{
                marginLeft: 28,
                fontFamily: 'NunitoSans-Bold',
                fontSize: 16,
              }}>
              {data.taskCode}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                marginRight: 5,
                fontFamily: 'NunitoSans-Bold',
                fontSize: 14,
                color: data.taskStatus == 'Done' ? '#52B788' : '#6C757D',
              }}>
              Finish Task
            </Text>
            <MaterialCommunity
              name="check-circle-outline"
              size={20}
              color={data.taskStatus == 'Done' ? '#52B788' : '#ADB5BD'}
            />
          </View>
        </View>

        <View style={{paddingHorizontal: 21}}>
          <Text style={{fontFamily: 'NunitoSans-Bold', fontSize: 24}}>
            {data.taskName}
          </Text>
          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#CED4DA',
              width: deviceWidth * 0.9,
              alignSelf: 'center',
              marginTop: 24,
            }}
          />
        </View>

        <View style={{paddingHorizontal: 21}}>
          <View style={{marginTop: 24}}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Text
                style={{
                  width: '55%',
                  fontFamily: 'NunitoSans-Bold',
                  fontSize: 14,
                  color: '#ADB5BD',
                }}>
                Status
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <View style={{width: '70%'}}>
                <SelectDropdown
                  data={status}
                  onSelect={(selectedItem, index) => {
                    changeStatus(selectedItem.label);
                  }}
                  dropdownStyle={{borderRadius: 10}}
                  rowStyle={{backgroundColor: '#52B788'}}
                  rowTextStyle={{color: '#FFF'}}
                  dropdownOverlayColor={'transparent'}
                  defaultButtonText={statuses}
                  renderDropdownIcon={(isOpened) => {
                    return (
                      <MaterialCommunity
                        name={isOpened ? 'menu-up' : 'menu-down'}
                        color={'#FFF'}
                        size={18}
                      />
                    );
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.label;
                  }}
                  buttonStyle={{
                    borderRadius: 10,
                    width: 128,
                    height: 32,
                    backgroundColor: '#52B788',
                    marginTop: 15,
                  }}
                  buttonTextStyle={{
                    fontFamily: 'Lato-Bold',
                    fontSize: 14,
                    color: '#FFF',
                  }}
                  rowTextForSelection={(item, index) => {
                    return item.label;
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{marginTop: 22}}>
            <Text
              style={{
                fontFamily: 'NunitoSans-Bold',
                fontSize: 14,
                color: '#ADB5BD',
              }}>
              Category
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
              }}>
              {data?.detail.tags.length > 0 &&
                data?.detail.tags.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: item.taskTagColor,
                      borderRadius: 50,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      marginRight: 5,
                      marginTop: 9,
                      borderWidth: 1,
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Lato-Bold',
                        color: item.taskTagTextColor,
                      }}>
                      {item.taskTagName}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        </View>

        <View style={{marginTop: 36, paddingHorizontal: 21}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontFamily: 'NunitoSans-Bold',
                fontSize: 14,
                color: '#ADB5BD',
              }}>
              Description
            </Text>
          </View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'NunitoSans-Regular',
              color: '#555',
              marginTop: 5,
              paddingRight: 5,
            }}>
            {data.taskDescription}
          </Text>
        </View>

        <View style={{marginTop: 36, paddingHorizontal: 21}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontFamily: 'NunitoSans-Bold',
                fontSize: 14,
                color: '#ADB5BD',
              }}>
              Unit
            </Text>
          </View>
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'NunitoSans-Regular',
              color: '#555',
              marginTop: 5,
              paddingRight: 5,
            }}>
            {data.unit?.unitName ? data.unit.unitName : '-'}
          </Text>
        </View>

        <View style={{marginTop: 32, paddingHorizontal: 21}}>
          <Text
            style={{
              fontFamily: 'NunitoSans-Bold',
              fontSize: 14,
              color: '#ADB5BD',
            }}>
            Due Date
          </Text>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 6}}>
            <StopWatch name="stopwatch" size={20} color="#ADB5BD" />
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'NunitoSans-Regular',
                color: '#555',
                paddingRight: 5,
                marginHorizontal: 15,
              }}>
              {moment(data.times.scheduleEnd).format('DD MMM YYYY')}
            </Text>
            {diffDate(data.due) > 0 && (
              <View
                style={{
                  backgroundColor: '#FF5F57',
                  flexDirection: 'row',
                  borderRadius: 50,
                  paddingHorizontal: 10,
                  paddingVertical: 2,
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
                  Late: {diffDate(data.due)} Days
                </Text>
              </View>
            )}
          </View>
          <View
            style={{
              marginBottom: 32,
              marginTop: 20,
              borderBottomWidth: 1,
              borderBottomColor: '#CED4DA',
            }}
          />
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              bottom: 5,
            }}>
          </View>
        </View>
      </View>

      {/* Footer dengan SlidingUpPanel */}
      <SlidingUpPanel
        ref={(c) => (_panel = c)}
        draggableRange={{top: height - topBarHeight, bottom: halfScreen}}
        showBackdrop={false}
        containerStyle={{backgroundColor: '#F2F6F8'}}
      >
        {(dragHandler) => (
          <View style={{flex: 1}}>
            <View
              {...dragHandler}
              style={{backgroundColor: '#FFF', alignItems: 'center'}}>
              <MaterialCommunity
                name="drag-horizontal-variant"
                size={25}
                color="#CED4DA"
                style={{bottom: -1}}
              />
            </View>
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: '#CED4DA',
              }}>
              <View style={{height: 52, flexDirection: 'row'}}>
                {Tab(TabTitle)}
              </View>
            </View>
            {tabId == 0 ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#F2F6F8',
                }}>
                <Text
                  style={{
                    marginVertical: 20,
                    fontSize: 16,
                    fontFamily: 'NunitoSans-Regular',
                    color: '#6C757D',
                  }}>
                  Subtask Done (
                  {
                    data.detail.subTask.filter(
                      (item: any) => item.subTaskStatus,
                    ).length
                  }
                  /{data.detail.subTask.length})
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#F2F6F8',
                }}>
                <Text
                  style={{
                    marginVertical: 20,
                    fontSize: 16,
                    fontFamily: 'NunitoSans-Regular',
                    color: '#6C757D',
                  }}>
                  {moment(data.updatedAt).format('DD MMM YYYY')}
                </Text>
              </View>
            )}
            
            {/* ScrollView untuk konten tab - PERBAIKAN UTAMA */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              style={{
                flex: 1, // Tambahkan flex: 1
                backgroundColor: '#F2F6F8',
              }}
              contentContainerStyle={{
                width: '100%',
                alignItems: 'center',
                alignSelf: 'center',
                backgroundColor: '#F2F6F8',
                paddingBottom: tabId === 1 ? 100 : 50, // Tambah padding bottom untuk comments
                flexGrow: 1, // Tambahkan flexGrow
              }}>
              {tabId == 0
                ? SubTask(data.detail.subTask)
                : tabId == 1
                ? Discussion(data.detail.discussions)
                : Files(data.detail.files)}
            </ScrollView>
          </View>
        )}
      </SlidingUpPanel>

      {/* Input comment hanya muncul di tab comments */}
      {tabId == 1 && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 120}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#FFF'
          }}
        >
          <View
            style={{
              height: 60,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTopWidth: 1,
              borderStartWidth: 1,
              borderEndWidth: 1,
              borderTopRightRadius: 5,
              borderTopLeftRadius: 5,
              backgroundColor: '#FFF',
              borderColor: '#DEE2E6',
              paddingHorizontal: 10,
            }}>
            <TextInput
              onChangeText={(text: any) => setComment(text)}
              placeholderTextColor="#CED4DA"
              style={{
                paddingLeft: 10,
                flex: 1,
                color: '#10180F',
                fontFamily: 'NunitoSans-Regular',
                fontSize: 14,
              }}
              value={Comment}
              selectionColor={'#1B7472'}
              placeholder="Comment here"
            />
            <TouchableOpacity
              onPress={() => submit()}
              style={{height: 30, width: 30, marginTop: 5}}>
              <MaterialIcon name="send" size={22} color={'#ADB5BD'} />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                borderRadius: 5,
                alignItems: 'center',
                paddingHorizontal: 5,
              }}>
              <View
                style={{
                  height: 25,
                  borderLeftWidth: 1,
                  borderLeftColor: '#ADB5BD',
                }}
              />
              <TouchableOpacity
                style={{marginHorizontal: 10}}
                onPress={chooseAction}>
                {image !== '' ? (
                  <Image
                    source={{uri: image}}
                    style={{width: 22, height: 22}}
                  />
                ) : (
                  <MaterialIcon
                    name="attach-file"
                    size={22}
                    color="#ADB5BD"
                  />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setImage('');
                  setFile('');
                }}>
                <MaterialIcon name="cancel" size={22} color="#ADB5BD" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* Modal untuk view image dengan zoom - menggunakan react-native-image-zoom-viewer */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <ImageViewer
          imageUrls={images}
          index={imageIndex}
          onSwipeDown={() => setModalVisible(false)}
          enableSwipeDown={true}
          renderHeader={() => (
            <View style={{
              position: 'absolute',
              top: 40,
              right: 20,
              zIndex: 10,
              backgroundColor: 'rgba(255,255,255,0.8)',
              borderRadius: 20,
              padding: 8,
            }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialIcon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          )}
          renderIndicator={() => null}
          backgroundColor="rgba(0,0,0,0.9)"
          enableImageZoom={true}
          saveToLocalByLongPress={false}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          imageStyle={{
            width: deviceWidth,
            height: deviceHeight * 0.8,
          }}
          renderImage={(props) => (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: deviceWidth,
              height: deviceHeight,
            }}>
              <Image 
                {...props} 
                style={{
                  width: deviceWidth - 40,
                  height: deviceHeight * 0.6,
                  maxWidth: deviceWidth - 40,
                  maxHeight: deviceHeight * 0.6,
                }}
                resizeMode="contain"
              />
            </View>
          )}
          renderFooter={() => (
            <View style={{
              position: 'absolute',
              bottom: 50,
              left: 0,
              right: 0,
              alignItems: 'center',
            }}>
              <Text style={{
                color: '#FFF',
                fontSize: 14,
                fontFamily: 'NunitoSans-Regular',
                backgroundColor: 'rgba(0,0,0,0.5)',
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderRadius: 20,
              }}>
                Pinch to zoom • Swipe down to close
              </Text>
            </View>
          )}
          // Props tambahan untuk positioning yang lebih baik
          cropAlignY={0.5}
          cropAlignX={0.5}
          panToMove={true}
          pinchToZoom={true}
          clickInterval={250}
          maxOverflow={500}
          minScale={0.5}
          maxScale={8}
          doubleClickInterval={175}
        />
      </Modal>

      {/* Modal untuk pilihan camera/gallery */}
      <Modal animationType="slide" transparent={true} visible={visibleCamera}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
          onPress={() => setVisibleCamera(!visibleCamera)}>
          <View
            style={{
              backgroundColor: '#FFF',
              height: 150,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 90,
            }}>
            <TouchableOpacity
              style={{
                width: 65,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => takeCamera()}>
              <MaterialCommunity name="camera" size={40} />
              <Text style={{fontFamily: 'NunitoSans-Regular'}}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 65,
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => pickImage()}>
              <MaterialCommunity name="image" size={40} />
              <Text style={{fontFamily: 'NunitoSans-Regular'}}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
  },
  panelHeader: {
    height: 180,
    backgroundColor: '#b197fc',
    justifyContent: 'flex-end',
    padding: 24,
  },
  textHeader: {
    fontSize: 28,
    color: '#FFF',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -24,
    right: 18,
    width: 48,
    height: 48,
    zIndex: 1,
  },
  iconBg: {
    backgroundColor: '#2b8a3e',
    position: 'absolute',
    top: -24,
    right: 18,
    width: 48,
    height: 48,
    borderRadius: 24,
    zIndex: 1,
  },
});