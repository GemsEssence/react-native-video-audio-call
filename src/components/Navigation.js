import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {isEqual} from 'lodash';

import Home from './Home';
import Video from './Call/Video';
import Audio from './Call/Audio';
import Call from './Call';
import Users from './Users';
import Entry from './index';

const Stack = createStackNavigator();

PushNotification.configure({
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  default: true,
  popInitialNotification: true,
  requestPermissions: true,
});

const Navigation = () => {
  const displayNotification = (message) => {
    const title = isEqual(message.data.status, 'start')
      ? 'Incoming Call !'
      : 'Missed Call !';
    PushNotification.localNotification({
      ticker: 'My Notification Ticker',
      showWhen: true,
      autoCancel: true,
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_notification',
      bigText: message.data.message,
      color: 'green',
      vibrate: true,
      vibration: 300,
      priority: 'high',
      visibility: 'private',
      ignoreInForeground: false,
      messageId: 'google:message_id',
      invokeApp: true,
      title,
      message: message.data.message,
      userInfo: {},
      playSound: false,
      soundName: 'default',
    });
  };

  useEffect(() => {
    messaging().onMessage(async (remoteMessage) => {
      console.log('Message handled in the active!', remoteMessage);

      displayNotification(remoteMessage);
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
      displayNotification(remoteMessage);
    });
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRoute="Entry" headerMode="none">
        <Stack.Screen name="Entry" component={Entry} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Video" component={Video} />
        <Stack.Screen name="Audio" component={Audio} />
        <Stack.Screen name="Users" component={Users} />
        <Stack.Screen name="Call" component={Call} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
