import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, FlatList, Alert} from 'react-native';
import database from '@react-native-firebase/database';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import styles from './styles';
import {logout} from '../../state/Users/actions';

const Users = (props) => {
  const [users, handleUsers] = useState([]);
  const {actions, isAdmin, currentUser, navigation} = props;
  const user = currentUser;

  // const {user} = props.route.params;
  useEffect(() => {
    database()
      .ref('/callRecords/')
      .on('value', (snapshot) => {
        if (snapshot.val()) {
          const keys = Object.keys(snapshot.val());
          if (keys.includes(user.mobile)) {
            const {type, receiver, channel} = snapshot.val()[user.mobile];
            const dbUser = snapshot.val()[user.mobile].user;
            navigation.navigate('Call', {
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

  const deleteUser = (item) => {
    Alert.alert('Delete User', 'Are you sure you want to delete ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => database().ref(`/users/${item.mobile}`).remove(),
      },
    ]);
  };

  const handleLogout = () => {
    actions.logout();
    navigation.navigate('Home');
  };

  const initiateCall = (type, receiver) => {
    const channel1 = `${user.mobile}-${receiver.mobile}`;
    const channel2 = `${receiver.mobile}-${user.mobile}`;
    let channel = channel1;
    database()
      .ref(`/channels/${channel1}`)
      .on('value', (snapshot) => {
        if (!snapshot.val()) {
          database()
            .ref(`/channels/${channel2}`)
            .on('value', (data) => {
              if (data.val()) {
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
        navigation.navigate(type, {
          user,
          receiver,
          channel,
          type,
        });
      });
  };

  const renderItem = (item) => {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return (
      <View key={item.item.mobile} style={styles.listItemContainer}>
        <View style={[styles.row, {width: '55%'}]}>
          <View style={[styles.outerCircle, {backgroundColor: randomColor}]}>
            <View style={[styles.innerCircle, {backgroundColor: randomColor}]}>
              <Text style={{fontSize: 18}}>
                {item.item.name[0].toUpperCase()}
              </Text>
            </View>
          </View>
          <Text
            numberOfLines={1}>{`${item.item.name} (${item.item.mobile})`}</Text>
        </View>
        <View style={styles.row}>
          {isAdmin && (
            <TouchableOpacity
              style={[styles.callBtn, {marginRight: 5}]}
              onPress={() => deleteUser(item.item)}>
              <MaterialIcons size={30} color="#0093E9" name="delete" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => initiateCall('Audio', item.item)}
            style={[styles.callBtn, {marginRight: 5}]}>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Available Users</Text>
        <TouchableOpacity onPress={handleLogout}>
          <MaterialIcons name="exit-to-app" size={30} color="white" />
        </TouchableOpacity>
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

const mapStateToProps = (state) => ({
  currentUser: state.Users.currentUser,
  isAdmin: state.Users.isAdmin,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({logout}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);
