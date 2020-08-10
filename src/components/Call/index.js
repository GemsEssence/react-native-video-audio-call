import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import database from '@react-native-firebase/database';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import styles from './Style';

const Call = (props) => {
  const {navigation} = props;
  const {user, channel, receiver, type} = props.route.params;
  const timeout = setTimeout(() => rejectCall, 30000);
  const startCall = () => {
    clearTimeout(timeout);
    navigation.navigate(type, {user, channel, receiver});
  };

  const rejectCall = () => {
    database().ref(`/callRecords/${receiver.mobile}`).remove();
    navigation.goBack(1);
  };
  return (
    <View style={styles.callView}>
      <View style={[styles.innerBubble, {marginBottom: 20, padding:30}]}>
        <View style={[styles.nameBubble, styles.callNameBubble]}>
          <Text style={styles.bubbleText}>{user.name[0].toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.callerText}>{`${user.name} is calling ... !`}</Text>
      <View style={styles.callContainer}>
        <TouchableOpacity
          onPress={startCall}
          style={[
            styles.endCallBtn,
            {marginRight: 50, backgroundColor: 'green'}
          ]}>
          <MaterialIcons size={30} name="local-phone" color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={rejectCall} style={styles.endCallBtn}>
          <MaterialIcons size={30} name="close" color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Call;
