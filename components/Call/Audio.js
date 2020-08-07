import requestCameraAndAudioPermission from '../permission';
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import RtcEngine, {RtcRemoteView} from 'react-native-agora';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import styles from './Style';

let RemoteView = RtcRemoteView.SurfaceView;
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
    engine.addListener('UserJoined', data => {
      const {peerIds} = self.state;
      if (peerIds.indexOf(data) === -1) {
        self.setState({peerIds: [...peerIds, data]});
      }
    });

    engine.addListener('UserOffline', data => {
      self.setState({
        peerIds: self.state.peerIds.filter(uid => uid !== data),
      });
    });

    engine.addListener('JoinChannelSuccess', data => {
      self.setState({joinSucceed: true});
    });
    this.startCall();
  }

  startCall = () => {
    this.setState({joinSucceed: true});
    engine.joinChannel(null, this.state.channelName, null, 0);
  };

  endCall = () => {
    engine.leaveChannel();
    this.setState({peerIds: [], joinSucceed: false});
    this.props.navigation.goBack();
  };

  toggleMute = () => {
    this.setState(
      prevState => ({isMute: !prevState.isMute}),
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
      prevState => ({enableSpeaker: !prevState.enableSpeaker}),
      () => {
        if (this.state.enableSpeaker) {
          engine.setEnableSpeakerphone(false);
        } else {
          engine.setEnableSpeakerphone(true);
        }
      },
    );
  };

  audioView() {
    const {
      joinSucceed,
      peerIds,
      channelName,
      enableSpeaker,
      isMute,
    } = this.state;
    const {user} = this.props.route.params;
    return (
      <View style={styles.max}>
        {!joinSucceed ? (
          <View />
        ) : (
          <View style={styles.fullView}>
            {peerIds.length > 3 ? (
              <View style={styles.full}>
                <View style={styles.halfViewRow}>
                  <RemoteView
                    style={styles.half}
                    channelId={channelName}
                    uid={peerIds[0]}
                    renderMode={1}
                  />
                  <RemoteView
                    style={styles.half}
                    channelId={channelName}
                    uid={peerIds[1]}
                    renderMode={1}
                  />
                </View>
                <View style={styles.halfViewRow}>
                  <RemoteView
                    style={styles.half}
                    channelId={channelName}
                    uid={peerIds[2]}
                    renderMode={1}
                  />
                  <RemoteView
                    style={styles.half}
                    channelId={channelName}
                    uid={peerIds[3]}
                    renderMode={1}
                  />
                </View>
              </View>
            ) : peerIds.length > 2 ? (
              <View style={styles.full}>
                <View style={styles.half} channelId={channelName}>
                  <RemoteView
                    style={styles.full}
                    uid={peerIds[0]}
                    renderMode={1}
                  />
                </View>
                <View style={styles.halfViewRow}>
                  <RemoteView
                    style={styles.half}
                    channelId={channelName}
                    uid={peerIds[1]}
                    renderMode={1}
                  />
                  <RemoteView
                    style={styles.half}
                    channelId={channelName}
                    uid={peerIds[2]}
                    renderMode={1}
                  />
                </View>
              </View>
            ) : peerIds.length > 1 ? (
              <View style={styles.full}>
                <RemoteView
                  style={styles.full}
                  uid={peerIds[0]}
                  renderMode={1}
                />
                <RemoteView
                  style={styles.full}
                  uid={peerIds[1]}
                  renderMode={1}
                />
              </View>
            ) : peerIds.length > 0 ? ( //view for videostream
              <RemoteView style={styles.full} uid={peerIds[0]} renderMode={1} />
            ) : (
              <View>
                <Text style={styles.noUserText}> No users connected </Text>
              </View>
            )}
            <View style={styles.localVideoStyle}>
              <View style={styles.innerBubble}>
                <Text style={styles.nameBubble}>
                  {user.name[0].toUpperCase()}
                </Text>
              </View>
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
export default Audio;
