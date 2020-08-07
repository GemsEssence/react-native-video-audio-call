import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, TextInput, Alert} from 'react-native';
import database from '@react-native-firebase/database';

import styles from './styles';

const Home = (props) => {
  const [mobile, handleMobileNo] = useState('1234567898');
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
      if (!isUserExisting) {
        database().ref(`/users/${mobile}`).set({name});
      }
      props.navigation.navigate('Users', {user});
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

export default Home;
