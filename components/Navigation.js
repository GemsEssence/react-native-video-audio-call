import React, {useEffect} from 'react';
import {Alert} from 'react-native'
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';

import Home from './Home';
import Video from './Call/Video';
import Audio from './Call/Audio';
import Call from './Call';
import Users from './Users';

const Stack = createStackNavigator();

const Navigation = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });

    return unsubscribe;
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRoute="Home" headerMode="none">
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
