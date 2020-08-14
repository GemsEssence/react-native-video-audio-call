import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, TextInput, Alert} from 'react-native';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {loginDetails} from '../../state/Users/actions';
import styles from './styles';

const Home = (props) => {
  const [mobile, handleMobileNo] = useState('');
  const [name, handleName] = useState('');
  const [isUserExisting, handleExistingUser] = useState(false);
  useEffect(() => {
    if (mobile.trim().length === 10) {
      database()
        .ref(`/users/${mobile}`)
        .on('value', (snapshot) => {
          if (snapshot.val()) {
            handleExistingUser(true);
            handleName(snapshot.val().name);
          } else {
            handleExistingUser(false);
            handleName('');
          }
        });
    }
  }, [mobile]);

  const handleGo = () => {
    const user = {mobile, name};
    if (user.name.trim().length > 0 && user.mobile.trim().length === 10) {
      messaging()
        .getToken()
        .then((fcmToken) => {
          if (!isUserExisting) {
            database().ref(`/users/${mobile}`).set({name, fcmToken});
          }
          database().ref(`/users/${mobile}`).update({fcmToken});
          props.actions.loginDetails(user);
          props.navigation.navigate('Users', {user});
        });
    } else {
      Alert.alert(
        'Please fill the details',
        'Mobile number and user name are compulsory to add',
      );
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        autoFocus
        editable
        maxLength={10}
        style={styles.input}
        placeholder="Enter Your Mobile Number"
        value={mobile}
        onChangeText={handleMobileNo}
      />
      <TextInput
        editable={!isUserExisting}
        style={styles.input}
        placeholder="Enter Your Name"
        value={name}
        onChangeText={handleName}
      />
      {isUserExisting && (
        <Text>User Already exist, name cannot be changed!</Text>
      )}
      <TouchableOpacity style={styles.btn} onPress={handleGo}>
        <Text>Go</Text>
      </TouchableOpacity>
    </View>
  );
};

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({loginDetails}, dispatch),
});

export default connect(null, mapDispatchToProps)(Home);
