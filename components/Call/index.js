import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import styles from './Style';

const Call = props => {
  const {navigation} = props;
  const {user, channel} = props.route.params;
  const startCall = type => {
    navigation.navigate(type, {user, channel});
  };

  return (
    <View style={styles.callContainer}>
      <TouchableOpacity
        onPress={() => startCall('Audio')}
        style={[styles.button, {marginRight: 10}]}>
        <Text style={styles.buttonText}> Audio Call </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => startCall('Video')}
        style={styles.button}>
        <Text style={styles.buttonText}> Video Call </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Call;
