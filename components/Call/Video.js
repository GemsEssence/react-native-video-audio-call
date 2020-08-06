import requestCameraAndAudioPermission from '../permission';
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Platform, Alert} from 'react-native';
import RtcEngine, {RtcLocalView, RtcRemoteView} from 'react-native-agora';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import styles from './Style';

let LocalView = RtcLocalView.SurfaceView;
let RemoteView = RtcRemoteView.SurfaceView;
let engine;

class Video extends Component {
  constructor(props) {
    super(props);
    const {channel} = props.route.params;
    this.state = {
      peerIds: [],
      appid: '9383ec2f56364d478cefc38b0a37d8bc',
      channelName: channel,
      joinSucceed: false,
      isMute: false,
      showVideo: true,
      showFrontCam: true,
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
    engine.enableVideo();
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
    // this.callWaiting();
    this.setState({joinSucceed: true});
    engine.joinChannel(null, this.state.channelName, null, 0);
  };

  endCall = () => {
    engine.leaveChannel();
    clearTimeout(this.timeout);
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

  toggleVideo = () => {
    this.setState(
      prevState => ({showVideo: !prevState.showVideo}),
      () => {
        if (!this.state.showVideo) {
          engine.enableLocalVideo(false);
        } else {
          engine.enableLocalVideo(true);
        }
      },
    );
  };

  toggleFrontCamera = () => {
    this.setState(
      prevState => ({showFrontCam: !prevState.showFrontCam}),
      () => {
        if (!this.state.showFrontCam) {
          engine.enableLocalVideo(false);
        } else {
          engine.enableLocalVideo(true);
        }
      },
    );
  }

  videoView() {
    const {
      joinSucceed,
      peerIds,
      channelName,
      showVideo,
      isMute,
      showFrontCam,
    } = this.state;
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
            ) : peerIds.length > 0 ? (
              <RemoteView style={styles.full} uid={peerIds[0]} renderMode={1} />
            ) : (
              <View style={[styles.full, styles.ringing]}>
                <Text style={{fontSize: 25}}>Ringing....!</Text>
              </View>
            )}
            <LocalView
              style={
                peerIds.length === 0 ? styles.full : styles.localVideoStyle
              }
              channelId={channelName}
              renderMode={1}
              zOrderMediaOverlay={true}
            />
            {/* <TouchableOpacity
              onPress={this.toggleFrontCamera}
              style={styles.toggleCamera}>
              <MaterialIcons
                size={30}
                style={styles.buttonText}
                name={showFrontCam ? 'mic' : 'mic-off'}
              />
            </TouchableOpacity> */}
            {!showVideo && (
              <View style={[styles.localVideoStyle, styles.blurView]}>
                <Text style={styles.buttonText}>Camera Off</Text>
              </View>
            )}
          </View>
        )}
        {joinSucceed && (
          <View style={styles.callFooterContainer}>
            {peerIds.length > 0 && (
              <TouchableOpacity
                onPress={this.toggleMute}
                style={styles.endCallBtn}>
                <MaterialIcons
                  size={30}
                  style={styles.buttonText}
                  name={isMute ? 'mic' : 'mic-off'}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={this.endCall} style={styles.endCallBtn}>
              <MaterialIcons
                size={30}
                style={styles.buttonText}
                name="call-end"
              />
            </TouchableOpacity>
            {peerIds.length > 0 && (
              <TouchableOpacity
                onPress={this.toggleVideo}
                style={styles.endCallBtn}>
                <MaterialIcons
                  size={30}
                  style={styles.buttonText}
                  name={showVideo ? 'videocam' : 'videocam-off'}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  }
  render() {
    return this.videoView();
  }
}
export default Video;
