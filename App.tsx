import React, { FC, useEffect } from 'react';
import {Provider} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import codePush from "react-native-code-push";

import Navigator from './route/Navigator';
import {store} from './states/store';

const App: FC = () => {

  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
    });
  }, []);
  
  return (
    
    <Provider store={store}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </Provider>
  );
};

export default codePush(App);

// import React, { FC, useEffect, useRef, useState } from 'react';
// import { Provider } from 'react-redux';
// import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
// import { Alert, ToastAndroid, Platform } from 'react-native';
// import messaging from '@react-native-firebase/messaging';
// import codePush from "react-native-code-push";

// import Navigator from './route/Navigator';
// import { store } from './states/store';
// import { Stacks } from './route/shared';
// import { request } from './src/Api';
// import CustomNotificationBanner from './src/components/CustomNotificationBanner'; // Add this import

// const App: FC = () => {
//   const navigationRef = useRef<NavigationContainerRef<any>>(null);
//   const [foregroundNotification, setForegroundNotification] = useState<any>(null);
//   const [showNotificationBanner, setShowNotificationBanner] = useState(false);

//   // Function to handle navigation based on FCM data
//   const handleNotificationNavigation = async (data: any) => {
//     if (data && data.context === 'New Work' && data.workId) {
//       // Check if navigation is ready
//       if (navigationRef.current) {
//         console.log('Attempting to navigate with FCM data:', data);
        
//         // Option 1: Try to find latest task from any status
//         try {
//           console.log('Fetching tasks for workId:', data.workId);
          
//           // Check all statuses to find any available task
//           const statuses = ['todo', 'inProgress', 'resolved', 'done'];
//           let latestTask = null;
          
//           for (const status of statuses) {
//             try {
//               const response = await request.get(`mobile/work/${data.workId}/${status}`);
//               const tasks = response.data.data;
              
//               if (tasks && tasks.length > 0) {
//                 latestTask = tasks[0]; // Get first task from any status
//                 console.log(`Found task in ${status}:`, latestTask.id);
//                 break; // Exit loop when task found
//               }
//             } catch (statusError) {
//               console.log(`No tasks found in ${status}`);
//               continue; // Try next status
//             }
//           }
          
//           if (latestTask) {
//             // Navigate directly to DetailTask with taskId
//             navigationRef.current.navigate(Stacks.DetailTask, {
//               id: latestTask.id,
//               fromFCM: true,
//             });
            
//             console.log('Successfully navigated to DetailTask with taskId:', latestTask.id);
//             return; // Exit function successfully
//           } else {
//             throw new Error('No tasks found in any status');
//           }
//         } catch (error) {
//           console.log('Failed to get taskId, navigating to List instead:', error);
          
//           // Option 2: Navigate to List page (task list for specific work)
//           try {
//             navigationRef.current.navigate(Stacks.List, {
//               id: data.workId,
//               name: data.workName, // You can get actual work name from API if needed
//               fromFCM: true,
//             });
            
//             console.log('Successfully navigated to List with workId:', data.workId);
//           } catch (error2) {
//             console.log('List navigation also failed:', error2);
            
//             // Option 3: Final fallback to My Work (work list)
//             try {
//               navigationRef.current.navigate(Stacks.Task);
//               console.log('Final fallback to My Work successful');
//             } catch (error3) {
//               console.log('Final fallback also failed:', error3);
//             }
//           }
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     // Function to handle navigation based on FCM data
//     const handleNotificationNavigation = async (data: any) => {
//       if (data && data.context === 'New Work' && data.workId) {
//         // Check if navigation is ready
//         if (navigationRef.current) {
//           console.log('Attempting to navigate with FCM data:', data);
          
//           // Option 1: Try to find latest task from any status
//           try {
//             console.log('Fetching tasks for workId:', data.workId);
            
//             // Check all statuses to find any available task
//             const statuses = ['todo', 'inProgress', 'resolved', 'done'];
//             let latestTask = null;
            
//             for (const status of statuses) {
//               try {
//                 const response = await request.get(`mobile/work/${data.workId}/${status}`);
//                 const tasks = response.data.data;
                
//                 if (tasks && tasks.length > 0) {
//                   latestTask = tasks[0]; // Get first task from any status
//                   console.log(`Found task in ${status}:`, latestTask.id);
//                   break; // Exit loop when task found
//                 }
//               } catch (statusError) {
//                 console.log(`No tasks found in ${status}`);
//                 continue; // Try next status
//               }
//             }
            
//             if (latestTask) {
//               // Navigate directly to DetailTask with taskId
//               navigationRef.current.navigate(Stacks.DetailTask, {
//                 id: latestTask.id,
//                 fromFCM: true,
//               });
              
//               console.log('Successfully navigated to DetailTask with taskId:', latestTask.id);
//               return; // Exit function successfully
//             } else {
//               throw new Error('No tasks found in any status');
//             }
//           } catch (error) {
//             console.log('Failed to get taskId, navigating to List instead:', error);
            
//             // Option 2: Navigate to List page (task list for specific work)
//             try {
//               navigationRef.current.navigate(Stacks.List, {
//                 id: data.workId,
//                 name: data.workName, // You can get actual work name from API if needed
//                 fromFCM: true,
//               });
              
//               console.log('Successfully navigated to List with workId:', data.workId);
//             } catch (error2) {
//               console.log('List navigation also failed:', error2);
              
//               // Option 3: Final fallback to My Work (work list)
//               try {
//                 navigationRef.current.navigate(Stacks.Task);
//                 console.log('Final fallback to My Work successful');
//               } catch (error3) {
//                 console.log('Final fallback also failed:', error3);
//               }
//             }
//           }
//         }
//       }
//     };

//     // Function to show foreground notification
//     const showForegroundNotification = (remoteMessage: any) => {
//       console.log('Showing custom foreground notification');
      
//       // Set notification data and show banner
//       setForegroundNotification(remoteMessage);
//       setShowNotificationBanner(true);
//     };

//     // Handle notification when app is opened from terminated state
//     messaging()
//       .getInitialNotification()
//       .then(remoteMessage => {
//         if (remoteMessage) {
//           console.log('App opened from terminated state by notification:', remoteMessage);
//           console.log('Initial notification data:', remoteMessage.data);
          
//           // Add a small delay to ensure navigation is ready
//           setTimeout(() => {
//             handleNotificationNavigation(remoteMessage.data);
//           }, 1000);
//         }
//       });

//     // Handle notification when app is in background
//     const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(remoteMessage => {
//       console.log('App opened from background by notification:', remoteMessage);
//       console.log('Background opened notification data:', remoteMessage.data);
      
//       handleNotificationNavigation(remoteMessage.data);
//     });

//     // Handle background messages
//     messaging().setBackgroundMessageHandler(async remoteMessage => {
//       console.log('Background Message:', remoteMessage);
//       console.log('Title:', remoteMessage.notification?.title);
//       console.log('Body:', remoteMessage.notification?.body);
//       console.log('Data:', remoteMessage.data);
//     });

//     // Handle foreground messages
//     const unsubscribeForegroundMessage = messaging().onMessage(async remoteMessage => {
//       console.log('Foreground Message:', remoteMessage);
//       console.log('Title:', remoteMessage.notification?.title);
//       console.log('Body:', remoteMessage.notification?.body);
//       console.log('Data:', remoteMessage.data);
      
//       // Show in-app notification for foreground messages
//       showForegroundNotification(remoteMessage);
//     });

//     return () => {
//       unsubscribeNotificationOpened();
//       unsubscribeForegroundMessage();
//     };
//   }, []);

//   return (
//     <Provider store={store}>
//       <NavigationContainer ref={navigationRef}>
//         <Navigator />
        
//         {/* Custom Notification Banner for Foreground */}
//         <CustomNotificationBanner
//           notification={foregroundNotification}
//           visible={showNotificationBanner}
//           onPress={() => {
//             console.log('User tapped notification banner');
//             if (foregroundNotification?.data) {
//               handleNotificationNavigation(foregroundNotification.data);
//             }
//             setShowNotificationBanner(false);
//           }}
//           onDismiss={() => {
//             console.log('Notification banner dismissed');
//             setShowNotificationBanner(false);
//             setForegroundNotification(null);
//           }}
//         />
//       </NavigationContainer>
//     </Provider>
//   );
// };

// export default codePush(App);