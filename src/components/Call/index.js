import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import database from '@react-native-firebase/database';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import InCallManager from 'react-native-incall-manager';
import {CommonActions} from '@react-navigation/native';
import {connect} from 'react-redux';

import styles from './Style';

const Call = (props) => {
  const {navigation} = props;
  const {user, channel, receiver, type} = props.route.params;
  const timeout = setTimeout(() => rejectCall, 30000);

  useEffect(() => {
    InCallManager.startRingtone('_BUNDLE_', [400, 0, 400, 0]);
    database()
      .ref(`/callRecords/${receiver.mobile}`)
      .on('value', (snapshot) => {
        if (!snapshot.val()) {
          rejectCall();
        }
      });
    return () => {
      InCallManager.stopRingtone();
    };
  }, []);

  const startCall = () => {
    InCallManager.stopRingtone();
    clearTimeout(timeout);
    navigation.navigate(type, {user, channel, receiver});
  };

  const rejectCall = () => {
    InCallManager.stopRingtone();
    database().ref(`/channels/${channel}`).update({isActive: false});
    database().ref(`/callRecords/${receiver.mobile}`).off();
    database().ref(`/active/${receiver.mobile}`).off();
    database().ref(`/active/${user.mobile}`).off();
    database().ref(`/callRecords/${receiver.mobile}`).remove();
    database().ref(`/active/${receiver.mobile}`).remove();
    database().ref(`/active/${user.mobile}`).remove();
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Users'}],
      }),
    );
  };
  return (
    <View style={styles.callView}>
      <View style={[styles.innerBubble, {marginBottom: 20, padding: 30}]}>
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

const mapStateToProps = (state) => ({
  currentUser: state.Users.currentUser,
});

export default connect(mapStateToProps)(Call);
