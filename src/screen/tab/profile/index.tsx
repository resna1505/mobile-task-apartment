import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import IconEmail from 'react-native-vector-icons/MaterialCommunityIcons'
import IconEdit from 'react-native-vector-icons/MaterialIcons'
import IconLogout from 'react-native-vector-icons/SimpleLineIcons';
import {request, baseUrl} from '../../../Api';
import  {store} from '../../../../states/store'
import Loading from '../../../components/loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { err } from 'react-native-svg/lib/typescript/xml';
import axios from 'axios';


const Profile = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({})
  const [file, setFile] = useState('');
  const [image, setImage] = useState('');
  const [phone, setPhone] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [isEdited, setIsEdit] = useState(false);

  useEffect(() => {
    authMe();
    setIsEdit(false);
  }, []);

  const authMe = async () => {
    setLoading(true)
    const url = 'auth/mobile/me';
    try {
      const res = await request.get(url, {
        Authorization: 'Bearer ' + store.getState().auth.token,
      });
      if (res) {
        setData(res.data)
        setPhone(res.data.phoneNumber)
        setAddress(res.data.userAddress || '')
      }
    } catch (error) {
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  const logout = async () => {
    await AsyncStorage.setItem('access_token', '')
    navigation.replace('Login')
  }

  const UploadPhoto = async () => {
    try {
      const res = await launchImageLibrary({
        includeBase64: true,
        mediaType: 'photo',
        quality: 0.5,
      });
      if (res) {
        submit(res.assets[0]?.base64)
      }
    } catch (error) {
    }
  };


  const submit = async (file: any) => {
    const url = `${baseUrl}mobile/user/profileImages`;
    try {
      const res = await axios.patch(
        url,
        {
          profileImage: file !== '' ? 'data:image/png;base64,' + file : ''
        },
        {
          headers: {
            Authorization: 'Bearer ' + store.getState().auth.token,
          },
        },
      );
      if (res) {
        setFile('');
        setImage('');
        authMe()
        ToastAndroid.show('Change photo success', ToastAndroid.SHORT)
      }
    } catch (error) {
    }
  };

  const onEdit = () => {
    setIsEdit(!isEdited)
  }

  const changeNumberPhone = async () => {
    const url = `${baseUrl}mobile/user`;    
    if (newPassword !== confirmPassword) {
      ToastAndroid.show('Password baru dan konfirmasi tidak cocok', ToastAndroid.SHORT);
      return;
    }
    try {
      const res = await axios.patch(
        url,
        {
          phoneNumber: phone,
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
          userAddress: address
        },
        {
          headers: {
            Authorization: 'Bearer ' + store.getState().auth.token,
          },
        },
      );
      if (res) {
        setIsEdit(false);
        authMe()
        ToastAndroid.show('Edit profile success', ToastAndroid.SHORT)
      }
    } catch (error) {
      ToastAndroid.show(
        error.response?.data?.error || 'Gagal update data',
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{flex:1, backgroundColor: '#FFF'}}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {loading ? <Loading /> : null}
      <StatusBar backgroundColor='#FFF' barStyle='dark-content' />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{flex:1}}>
          <View style={{width: '100%', height: 341}}>
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
                position: 'absolute',
                zIndex: 10,
                top: 20,
                right: 20,
              }}
            >
              <IconLogout name='logout'/>
              <Text style={{fontFamily: 'NunitoSans-Bold', color: '#495057', fontSize: 16, marginLeft: 10}}>Sign Out</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => UploadPhoto()}
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
                position: 'absolute',
                zIndex: 10,
                bottom: 20,
              }}
            >
              <IconEmail name='upload' size={20} color='#ADB5BD'/>
              <Text style={{fontFamily: 'NunitoSans-Bold', color: '#495057', fontSize: 16, marginLeft: 10}}>Upload Picture</Text>
            </TouchableOpacity>

            <Image source={{uri:`${baseUrl}user/profileImage/${data.profileImage}`}} style={{width: '100%', height: 341}}/>
          </View>
          <View style={{paddingVertical: 40, paddingHorizontal: 20}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontFamily: 'NunitoSans-Bold', fontSize: 24, marginBottom: 36}}>{data.firstName} {data.lastName}</Text>
              
              {isEdited ? 
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => changeNumberPhone()}
                >
                  <Text style={{color: '#52B788', fontSize: 16, fontWeight: '600', marginRight: 5}}>Save</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => onEdit()}
                >
                  <Text style={{color: '#52B788', fontSize: 16, fontWeight: '600', marginRight: 5}}>Edit Profile</Text>
                  <IconEdit name='edit' size={20} color ='#52B788'/>
                </TouchableOpacity>
              }
            
            </View>
            <View 
              style={{
                paddingVertical: 25,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderStyle: 'dashed',
                borderColor: '#BABCBE'
              }}
            >
              <Text style={{fontFamily: 'NunitoSans-Bold',}}>Nomor Telepon</Text>

              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 14}}>
                <Icon name='phone-alt' style={{marginRight: 12}} color='#B8BCC1' size={17}/>
                <TextInput
                  value={phone} 
                  style={{padding: 0, flex: 1, color: '#000'}}
                  onChangeText={(phone) => setPhone(phone)}
                  keyboardType={'numeric'}
                  editable={isEdited}
                />
              </View>
            </View>

            <View 
              style={{
                paddingVertical: 25,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderStyle: 'dashed',
                borderColor: '#BABCBE'
              }}
            >
              <Text style={{fontFamily: 'NunitoSans-Bold',}}>Alamat Email</Text>

              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 14}}>
                <IconEmail name='email' style={{marginRight: 12}} color='#B8BCC1' size={18}/>
                <Text style={{fontFamily: 'NunitoSans-Regular', fontSize: 16}}>{data.email}</Text>
              </View>
            </View>
            <View 
              style={{
                paddingVertical: 25,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderStyle: 'dashed',
                borderColor: '#BABCBE'
              }}
            >
              <Text style={{fontFamily: 'NunitoSans-Bold',}}>Alamat</Text>

              {/* <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 14}}>
                <Text style={{fontFamily: 'NunitoSans-Regular', fontSize: 16}}>{data.userAddress ?  data.userAddress : '-'}</Text>
              </View> */}
              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 14}}>
                <Icon name='map-marker-alt' style={{marginRight: 12}} color='#B8BCC1' size={17} />
                <TextInput
                  value={address}
                  style={{padding: 0, flex: 1, color: '#000'}}
                  onChangeText={(text) => setAddress(text)}
                  editable={isEdited}
                  // placeholder="Alamat"
                />
              </View>
            </View>

            <View
              style={{
                paddingVertical: 25,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderStyle: 'dashed',
                borderColor: '#BABCBE',
              }}
            >
              <Text style={{fontFamily: 'NunitoSans-Bold'}}>Ganti Password</Text>

              {/* Old Password */}
              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 14}}>
                <Icon name='lock' style={{marginRight: 12}} color='#B8BCC1' size={17} />
                <TextInput
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  placeholder="Password Lama"
                  secureTextEntry={true}
                  editable={isEdited}
                  style={{padding: 0, flex: 1, color: '#000'}}
                />
              </View>

              {/* New Password */}
              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 14}}>
                <Icon name='lock' style={{marginRight: 12}} color='#B8BCC1' size={17} />
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Password Baru"
                  secureTextEntry={true}
                  editable={isEdited}
                  style={{padding: 0, flex: 1, color: '#000'}}
                />
              </View>

              {/* Confirm Password */}
              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 14}}>
                <Icon name='lock' style={{marginRight: 12}} color='#B8BCC1' size={17} />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Konfirmasi Password"
                  secureTextEntry={true}
                  editable={isEdited}
                  style={{padding: 0, flex: 1, color: '#000'}}
                />
              </View>
            </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Profile;
