import React, {useState} from 'react';
import {View, TouchableOpacity, Text, TextInput, Alert} from 'react-native';

import styles from './styles';

const Home = props => {
  const [channel, handleChannel] = useState('channel-x');
  const [user, handleUser] = useState('test');

  const handleGo = () => {
    if (channel.trim().length > 0 && user.trim().length > 0) {
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
        placeholder="Enter Your Name"
        value={user}
        onChangeText={handleUser}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Channel Id"
        value={channel}
        onChangeText={handleChannel}
      />
      <TouchableOpacity style={styles.btn} onPress={handleGo}>
        <Text>Go</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
