export enum Stacks {
  Tab = 'Tab',
  Login = 'Login',
  ForgotPassword = 'ForgotPassword',
  DetailTask = 'DetailTask',
  History = 'History',
  Access = 'Access',
  Task = 'Task',
  List = 'List',
  Notification = 'Notification'
}

export enum Tabs {
  Home = 'Home',
  Schedule = 'Task',
  Profile = 'Profile',
}

export type RootStackParamList = {
  Tab: {id: number; firstName: any; lastName: any; type: any};
  Home: {id: number; firstName: any; lastName: any; type: any};
  Login: {id: number};
  ForgotPassword: undefined;
};
