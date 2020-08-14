import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Platform, Alert} from 'react-native';
import RtcEngine from 'react-native-agora';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import KeepAwake from 'react-native-keep-awake';
import {connect} from 'react-redux';
import {isEqual} from 'lodash';
import database from '@react-native-firebase/database';
import {CommonActions} from '@react-navigation/native';

import styles from './Style';
import requestCameraAndAudioPermission from '../permission';

let engine;
class Audio extends Component {
  constructor(props) {
    super(props);
    const {channel} = props.route.params;
    this.state = {
      peerIds: [],
      appid: '9383ec2f56364d478cefc38b0a37d8bc',
      channelName: channel,
      joinSucceed: false,
      isMute: false,
      enableSpeaker: false,
    };
    if (Platform.OS === 'android') {
      requestCameraAndAudioPermission().then(_ => {
        console.log('requested!');
      });
    }
  }

  async componentDidMount() {
    let self = this;
    engine = await RtcEngine.create(self.state.appid);
    engine.disableVideo();
    engine.addListener('UserJoined', (data) => {
      const {peerIds} = self.state;
      if (peerIds.indexOf(data) === -1) {
        self.setState({peerIds: [...peerIds, data]});
      }
    });

    engine.addListener('UserOffline', (data) => {
      self.setState({
        peerIds: self.state.peerIds.filter((uid) => uid !== data),
      });
    });

    engine.addListener('JoinChannelSuccess', (data) => {
      self.setState({joinSucceed: true});
    });
    this.startCall();
  }

  callWaiting = () => {
    this.timeout = setTimeout(() => {
      if (this.state.peerIds.length === 0) {
        Alert.alert(
          'Call Disconnected',
          "Receiver didn't picked the call",
          [
            {
              text: 'Call Again',
              onPress: () => this.startCall(),
              style: 'cancel',
            },
            {
              text: 'Cancel',
              onPress: () => this.endCall(),
            },
          ],
          {cancelable: false},
        );
      }
    }, 30000);
  };

  startCall = () => {
    KeepAwake.activate();
    this.timeout = setTimeout(
      () => this.setState(() => ({showFooterButtons: false})),
      5000,
    );
    this.callWaiting();
    this.setState({joinSucceed: true});
    engine.joinChannel(null, this.state.channelName, null, 0);
    const {receiver} = this.props.route.params;
    database()
      .ref(`/callRecords/${receiver.mobile}`)
      .on('value', (snapshot) => {
        if (!snapshot.val()) {
          Alert.alert(
            'Call Disconnected',
            'Receiver canceled the call',
            [
              {
                text: 'Call Again',
                onPress: () => this.startCall(),
                style: 'cancel',
              },
              {
                text: 'Cancel',
                onPress: () => this.endCall(),
              },
            ],
            {cancelable: false},
          );
          this.endCall();
          return false;
        }
      });
  };

  endCall = () => {
    const {user, receiver, channel} = this.props.route.params;
    database().ref(`/callRecords/${receiver.mobile}`).off();
    database().ref(`/active/${receiver.mobile}`).off();
    database().ref(`/active/${user.mobile}`).off();
    database().ref(`/channels/${channel}`).update({isActive: false});
    database().ref(`/callRecords/${receiver.mobile}`).remove();
    database().ref(`/active/${receiver.mobile}`).remove();
    database().ref(`/active/${user.mobile}`).remove();
    engine.leaveChannel();
    clearTimeout(this.timeout);
    this.setState({peerIds: [], joinSucceed: false});
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Users'}],
      }),
    );
  };

  toggleMute = () => {
    this.setState(
      (prevState) => ({isMute: !prevState.isMute}),
      () => {
        if (this.state.isMute) {
          engine.enableLocalAudio(false);
        } else {
          engine.enableLocalAudio(true);
        }
      },
    );
  };

  toggleSpeaker = () => {
    this.setState(
      (prevState) => ({enableSpeaker: !prevState.enableSpeaker}),
      () => {
        if (this.state.enableSpeaker) {
          engine.setEnableSpeakerphone(false);
        } else {
          engine.setEnableSpeakerphone(true);
        }
      },
    );
  };

  componentWillUnmount() {
    KeepAwake.deactivate();
  }

  audioView() {
    const {joinSucceed, peerIds, enableSpeaker, isMute} = this.state;
    const {user, receiver} = this.props.route.params;
    console.log(user, receiver);
    const {currentUser} = this.props;
    console.log('current user', currentUser);

    return (
      <View style={styles.max}>
        {!joinSucceed ? (
          <View />
        ) : (
          <View style={styles.fullView}>
            <View style={[styles.fullView, styles.audioCallFullView]}>
              <View style={[styles.innerBubble, {marginBottom: 50}]}>
                <View style={styles.nameBubble}>
                  <Text style={styles.bubbleText}>
                    {isEqual(currentUser.mobile, user.mobile)
                      ? receiver.name[0].toUpperCase()
                      : user.name[0].toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.callerText}>
                {peerIds.length < 1
                  ? `${user.name} is calling ... !`
                  : 'Call Connected !'}
              </Text>
            </View>
          </View>
        )}
        {joinSucceed && (
          <View style={styles.callFooterContainer}>
            <TouchableOpacity
              onPress={this.toggleMute}
              style={styles.endCallBtn}>
              <MaterialIcons
                size={30}
                style={styles.buttonText}
                name={isMute ? 'mic' : 'mic-off'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.endCall} style={styles.endCallBtn}>
              <MaterialIcons
                size={30}
                style={styles.buttonText}
                name="call-end"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.toggleSpeaker}
              style={styles.endCallBtn}>
              <MaterialIcons
                size={30}
                style={styles.buttonText}
                name={enableSpeaker ? 'hearing' : 'speaker'}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
  render() {
    return this.audioView();
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.Users.currentUser,
});

export default connect(mapStateToProps)(Audio);
