import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackNavigationProp} from '@react-navigation/stack';

import {RootStackParamList, Stacks} from './shared';
import TabNavigator from './Tab';
import Login from '../src/screen/auth/login';
import Forgot from '../src/screen/auth/forgot';
import History from '../src/screen/tab/task/history';
import Detail from '../src/screen/tab/task/detail';
import Access from '../src/screen/auth/access';
import Task from '../src/screen/tab/task'
import List from '../src/screen/tab/task/list'
import Notification from '../src/screen/tab/home/Notification';

interface Props {
  navigation: StackNavigationProp<RootStackParamList>;
}

const Stack = createNativeStackNavigator();

const Navigator: FC<Props> = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name={Stacks.Tab}
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Stacks.Login}
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Stacks.ForgotPassword}
        component={Forgot}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Stacks.DetailTask}
        component={Detail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Stacks.History}
        component={History}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Stacks.Access}
        component={Access}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Stacks.Task}
        component={Task}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Stacks.List}
        component={List}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={Stacks.Notification}
        component={Notification}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default Navigator;
