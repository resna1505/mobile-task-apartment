import React, {FC, useEffect} from 'react';
import {Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icons from 'react-native-vector-icons/SimpleLineIcons';
import TaskIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileIcon from 'react-native-vector-icons/MaterialIcons';

import Home from '../src/screen/tab/home';
import Task from '../src/screen/tab/task';
import Profile from '../src/screen/tab/profile';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './shared';

const Tab = createBottomTabNavigator();

interface Props {
  navigation: StackNavigationProp<RootStackParamList>
}

const TabNavigator:FC<Props> = ({route}:any)=> {
  const id = route.params.id;
  
  useEffect(()=>{},[id])
  
  return (
    // <NavigationContainer>
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={Home}
        initialParams={{id: id}}
        options={{
          headerShown: false,
          title: "Home",
          tabBarActiveTintColor:'#40916C',
          tabBarLabelStyle:{fontFamily:'NunitoSans-Bold', fontSize:12},
          tabBarIcon: ({size, focused, color}) => {
            return <Icons name="home" size={19} color={focused?"#40916C": "#ADB5BD"} />;
          },
        }}
      />
      <Tab.Screen
        name="Task"
        component={Task}
        initialParams={{id: id}}
        options={{
          headerShown: false,
          title: 'My Work',
          tabBarActiveTintColor:'#40916C',
          tabBarLabelStyle:{fontFamily:'NunitoSans-Bold', fontSize:12},
          tabBarIcon: ({size, focused, color}) => {
            return (
              <TaskIcon
                name="briefcase-outline"
                size={19}
                color={focused?"#40916C": "#ADB5BD"}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          title: 'Profile',
          tabBarActiveTintColor:'#40916C',
          tabBarLabelStyle:{fontFamily:'NunitoSans-Bold', fontSize:12},
          tabBarIcon: ({size, focused, color}) => {
            return (
              <ProfileIcon
                name="person-outline"
                size={25}
                color={focused?"#40916C": "#ADB5BD"}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
