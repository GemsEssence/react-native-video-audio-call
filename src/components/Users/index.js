import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, FlatList, Alert} from 'react-native';
import database from '@react-native-firebase/database';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import styles from './styles';

const Users = (props) => {
  const [users, handleUsers] = useState([]);
  const {user} = props.route.params;
  useEffect(() => {
    database()
      .ref('/callRecords/')
      .on('value', (snapshot) => {
        if (snapshot.val()) {
          const keys = Object.keys(snapshot.val());
          if (keys.includes(user.mobile)) {
            const {type, receiver, channel} = snapshot.val()[user.mobile];
            const dbUser = snapshot.val()[user.mobile].user;
            props.navigation.navigate('Call', {
              type,
              user: dbUser,
              receiver,
              channel,
            });
          }
        }
      });
    database()
      .ref('/users/')
      .on('value', (snapshot) => {
        if (snapshot.val()) {
          const keys = Object.keys(snapshot.val());
          const allUsers = [];
          keys.map((mobile) => {
            if (mobile.toString() !== user.mobile) {
              const obj = {
                mobile,
                name: snapshot.val()[mobile].name,
              };
              allUsers.push(obj);
            }
          });
          handleUsers(allUsers);
        }
      });
  }, []);

  const renderItem = (item) => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return (
      <View key={item.item.mobile} style={styles.listItemContainer}>
        <View style={styles.row}>
          <View style={[styles.outerCircle, {backgroundColor: randomColor}]}>
            <View style={[styles.innerCircle, {backgroundColor: randomColor}]}>
              <Text style={{fontSize: 18}}>
                {item.item.name[0].toUpperCase()}
              </Text>
            </View>
          </View>
          <Text>{`${item.item.name}   (${item.item.mobile})`}</Text>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => initiateCall('Audio', item.item)}
            style={[styles.callBtn, {marginRight: 10}]}>
            <MaterialIcons size={30} color="#0093E9" name="local-phone" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => initiateCall('Video', item.item)}
            style={styles.callBtn}>
            <MaterialIcons size={30} color="#0093E9" name="video-call" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const initiateCall = (type, receiver) => {
    const channel1 = `${user.mobile}-${receiver.mobile}`;
    const channel2 = `${receiver.mobile}-${user.mobile}`;
    let channel = channel1;
    // database()
    //   .ref(`/callRecords/${receiver.mobile}`)
    //   .on('value', (snapshot) => {
    //     if (snapshot.val()) {
    //       Alert.alert(
    //         'Call cannot be connected',
    //         `${receiver.name}  (${receiver.mobile}) is busy on another call, please try again later!`,
    //       );
    //       return false;
    //     } else {
    database()
      .ref(`/channels/${channel1}`)
      .on('value', (snapshot) => {
        console.log('channel 1', snapshot.val());
        if (!snapshot.val()) {
          database()
            .ref(`/channels/${channel2}`)
            .on('value', (snapshot) => {
              if (snapshot.val()) {
                channel = channel2;
              } else {
                database()
                  .ref(`/channels/${channel1}`)
                  .set({channel: channel1});
              }
            });
        }
        database()
          .ref(`/callRecords/${receiver.mobile}`)
          .set({receiver, user, channel, type});
        props.navigation.navigate(type, {
          user,
          receiver,
          channel,
          type,
        });
      });
    //   }
    // });
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Available Users</Text>
      </View>
      <View style={styles.body}>
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.mobile}
        />
      </View>
    </View>
  );
};

export default Users;
