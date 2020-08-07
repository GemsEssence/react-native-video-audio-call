import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, TextInput, Alert} from 'react-native';
import database from '@react-native-firebase/database';

import styles from './styles';

const Home = (props) => {
  const [channel, handleChannel] = useState('channel-x');
  const [mobile, handleMobileNo] = useState('test');
  const [name, handleName] = useState('');
  useEffect(() => {
    if (mobile.trim().length === 10) {
      database()
        .ref(`/users/${mobile}`)
        .on('value', (snapshot) => {
          console.log('User data: ', snapshot.val());
          if (snapshot.val()) {
            handleName(snapshot.val());
          }
        });
    }
  }, [mobile]);
  const handleGo = () => {
    const user = {mobile, name};
    if (channel.trim().length > 0 && user.mobile.trim().length === 10) {
      props.navigation.navigate('Call', {user, channel});
    } else {
      Alert.alert(
        'Please fill the details',
        'Channel name and user name are compulsory to add',
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
        style={styles.input}
        placeholder="Enter Your Name"
        value={name}
        onChangeText={handleName}
      />
      <TouchableOpacity style={styles.btn} onPress={handleGo}>
        <Text>Go</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
