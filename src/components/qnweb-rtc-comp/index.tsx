import React from "react";

import QNRTC, {
  QNRTCClient,
  QNRemoteVideoTrack,
  QNRemoteAudioTrack,
} from "qnweb-rtc";
class QNWebRtcDemo extends React.Component<any, any> {
  private client: QNRTCClient;
  componentDidMount(): void {
    // this.client = QNRTC.createClient();
    // const users = this.client.remoteUsers;
    // let publishedTracks: QNRemoteVideoTrack[] | QNRemoteAudioTrack[] = [];
    // users.forEach((user) => {
    //   const videoTracks = user.getVideoTracks();
    //   const aodioTracks = user.getAudioTracks();
    //   const remoteTracks = [...videoTracks, ...aodioTracks];
    //   publishedTracks = [].concat(publishedTracks, remoteTracks);
    // });
    // this.client.subscribe(publishedTracks);
    // this.client.session


  }
}
